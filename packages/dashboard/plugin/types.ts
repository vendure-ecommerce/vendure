import { ID } from '@vendure/common/lib/shared-types';
import { CustomFields } from '@vendure/core';

import { EntityDataMapper } from './entity-data-mapper/entity-data-mapper.interface';
import { SearchIndexingStrategy } from './search-index/search-indexing.strategy';

/**
 * @description
 * Configuration options for the {@link DashboardPlugin}.
 *
 * @docsCategory core plugins/DashboardPlugin
 */
export interface DashboardPluginOptions {
    /**
     * @description
     * The route to the Dashboard UI.
     *
     * @default 'dashboard'
     */
    route: string;
    /**
     * @description
     * The path to the dashboard UI app dist directory. By default, the built-in dashboard UI
     * will be served. This can be overridden with a custom build of the dashboard.
     */
    appDir: string;

    /**
     * @description
     * Configuration of the global search feature in the dashboard UI
     */
    globalSearch?: {
        indexingStrategy?: SearchIndexingStrategy;
        entityDataMappers?: Record<keyof CustomFields | string, EntityDataMapper>;
    };
}

export type MetricSummary = {
    interval: MetricInterval;
    type: MetricType;
    title: string;
    entries: MetricSummaryEntry[];
};

export enum MetricType {
    OrderCount = 'OrderCount',
    OrderTotal = 'OrderTotal',
    AverageOrderValue = 'AverageOrderValue',
}

export enum MetricInterval {
    Daily = 'Daily',
}

export type MetricSummaryEntry = {
    label: string;
    value: number;
};

export interface MetricSummaryInput {
    interval: MetricInterval;
    types: MetricType[];
    refresh?: boolean;
}

export interface SearchIndexItem {
    id?: string;
    title: string;
    type: 'entity' | 'plugin' | 'docs' | 'article';
    subtitle?: string;
    description?: string;
    thumbnailUrl?: string;
    metadata?: Record<string, any>;
    lastModified?: Date | string;
}

/**
 * @description The index items for custom and built-in Vendure entities
 */
export interface EntitySearchIndexItem extends SearchIndexItem {
    entityId: ID;
    entityName: string;
}

/**
 * @description The index items for external urls like blog articles, docs or plugins.
 */
export interface ExternalUrlSearchIndexItem extends SearchIndexItem {
    externalId: string;
    url: string;
}
