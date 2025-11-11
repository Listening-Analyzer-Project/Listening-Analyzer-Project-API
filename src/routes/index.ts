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
import genreRoute from './core/genre-route';
import subGenreRoute from './core/sub-genre-route';
import trackRoutes from './core/track-route';
import listenRoute from './core/listen-route';

import trackArtistRoutes from './relation/track-artist-route';
import trackTagRoutes from './relation/track-tag-route';
import playlistTrackRoute from './relation/playlist-track-route';

import albumAnalyticsRoutes from './analytics/albums-analytics-route';
import artistAnalyticsRoutes from './analytics/artists-analytics-route';
import tracksAnalyticsRoutes from './analytics/tracks-analytics-route';
import listensAnalyticsRoutes from './analytics/listens-analytics-route';

import importRoute from './other/import-route';
import deleteUserRoute from './other/delete-user-route';


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
router.use('/genres', genreRoute);
router.use('/sub-genres', subGenreRoute);
router.use('/tracks', trackRoutes);
router.use('/listens', listenRoute);

// Routes de relations
router.use('/track-artists', trackArtistRoutes);
router.use('/track-tags', trackTagRoutes);
router.use('/playlist-tracks', playlistTrackRoute);

// Route d'analytics
router.use('/analytics/albums', albumAnalyticsRoutes);
router.use('/analytics/artists', artistAnalyticsRoutes);
router.use('/analytics/tracks', tracksAnalyticsRoutes);
router.use('/analytics/listens', listensAnalyticsRoutes);

// Routes other
router.use('/import', importRoute);
router.use('/delete-user', deleteUserRoute);

export default router;
