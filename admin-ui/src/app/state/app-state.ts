import { NormalizedCacheObject } from 'apollo-cache-inmemory/src/types';

import { UserState } from './user/user-state';

export interface AppState {
    entities: NormalizedCacheObject;
    user: UserState;
}
