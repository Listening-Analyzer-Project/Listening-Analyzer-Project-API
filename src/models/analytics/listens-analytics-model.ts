import { IListenAnalytics } from '@/type';
import { buildSearchClause, queryAll } from '@/utils';

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
    const searchResult = buildSearchClause(filters.search, [
      'track_title',
      'album_title',
      'all_artists',
      'listen_timestamp',
      'genre_name',
      'sub_genre_name',
      'all_tags'
    ]);
    if (searchResult.clause) {
      whereClauses.push(searchResult.clause);
      params.push(...searchResult.params);
    }

    let orderByClause = order_by;
    if (order_by === 'ms_played') {
      orderByClause = 'CAST(ms_played AS INTEGER)';
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
          ROW_NUMBER() OVER (ORDER BY ${orderByClause} ${direction}) AS rank_num
        FROM listens_stats
      )
      SELECT
        ranked.*,
        (SELECT COUNT(*) FROM listens_stats) AS total_count
      FROM ranked
      ORDER BY ${orderByClause} ${direction}
      LIMIT ? OFFSET ?;
    `;

    const results = queryAll<any>(sql, [...params, limit, offset]);

    return results.map(row => ({
      ...row,
      all_tags: row.all_tags ? JSON.parse(row.all_tags) : []
    })) as IListenAnalytics[];
  }
};

export default ListensAnalytics;
