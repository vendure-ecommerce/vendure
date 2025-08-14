import { SearchIndexItem } from '../types';

import { SearchIndexingStrategy } from './search-indexing.strategy';

export class DbIndexingStrategy implements SearchIndexingStrategy {
    persist(items: SearchIndexItem[]): Promise<void> {
        return Promise.resolve(undefined);
    }

    remove(id: string): Promise<void> {
        return Promise.resolve(undefined);
    }
}
