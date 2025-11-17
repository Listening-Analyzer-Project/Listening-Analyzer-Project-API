import { Request, Response } from 'express';
import Track from '@/models/core/track-model';
import { ITrack } from '@/type';

const getAllTracks = async (req: Request, res: Response) => {
  const tracks = await Track.getAll();
  res.json(tracks);
};

const getTrackById = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
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
  if (!id) throw { status: 400, message: 'ID manquant' };
  const trackData: ITrack = req.body;
  const updated = await Track.update(id, trackData);
  res.json(updated);
};

const deleteTrack = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const deleted = await Track.delete(id);
  res.json(deleted);
};

export default {
  getAllTracks,
  getTrackById,
  createTrack,
  updateTrack,
  deleteTrack,
};
