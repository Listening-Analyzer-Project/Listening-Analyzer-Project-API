import SearchSuggestionsModel from '@/models/search-suggestions-model';
import { SuggestionResult } from '@/type';
import { SUGGESTION_CONFIGS } from '@/utils/constants/search-constants';

/**
 * Construit une clause de recherche SQL dynamique pour plusieurs colonnes.
 * @param search Le terme de recherche.
 * @param columns La liste des colonnes sur lesquelles effectuer la recherche.
 * @returns Un objet contenant la clause SQL et les paramètres associés.
 */
export const buildSearchClause = (search: string | undefined, columns: string[]): { clause: string, params: string[] } => {
    if (!search || search.trim() === '' || columns.length === 0) {
        return { clause: '', params: [] };
    }

    const pattern = `%${search.trim()}%`;
    const conditions = columns.map(col => `${col} LIKE ?`);
    const clause = `(${conditions.join(' OR ')})`;
    const params = columns.map(() => pattern);

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
