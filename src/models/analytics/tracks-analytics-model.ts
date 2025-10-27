import { queryAll } from '@/utils';
import { ITrackAnalytics } from '@/type';

const TrackAnalytics = {
  getTracksAnalytics: (
    search: string = '',
    order_by: string = 'valid_listens',
    order_dir: string = 'desc',
    limit: number = 50,
    offset: number = 0
  ): ITrackAnalytics[] => {
    const validOrderBy = ['track_title','album_title','all_artists','genre_name','sub_genre_name','all_tags','valid_listens','invalid_listens','total_listens'];
    if (!validOrderBy.includes(order_by)) order_by = 'valid_listens';
    const direction = order_dir.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const params: any[] = [];
    let searchClause = '';
    if (search && search.trim() !== '') {
      searchClause = `WHERE track_title LIKE ? OR album_title LIKE ? OR all_artists LIKE ? OR genre_name LIKE ? OR sub_genre_name LIKE ? OR all_tags LIKE ?`;
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern, pattern, pattern, pattern);
    }

    const sql = `
      WITH track_stats AS (
        SELECT
          track_id,
          track_title,
          album_title,
          all_artists,
          genre_name,
          sub_genre_name,
          all_tags,
          SUM(CASE WHEN is_valid = 1 THEN 1 ELSE 0 END) AS valid_listens,
          SUM(CASE WHEN is_valid = 0 THEN 1 ELSE 0 END) AS invalid_listens
        FROM analytics_listens
        ${searchClause}
        GROUP BY track_id, track_title, album_title, all_artists, genre_name, sub_genre_name, all_tags
        HAVING COUNT(listen_id) > 0
      ),
      ranked AS (
        SELECT
          *,
          ROW_NUMBER() OVER (ORDER BY ${order_by} ${direction}) AS rank_num
        FROM track_stats
      )
      SELECT
        ranked.*,
        (SELECT COUNT(*) FROM track_stats) AS total_count
      FROM ranked
      ORDER BY ${order_by} ${direction}
      LIMIT ? OFFSET ?;
    `;

    return queryAll<ITrackAnalytics>(sql, [...params, limit, offset]);
  }
};

export default TrackAnalytics;
