import { Request, Response } from 'express';
import { importService } from '@/service';
import type { CanonicalListen } from '@/type';
import { dropIndexes, createIndexes } from '@/utils';

const importBatch = async (req: Request, res: Response) => {
  const batch = req.body as CanonicalListen[];
  const id = Number(req.query.id);

  const result = await importService.importCanonicalListens(batch, id);
  res.status(200).json({
    success: true,
    ...result,
  });
};

const dropDBIndexes = async (req: Request, res: Response) => {
  await dropIndexes();
  res.status(200).json({ success: true, message: 'Indexes supprimés.' });
};

const createDBIndexes = async (req: Request, res: Response) => {
  await createIndexes();
  res.status(200).json({ success: true, message: 'Indexes créés.' });
};

export default {
  importBatch,
  dropDBIndexes,
  createDBIndexes,
};

