import { Request, Response } from 'express';
import { IAlbum } from '../../type/bdd-type';
import Album from '../../models/main-classes/album-model';

const getAllAlbums = (req: Request, res: Response) => {
  try {
    const albums = Album.getAll();
    res.json(albums);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const getAlbumById = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const album = Album.getById(id);
    if (!album) return res.status(404).json({ error: 'Album non trouvé' });
    res.json(album);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const createAlbum = (req: Request, res: Response) => {
  try {
    const albumData: IAlbum = req.body;
    const newAlbum = Album.create(albumData);
    res.status(201).json(newAlbum);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const updateAlbum = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const albumData: IAlbum = req.body;
    const updated = Album.update(id, albumData);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAlbum = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const deleted = Album.delete(id);
    res.json(deleted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
};
