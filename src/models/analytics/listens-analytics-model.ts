import { queryAll, queryOne } from '@/utils';
import { IListenAnalytics } from '@/type';

const ListensAnalytics = {
  getListens: (
    filters: {
      user_ids?: string[];
      track_id?: string;
      is_valid?: boolean;
      platform?: string;
      start_date?: string;
      end_date?: string;
      search?: string;
    } = {},
    order_by: string = 'listen_timestamp',
    order_dir: string = 'desc',
    limit: number = 10000,
    offset: number = 0
  ): IListenAnalytics[] => {
    const validOrderBy = [
      'listen_timestamp',
      'track_title',
      'primary_artist_name',
      'album_title',
      'album_release_date',
      'genre_name',
      'sub_genre_name',
      'ambiance',
      'primary_artist_country',
      'ms_played',
      'reason_start',
      'reason_end',
      'skipped',
      'is_valid',
      'platform'
    ];
    if (!validOrderBy.includes(order_by)) order_by = 'listen_timestamp';
    const direction = order_dir.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const params: any[] = [];
    const whereClauses: string[] = [];

    console.log('isvalid:', filters);

    if (filters.user_ids && filters.user_ids.length > 0) {
      const placeholders = filters.user_ids.map(() => '?').join(', ');
      whereClauses.push(`user_id IN (${placeholders})`);
      params.push(...filters.user_ids);
    }
    if (filters.track_id) {
      whereClauses.push(`track_id = ?`);
      params.push(filters.track_id);
    }
    if (filters.is_valid !== undefined) {
      whereClauses.push(`is_valid = ?`);
      params.push(filters.is_valid ? 1 : 0);
    }
    if (filters.platform) {
      whereClauses.push(`platform = ?`);
      params.push(filters.platform);
    }
    if (filters.start_date) {
      whereClauses.push(`listen_timestamp >= ?`);
      params.push(filters.start_date);
    }
    if (filters.end_date) {
      whereClauses.push(`listen_timestamp <= ?`);
      params.push(filters.end_date);
    }

    // Filtre texte global
    if (filters.search && filters.search.trim() !== '') {
      const pattern = `%${filters.search}%`;
      whereClauses.push(`(
        track_title LIKE ?
        OR album_title LIKE ?
        OR primary_artist_name LIKE ?
        OR genre_name LIKE ?
        OR sub_genre_name LIKE ?
        OR all_tags LIKE ?
      )`);
      params.push(pattern, pattern, pattern, pattern, pattern, pattern);
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sql = `
      WITH listens_stats AS (
        SELECT *
        FROM analytics_listens
        ${whereSQL}
      ),
      ranked AS (
        SELECT *,
          ROW_NUMBER() OVER (ORDER BY ${order_by} ${direction}) AS rank_num
        FROM listens_stats
      )
      SELECT
        ranked.*,
        (SELECT COUNT(*) FROM listens_stats) AS total_count
      FROM ranked
      ORDER BY ${order_by} ${direction}
      LIMIT ? OFFSET ?;
    `;

    return queryAll<IListenAnalytics>(sql, [...params, limit, offset]);
  }
};

export default ListensAnalytics;
