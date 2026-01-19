import { basicJobPhase, IJob } from '@/type';
import { parentPort } from 'worker_threads';
import listenModel from '@/models/core/listen-model';


export const importQueueService = {
    processImportJob: async (job: IJob) => {
        const allListens = listenModel.getAllbyUserId(job.user_id);

        if (!allListens || allListens.length === 0) {
            console.log(`[ImportQueue] No listens found for user ${job.user_id}`);
            return;
        }

        // Sort by timestamp (chronological) to ensure order
        allListens.sort((a, b) => {
            if (a.ts < b.ts) return -1;
            if (a.ts > b.ts) return 1;
            return 0;
        });

        let startIndex = 0;
        if (job.phase === basicJobPhase.IN_PROGRESS && job.last_processed_id) {
            const lastProcessedId = job.last_processed_id;
            const foundIndex = allListens.findIndex(l => l.id === lastProcessedId);
            if (foundIndex !== -1) {
                startIndex = foundIndex + 1;
            }
        } else {
            if (parentPort) {
                parentPort.postMessage({
                    type: 'progress',
                    value: 0,
                    lastId: 0,
                    phase: basicJobPhase.IN_PROGRESS
                });
            }
        }

        if (startIndex >= allListens.length) {
            console.log(`[ImportQueue] Job ${job.id} already completed or no new items.`);
            return;
        }

        console.log(`[ImportQueue] Starting job ${job.id} at index ${startIndex}/${allListens.length}`);

        const BATCH_SIZE = 5000;
        let currentIndex = startIndex;

        while (currentIndex < allListens.length) {
            const endIndex = Math.min(currentIndex + BATCH_SIZE, allListens.length);
            const batch = allListens.slice(currentIndex, endIndex);

            let lastProcessedId = 0;
            for (let i = currentIndex; i < endIndex; i++) {
                const currentListen = allListens[i];
                const prevListen = i > 0 ? allListens[i - 1] : null;
                const nextListen = i < allListens.length - 1 ? allListens[i + 1] : null;

                // --- BUSINESS LOGIC START ---
                // Comparaison avec prevListen et nextListen
                // Determination de la raison de fin (skip, relire, etc.)
                // listenModel.update(...) // Si nécessaire
                // --- BUSINESS LOGIC END ---

                lastProcessedId = currentListen.id;
            }

            currentIndex = endIndex;
            const progress = Math.round((currentIndex / allListens.length) * 100);
            console.log(`[ImportQueue] Job ${job.id} progress: ${progress}%`);
            if (parentPort) {
                parentPort.postMessage({
                    type: 'progress',
                    value: progress,
                    lastId: lastProcessedId,
                    phase: basicJobPhase.IN_PROGRESS
                });
            }
        }
        console.log(`[ImportQueue] Job ${job.id} finished processing.`);
    }
};