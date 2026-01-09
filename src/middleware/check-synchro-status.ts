import { Request, Response, NextFunction } from 'express';
import User from '@/models/core/user-model';
import ListenModel from '@/models/core/listen-model';

export const checkSynchroStatus = (strategy: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let userId: number | undefined;

        try {
            if (strategy === 'user_from_query') {
                userId = Number(req.query.id);
            } else if (strategy === 'user_from_body') {
                userId = Number(req.body.user_id);
            } else if (strategy === 'listen_from_query') {
                const listenId = Number(req.query.id);
                if (listenId) {
                    const listen = await ListenModel.getById(listenId);
                    if (listen) {
                        userId = listen.user_id;
                    }
                }
            }

            if (!userId || isNaN(userId)) {
                return next();
            }

            const user = await User.getById(userId);
            if (user && user.syncro_status === 1) {
                return res.status(423).json({
                    status: 423,
                    message: 'Resource locked due to synchronization in progress. Please try again later.',
                });
            }

            return next();
        } catch (error) {
            console.error('[checkSynchroStatus] Error:', error);
            return next(error);
        }
    };
};
