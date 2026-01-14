import JobModel from '@/models/core/jobs-model';
import { IJob } from '@/type';
import { JobType, basicJobPhase } from '@/type/enum';
import { importQueueService } from '@/service/queue/import-queue';

type JobProcessor = (job: IJob) => Promise<void>;

class JobManager {
    private static instance: JobManager;
    private isProcessing: boolean = false;
    private processors: Map<JobType, JobProcessor> = new Map();

    private constructor() { }

    public static getInstance(): JobManager {
        if (!JobManager.instance) {
            JobManager.instance = new JobManager();
        }
        return JobManager.instance;
    }

    /**
     * Initialisation du manager: enregistre les processeurs et lance la file d'attente
     */
    public initialize() {
        console.log('[JobManager] Initializing and registering processors...');
        this.registerProcessor(JobType.IMPORT, importQueueService.processImportJob);
        this.processNext();
    }

    /**
     * Map a job type to a specific processing function
     */
    public registerProcessor(type: JobType, processor: JobProcessor) {
        this.processors.set(type, processor);
    }

    /**
     * Add a job to the database and trigger processing
     */
    public async addJob(name: string, userId: number, type: JobType, payload: any = {}) {
        const jobId = JobModel.create({
            name,
            user_id: userId,
            type,
            progress: 0,
            phase: basicJobPhase.NOT_STARTED,
            ...payload
        });

        console.log(`[JobManager] Job created: ${name} (ID: ${jobId.id})`);
        this.processNext();
        return jobId;
    }

    /**
     * Trigger the processing of the next available job
     */
    public async processNext() {
        if (this.isProcessing) {
            return;
        }

        const nextJob = JobModel.getNextJob();

        if (!nextJob) {
            console.log('[JobManager] No jobs to process.');
            return;
        }

        this.isProcessing = true;

        try {
            console.log(`[JobManager] Starting job: ${nextJob.name} (ID: ${nextJob.id})`);

            // Mark as in progress in DB
            JobModel.update(nextJob.id!, { phase: basicJobPhase.IN_PROGRESS });

            const processor = this.processors.get(nextJob.type);
            if (!processor) {
                throw new Error(`No processor registered for job type: ${nextJob.type}`);
            }

            // Run the processor
            await processor(nextJob);

            // Job completed successfully -> Delete it
            JobModel.delete(nextJob.id!);
            console.log(`[JobManager] Job completed and removed: ${nextJob.name} (ID: ${nextJob.id})`);

        } catch (error) {
            console.error(`[JobManager] Job failed: ${nextJob.name} (ID: ${nextJob.id})`, error);
            // On failure, we might want to keep it in DB with a "FAILED" phase or just keep it as is.
            // For now, we'll keep it so it doesn't loop infinitely if we don't have a retry logic.
            // But we must stop processing or skip it.
            // Refinement: mark as failed if we had a state, but here let's just stop this chain for safety.
        } finally {
            this.isProcessing = false;
            // Always try to pick up the next one
            this.processNext();
        }
    }

    /**
     * Helper to update progress from within a processor
     */
    public updateProgress(jobId: number, progress: number, phase?: number) {
        JobModel.update(jobId, { progress, phase });
    }
}

export default JobManager.getInstance();
