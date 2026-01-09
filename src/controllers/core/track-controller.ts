import { Request, Response } from 'express';
import Track from '@/models/core/track-model';
import { ITrack } from '@/type';

const getAllTracks = async (req: Request, res: Response) => {
  const tracks = await Track.getAll();
  res.json(tracks);
};

const getTrackById = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const track = await Track.getById(id);
  if (!track) throw { status: 404, message: 'Morceau non trouvé' };
  res.json(track);
};

const createTrack = async (req: Request, res: Response) => {
  const trackData: ITrack = req.body;
  const newTrack = await Track.create(trackData);
  res.status(201).json(newTrack);
};

const updateTrack = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const trackData: ITrack = req.body;
  const updated = await Track.update(id, trackData);
  if (updated.changes === 0) throw { status: 404, message: 'Morceau non trouvé' };
  res.json(updated);
};

const deleteTrack = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const deleted = await Track.delete(id);
  if (deleted.changes === 0) throw { status: 404, message: 'Morceau non trouvé' };
  res.json(deleted);
};

export default {
  getAllTracks,
  getTrackById,
  createTrack,
  updateTrack,
  deleteTrack,
};
