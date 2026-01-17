// =======================
// User
// =======================
export interface IUser {
  id?: number;
  name: string;
  type: number;
  isadmin: number; // 0 ou 1
  syncro_status: number; // 0, 1 ou 2
}

// =======================
// Playlist
// =======================
export interface IPlaylist {
  id?: number;
  name: string;
  user_id: number;
}

// =======================
// Playlist_Track (table de liaison)
// =======================
export interface IPlaylistTrack {
  track_id: number;
  playlist_id: number;
}

// =======================
// Albums
// =======================
export interface IAlbum {
  id?: number;
  title: string;
  release_date?: string;
  image_uri?: string;
  popularity?: number;
}

// =======================
// Tags
// =======================
export interface ITag {
  id?: number;
  name: string;
}

// =======================
// Track_Tag (table de liaison)
// =======================
export interface ITrackTag {
  track_id: number;
  tag_id: number;
}

// =======================
// Artists
// =======================
export interface IArtist {
  id?: number;
  name: string;
  image_uri?: string;
  popularity?: number;
  country_id?: number;
  type?: number;
  birth?: string;
}

// =======================
// Categories
// =======================
export interface ICategory {
  id?: number;
  name: string;
}

// =======================
// Countries
// =======================
export interface ICountry {
  id?: number;
  name: string;
  geographical_region_id?: number;
}

// =======================
// Events
// =======================
export interface IEvent {
  id?: number;
  title: string;
  start_date: string;
  end_date: string;
  category_id?: number;
  user_id?: number;
  description?: string;
}

// =======================
// Geographical Regions
// =======================
export interface IGeographicalRegion {
  id?: number;
  name: string;
}

// =======================
// Listens
// =======================
export interface IListen {
  id: number;
  ts: string;
  platform: string;
  ms_played: number;
  track_id?: number;
  user_id?: number;
  reason_end?: string;
}

// =======================
// Genres
// =======================
export interface IGenre {
  id?: number;
  name: string;
}

// =======================
// Sub Genres
// =======================
export interface ISubGenre {
  id?: number;
  name: string;
  genre_id: number;
}

// =======================
// Track_Artists (table de liaison)
// =======================
export interface ITrackArtist {
  track_id: number;
  artist_id: number;
  is_primary?: number; // 0 ou 1
}

// =======================
// Tracks
// =======================
export interface ITrack {
  id?: number;
  title: string;
  duration_ms?: number;
  album_id?: number;
  explicit?: number; // 0 ou 1
  popularity?: number;
  sub_genre_id?: number;
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
  is_edited?: number; // 0 ou 1
}

// =======================
// Jobs
// =======================
export interface IJob {
  id?: number;
  name: string;
  user_id: number;
  progress: number;
  phase: number;
  type: number;
  last_processed_id: number;
}

// =======================
// Schéma global de la base
// =======================
export interface IDatabaseSchema {
  users: IUser[];
  playlists: IPlaylist[];
  playlist_tracks: IPlaylistTrack[];
  albums: IAlbum[];
  tags: ITag[];
  track_tags: ITrackTag[];
  artists: IArtist[];
  categories: ICategory[];
  countries: ICountry[];
  events: IEvent[];
  geographical_regions: IGeographicalRegion[];
  listens: IListen[];
  genres: IGenre[];
  sub_genres: ISubGenre[];
  track_artists: ITrackArtist[];
  tracks: ITrack[];
}