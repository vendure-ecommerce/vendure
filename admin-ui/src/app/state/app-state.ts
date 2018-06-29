import { NormalizedCacheObject } from 'apollo-cache-inmemory/src/types';

import { ApiState } from './api/api-state';
import { UserState } from './user/user-state';

export interface AppState {
    api: ApiState;
    entities: NormalizedCacheObject;
    user: UserState;
}
