-- ======================
-- Création des tables
-- ======================
CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  type INTEGER NOT NULL,
  isadmin INTEGER NOT NULL,
  syncro_status INTEGER NOT NULL
);

CREATE TABLE playlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE playlist_track (
  track_id INTEGER NOT NULL,
  playlist_id INTEGER NOT NULL,
  PRIMARY KEY (track_id, playlist_id),
  FOREIGN KEY (track_id) REFERENCES tracks(id),
  FOREIGN KEY (playlist_id) REFERENCES playlist(id)
);

CREATE TABLE albums (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  release_date TEXT,
  image_uri TEXT UNIQUE,
  popularity INTEGER
);

CREATE TABLE tag (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  color_index INTEGER DEFAULT 0
);

CREATE TABLE track_tag (
  track_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (track_id, tag_id),
  FOREIGN KEY (track_id) REFERENCES tracks(id),
  FOREIGN KEY (tag_id) REFERENCES tag(id)
);

CREATE TABLE artists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  image_uri TEXT UNIQUE,
  popularity INTEGER,
  country_id INTEGER,
  type INTEGER,
  birth TEXT,
  FOREIGN KEY (country_id) REFERENCES countries(id)
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE countries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  geographical_region_id INTEGER,
  FOREIGN KEY (geographical_region_id) REFERENCES geographical_regions(id)
);

CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  category_id INTEGER,
  user_id INTEGER,
  description TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE geographical_regions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE listens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  platform TEXT NOT NULL,
  ms_played INTEGER NOT NULL,
  track_id INTEGER,
  user_id INTEGER,
  reason_end TEXT,
  FOREIGN KEY (track_id) REFERENCES tracks(id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE genres (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE sub_genres (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  genre_id INTEGER NOT NULL,
  FOREIGN KEY (genre_id) REFERENCES genres(id)
);

CREATE TABLE track_artists (
  track_id INTEGER NOT NULL,
  artist_id INTEGER NOT NULL,
  is_primary INTEGER DEFAULT 0,
  PRIMARY KEY (track_id, artist_id),
  FOREIGN KEY (track_id) REFERENCES tracks(id),
  FOREIGN KEY (artist_id) REFERENCES artists(id)
);

CREATE TABLE tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  duration_ms INTEGER,
  album_id INTEGER,
  explicit INTEGER DEFAULT 0,
  popularity INTEGER,
  sub_genre_id INTEGER,
  acousticness REAL,
  danceability REAL,
  energy REAL,
  instrumentalness REAL,
  key INTEGER,
  liveness REAL,
  loudness REAL,
  mode INTEGER,
  speechiness REAL,
  tempo REAL,
  time_signature INTEGER,
  valence REAL,
  is_edited INTEGER DEFAULT 0,
  FOREIGN KEY (album_id) REFERENCES albums(id),
  FOREIGN KEY (sub_genre_id) REFERENCES sub_genres(id)
);

-- ======================
-- INDEX OPTIMISÉS (ANALYTIQUES)
-- ======================

-- Relations principales pour les grosses jointures analytiques
CREATE INDEX idx_track_artists_track_artist ON track_artists(track_id, artist_id);
CREATE INDEX idx_track_tag_track_tag ON track_tag(track_id, tag_id);
CREATE INDEX idx_tracks_album_id ON tracks(album_id);
CREATE INDEX idx_tracks_sub_genre_id ON tracks(sub_genre_id);
CREATE INDEX idx_listens_track_id ON listens(track_id);
CREATE INDEX idx_artists_country_id ON artists(country_id);
CREATE INDEX idx_sub_genres_genre_id ON sub_genres(genre_id);

-- Filtres fréquents
CREATE INDEX idx_artists_name ON artists(name);
CREATE INDEX idx_albums_title ON albums(title);
CREATE INDEX idx_listens_user_id ON listens(user_id);
CREATE INDEX idx_listens_valid_ms ON listens(track_id) WHERE ms_played >= 30000;
CREATE INDEX idx_listens_invalid_ms ON listens(track_id) WHERE ms_played < 30000;

