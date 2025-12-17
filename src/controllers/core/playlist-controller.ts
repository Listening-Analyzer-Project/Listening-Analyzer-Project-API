import { Request, Response } from 'express';
import Playlist from '@/models/core/playlist-model';
import { IPlaylist } from '@/type';

const getAllPlaylists = async (req: Request, res: Response) => {
  const playlists = await Playlist.getAll();
  res.json(playlists);
};

const getPlaylistById = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const playlist = await Playlist.getById(id);
  if (!playlist) throw { status: 404, message: 'Playlist non trouvée' };
  res.json(playlist);
};

const createPlaylist = async (req: Request, res: Response) => {
  const playlistData: IPlaylist = req.body;
  const newPlaylist = await Playlist.create(playlistData);
  res.status(201).json(newPlaylist);
};

const updatePlaylist = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const playlistData: Partial<IPlaylist> = req.body;
  const updatedPlaylist = await Playlist.update(id, playlistData);
  if (!updatedPlaylist) throw { status: 404, message: 'Playlist non trouvée' };
  res.json(updatedPlaylist);
};

const deletePlaylist = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const deleted = await Playlist.delete(id);
  if (!deleted) throw { status: 404, message: 'Playlist non trouvée' };
  res.json(deleted);
};

export default {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist
};