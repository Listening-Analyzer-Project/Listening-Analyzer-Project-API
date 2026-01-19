import { Request, Response } from 'express';
import User from '@/models/core/user-model';
import { IUser } from '@/type';

const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.getAll();
  res.json(users);
};

const getUserById = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
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
  const userData: IUser = req.body;
  const updated = await User.update(id, userData);
  if (!updated) throw { status: 404, message: 'Utilisateur non trouvé' };
  res.json(updated);
};

const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const deleted = await User.delete(id);
  if (!deleted) throw { status: 404, message: 'Utilisateur non trouvé' };
  res.json(deleted);
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
