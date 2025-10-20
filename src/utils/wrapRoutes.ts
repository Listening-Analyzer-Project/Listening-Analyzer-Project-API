import { Router, RequestHandler } from 'express';
import { asyncHandler } from '@/middleware';

/**
 * Enveloppe automatiquement toutes les routes d'un Router avec asyncHandler.
 */
export function wrapRoutes(router: Router): Router {
  const stack = router.stack;

  for (const layer of stack) {
    // On vérifie si la couche contient des "route handlers"
    if (layer.route && layer.route.stack) {
      for (const routeLayer of layer.route.stack) {
        const handler = routeLayer.handle as RequestHandler;

        // On ne wrappe que les fonctions async (celles qui retournent une promesse)
        if (handler.constructor.name === 'AsyncFunction') {
          routeLayer.handle = asyncHandler(handler);
        }
      }
    }
  }

  return router;
}
