import { Request, Response } from 'express';
import Genre from '../../models/core/genre-model';
import { IGenre } from '@/type';

const getAllGenres = async (req: Request, res: Response) => {
  const genres = await Genre.getAll();
  res.json(genres);
};

const getGenreById = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const genre = await Genre.getById(id);
  if (!genre) throw { status: 404, message: 'Genre non trouvé' };
  res.json(genre);
};

const createGenre = async (req: Request, res: Response) => {
  const genreData: IGenre = req.body;
  const newGenre = await Genre.create(genreData);
  res.status(201).json(newGenre);
};

const updateGenre = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const genreData: IGenre = req.body;
  const updated = await Genre.update(id, genreData);
  res.json(updated);
};

const deleteGenre = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const deleted = await Genre.delete(id);
  res.json(deleted);
};

export default {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
};
