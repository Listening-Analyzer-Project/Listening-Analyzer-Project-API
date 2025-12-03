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

    const searchResult = buildSearchClause(search, ['primary_artist_name', 'country_name']);
    if (searchResult.clause) {
      whereClauses.push(searchResult.clause);
      params.push(...searchResult.params);
    }

    const searchClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sql = `
      WITH artist_stats AS (
        SELECT
          primary_artist_id AS artist_id,
          primary_artist_name AS artist_name,
          country_name,
          COALESCE(genre_name, 'multiple') AS genre_name,
          GROUP_CONCAT(DISTINCT sub_genre_name) AS sub_genres,
          SUM(CASE WHEN is_valid = 1 THEN 1 ELSE 0 END) AS valid_listens,
          SUM(CASE WHEN is_valid = 0 THEN 1 ELSE 0 END) AS invalid_listens
        FROM analytics_listens
        ${searchClause}
        GROUP BY primary_artist_id, primary_artist_name, country_name, genre_name
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
