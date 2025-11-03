import express from 'express';
import EventController from '../../controllers/core/event-controller';
import { wrapRoutes } from '@/utils';

const router = express.Router();

router.get('/', EventController.getAllEvents);
router.get('/byId', EventController.getEventById);
router.post('/', EventController.createEvent);
router.put('/', EventController.updateEvent);
router.delete('/', EventController.deleteEvent);
router.get('/withCategory', EventController.getEventsWithCategory);

export default wrapRoutes(router);
