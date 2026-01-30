import { parentPort } from 'worker_threads';
import { IJob, JOB_REGISTRY, JobType } from '@/type';

if (parentPort) {
    console.log(`[Worker] Persistent thread started (ID: ${process.pid})`);

    parentPort.on('message', async (job: IJob) => {
        try {
            console.log(`[Worker] Received job ${job.id} (Type: ${job.type})`);

            const registryEntry = JOB_REGISTRY[job.type as JobType];
            if (!registryEntry) {
                throw new Error(`Job type ${job.type} not found in registry`);
            }

            const module = await import(registryEntry.modulePath);
            const service = registryEntry.serviceName ? module[registryEntry.serviceName] : module;
            const processor = service[registryEntry.methodName];

            if (typeof processor !== 'function') {
                throw new Error(`Method ${registryEntry.methodName} not found or is not a function in ${registryEntry.modulePath}`);
            }

            await processor(job);

            parentPort!.postMessage({ type: 'completed' });
        } catch (error: any) {
            console.error(`[Worker] Error executing job ${job.id}:`, error);
            parentPort!.postMessage({ type: 'error', error: error.message || String(error) });
        }
    });

    // Notify main thread that worker is ready Probably not usefull
    parentPort.postMessage({ type: 'ready' });
}

