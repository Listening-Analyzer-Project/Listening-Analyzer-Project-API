import { queryAll } from '@/utils';
import { IArtistAnalytics } from '@/type';

const ArtistAnalytics = {
  getArtistsAnalytics: (
    search: string = '',
    order_by: string = 'valid_listens',
    order_dir: string = 'desc',
    limit: number = 50,
    offset: number = 0
  ): IArtistAnalytics[] => {
    const validOrderBy = ['artist_name', 'country_name', 'valid_listens', 'invalid_listens', 'total_listens', 'main_genre'];
    if (!validOrderBy.includes(order_by)) order_by = 'valid_listens';
    const direction = order_dir.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const params: any[] = [];
    let searchClause = '';
    if (search && search.trim() !== '') {
      searchClause = 'WHERE a.name LIKE ?';
      params.push(`%${search}%`);
    }

    const sql = `
      WITH artist_tracks AS (
        SELECT
          ta.artist_id,
          t.sub_genre_id
        FROM track_artists ta
        JOIN tracks t ON t.id = ta.track_id
      ),
      artist_genres AS (
        SELECT
          at.artist_id,
          GROUP_CONCAT(DISTINCT sg.name) AS sub_genres,
          COUNT(DISTINCT sg.genre_id) AS genre_count,
          MIN(sg.genre_id) AS single_genre_id
        FROM artist_tracks at
        JOIN sub_genres sg ON at.sub_genre_id = sg.id
        GROUP BY at.artist_id
      ),
      artist_stats AS (
        SELECT
          a.id AS artist_id,
          a.name AS artist_name,
          c.name AS country_name,
          a.country_id,
          ag.single_genre_id,
          CASE 
            WHEN ag.genre_count = 1 THEN g.name
            ELSE 'multiple'
          END AS main_genre,
          CASE 
            WHEN ag.genre_count = 1 THEN ag.sub_genres
            ELSE ag.sub_genres
          END AS sub_genres,
          SUM(CASE WHEN l.ms_played >= 30000 THEN 1 ELSE 0 END) AS valid_listens,
          SUM(CASE WHEN l.ms_played < 30000 THEN 1 ELSE 0 END) AS invalid_listens,
          COUNT(l.id) AS total_listens
        FROM artists a
        LEFT JOIN countries c ON a.country_id = c.id
        LEFT JOIN artist_genres ag ON a.id = ag.artist_id
        LEFT JOIN genres g ON ag.single_genre_id = g.id
        LEFT JOIN track_artists ta ON a.id = ta.artist_id
        LEFT JOIN tracks t ON ta.track_id = t.id
        LEFT JOIN listens l ON l.track_id = t.id
        ${searchClause}
        GROUP BY a.id, a.name, c.name, a.country_id, ag.single_genre_id, ag.genre_count, ag.sub_genres, g.name
        HAVING COUNT(l.id) > 0
      ),
      ranked AS (
        SELECT
          *,
          ROW_NUMBER() OVER (ORDER BY ${order_by} ${direction}) AS rank_num
        FROM artist_stats
      )
      SELECT
        ranked.*,
        (SELECT COUNT(*) FROM artist_stats) AS total_count
      FROM ranked
      ORDER BY ${order_by} ${direction}
      LIMIT ? OFFSET ?;
    `;

    return queryAll<IArtistAnalytics>(sql, [...params, limit, offset]);
  }
};

export default ArtistAnalytics;
