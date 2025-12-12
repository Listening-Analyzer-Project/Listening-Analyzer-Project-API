-- Régions
INSERT INTO geographical_regions (name)
VALUES ('Europe'), ('Amérique du Nord'), ('Asie');

-- Pays
INSERT INTO countries (name, geographical_region_id)
VALUES ('France', 1), ('Canada', 2), ('Japon', 3);

-- Utilisateurs
INSERT INTO user (name, type, isadmin, syncro_status)
VALUES 
  ('Alice', 1, 0, 1),
  ('Bob', 1, 0, 1),
  ('Admin', 2, 1, 1);

-- Genres et sous-genres
INSERT INTO genres (name) VALUES ('Pop'), ('Hip-Hop'), ('Rock');

INSERT INTO sub_genres (name, genre_id)
VALUES ('Synthpop', 1), ('Trap', 2), ('Indie Rock', 3);

-- Ambiances / tags
INSERT INTO tag (name) VALUES ('Chill'), ('Workout'), ('Focus');

-- Artistes
INSERT INTO artists (name, image_uri, popularity, country_id, type, birth)
VALUES
  ('Dua Lipa', 'img_dua.jpg', 90, 1, 1, '1995-08-22'),
  ('Drake', 'img_drake.jpg', 95, 2, 1, '1986-10-24'),
  ('Radwimps', 'img_radwimps.jpg', 80, 3, 1, '2001-01-01');

-- Albums
INSERT INTO albums (title, release_date, image_uri, popularity)
VALUES
  ('Future Nostalgia', '2020-03-27', 'dua_album.jpg', 85),
  ('Scorpion', '2018-06-29', 'drake_album.jpg', 88),
  ('Your Name OST', '2016-08-24', 'radwimps_album.jpg', 75);

-- Tracks
INSERT INTO tracks (
  title, duration_ms, album_id, explicit, popularity, sub_genre_id,
  acousticness, danceability, energy, instrumentalness, key, liveness,
  loudness, mode, speechiness, tempo, time_signature, valence, is_edited
) VALUES
  ('Don’t Start Now', 183000, 1, 0, 90, 1, 0.12, 0.80, 0.75, 0.01, 1, 0.12, -5.0, 1, 0.06, 124, 4, 0.95, 1),
  ('God’s Plan', 198000, 2, 1, 95, 2, 0.05, 0.79, 0.65, 0.0, 5, 0.15, -6.2, 1, 0.10, 153, 4, 0.80, 1),
  ('Zenzenzense', 250000, 3, 0, 85, 3, 0.03, 0.85, 0.88, 0.01, 3, 0.10, -4.5, 1, 0.05, 172, 4, 0.98, 0);

-- Relations track_artists
INSERT INTO track_artists (track_id, artist_id, is_primary)
VALUES (1, 1, 1), (2, 2, 1), (3, 3, 1);

-- Relations track_tag
INSERT INTO track_tag (track_id, tag_id)
VALUES 
  (1, 1), (1, 3),
  (2, 2);

-- Écoutes (listens)
INSERT INTO listens (ts, platform, ms_played, track_id, user_id, reason_end)
VALUES
  ('2024-10-01T10:00:00Z', 'Spotify', 200000, 1, 1, 'trackdone'),
  ('2024-10-01T11:00:00Z', 'Spotify', 25000, 1, 2, 'clicknext'),
  ('2024-10-02T09:00:00Z', 'Apple Music', 198000, 2, 1, 'trackdone'),
  ('2024-10-03T08:00:00Z', 'Spotify', 180000, 2, 2, 'endplay'),
  ('2024-10-04T07:00:00Z', 'YouTube Music', 250000, 3, 1, 'trackdone'),
  ('2024-10-04T08:00:00Z', 'Spotify', 5000, 3, 2, 'clicknext');

-- Categories
INSERT INTO categories (name)
VALUES
('Vie professionnelle'),
('Vie amoureuse'),
('Vie publique');

-- Events
INSERT INTO events (title, user_id, category_id, start_date, end_date, description)
VALUES
('Event 1', 1, 1, '2024-10-01', '2024-10-01', 'Description 1'),
('Event 2', 2, 2, '2020-10-03', '2025-10-04', 'Description 2'),
('Event 3', 3, 3, '2024-10-05', '2024-11-20', 'Description 3');