import express from 'express';
import userRoutes from './routes/user-route';

const app = express();
const port = 3001;

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Route globale
app.get('/', (req, res) => {
  res.send('API Express + SQLite fonctionne !');
});

// Démarrage serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
