import TrackModel from '@/models/core/track-model';
import AlbumModel from '@/models/core/album-model';
import ArtistModel from '@/models/core/artist-model';
import PlaylistTrackModel from '@/models/relation/playlist-track-model';
import TrackArtistModel from '@/models/relation/track-artist-model';
import { deleteInBatches } from './batch-helper';

export const cleanupHelper = {
  removeUnusedTracks(): number[] {
    const tracks = TrackModel.findUnusedTracks();
    const ids = tracks.map(t => t.id);
    const deletedRelations = cleanupHelper.deleteRelationsByTrackIds(ids);
    const deletedTracks = deleteInBatches(ids, TrackModel);
    return [deletedRelations, deletedTracks];
  },

  removeOrphanAlbums(): number {
    const albums = AlbumModel.findOrphanAlbums();
    const ids = albums.map(a => a.id);
    return deleteInBatches(ids, AlbumModel);
  },

  removeOrphanArtists(): number {
    const artists = ArtistModel.findOrphanArtists();
    const ids = artists.map(a => a.id);
    return deleteInBatches(ids, ArtistModel);
  },

  deleteRelationsByPlaylistIds(playlistIds: number[]): number {
    const { changes } = PlaylistTrackModel.deleteByPlaylistIds(playlistIds);
    return changes;
  },

  deleteRelationsByTrackIds(trackIds: number[]): number {
    const { changes } = TrackArtistModel.deleteByTrackIds(trackIds);
    return changes;
  }
};

