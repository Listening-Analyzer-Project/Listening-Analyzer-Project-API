import TrackModel from '@/models/core/track-model';
import AlbumModel from '@/models/core/album-model';
import ArtistModel from '@/models/core/artist-model';
import PlaylistTrackModel from '@/models/relation/playlist-track-model';
import TrackArtistModel from '@/models/relation/track-artist-model';
import TrackTagModel from '@/models/relation/track-tag-model';
import { deleteInBatches } from './batch-helper';

export const cleanupHelper = {
  removeUnusedTracks(): number[] {
    const tracks = TrackModel.findUnusedTracks();
    if (!tracks?.length) return [0, 0];

    const allTrackIds = tracks.map(t => t.id);
    if (!allTrackIds.length) return [0, 0];

    const taggedTracks = TrackTagModel.getTrackIdsWithTags(allTrackIds);
    const taggedTrackIds = new Set(taggedTracks.map(t => t.track_id));

    const toUpdate = tracks.filter(t => taggedTrackIds.has(t.id));
    const toDelete = tracks.filter(t => !taggedTrackIds.has(t.id));

    if (toUpdate.length > 0) {
      const idsToUpdate = toUpdate.map(t => t.id);
      TrackModel.markAsEdited(idsToUpdate);
    }

    let deletedRelations = 0;
    let deletedTracks = 0;

    if (toDelete.length > 0) {
      const idsToDelete = toDelete.map(t => t.id);
      deletedRelations = cleanupHelper.deleteRelationsByTrackIds(idsToDelete);
      deletedTracks = deleteInBatches(idsToDelete, TrackModel);
    }

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

