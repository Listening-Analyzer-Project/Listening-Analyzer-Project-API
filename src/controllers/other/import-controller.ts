import { Request, Response } from 'express';
import { importService } from '@/service';
import type { CanonicalListen } from '@/type';

const importBatch = (req: Request, res: Response) => {
  const batch = req.body as CanonicalListen[];
  const id = Number(req.query.id);

  if (!id) throw { status: 400, message: 'ID manquant' };

  if (!Array.isArray(batch) || batch.length === 0) {
  return res.status(400).json({ error: 'Aucune donnée à importer.' });
  }

  const result = importService.importCanonicalListens(batch, id);
  return res.status(200).json({
  success: true,
  ...result,
  });
};

export default {
    importBatch,
};

