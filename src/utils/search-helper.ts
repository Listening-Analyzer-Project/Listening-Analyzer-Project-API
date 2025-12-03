import SearchSuggestionsModel from '@/models/search-suggestions-model';
import { SuggestionResult } from '@/type';
import { SUGGESTION_CONFIGS } from '@/utils/constants/search-constants';

/**
 * Construit une clause de recherche SQL dynamique pour plusieurs colonnes.
 * Supporte les opérateurs '+' (ET) et '|' (OU).
 * La priorité est donnée à '|' (OU) à l'intérieur des blocs '+' (ET).
 * @param search Le terme de recherche.
 * @param columns La liste des colonnes sur lesquelles effectuer la recherche.
 * @returns Un objet contenant la clause SQL et les paramètres associés.
 */
export const buildSearchClause = (search: string | undefined, columns: string[]): { clause: string, params: string[] } => {
    if (!search || search.trim() === '' || columns.length === 0) {
        return { clause: '', params: [] };
    }

    const normalizedSearch = search
        .replace(/\+/g, ' ')
        .replace(/\s*\|\s*/g, '|')
        .replace(/\s+/g, ' ')
        .trim();

    const andSegments = normalizedSearch.split(' ');
    const andClauses: string[] = [];
    const params: string[] = [];

    for (const segment of andSegments) {
        const orSegments = segment.split('|');
        const orClauses: string[] = [];

        for (const term of orSegments) {
            const cleanTerm = term.trim();
            if (cleanTerm) {
                const pattern = `%${cleanTerm}%`;
                const termConditions = columns.map(col => `${col} LIKE ?`);
                orClauses.push(`(${termConditions.join(' OR ')})`);
                params.push(...columns.map(() => pattern));
            }
        }

        if (orClauses.length > 0) {
            andClauses.push(`(${orClauses.join(' OR ')})`);
        }
    }

    if (andClauses.length === 0) {
        return { clause: '', params: [] };
    }

    const clause = `(${andClauses.join(' AND ')})`;

    return { clause, params };
};

/**
 * Récupère les suggestions de recherche pour un viewType donné.
 * @param search Le terme de recherche
 * @param viewType Le type de vue ('listens', 'tracks', 'artists', 'albums')
 * @param limit Le nombre maximum de suggestions
 * @param userIds Optionnel: filtrer par user IDs
 */
export const getSuggestions = (
    search: string,
    viewType: string,
    limit: number = 10,
    userIds?: string[]
): SuggestionResult[] => {
    const config = SUGGESTION_CONFIGS[viewType];

    if (!config) {
        throw new Error(`View type non supporté: ${viewType}`);
    }

    return SearchSuggestionsModel.getSuggestions(search, config, limit, userIds);
};
