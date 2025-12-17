import express from 'express';
import EventController from '@/controllers/core/event-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { createEventSchema, updateEventSchema, getDeleteEventSchema, getEventWithCategorySchema } from '@/validators/core/event-validator';

const router = express.Router();

router.get('/', EventController.getAllEvents);
router.get('/byId', validateRequest(getDeleteEventSchema), EventController.getEventById);
router.post('/', validateRequest(createEventSchema), EventController.createEvent);
router.put('/', validateRequest(updateEventSchema), EventController.updateEvent);
router.delete('/', validateRequest(getDeleteEventSchema), EventController.deleteEvent);
router.get('/withCategory', validateRequest(getEventWithCategorySchema), EventController.getEventsWithCategory);

export default wrapRoutes(router);
