import { basicJobPhase, IJob } from '@/type';
import { parentPort } from 'worker_threads';
import listenModel from '@/models/core/listen-model';


export const importQueueService = {
    processImportJob: async (job: IJob) => {
        // 1. On récupère le point de départ
        const startId = job.last_processed_id || 0;

        // 2. On récupère les données à partir de ce point (par lots/chunks)
        // IMPORTANT : Toujours trier par ID pour la cohérence
        const batchSize = 1000;
        let hasMore = true;
        let currentStartId = startId;

        while (hasMore) {
            // Récupérer un lot de 1000 lignes (exemple)
            const rows = listenModel.getRowsAfterId(currentStartId, batchSize, job.user_id);

            if (rows.length === 0) {
                hasMore = false;
                break;
            } else {
                // 3. Traitement du lot
                for (const row of rows) {
                    // Votre logique complexe de comparaison ici...
                    // ...
                    currentStartId = row.id;
                }
            }

            // 4. Sauvegarde du checkpoint après chaque lot (Atome de travail)
            // On ne le fait pas à chaque ligne pour ne pas saturer le disque
            const progress = (currentStartId - startId) / batchSize; // Logique personnalisée pas bonne et fonctionnel

            // Envoyer au Main Thread pour mise à jour DB
            if (parentPort) {
                parentPort.postMessage({
                    type: 'progress',
                    value: progress,
                    lastId: currentStartId, // On transmet le nouvel index
                    phase: basicJobPhase.IN_PROGRESS
                });
            }
        }
    }
};