DROP VIEW IF EXISTS analytics_listens;

CREATE VIEW analytics_listens AS
SELECT
  -- Données de l'écoute
  l.id AS listen_id,
  l.ts AS listen_timestamp,
  l.platform,
  l.ms_played,
  l.reason_end,
  l.user_id,
  CASE WHEN l.ms_played >= 30000 THEN 1 ELSE 0 END AS is_valid,

  -- Données de l'utilisateur
  u.name AS user_name,
  u.type AS user_type,

  -- Données du morceau
  t.id AS track_id,
  t.title AS track_title,
  t.duration_ms,
  t.explicit,
  t.popularity AS track_popularity,
  t.is_edited,

  -- Album
  al.id AS album_id,
  al.title AS album_title,
  al.release_date AS album_release_date,
  al.popularity AS album_popularity,
  al.image_uri AS album_image_uri,

  -- Sous-genre et genre
  sg.id AS sub_genre_id,
  sg.name AS sub_genre_name,
  g.id AS genre_id,
  g.name AS genre_name,

  -- Artiste principal
  pa.id AS primary_artist_id,
  pa.name AS primary_artist_name,
  pa.popularity AS primary_artist_popularity,
  pa.image_uri AS primary_artist_image,

  -- Pays et région de l'artiste principal
  c.id AS country_id,
  c.name AS country_name,
  gr.id AS region_id,
  gr.name AS region_name,

  -- Liste des artistes liés au morceau
  (
    SELECT GROUP_CONCAT(ar.name, ', ')
    FROM track_artists ta2
    JOIN artists ar ON ta2.artist_id = ar.id
    WHERE ta2.track_id = t.id
  ) AS all_artists,

  -- Liste des tags associés
  (
    SELECT json_group_array(
      json_object(
        'name', tag.name, 
        'color_index', IFNULL(tag.color_index, 0)
      )
    )
    FROM track_tag tt
    JOIN tag ON tt.tag_id = tag.id
    WHERE tt.track_id = t.id
  ) AS all_tags

FROM listens l

-- Jointures principales
LEFT JOIN user u ON l.user_id = u.id
LEFT JOIN tracks t ON l.track_id = t.id
LEFT JOIN albums al ON t.album_id = al.id
LEFT JOIN sub_genres sg ON t.sub_genre_id = sg.id
LEFT JOIN genres g ON sg.genre_id = g.id

-- Artiste principal (is_primary = 1)
LEFT JOIN (
    SELECT track_id, artist_id
    FROM (
        SELECT track_id, artist_id,
               ROW_NUMBER() OVER (PARTITION BY track_id ORDER BY is_primary DESC, artist_id ASC) as rn
        FROM track_artists
    )
    WHERE rn = 1
) ta ON ta.track_id = t.id
LEFT JOIN artists pa ON ta.artist_id = pa.id

-- Géographie
LEFT JOIN countries c ON pa.country_id = c.id
LEFT JOIN geographical_regions gr ON c.geographical_region_id = gr.id;
