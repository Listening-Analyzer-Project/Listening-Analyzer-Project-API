import { Request, Response } from 'express';
import SubGenre from '@/models/core/sub-genre-model';
import { ISubGenre } from '@/type';

const getAllSubGenres = async (req: Request, res: Response) => {
  const subGenres = await SubGenre.getAll();
  res.json(subGenres);
};

const getSubGenreById = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const subGenre = await SubGenre.getById(id);
  if (!subGenre) throw { status: 404, message: 'Sous-genre non trouvé' };
  res.json(subGenre);
};

const createSubGenre = async (req: Request, res: Response) => {
  const subGenreData: ISubGenre = req.body;
  const newSubGenre = await SubGenre.create(subGenreData);
  res.status(201).json(newSubGenre);
};

const updateSubGenre = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const subGenreData: ISubGenre = req.body;
  const updated = await SubGenre.update(id, subGenreData);
  if (!updated) throw { status: 404, message: 'Sous-genre non trouvé' };
  res.json(updated);
};

const deleteSubGenre = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const deleted = await SubGenre.delete(id);
  if (!deleted) throw { status: 404, message: 'Sous-genre non trouvé' };
  res.json(deleted);
};

export default {
  getAllSubGenres,
  getSubGenreById,
  createSubGenre,
  updateSubGenre,
  deleteSubGenre,
};
