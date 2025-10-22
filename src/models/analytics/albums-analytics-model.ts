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
    // Validation du champ de tri
    const validOrderBy = ['album_title', 'release_date', 'valid_listens', 'invalid_listens', 'total_listens'];
    if (!validOrderBy.includes(order_by)) order_by = 'valid_listens';
    const direction = order_dir.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // Gestion du filtre de recherche
    const params: any[] = [];
    let searchClause = '';
    if (search && search.trim() !== '') {
      searchClause = `WHERE al.title LIKE ? OR aa.artists LIKE ?`;
      params.push(`%${search}%`, `%${search}%`);
    }

    // SQL optimisé, en un seul passage, avec CTE et total_count global
    const sql = `
      WITH album_artists AS (
        SELECT
          al.id AS album_id,
          GROUP_CONCAT(DISTINCT a.name) AS artists
        FROM albums al
        LEFT JOIN tracks t ON t.album_id = al.id
        LEFT JOIN track_artists ta ON ta.track_id = t.id
        LEFT JOIN artists a ON a.id = ta.artist_id
        GROUP BY al.id
      ),
      album_stats AS (
        SELECT
          al.id AS album_id,
          al.title AS album_title,
          al.release_date AS release_date,
          aa.artists AS artists,
          SUM(CASE WHEN l.ms_played >= 30000 THEN 1 ELSE 0 END) AS valid_listens,
          SUM(CASE WHEN l.ms_played < 30000 THEN 1 ELSE 0 END) AS invalid_listens,
          COUNT(l.id) AS total_listens
        FROM albums al
        LEFT JOIN tracks t ON t.album_id = al.id
        LEFT JOIN listens l ON l.track_id = t.id
        LEFT JOIN album_artists aa ON aa.album_id = al.id
        ${searchClause}
        GROUP BY al.id, al.title, al.release_date, aa.artists
        HAVING COUNT(l.id) > 0
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
