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
