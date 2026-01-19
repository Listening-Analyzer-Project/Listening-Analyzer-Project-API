import { Request, Response } from 'express';
import Artist from '@/models/core/artist-model';
import { IArtist } from '@/type';

const getAllArtists = async (req: Request, res: Response) => {
  const artists = await Artist.getAll();
  res.json(artists);
};

const getArtistById = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const artist = await Artist.getById(id);
  if (!artist) throw { status: 404, message: 'Artiste non trouvé' };
  res.json(artist);
};

const createArtist = async (req: Request, res: Response) => {
  const artistData: IArtist = req.body;
  const newArtist = await Artist.create(artistData);
  res.status(201).json(newArtist);
};

const updateArtist = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const artistData: IArtist = req.body;
  const updated = await Artist.update(id, artistData);
  if (!updated) throw { status: 404, message: 'Artiste non trouvé' };
  res.json(updated);
};

const deleteArtist = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const deleted = await Artist.delete(id);
  if (!deleted) throw { status: 404, message: 'Artiste non trouvé' };
  res.json(deleted);
};

export default {
  getAllArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
};
