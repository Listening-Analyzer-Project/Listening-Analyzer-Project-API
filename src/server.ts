import express from 'express';
import routes from './routes';
import { errorHandler } from '@/middleware';
import cors from 'cors';
import { corsOptions } from './cors.config';


const app = express();
const port = 3001;

// Configuration CORS
app.use(cors(corsOptions));

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use('/api', routes);

// Middleware de gestion des erreurs
app.use(errorHandler);

// Route globale
app.get('/', (req, res) => {
  res.send('API Express + SQLite fonctionne !');
});

// Démarrage serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
