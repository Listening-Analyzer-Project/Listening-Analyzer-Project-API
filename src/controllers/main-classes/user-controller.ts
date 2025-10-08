import { Request, Response } from 'express';
import User from '../../models/main-classes/user-model';
import { IUser } from '../../type/bdd-type';

const getAllUsers = (req: Request, res: Response) => {
  try {
    const users = User.getAll();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const getUserById = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const user = User.getById(id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const createUser = (req: Request, res: Response) => {
  try {
    const userData: IUser = req.body;
    const newUser = User.create(userData);
    res.status(201).json(newUser);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const userData: IUser = req.body;
    const updated = User.update(id, userData);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const deleted = User.delete(id);
    res.json(deleted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
