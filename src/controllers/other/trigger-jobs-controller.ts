import { Request, Response } from 'express';
import { addPostImportJob } from '@/queue/import-queue';

const triggerPostImportJobs = async (req: Request, res: Response) => {
    const userId = Number(req.query.id);
    await addPostImportJob(userId);
    res.status(200).json({ success: true });
};

export default {
    triggerPostImportJobs,
};