import { queryAll } from '@/utils';
import { IAlbumAnalytics } from '@/type';

const AlbumAnalytics = {
  getAlbumsAnalytics: (
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
    let whereClause = '';
    if (search && search.trim() !== '') {
      whereClause = `WHERE album_title LIKE ? OR all_artists LIKE ?`;
      params.push(`%${search}%`, `%${search}%`);
    }

    const sql = `
      WITH album_stats AS (
        SELECT
          album_id,
          album_title,
          album_release_date AS release_date,
          GROUP_CONCAT(DISTINCT primary_artist_name) AS all_artists,
          SUM(CASE WHEN is_valid = 1 THEN 1 ELSE 0 END) AS valid_listens,
          SUM(CASE WHEN is_valid = 0 THEN 1 ELSE 0 END) AS invalid_listens
        FROM analytics_listens
        ${whereClause}
        GROUP BY album_id, album_title, album_release_date
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
