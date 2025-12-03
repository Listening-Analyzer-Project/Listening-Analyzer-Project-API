import { queryAll } from '@/utils';
import { SuggestionResult, SuggestionTableConfig } from '@/type';

const SearchSuggestionsModel = {
    /**
     * Récupère les suggestions de recherche de manière générique.
     * @param search Le terme de recherche
     * @param config La configuration de la table et des colonnes
     * @param limit Le nombre maximum de suggestions
     * @param userIds Optionnel: filtrer par user IDs
     */
    getSuggestions: (
        search: string,
        config: SuggestionTableConfig,
        limit: number = 10,
        userIds?: string[]
    ): SuggestionResult[] => {
        if (!search || search.trim() === '' || config.suggestions.length === 0) {
            return [];
        }

        const pattern = `%${search.trim()}%`;
        const params: any[] = [];

        // Construire les sous-requêtes UNION pour chaque colonne
        const unionQueries = config.suggestions.map(({ column, type }) => {
            let whereClause = `WHERE ${column} LIKE ? AND ${column} IS NOT NULL`;

            if (userIds && userIds.length > 0 && config.userIdsColumn) {
                const placeholders = userIds.map(() => '?').join(', ');
                whereClause += ` AND ${config.userIdsColumn} IN (${placeholders})`;
            }

            return `
                SELECT ${column} AS value, '${type}' AS type 
                FROM ${config.table} 
                ${whereClause}
                GROUP BY ${column}
            `;
        });

        const sql = `
            SELECT value, type FROM (
                ${unionQueries.join('\nUNION\n')}
            )
            ORDER BY LENGTH(value) ASC
            LIMIT ?;
        `;

        config.suggestions.forEach(() => {
            params.push(pattern);
            if (userIds && userIds.length > 0 && config.userIdsColumn) {
                params.push(...userIds);
            }
        });
        params.push(limit);

        return queryAll<SuggestionResult>(sql, params);
    }
};

export default SearchSuggestionsModel;
