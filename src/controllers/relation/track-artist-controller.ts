import { Request, Response } from 'express';
import TrackArtist from '@/models/relation/track-artist-model';
import { ITrackArtist } from '@/type';

const getAllTrackArtists = async (req: Request, res: Response) => {
  const data = await TrackArtist.getAll();
  res.json(data);
};

const getByTrackId = async (req: Request, res: Response) => {
  const track_id = Number(req.query.track_id);
  if (!track_id) throw { status: 400, message: 'track_id manquant' };
  const data = await TrackArtist.getByTrackId(track_id);
  res.json(data);
};

const getByArtistId = async (req: Request, res: Response) => {
  const artist_id = Number(req.query.artist_id);
  if (!artist_id) throw { status: 400, message: 'artist_id manquant' };
  const data = await TrackArtist.getByArtistId(artist_id);
  res.json(data);
};

const createTrackArtist = async (req: Request, res: Response) => {
  const data: ITrackArtist = req.body;
  if (!data.track_id || !data.artist_id)
    throw { status: 400, message: 'track_id et artist_id sont requis' };

  const result = await TrackArtist.create(data);
  res.status(201).json(result);
};

const updateTrackArtist = async (req: Request, res: Response) => {
  const track_id = Number(req.query.track_id);
  const artist_id = Number(req.query.artist_id);
  if (!track_id || !artist_id)
    throw { status: 400, message: 'track_id et artist_id sont requis' };

  const data: ITrackArtist = req.body;
  const updated = await TrackArtist.update(track_id, artist_id, data);
  res.json(updated);
};

const deleteTrackArtist = async (req: Request, res: Response) => {
  const track_id = Number(req.query.track_id);
  const artist_id = Number(req.query.artist_id);
  if (!track_id || !artist_id)
    throw { status: 400, message: 'track_id et artist_id sont requis' };

  const result = await TrackArtist.delete(track_id, artist_id);
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
