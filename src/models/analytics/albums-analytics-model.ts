import { queryAll, buildSearchClause } from '@/utils';
import { IAlbumAnalytics } from '@/type';

const AlbumAnalytics = {
  getAlbumsAnalytics: (
    user_ids?: string[],
    search: string = '',
    order_by: string = 'valid_listens',
    order_dir: string = 'desc',
    limit: number = 50,
    offset: number = 0
  ): IAlbumAnalytics[] => {
    const validOrderBy = ['album_title', 'release_date', 'valid_listens', 'invalid_listens', 'total_listens'];
    if (!validOrderBy.includes(order_by)) order_by = 'valid_listens';
    const direction = order_dir.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const params: any[] = [];
    const whereClauses: string[] = [];

    if (user_ids && user_ids.length > 0) {
      const placeholders = user_ids.map(() => '?').join(', ');
      whereClauses.push(`user_id IN (${placeholders})`);
      params.push(...user_ids);
    }

    const searchResult = buildSearchClause(search, ['album_title', 'primary_artist_name']);
    if (searchResult.clause) {
      whereClauses.push(searchResult.clause);
      params.push(...searchResult.params);
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sql = `
      WITH album_tracks_count AS (
        SELECT album_id, COUNT(*) as total_tracks
        FROM tracks
        GROUP BY album_id
      ),
      artist_presence AS (
          SELECT 
              t.album_id, 
              ta.artist_id, 
              ar.name as artist_name,
              COUNT(t.id) as track_count
          FROM tracks t
          JOIN track_artists ta ON t.id = ta.track_id
          JOIN artists ar ON ta.artist_id = ar.id
          GROUP BY t.album_id, ta.artist_id, ar.name
      ),
      album_main_artists AS (
          SELECT
              ap.album_id,
              GROUP_CONCAT(ap.artist_name, ', ') as album_artists
          FROM artist_presence ap
          JOIN album_tracks_count atc ON ap.album_id = atc.album_id
          WHERE (
              (atc.total_tracks > 2 AND (CAST(ap.track_count AS REAL) / atc.total_tracks) > 0.6)
              OR
              (atc.total_tracks <= 2)
          )
          GROUP BY ap.album_id
      ),
      album_stats AS (
          SELECT
              al.album_id,
              al.album_title,
              al.album_release_date AS release_date,
              COALESCE(ama.album_artists, 'multiple') as all_artists,
              SUM(CASE WHEN al.is_valid = 1 THEN 1 ELSE 0 END) AS valid_listens,
              SUM(CASE WHEN al.is_valid = 0 THEN 1 ELSE 0 END) AS invalid_listens
          FROM analytics_listens al
          LEFT JOIN album_main_artists ama ON al.album_id = ama.album_id
          ${whereClause}
          GROUP BY al.album_id, al.album_title, al.album_release_date, ama.album_artists
          HAVING valid_listens > 0 OR invalid_listens > 0
      ),
      ranked AS (
        SELECT
          *,
          ROW_NUMBER() OVER (ORDER BY ${order_by} ${direction}) AS rank_num
        FROM album_stats
      )
      SELECT
        ranked.*,
        (SELECT COUNT(*) FROM album_stats) AS total_count
      FROM ranked
      ORDER BY ${order_by} ${direction}
      LIMIT ? OFFSET ?;
    `;

    return queryAll<IAlbumAnalytics>(sql, [...params, limit, offset]);
  }
};

export default AlbumAnalytics;
