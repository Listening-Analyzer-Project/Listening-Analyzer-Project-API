import { Request, Response } from 'express';
import AlbumAnalytics from '@/models/analytics/albums-analytics-model';

const getAlbumsAnalytics = (req: Request, res: Response) => {
    const {
        search = '',
        order_by = 'valid_listens',
        order_dir = 'desc',
        limit,
        offset
    } = req.query;

    // Gestion sécurisée des valeurs numériques
    const safeLimit = isNaN(Number(limit)) || Number(limit) <= 0 ? 100 : Number(limit);
    const safeOffset = isNaN(Number(offset)) || Number(offset) < 0 ? 0 : Number(offset);

    const results = AlbumAnalytics.getAlbumsAnalytics(
        search as string,
        order_by as string,
        order_dir as string,
        safeLimit,
        safeOffset
    );

    if (!results.length) {
        return res.json({
        data: [],
        total_count: 0,
        });
    }

    const total_count = results[0].total_count;

    res.json({
        total_count,
        data: results.map(r => ({
        album_id: r.album_id,
        album_title: r.album_title,
        release_date: r.release_date,
        artists: r.artists,
        valid_listens: r.valid_listens,
        invalid_listens: r.invalid_listens,
        total_listens: r.total_listens,
        rank_num: r.rank_num,
        })),
    });
};

export default {
    getAlbumsAnalytics,
};
