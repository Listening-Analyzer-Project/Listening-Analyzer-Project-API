import { Request, Response } from 'express';
import Listen from '@/models/core/listen-model';
import { IListen } from '@/type';

const getAllListens = async (req: Request, res: Response) => {
  const listens = await Listen.getAll();
  res.json(listens);
};

const getListenById = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const listen = await Listen.getById(id);
  if (!listen) throw { status: 404, message: 'Écoute non trouvée' };
  res.json(listen);
};

const createListen = async (req: Request, res: Response) => {
  const listenData: IListen = req.body;
  const newListen = await Listen.create(listenData);
  res.status(201).json(newListen);
};

const updateListen = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const listenData: IListen = req.body;
  const updated = await Listen.update(id, listenData);
  res.json(updated);
};

const deleteListen = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const deleted = await Listen.delete(id);
  res.json(deleted);
};

export default {
  getAllListens,
  getListenById,
  createListen,
  updateListen,
  deleteListen,
};
