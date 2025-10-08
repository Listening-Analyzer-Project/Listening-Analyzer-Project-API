import { Request, Response } from 'express';
import Category from '../../models/main-classes/category-model';
import { ICategory } from '../../type/bdd-type';

const getAllCategories = (req: Request, res: Response) => {
  try {
    const categories = Category.getAll();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const getCategoryById = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const category = Category.getById(id);
    if (!category) return res.status(404).json({ error: 'Catégorie non trouvée' });
    res.json(category);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const createCategory = (req: Request, res: Response) => {
  try {
    const categoryData: ICategory = req.body;
    const newCategory = Category.create(categoryData);
    res.status(201).json(newCategory);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const updateCategory = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const categoryData: ICategory = req.body;
    const updated = Category.update(id, categoryData);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCategory = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const deleted = Category.delete(id);
    res.json(deleted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
