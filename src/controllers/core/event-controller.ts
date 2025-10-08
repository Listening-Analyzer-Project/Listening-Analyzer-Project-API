import { Request, Response } from 'express';
import Event from '../../models/core/event-model';
import { IEvent } from '@/type';

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

export default {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};