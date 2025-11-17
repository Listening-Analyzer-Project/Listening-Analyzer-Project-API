import { Request, Response } from 'express';
import User from '@/models/core/user-model';
import { IUser } from '@/type';

const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.getAll();
  res.json(users);
};

const getUserById = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const user = await User.getById(id);
  if (!user) throw { status: 404, message: 'Utilisateur non trouvé' };
  res.json(user);
};

const createUser = async (req: Request, res: Response) => {
  const userData: IUser = req.body;
  const newUser = await User.create(userData);
  res.status(201).json(newUser);
};

const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const userData: IUser = req.body;
  const updated = await User.update(id, userData);
  res.json(updated);
};

const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const deleted = await User.delete(id);
  res.json(deleted);
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
