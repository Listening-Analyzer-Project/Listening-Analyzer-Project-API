import { Request, Response } from 'express';
import GeographicalRegion from '@/models/core/geographical-region-model';
import { IGeographicalRegion } from '@/type';

const getAllRegions = async (req: Request, res: Response) => {
    const regions = await GeographicalRegion.getAll();
    res.json(regions);
};

const getRegionById = async (req: Request, res: Response) => {
    const id = Number(req.query.id);
    const region = await GeographicalRegion.getById(id);
    if (!region) throw { status: 404, message: 'Region non trouvée' };
    res.json(region);
};

const createRegion = async (req: Request, res: Response) => {
    const newRegion: IGeographicalRegion = req.body;
    const createdRegion = await GeographicalRegion.create(newRegion);
    res.status(201).json(createdRegion);
};

const updateRegion = async (req: Request, res: Response) => {
    const id = Number(req.query.id);
    const updatedRegion: IGeographicalRegion = req.body;
    const result = await GeographicalRegion.update(id, updatedRegion);
    if (!result) throw { status: 404, message: 'Region non trouvée' };
    res.json(result);
};

const deleteRegion = async (req: Request, res: Response) => {
    const id = Number(req.query.id);
    const result = await GeographicalRegion.delete(id);
    if (!result) throw { status: 404, message: 'Region non trouvée' };
    res.json(result);
};

export default {
    getAllRegions,
    getRegionById,
    createRegion,
    updateRegion,
    deleteRegion
};
