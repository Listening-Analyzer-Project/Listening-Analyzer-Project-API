import Event from '@/models/core/event-model';
import { IEvent } from '@/type';
import { Request, Response } from 'express';

// =======================
// CRUD
// =======================

const getAllEvents = async (req: Request, res: Response) => {
  const events = await Event.getAll();
  res.json(events);
};

const getEventById = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
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
  if (!id) throw { status: 400, message: 'ID manquant' };
  const eventData: IEvent = req.body;
  const updatedEvent = await Event.update(id, eventData);
  res.json(updatedEvent);
};

const deleteEvent = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  await Event.delete(id);
  res.json({ id });
};

// =======================
// Additional Methods
// =======================

const getEventsWithCategory = async (req: Request, res: Response) => {
  const userIdsParam = req.query.user_ids?.toString();
  const userIds = userIdsParam ? userIdsParam.split(',').map(id => id.trim()).filter(id => id) : undefined;
  const { category_id, limit, offset } = req.query;

  const events = Event.getAllWithCategory({
    user_id: userIds ? userIds.map(id => Number(id)) : undefined,
    category_id: category_id ? Number(category_id) : undefined,
    limit: limit ? Number(limit) : 50,
    offset: offset ? Number(offset) : 0,
  });

  res.json(events);
};

const getEventCount = async (req: Request, res: Response) => {
  const result = await Event.countAll();
  res.json(result);
};

export default {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsWithCategory,
  getEventCount,
};