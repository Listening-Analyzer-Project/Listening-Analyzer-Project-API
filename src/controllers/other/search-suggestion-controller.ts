import { Request, Response } from 'express';
import { getSuggestions as getSuggestionsHelper } from '@/utils/search-helper';

/**
 * Récupère les suggestions de recherche (autocomplétion) pour un type de vue donné.
 * @param req 
 * @param res 
 */
const getSuggestions = (req: Request, res: Response) => {
    const search = req.query.search?.toString();
    const viewType = req.query.view_type?.toString() || 'listens';
    const limit = parseInt(req.query.limit?.toString() || '10', 10);

    if (!search || search.length < 2) {
        return res.json({ suggestions: [] });
    }

    const userIdsParam = req.query.user_ids?.toString();
    const userIds = userIdsParam ? userIdsParam.split(',').map(id => id.trim()).filter(id => id) : undefined;

    try {
        const suggestions = getSuggestionsHelper(search, viewType, limit, userIds);

        const typeLabels: Record<string, string> = {
            track: 'Tra',
            artist: 'Art',
            album: 'Alb',
            tag: 'Tag'
        };

        const formattedSuggestions = suggestions
            .filter(s => s.value && s.value.trim() !== '')
            .map(s => `[${typeLabels[s.type] || s.type}] ${s.value}`);

        res.json({
            suggestions: formattedSuggestions.slice(0, limit)
        });

    } catch (err: any) {
        console.error('Erreur lors de la récupération des suggestions:', err);
        res.status(500).json({ error: err.message || 'Erreur interne du serveur' });
    }
};

export default {
    getSuggestions,
};
