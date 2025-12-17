import express from 'express';
import TrackTagController from '@/controllers/relation/track-tag-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { createTrackTagSchema, deleteTrackTagSchema, getByTagIdSchema, getByTrackIdSchema } from '@/validators/relation/track-tag-validator';

const router = express.Router();

router.get('/', TrackTagController.getAllTrackTags);
router.get('/byTrack', validateRequest(getByTrackIdSchema), TrackTagController.getByTrackId);
router.get('/byTag', validateRequest(getByTagIdSchema), TrackTagController.getByTagId);
router.post('/', validateRequest(createTrackTagSchema), TrackTagController.createTrackTag);
router.delete('/', validateRequest(deleteTrackTagSchema), TrackTagController.deleteTrackTag);

export default wrapRoutes(router);
