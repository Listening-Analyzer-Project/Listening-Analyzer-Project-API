import { Request, Response } from 'express';
import { IAlbum } from '../../type/bdd-type';
import Album from '../../models/main-classes/album-model';

const getAllAlbums = async (req: Request, res: Response) => {
  const albums = await Album.getAll();
  res.json(albums);
};

const getAlbumById = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const album = await Album.getById(id);
  if (!album) throw { status: 404, message: 'Album non trouvé' };
  res.json(album);
};

const createAlbum = async (req: Request, res: Response) => {
  const albumData: IAlbum = req.body;
  const newAlbum = await Album.create(albumData);
  res.status(201).json(newAlbum);
};

const updateAlbum = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const albumData: IAlbum = req.body;
  const updated = await Album.update(id, albumData);
  res.json(updated);
};

const deleteAlbum = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const deleted = await Album.delete(id);
  res.json(deleted);
};

export default {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
};
