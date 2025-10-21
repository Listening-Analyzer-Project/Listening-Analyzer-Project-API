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

