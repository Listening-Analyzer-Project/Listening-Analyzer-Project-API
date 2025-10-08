import express from 'express';
import userRoutes from './core/user-route';
import playlistRoutes from './core/playlist-route';
import artistRoutes from './core/artist-route';
import albumRoutes from './core/album-route';
import tagRoutes from './core/tag-routes';
import categoryRoutes from './core/category-route';
import countryRoutes from './core/country-route';
import eventRoutes from './core/event-route';
import geographicalRegionRoutes from './core/geographical-region-route';

const router = express.Router();

// Routes principales
router.use('/users', userRoutes);
router.use('/playlists', playlistRoutes);
router.use('/artists', artistRoutes);
router.use('/albums', albumRoutes);
router.use('/tags', tagRoutes);
router.use('/categories', categoryRoutes);
router.use('/countries', countryRoutes);
router.use('/events', eventRoutes);
router.use('/geographical-regions', geographicalRegionRoutes);


export default router;
