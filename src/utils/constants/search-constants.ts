import { SuggestionTableConfig } from "@/type";

/**
 * Configurations pour les suggestions par type de vue
 */
export const SUGGESTION_CONFIGS: Record<string, SuggestionTableConfig> = {
    listens: {
        table: 'analytics_listens',
        suggestions: [
            { column: 'track_title', type: 'track' },
            { column: 'primary_artist_name', type: 'artist' },
            { column: 'album_title', type: 'album' }
        ],
        userIdsColumn: 'user_id'
    },
    tracks: {
        table: 'analytics_listens',
        suggestions: [
            { column: 'track_title', type: 'track' },
            { column: 'all_artists', type: 'artist' },
            { column: 'album_title', type: 'album' }
        ],
        userIdsColumn: 'user_id'
    },
    artists: {
        table: 'analytics_listens',
        suggestions: [
            { column: 'primary_artist_name', type: 'artist' },
            { column: 'country_name', type: 'tag' }
        ],
        userIdsColumn: 'user_id'
    },
    albums: {
        table: 'analytics_listens',
        suggestions: [
            { column: 'album_title', type: 'album' },
            { column: 'all_artists', type: 'artist' }
        ],
        userIdsColumn: 'user_id'
    }
};