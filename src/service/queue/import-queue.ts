import { basicJobPhase, IJob, ReasonType } from '@/type';
import { parentPort } from 'worker_threads';
import listenModel from '@/models/core/listen-model';


export const importQueueService = {
    processImportJob: async (job: IJob) => {
        const allListens = listenModel.getAllbyUserId(job.user_id);
        const BATCH_SIZE = 10000;
        let currentIndex = 0;

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

        if (job.phase === basicJobPhase.IN_PROGRESS && job.last_processed_id) {
            const lastProcessedId = job.last_processed_id;
            const foundIndex = allListens.findIndex(l => l.id === lastProcessedId);
            if (foundIndex !== -1) {
                currentIndex = foundIndex + 1;
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

        if (currentIndex >= allListens.length) {
            console.log(`[ImportQueue] Job ${job.id} already completed or no new items.`);
            return;
        }

        console.log(`[ImportQueue] Starting job ${job.id} at index ${currentIndex}/${allListens.length}`);

        while (currentIndex < allListens.length) {
            const endIndex = Math.min(currentIndex + BATCH_SIZE, allListens.length);

            let lastProcessedId = 0;
            const updates: { id: number; reason_end: string }[] = [];

            for (let i = currentIndex; i < endIndex; i++) {
                const currentListen = allListens[i];
                const prevListen = i > 0 ? allListens[i - 1] : null;
                const nextListen = i < allListens.length - 1 ? allListens[i + 1] : null;

                let reason: string | undefined;

                if (nextListen) {
                    const hn = new Date(currentListen.ts).getTime();
                    const tn = currentListen.ms_played;
                    const tnPlus1 = nextListen.ms_played;
                    const hnPlus1 = new Date(nextListen.ts).getTime();

                    // Calculate when current listen ends
                    const currentListenEnd = hn + tnPlus1;

                    // Check if next listen starts within 15 seconds of current listen ending
                    // We want: hnPlus1 ≈ currentListenEnd (within ±15 seconds)
                    const diff = hnPlus1 - currentListenEnd;

                    // ~ 15 seconds tolerance (allow for slight overlap or gap)
                    if (diff >= -15000 && diff <= 15000) {
                        if (tn < 30000) {
                            if (prevListen && nextListen &&
                                prevListen.track_id === nextListen.track_id &&
                                prevListen.ms_played >= 30000) {
                                reason = ReasonType.REPEAT_LAST;
                            } else if (currentListen.track_id !== nextListen.track_id) {
                                reason = ReasonType.SKIP;
                            } else {
                                reason = ReasonType.END_PLAY;
                            }
                        } else {
                            if (currentListen.track_id === nextListen.track_id) {
                                reason = ReasonType.REPEAT;
                            } else {
                                reason = ReasonType.END_TRACK;
                            }
                        }
                    } else {
                        reason = ReasonType.END_PLAY;
                    }
                } else {
                    reason = ReasonType.END_PLAY;
                }

                // Optimization: Only update if reason_end is different or missing
                if (reason && currentListen.reason_end !== reason) {
                    updates.push({ id: currentListen.id, reason_end: reason });
                    // Update in memory for consistency
                    currentListen.reason_end = reason;
                }

                lastProcessedId = currentListen.id;
            }

            if (updates.length > 0) {
                listenModel.updateReasonEndMany(updates);
            }

            currentIndex = endIndex;
            const progress = Math.round((currentIndex / allListens.length) * 100);
            if (parentPort) {
                parentPort.postMessage({
                    type: 'progress',
                    value: progress,
                    lastId: lastProcessedId,
                    phase: basicJobPhase.IN_PROGRESS
                });
            }
        }
    }
};