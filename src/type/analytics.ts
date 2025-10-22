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

