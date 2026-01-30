import express from 'express';
import routes from './routes';
import { errorHandler } from '@/middleware';
import cors from 'cors';
import { corsOptions } from './cors.config';
import JobManager from '@/service/job-manager';

// Initialisation du JobManager
JobManager.initialize();

const app = express();
const port = 3001;

// Configuration CORS
app.use(cors(corsOptions));

// Taille limite pour les requêtes JSON
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api', routes);

// Middleware de gestion des erreurs
app.use(errorHandler);

// Route globale
app.get('/', (req, res) => {
  res.send('API Express + SQLite fonctionne !');
});

// Démarrage serveur
const server = app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

/**
 * GESTION DE L'ARRÊT GRACIEUX (SHUTDOWN)
 */
async function handleShutdown(signal: string) {
  console.log(`\n ${signal} received. Closing resources...`);

  server.close(async () => {
    console.log(' HTTP server closed.');
    await JobManager.shutdown();

    console.log(' Shutdown complete.');
    process.exit(0);
  });
}

// Écoute des signaux d'arrêt
process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));