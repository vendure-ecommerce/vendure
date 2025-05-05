import { GlobalIndexingStrategy } from './indexing-strategy/global-indexing-strategy';
import { GlobalSearchStrategy } from './search-strategy/global-search-strategy';

/**
 * Configuration options for the DashboardPlugin
 */
export interface DashboardPluginOptions {
    searchStrategy: GlobalSearchStrategy;
    indexingStrategy: GlobalIndexingStrategy;
}
