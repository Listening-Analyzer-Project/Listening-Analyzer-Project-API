import { Request, Response } from 'express';
import Event from '@/models/core/event-model';
import { IEvent } from '@/type';

// =======================
// CRUD
// =======================

const getAllEvents = async (req: Request, res: Response) => {
  const events = await Event.getAll();
  res.json(events);
};

const getEventById = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const event = await Event.getById(id);
  if (!event) throw { status: 404, message: 'Événement non trouvé' };
  res.json(event);
};

const createEvent = async (req: Request, res: Response) => {
  const eventData: IEvent = req.body;
  const newEvent = await Event.create(eventData);
  res.status(201).json(newEvent);
};

const updateEvent = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const eventData: IEvent = req.body;
  const updatedEvent = await Event.update(id, eventData);
  if (updatedEvent.changes === 0) throw { status: 404, message: 'Événement non trouvé' };
  res.json(updatedEvent);
};

const deleteEvent = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const deleted = await Event.delete(id);
  if (deleted.changes === 0) throw { status: 404, message: 'Événement non trouvé' };
  res.json({ id });
};

// =======================
// Additional Methods
// =======================

const getEventsWithCategory = async (req: Request, res: Response) => {
  const { user_id, category_id, limit, offset } = req.query;
  if (!user_id) throw { status: 400, message: 'user_id manquant' };

  const events = Event.getAllWithCategory({
    user_id: Number(user_id),
    category_id: category_id ? Number(category_id) : undefined,
    limit: limit ? Number(limit) : 50,
    offset: offset ? Number(offset) : 0,
  });

  res.json(events);
};

export default {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsWithCategory,
};