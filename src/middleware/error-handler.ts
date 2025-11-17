import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Erreur détectée :', err);

  // Si c’est une erreur connue (par exemple une contrainte SQL)
  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({ error: 'Contrainte violée (donnée déjà existante ou invalide).' });
  }

  // Erreur de validation (optionnel si tu ajoutes Zod/Yup plus tard)
  if (err.status === 400) {
    return res.status(400).json({ error: err.message });
  }

  if (err.status === 404) {
    return res.status(404).json({ error: err.message });
  }

  // Par défaut → erreur interne serveur
  res.status(500).json({ error: 'Erreur interne du serveur', details: err.message });
};
