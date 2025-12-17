import { Request, Response } from 'express';
import Category from '@/models/core/category-model';
import { ICategory } from '@/type';

const getAllCategories = async (req: Request, res: Response) => {
  const categories = await Category.getAll();
  res.json(categories);
};

const getCategoryById = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const category = await Category.getById(id);
  if (!category) throw { status: 404, message: 'Catégorie non trouvée' };
  res.json(category);
};

const createCategory = async (req: Request, res: Response) => {
  const categoryData: ICategory = req.body;
  const newCategory = await Category.create(categoryData);
  res.status(201).json(newCategory);
};

const updateCategory = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const categoryData: ICategory = req.body;
  const updated = await Category.update(id, categoryData);
  if (!updated) throw { status: 404, message: 'Catégorie non trouvée' };
  res.json(updated);
};

const deleteCategory = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  const deleted = await Category.delete(id);
  if (!deleted) throw { status: 404, message: 'Catégorie non trouvée' };
  res.json(deleted);
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
