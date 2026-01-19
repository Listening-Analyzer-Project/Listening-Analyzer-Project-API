export type UserIdStrategy = 'user_from_query' | 'user_from_body' | 'listen_from_query';

export enum isEditedState {
    NOT_EDITED = 0,
    TAG_EDITED = 1,
    SPOTIFY_EDITED = 2,
    ALL_EDITED = 3,
}

export enum basicJobPhase {
    NOT_STARTED = 0,
    IN_PROGRESS = 1,
    COMPLETED = 2,
    FAILED = 3,
}

export enum syncroStatus {
    CREATED = 0,
    COMPUTING = 1,
    IMPORTED = 2,
    REASONED_SYNCED = 3,
    LISTEN_SYNCED = 4,
    OTHER_API_SYNCED = 5,
    FULL_SYNCED = 6, // Spotify
}

export enum JobType {
    IMPORT = 0,
}

export enum ReasonType {
    SKIP = 0,
    REPEAT = 1,

}
