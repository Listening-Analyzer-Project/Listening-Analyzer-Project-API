import express from 'express';
import EventController from '../../controllers/main-classes/event-controller';
import { wrapRoutes } from '../../utils/wrapRoutes';

const router = express.Router();

router.get('/', EventController.getAllEvents);
router.get('/byId', EventController.getEventById);
router.post('/', EventController.createEvent);
router.put('/', EventController.updateEvent);
router.delete('/', EventController.deleteEvent);

export default wrapRoutes(router);
