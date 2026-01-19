import { Request, Response } from 'express';
import PlaylistTrack from '@/models/relation/playlist-track-model';
import { IPlaylistTrack } from '@/type';

const getAllPlaylistTracks = async (req: Request, res: Response) => {
  const data = await PlaylistTrack.getAll();
  res.json(data);
};

const getByTrackId = async (req: Request, res: Response) => {
  const track_id = Number(req.query.track_id);
  const data = await PlaylistTrack.getByTrackId(track_id);
  if (!data) throw new Error('PlaylistTrack non trouvé');
  res.json(data);
};

const getByPlaylistId = async (req: Request, res: Response) => {
  const playlist_id = Number(req.query.playlist_id);
  const data = await PlaylistTrack.getByPlaylistId(playlist_id);
  if (!data) throw new Error('PlaylistTrack non trouvé');
  res.json(data);
};

const createPlaylistTrack = async (req: Request, res: Response) => {
  const data: IPlaylistTrack = req.body;
  const result = await PlaylistTrack.create(data);
  res.status(201).json(result);
};

const deletePlaylistTrack = async (req: Request, res: Response) => {
  const track_id = Number(req.query.track_id);
  const playlist_id = Number(req.query.playlist_id);
  const result = await PlaylistTrack.delete(track_id, playlist_id);
  if (!result) throw new Error('PlaylistTrack non trouvé');
  res.json(result);
};

export default {
  getAllPlaylistTracks,
  getByTrackId,
  getByPlaylistId,
  createPlaylistTrack,
  deletePlaylistTrack,
};
