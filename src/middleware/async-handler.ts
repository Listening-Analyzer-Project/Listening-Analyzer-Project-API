import { Request, Response, NextFunction } from 'express';

/**
 * Middleware pour capturer automatiquement les erreurs des fonctions async
 */
export const asyncHandler = (fn: Function) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
