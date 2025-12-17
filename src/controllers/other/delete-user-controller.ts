import { Request, Response } from 'express';
import { deleteUserService } from '@/service';
import User from '@/models/core/user-model';

const deleteUser = async (req: Request, res: Response) => {
  const userId = Number(req.query.id);

  const user = await User.getById(userId);
  if (!user) throw { status: 404, message: 'Utilisateur non trouvé' };

  const deleteUser = req.body.deleteUser === true;

  const result = await deleteUserService.deleteUserData(userId, deleteUser);
  if (result) {
    res.status(200).json(result);
  }
};

export default {
  deleteUser,
};