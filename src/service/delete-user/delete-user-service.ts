import { runTransaction } from '@/utils';
import ListenModel from '@/models/core/listen-model';
import PlaylistModel from '@/models/core/playlist-model';
import UserModel from '@/models/core/user-model';
import EventModel from '@/models/core/event-model';
import { cleanupHelper } from './helper/cleanup-helper';
import { deleteInBatches } from './helper/batch-helper';

export const deleteUserService = {
  /**
   * Supprime toutes les données liées à un utilisateur.
   * @param userId id de l’utilisateur
   * @param deleteUser si vrai, supprime aussi l’utilisateur
   */
  async deleteUserData(userId: number, deleteUser: boolean) {

    let deletedListens = 0;
    let deletedEvents = 0;
    let deletedTracks = 0;
    let deletedAlbums = 0;
    let deletedArtists = 0;
    let deletedPlaylists = 0;
    let deletedPlaylistRelations = 0;
    let deletedTrackRelations = 0;
    let deletedUser = 0;

    await runTransaction(() => {
      const userListens = ListenModel.getAllbyUserId(userId);
      const listenIds = userListens.map(l => l.id)
        .filter(id => id !== undefined) as number[];

      if (listenIds.length > 0) {
        deletedListens = deleteInBatches(listenIds, ListenModel);
      }

      const userEvents = EventModel.getAllbyUserId(userId);
      const eventIds = userEvents.map(e => e.id).filter(id => id !== undefined) as number[];

      if (eventIds.length > 0) {
        deletedEvents = deleteInBatches(eventIds, EventModel);
      }

      const userPlaylists = PlaylistModel.getAllbyUserId(userId);
      const playlistIds = userPlaylists.map(p => p.id)
        .filter(id => id !== undefined) as number[];


      if (playlistIds.length > 0) {
        deletedPlaylists = deleteInBatches(playlistIds, PlaylistModel);
      }

      if (playlistIds.length > 0) {
        const changes = cleanupHelper.deleteRelationsByPlaylistIds(playlistIds);
        deletedPlaylistRelations = changes;
        deletedPlaylists = deleteInBatches(playlistIds, PlaylistModel);
      }

      [deletedTrackRelations, deletedTracks] = cleanupHelper.removeUnusedTracks();
      deletedAlbums = cleanupHelper.removeOrphanAlbums();
      deletedArtists = cleanupHelper.removeOrphanArtists();

      if (deleteUser) {
        const { changes } = UserModel.delete(userId);
        deletedUser = changes ?? 0;
      }
    });

    return {
      success: true,
      userId,
      deleteUser,
      deletedListens,
      deletedEvents,
      deletedTracks,
      deletedAlbums,
      deletedArtists,
      deletedPlaylists,
      deletedTrackRelations,
      deletedUser,
    };
  },
};
