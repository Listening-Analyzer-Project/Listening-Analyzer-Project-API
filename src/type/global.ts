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
  user_name?: string;
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
// Artist Analytics Interface
// =======================
export interface CanonicalListen {
  ts: string;
  platform: string;
  ms_played: number;
  reason_end: string;
  track: {
    title: string;
    duration_ms: number;
    album?: {
      title: string;
      release_date: string;
      image_uri: string;
      popularity: number;
    };
    artists?: {
      name: string;
      image_uri: string;
      popularity: number;
      type: string;
      birth: string;
    }[];
    tags?: string[];
    genre?: string;
    sub_genre?: string;
    explicit?: boolean;
    acousticness?: number;
    danceability?: number;
    energy?: number;
    instrumentalness?: number;
    key?: number;
    liveness?: number;
    loudness?: number;
    mode?: number;
    speechiness?: number;
    tempo?: number;
    time_signature?: number;
    valence?: number;
    is_edited?: boolean;
  };
}

// =======================
// GroupedTrack type
// =======================

export type GroupedTrack = {
  /** la représentation canonical du track (première occurrence du groupe) */
  track: CanonicalListen['track'];
  /** toutes les listens du batch associées à ce track */
  listens: CanonicalListen[];
  key: string;
};