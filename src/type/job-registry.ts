import { JobType } from '@/type/enum';

export interface JobRegistryEntry {
    modulePath: string; // Relative to src/service
    serviceName?: string; // Optional if exporting an object
    methodName: string;
}

export const JOB_REGISTRY: Record<JobType, JobRegistryEntry> = {
    [JobType.IMPORT]: {
        modulePath: '@/service',
        serviceName: 'importQueueService',
        methodName: 'processImportJob'
    }
};
