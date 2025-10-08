import { Request, Response } from 'express';
import Country from '../../models/main-classes/country-model';
import { ICountry } from '../../type/bdd-type';

const getAllCountries = (req: Request, res: Response) => {
  try {
    const countries = Country.getAll();
    res.json(countries);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const getCountryById = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const country = Country.getById(id);
    if (!country) return res.status(404).json({ error: 'Pays non trouvé' });
    res.json(country);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const createCountry = (req: Request, res: Response) => {
  try {
    const countryData: ICountry = req.body;
    const newCountry = Country.create(countryData);
    res.status(201).json(newCountry);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const updateCountry = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const countryData: ICountry = req.body;
    const updated = Country.update(id, countryData);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCountry = (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    const deleted = Country.delete(id);
    res.json(deleted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry,
};
