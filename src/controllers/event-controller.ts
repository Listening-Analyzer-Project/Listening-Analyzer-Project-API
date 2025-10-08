import { Request, Response } from 'express';
import Event from '../models/event-model';
import { IEvent } from '../type/bdd-type';

const getAllEvents = (req: Request, res: Response) => {
  try {
    const events = Event.getAll();
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const getEventById = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const event = Event.getById(id);
    if (!event) return res.status(404).json({ error: 'Événement non trouvé' });
    res.json(event);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const createEvent = (req: Request, res: Response) => {
  try {
    const eventData: IEvent = req.body;
    const newEvent = Event.create(eventData);
    res.status(201).json(newEvent);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const updateEvent = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const eventData: IEvent = req.body;
    const updatedEvent = Event.update(id, eventData);
    res.json(updatedEvent);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEvent = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    Event.delete(id);
    res.json({ id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};