import express from 'express';
import userRoutes from './routes/user-route';
import albumRoutes from './routes/album-route';
import playlistRoutes from './routes/playlist-route';
import tagRoutes from './routes/tag-routes';
import categoryRoutes from './routes/category-route';
import countryRoutes from './routes/country-route';
import eventRoutes from './routes/event-route';

const app = express();
const port = 3001;

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/events', eventRoutes);

// Route globale
app.get('/', (req, res) => {
  res.send('API Express + SQLite fonctionne !');
});

// Démarrage serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
