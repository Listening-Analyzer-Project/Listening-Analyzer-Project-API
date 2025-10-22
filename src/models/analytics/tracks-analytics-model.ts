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
    const validOrderBy = ['track_title','album_title','artists','genre_name','sub_genre_name','valid_listens','invalid_listens','total_listens'];

    if (!validOrderBy.includes(order_by)) order_by = 'valid_listens';
    const direction = order_dir.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const params: any[] = [];
    let searchClause = '';
    if (search && search.trim() !== '') {
      searchClause = `
        WHERE t.title LIKE ?
        OR al.title LIKE ?
        OR a_list.artists LIKE ?
        OR g.name LIKE ?
        OR sg.name LIKE ?
        OR tag_list.tag LIKE ?
      `;
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern, pattern, pattern, pattern);
    }

    const sql = `
      WITH artist_list AS (
        SELECT
          ta.track_id,
          GROUP_CONCAT(DISTINCT ar.name) AS artists
        FROM track_artists ta
        JOIN artists ar ON ar.id = ta.artist_id
        GROUP BY ta.track_id
      ),
      tag_list AS (
        SELECT
          tt.track_id,
          GROUP_CONCAT(DISTINCT tg.name) AS tag
        FROM track_tag tt
        JOIN tag tg ON tg.id = tt.tag_id
        GROUP BY tt.track_id
      ),
      track_stats AS (
        SELECT
          t.id AS track_id,
          t.title AS track_title,
          al.title AS album_title,
          a_list.artists,
          g.name AS genre_name,
          sg.name AS sub_genre_name,
          tag_list.tag,
          SUM(CASE WHEN l.ms_played >= 30000 THEN 1 ELSE 0 END) AS valid_listens,
          SUM(CASE WHEN l.ms_played < 30000 THEN 1 ELSE 0 END) AS invalid_listens,
          COUNT(l.id) AS total_listens
        FROM tracks t
        LEFT JOIN albums al ON al.id = t.album_id
        LEFT JOIN sub_genres sg ON sg.id = t.sub_genre_id
        LEFT JOIN genres g ON g.id = sg.genre_id
        LEFT JOIN listens l ON l.track_id = t.id
        LEFT JOIN artist_list a_list ON a_list.track_id = t.id
        LEFT JOIN tag_list ON tag_list.track_id = t.id
        ${searchClause}
        GROUP BY t.id, t.title, al.title, a_list.artists, g.name, sg.name, tag_list.tag
        HAVING COUNT(l.id) > 0
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
  },
};

export default TrackAnalytics;
