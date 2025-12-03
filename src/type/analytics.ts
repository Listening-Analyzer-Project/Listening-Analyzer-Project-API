// =======================
// Album Analytics Interface
// =======================

export interface IAlbumAnalytics {
  album_id: number;
  album_title: string;
  release_date?: string;
  artists: string;
  valid_listens: number;
  invalid_listens: number;
  total_listens: number;
  rank_num: number;
  total_count: number;
}

// =======================
// Artist Analytics Interface
// =======================

export interface IArtistAnalytics {
  artist_id: number;
  artist_name: string;
  country_name: string | null;
  main_genre: string | null;
  sub_genres: string | null;
  valid_listens: number;
  invalid_listens: number;
  total_listens: number;
  rank_num: number;
  total_count: number;
}

// =======================
// Track Analytics Interface
// =======================

export interface ITrackAnalytics {
  track_id: number;
  track_title: string;
  album_title: string | null;
  artists: string | null;
  genre_name: string | null;
  sub_genre_name: string | null;
  tags: string | null;
  valid_listens: number;
  invalid_listens: number;
  total_listens: number;
  rank_num: number;
  total_count: number;
}

// =======================
// Listen Analytics Interface
// =======================
export interface IListenAnalytics {
  listen_id: number;
  ts: string;
  platform: string;
  ms_played: number;
  is_valid: boolean;
  listen_country_code: string | null;
  ip_addr: string | null;
  track_id: number;
  track_title: string;
  album_id: number | null;
  album_title: string | null;
  album_release_date: string | null;
  genre_id: number | null;
  genre_name: string | null;
  sub_genre_id: number | null;
  sub_genre_name: string | null;
  ambiance_id: number | null;
  ambiance: string | null;
  primary_artist_id: number | null;
  primary_artist_name: string | null;
  primary_artist_country: string | null;
  primary_artist_spotify_genres: any[] | null;
  all_track_artists: any[] | null;
  reason_start?: string | null;
  reason_end?: string | null;
  shuffle?: boolean;
  skipped?: boolean;
  offline?: boolean;
  incognito_mode?: boolean;
  total_count?: number;
}

export type SuggestionResult = {
  type: 'track' | 'artist' | 'album' | 'tag';
  value: string;
}

export interface SuggestionColumnConfig {
  column: string;
  type: 'track' | 'artist' | 'album' | 'tag';
}

export interface SuggestionTableConfig {
  table: string;
  suggestions: SuggestionColumnConfig[];
  userIdsColumn?: string; // Optional: pour filtrer par user_ids si nécessaire
}
