import { Request, Response } from 'express';
import Playlist from '../models/playlist-model';
import { IPlaylist } from '../type/bdd-type';

const getAllPlaylists = (req: Request, res: Response) => {
  try {
    const playlists = Playlist.getAll();
    res.json(playlists);
    } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const getPlaylistById = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);;
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const playlist = Playlist.getById(id);
    if (!playlist) return res.status(404).json({ error: 'Playlist non trouvée' });
    res.json(playlist);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const createPlaylist = (req: Request, res: Response) => {
  try {
    const playlistData: IPlaylist = req.body;
    const newPlaylist = Playlist.create(playlistData);
    res.status(201).json(newPlaylist);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const updatePlaylist = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const playlistData: Partial<IPlaylist> = req.body;
    const updatedPlaylist = Playlist.update(id, playlistData);
    res.json(updatedPlaylist);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const deletePlaylist = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    Playlist.delete(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist
};