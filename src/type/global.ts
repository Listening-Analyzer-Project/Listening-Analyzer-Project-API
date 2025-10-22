import { IGenre, ISubGenre } from "@/type";

// =======================
// Countries avec la geographical region associée
// =======================
export interface ICountryWithRegion {
  id: number;
  name: string;
  geographical_region?: {
    id: number;
    name: string;
  } | null;
}

// =======================
// Events avec la catégorie associée
// =======================
export interface IEventWithCategory {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  description?: string;
  category?: {
    id: number;
    name: string;
  } | null;
  user_id?: number;
}

// =======================
// Countries avec la geographical region associée et des statistiques
// =======================
export interface ICountryWithRegionAndStats {
  id: number;
  name: string;
  geographical_region_name?: string | null;
  total_artists: number;
  total_listens: number;
}

// =======================
// Genre avec ses sous-genres
// =======================

export interface IGenreWithSubGenres extends IGenre {
  sub_genres: ISubGenre[];
}

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
