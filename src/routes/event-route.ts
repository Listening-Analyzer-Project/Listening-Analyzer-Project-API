import express from 'express';
import EventController from '../controllers/event-controller';

const router = express.Router();

router.get('/', EventController.getAllEvents);
router.get('/byId', EventController.getEventById);
router.post('/', EventController.createEvent);
router.put('/', EventController.updateEvent);
router.delete('/', EventController.deleteEvent);

export default router;
