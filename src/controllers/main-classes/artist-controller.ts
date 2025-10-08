import { Request, Response } from 'express';
import Artist from '../../models/main-classes/artist-model';
import { IArtist } from '../../type/bdd-type';

const getAllArtists = (req: Request, res: Response) => {
  try {
    const artists = Artist.getAll();
    res.json(artists);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const getArtistById = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const artist = Artist.getById(id);
    if (!artist) return res.status(404).json({ error: 'Artiste non trouvé' });
    res.json(artist);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const createArtist = (req: Request, res: Response) => {
  try {
    const artistData: IArtist = req.body;
    const newArtist = Artist.create(artistData);
    res.status(201).json(newArtist);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const updateArtist = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const artistData: IArtist = req.body;
    const updated = Artist.update(id, artistData);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const deleteArtist = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const deleted = Artist.delete(id);
    res.json(deleted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
};
