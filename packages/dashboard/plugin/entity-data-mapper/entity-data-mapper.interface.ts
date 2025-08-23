import { VendureEntity } from '@vendure/core';

import { SearchIndexItem } from '../types';

export interface EntityDataMapper {
    map(entity: VendureEntity): Promise<SearchIndexItem> | SearchIndexItem;
}
