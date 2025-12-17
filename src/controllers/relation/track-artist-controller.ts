import { Request, Response } from 'express';
import TrackArtist from '@/models/relation/track-artist-model';
import { ITrackArtist } from '@/type';

const getAllTrackArtists = async (req: Request, res: Response) => {
  const data = await TrackArtist.getAll();
  res.json(data);
};

const getByTrackId = async (req: Request, res: Response) => {
  const track_id = Number(req.query.track_id);
  const data = await TrackArtist.getByTrackId(track_id);
  if (!data) throw new Error('TrackArtist non trouvé');
  res.json(data);
};

const getByArtistId = async (req: Request, res: Response) => {
  const artist_id = Number(req.query.artist_id);
  const data = await TrackArtist.getByArtistId(artist_id);
  if (!data) throw new Error('TrackArtist non trouvé');
  res.json(data);
};

const createTrackArtist = async (req: Request, res: Response) => {
  const data: ITrackArtist = req.body;
  const result = await TrackArtist.create(data);
  if (!result) throw new Error('TrackArtist non trouvé');
  res.status(201).json(result);
};

const updateTrackArtist = async (req: Request, res: Response) => {
  const track_id = Number(req.query.track_id);
  const artist_id = Number(req.query.artist_id);
  const data: ITrackArtist = req.body;
  const updated = await TrackArtist.update(track_id, artist_id, data);
  if (!updated) throw new Error('TrackArtist non trouvé');
  res.json(updated);
};

const deleteTrackArtist = async (req: Request, res: Response) => {
  const track_id = Number(req.query.track_id);
  const artist_id = Number(req.query.artist_id);
  const result = await TrackArtist.delete(track_id, artist_id);
  if (!result) throw new Error('TrackArtist non trouvé');
  res.json(result);
};

export default {
  getAllTrackArtists,
  getByTrackId,
  getByArtistId,
  createTrackArtist,
  updateTrackArtist,
  deleteTrackArtist,
};
