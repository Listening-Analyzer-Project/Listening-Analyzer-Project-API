import { Request, Response } from 'express';
import Job from '@/models/core/jobs-model';
import { IJob } from '@/type';

const getAllJobs = async (req: Request, res: Response) => {
    const jobs = await Job.getAll();
    res.json(jobs);
};

const getJobById = async (req: Request, res: Response) => {
    const id = Number(req.query.id);
    console.log(id);
    const job = await Job.getById(id);
    if (!job) throw { status: 404, message: 'Job non trouvée' };
    res.json(job);
};

const createJob = async (req: Request, res: Response) => {
    const job: IJob = req.body;
    const result = await Job.create(job);
    res.status(201).json({ id: result.id });
};

const updateJob = async (req: Request, res: Response) => {
    const id = Number(req.query.id);
    const job: IJob = req.body;
    const result = await Job.update(id, job);
    if (result.changes === 0) throw { status: 404, message: 'Job non trouvée' };
    res.json(result);
};

const deleteJob = async (req: Request, res: Response) => {
    const id = Number(req.query.id);
    const result = await Job.delete(id);
    if (result.changes === 0) throw { status: 404, message: 'Job non trouvée' };
    res.json(result);
};

export default {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
};


