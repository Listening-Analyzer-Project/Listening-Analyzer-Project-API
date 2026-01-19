import { queryAll, buildSearchClause } from '@/utils';
import { IArtistAnalytics } from '@/type';

const ArtistAnalytics = {
  getArtistsAnalytics: (
    user_ids?: string[],
    search: string = '',
    order_by: string = 'valid_listens',
    order_dir: string = 'desc',
    limit: number = 50,
    offset: number = 0
  ): IArtistAnalytics[] => {
    const validOrderBy = ['artist_name', 'primary_artist_country', 'main_genre', 'valid_listens', 'invalid_listens', 'total_listens'];
    if (!validOrderBy.includes(order_by)) order_by = 'valid_listens';
    const direction = order_dir.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const params: any[] = [];
    const whereClauses: string[] = [];

    if (user_ids && user_ids.length > 0) {
      const placeholders = user_ids.map(() => '?').join(', ');
      whereClauses.push(`user_id IN (${placeholders})`);
      params.push(...user_ids);
    }

    const searchResult = buildSearchClause(search, ['all_artists', 'country_name']);
    if (searchResult.clause) {
      whereClauses.push(searchResult.clause);
      params.push(...searchResult.params);
    }

    const searchClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sql = `
      WITH exploded_listens AS (
        SELECT
          al.listen_id,
          al.is_valid,
          al.user_id,
          ta.artist_id,
          ar.name AS artist_name,
          c.name AS country_name,
          al.genre_name,
          al.sub_genre_name,
          al.all_artists
        FROM analytics_listens al
        JOIN track_artists ta ON al.track_id = ta.track_id
        JOIN artists ar ON ta.artist_id = ar.id
        LEFT JOIN countries c ON ar.country_id = c.id
      ),
      artist_stats AS (
        SELECT
          artist_id,
          artist_name,
          country_name,
          COALESCE(genre_name, 'multiple') AS genre_name,
          GROUP_CONCAT(DISTINCT sub_genre_name) AS sub_genres,
          SUM(CASE WHEN is_valid = 1 THEN 1 ELSE 0 END) AS valid_listens,
          SUM(CASE WHEN is_valid = 0 THEN 1 ELSE 0 END) AS invalid_listens
        FROM exploded_listens
        ${searchClause}
        GROUP BY artist_id, artist_name, country_name, genre_name
        HAVING COUNT(listen_id) > 0
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
