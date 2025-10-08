import express from 'express';
import userRoutes from './main-classes/user-route';
import playlistRoutes from './main-classes/playlist-route';
import artistRoutes from './main-classes/artist-route';
import albumRoutes from './main-classes/album-route';
import tagRoutes from './main-classes/tag-routes';
import categoryRoutes from './main-classes/category-route';
import countryRoutes from './main-classes/country-route';
import eventRoutes from './main-classes/event-route';
import geographicalRegionRoutes from './main-classes/geographical-region-route';

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
