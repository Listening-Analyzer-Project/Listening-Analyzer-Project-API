import JobModel from '@/models/core/jobs-model';
import { JobType, basicJobPhase } from '@/type';
import { Worker, SHARE_ENV } from 'node:worker_threads';

class JobManager {
    private static instance: JobManager;
    private isProcessing: boolean = false;
    private worker: Worker | null = null;

    private constructor() { }

    public static getInstance(): JobManager {
        if (!JobManager.instance) {
            JobManager.instance = new JobManager();
        }
        return JobManager.instance;
    }

    /**
     * Initialisation du manager et démarrage du worker persistant
     */
    public initialize() {
        console.log('[JobManager] Initializing JobManager...');
        this.getOrCreateWorker();
        this.processNext();
    }

    /**
     * Crée ou récupère le worker persistant
     */
    private getOrCreateWorker(): Worker {
        if (this.worker) return this.worker;

        console.log('[JobManager] Spawning a new persistent worker thread...');

        const isTs = import.meta.url.endsWith('.ts');
        const extension = isTs ? '.ts' : '.js';
        const workerFileName = `./job-worker${extension}`;

        const workerPath = import.meta.resolve(workerFileName);

        if (isTs) {
            const bootstrapScript = `
               import('tsx/esm/api').then(({ register }) => {
                    register();
                    return import('${workerPath}');
                }).catch(err => {
                    console.error('Failed to load worker:', err);
                    process.exit(1);
                });
            `;

            this.worker = new Worker(bootstrapScript, {
                eval: true,
                env: SHARE_ENV
            });
        } else {
            // En production (fichiers compilés.js), pas besoin de loader spécial
            this.worker = new Worker(new URL(workerPath));
        }

        this.worker.on('message', (message) => {
            const nextJob = JobModel.getNextJob();
            if (!nextJob && message.type !== 'ready') return;

            if (message.type === 'progress') {
                JobModel.update(nextJob!.id!, {
                    progress: message.value,
                    last_processed_id: message.lastId,
                    phase: message.phase
                });
            } else if (message.type === 'completed') {
                if (nextJob) {
                    JobModel.delete(nextJob.id!);
                    console.log(`[JobManager] Job completed: ${nextJob.name} (ID: ${nextJob.id})`);
                }
                this.isProcessing = false;
                this.processNext();
            } else if (message.type === 'error') {
                console.error(`[JobManager] Worker reported error:`, message.error);
                this.isProcessing = false;
                this.processNext();
            } else if (message.type === 'ready') {
                console.log('[JobManager] Worker thread is ready.');
            }
        });

        this.worker.on('error', (err) => {
            console.error(`[JobManager] Worker thread fatal error:`, err);
            this.worker = null;
            this.isProcessing = false;
        });

        this.worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`[JobManager] Worker exited with code ${code}`);
            }
            this.worker = null;
            this.isProcessing = false;
            // Redémarrer si nécessaire (le prochain processNext le fera)
            if (JobModel.getNextJob()) {
                this.processNext();
            }
        });

        return this.worker;
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
     * Envoie le prochain job au worker persistant
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
            const worker = this.getOrCreateWorker();
            console.log(`[JobManager] Sending job to worker: ${nextJob.name} (ID: ${nextJob.id})`);

            // Mark as in progress in DB
            JobModel.update(nextJob.id!, { phase: basicJobPhase.IN_PROGRESS });

            worker.postMessage(nextJob);

        } catch (error) {
            console.error(`[JobManager] Failed to send job to worker:`, error);
            this.isProcessing = false;
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
