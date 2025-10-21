import { Request, Response } from 'express';
import Country from '../../models/core/country-model';
import { ICountry } from '@/type';

// =======================
// CRUD
// =======================

const getAllCountries = async (req: Request, res: Response) => {
    const countries = await Country.getAll();
    res.json(countries);
};

const getCountryById = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const country = await Country.getById(id);
  if (!country) throw { status: 404, message: 'Pays non trouvé' };
  res.json(country);
};

const createCountry = async (req: Request, res: Response) => {
  const countryData: ICountry = req.body;
  const newCountry = await Country.create(countryData);
  res.status(201).json(newCountry);
};

const updateCountry = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const countryData: ICountry = req.body;
  const updatedCountry = await Country.update(id, countryData);
  res.json(updatedCountry);
};

const deleteCountry = async (req: Request, res: Response) => {
  const id = Number(req.query.id);
  if (!id) throw { status: 400, message: 'ID manquant' };
  const deleted = await Country.delete(id);
  res.json(deleted);
};

// =======================
// Additional Methods
// =======================

const getAllCountriesWithRegion = async (_req: Request, res: Response) => {
  const countries = await Country.getAllWithRegion();
  res.json(countries);
};

export default {
  getAllCountries,
  getAllCountriesWithRegion,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry,
};