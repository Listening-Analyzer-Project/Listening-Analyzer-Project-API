import { Request, Response } from 'express';
import Tag from '../../models/main-classes/tag-model';
import { ITag } from '../../type/bdd-type';

const getAllTags = (req: Request, res: Response) => {
  try {
    const tags = Tag.getAll();
    res.json(tags);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const getTagById = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const tag = Tag.getById(id);
    if (!tag) return res.status(404).json({ error: 'Tag non trouvé' });
    res.json(tag);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const createTag = (req: Request, res: Response) => {
  try {
    const tagData: ITag = req.body;
    const newTag = Tag.create(tagData);
    res.status(201).json(newTag);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const updateTag = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const tagData: ITag = req.body;
    const updated = Tag.update(id, tagData);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTag = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const deleted = Tag.delete(id);
    res.json(deleted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
};
