import { Request, Response } from 'express';
import PlaylistTrack from '@/models/relation/playlist-track-model';
import { IPlaylistTrack } from '@/type';

const getAllPlaylistTracks = async (req: Request, res: Response) => {
  const data = await PlaylistTrack.getAll();
  res.json(data);
};

const getByTrackId = async (req: Request, res: Response) => {
  const track_id = Number(req.query.track_id);
  if (!track_id) throw { status: 400, message: 'track_id manquant' };
  const data = await PlaylistTrack.getByTrackId(track_id);
  res.json(data);
};

const getByPlaylistId = async (req: Request, res: Response) => {
  const playlist_id = Number(req.query.playlist_id);
  if (!playlist_id) throw { status: 400, message: 'playlist_id manquant' };
  const data = await PlaylistTrack.getByPlaylistId(playlist_id);
  res.json(data);
};

const createPlaylistTrack = async (req: Request, res: Response) => {
  const data: IPlaylistTrack = req.body;
  if (!data.track_id || !data.playlist_id)
    throw { status: 400, message: 'track_id et playlist_id sont requis' };

  const result = await PlaylistTrack.create(data);
  res.status(201).json(result);
};

const deletePlaylistTrack = async (req: Request, res: Response) => {
  const track_id = Number(req.query.track_id);
  const playlist_id = Number(req.query.playlist_id);
  if (!track_id || !playlist_id)
    throw { status: 400, message: 'track_id et playlist_id sont requis' };

  const result = await PlaylistTrack.delete(track_id, playlist_id);
  res.json(result);
};

export default {
  getAllPlaylistTracks,
  getByTrackId,
  getByPlaylistId,
  createPlaylistTrack,
  deletePlaylistTrack,
};
