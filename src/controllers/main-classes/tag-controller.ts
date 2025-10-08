import { Request, Response } from 'express';
import Tag from '../../models/main-classes/tag-model';
import { ITag } from '../../type/bdd-type';

const getAllTags = async (req: Request, res: Response) => {
    const tags = await Tag.getAll();
    res.json(tags);
};

const getTagById = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const tag = await Tag.getById(id);
  if (!tag) throw { status: 404, message: 'Tag non trouvé' };
  res.json(tag);
};

const createTag = async (req: Request, res: Response) => {
  const tagData: ITag = req.body;
  const newTag = await Tag.create(tagData);
  res.status(201).json(newTag);
};

const updateTag = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const tagData: ITag = req.body;
  const updated = await Tag.update(id, tagData);
  res.json(updated);
};

const deleteTag = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const deleted = await Tag.delete(id);
  res.json(deleted);
};

export default {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
};
