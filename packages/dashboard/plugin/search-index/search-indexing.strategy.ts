import { SearchIndexItem } from '../types';

export interface SearchIndexingStrategy {
    /**
     * Persists the given items to the search index
     * @param items
     */
    persist(items: SearchIndexItem[]): Promise<void>;

    /**
     * Removes the given item ID from the search index
     * @param id
     */
    remove(id: string): Promise<void>;
}
