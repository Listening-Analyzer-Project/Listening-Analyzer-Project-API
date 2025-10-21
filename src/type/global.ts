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

export interface IGenreWithSubGenres extends IGenre {
  sub_genres: ISubGenre[];
}

