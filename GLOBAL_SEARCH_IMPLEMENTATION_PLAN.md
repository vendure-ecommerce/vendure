# Global Search Implementation Plan

## Overview

This document outlines the comprehensive implementation plan for adding a global search feature to the Vendure dashboard under `packages/dashboard`, similar to modern command palette interfaces.

## Architecture Overview

The search feature will be built as:

- **Backend**: GraphQL API extension in the Dashboard Plugin
- **Frontend**: React component integrated into the AppLayout header
- **Search UI**: Command palette using existing `cmdk` components from our shadcn components
- **Indexing**: Scheduled indexing system with pluggable search backends (Database, TypeSense, etc.)

## Searchable Content Categories

### Core Built-in Entities

All Vendure built-in entities should be searchable:

**Catalog Entities:**

- **Products** - Name, SKU, description, variant names, translations
- **Product Variants** - Name, SKU, price, stock status
- **Collections** - Name, description, slug, translations
- **Assets** - Filename, name, alt text, type
- **Facets & Facet Values** - Name, code, translations
- **Tags** - Value

**Customer Management:**

- **Customers** - First name, last name, email, phone number
- **Customer Groups** - Name, code
- **Addresses** - Full address, company, contact info

**Order Management:**

- **Orders** - Code, customer info, state, total, items
- **Order Lines** - Product names, SKUs, quantities
- **Payments** - Method, amount, state, transaction ID
- **Fulfillments** - Method, tracking code, state
- **Refunds** - Reason, amount, state

**Configuration:**

- **Channels** - Name, code, description, hostname
- **Countries** - Name, code, enabled status
- **Provinces** - Name, code, country
- **Zones** - Name, members
- **Tax Categories** - Name, is default
- **Tax Rates** - Name, value, zone, category
- **Shipping Methods** - Name, code, description, translations
- **Payment Methods** - Name, code, description, translations

**System & Access:**

- **Administrators** - First name, last name, email, role
- **Roles** - Code, description, permissions
- **Users** - Identifier, verified status
- **Sessions** - Active user sessions
- **Stock Locations** - Name, description

**Marketing:**

- **Promotions** - Name, coupon code, description, translations

### Custom Entities

Dynamic discovery and indexing of custom entities:

- **Plugin-defined Entities** - Auto-discover entities from installed plugins
- **Custom Fields** - Index custom field values across all entity types
- **Entity Extensions** - Search extended entity properties

### Data Mapping for Entities

For each built-in database entity there must be a data mapper in place.
For custom entities there is the need to provide these entity mappers. Developers must also be able to extend the data mapping for built-in entities, which means that the built-in data mapper gets extended by a provided data mappers.
The task of a data mapper is to map the entity to the search index item.

### Dashboard Content

- **Navigation Items** - Menu labels, routes, permissions
- **Settings Pages** - Global settings, channel settings, tax settings, etc.
- **Recent Activity** - Recently viewed entities, user activity
- **Quick Actions** - Global and context-aware actions (see detailed section below)

### Settings Pages Coverage

There are settings and systems pages that are not based on list-views, like the job queue or scheduled tasks. These pages are searchable through a quick action that is registered.

### Quick Actions System

A comprehensive quick actions system that includes both global and context-aware actions:

#### Global Quick Actions

Always available actions regardless of current page:

- **Create Actions** - "Create new product", "Create new customer", "Create new order"
- **Navigation Actions** - "Go to products", "Go to orders", "Go to customers"
- **Account Actions** - "Go to profile", "Change password", "Logout"
- **Search Actions** - "Search products", "Search customers", "Search orders"
- **System Actions** - "View job queue", "Check system health", "View logs"

#### Context-Aware Quick Actions

Actions that appear only on specific pages/contexts:

- **Product Detail Page** - "Save product", "Duplicate product", "Delete product", "Add variant"
- **Order Detail Page** - "Fulfill order", "Add payment", "Cancel order", "Print invoice"
- **Customer Detail Page** - "Send email", "Add address", "View orders", "Add to group"
- **Collection Page** - "Save collection", "Add products", "Move collection"
- **Any List Page** - "Export data", "Bulk edit", "Filter results", "Sort by..."

#### Custom Actions via `defineDashboardExtensions`

Developers can register custom actions:

- **Global Custom Actions** - Available everywhere
- **Context-Aware Custom Actions** - Page/route specific
- **Entity-Specific Actions** - Based on current entity being viewed
- **Keyboard Shortcuts** - Custom hotkeys for actions

### External Content Sources

- **Documentation** - Help content, API reference, tutorials (from existing search index that powers docs.vendure.io)
- **Blog Posts** - Articles, guides, announcements from website (Datasource: Storyblok CMS)
- **Plugins** - Community and official plugins from website (Datasource: Vendure app that powers our website)

## Backend Implementation

### Search Index Architecture

The search system uses a dedicated index that aggregates data from all internal and external sources:

#### Index Structure

```typescript
interface SearchIndexEntry {
    id: string;
    type: SearchResultType;
    title: string;
    subtitle?: string;
    description?: string;
    content: string; // Full searchable text content
    url: string;
    thumbnailUrl?: string;
    metadata: Record<string, any>;
    permissions?: string[]; // Required permissions to view
    channelIds: string[]; // Channel access
    entityId?: string; // Original entity ID (for internal entities)
    entityName?: string; // Original entity name
    lastUpdated: Date;
    searchVector?: string; // For advanced search backends
}
```

#### Indexing Sources

- **Internal Entities** - All Vendure entities (products, orders, customers, etc.)
- **Custom Entities** - Plugin-defined entities
- **Settings & Configuration** - Dashboard settings, system config
- **External Content** - Documentation, blog posts, plugins

### Search Backend Strategies

#### Default Database Strategy

```typescript
// Default implementation using the selected database (PostgreSQL, MySQL, etc.)
@Injectable()
export class DatabaseSearchStrategy implements SearchStrategy {
    async indexContent(entries: SearchIndexEntry[]): Promise<void> {
        // Upsert entries into search_index table
        // Use database full-text search capabilities
    }

    async search(query: string, options: SearchOptions): Promise<SearchResult[]> {
        // Use database full-text search with ranking
        // PostgreSQL: ts_rank, ts_headline
        // MySQL: MATCH() AGAINST()
    }
}
```

#### TypeSense Strategy

```typescript
// Alternative implementation for TypeSense
@Injectable()
export class TypeSenseSearchStrategy implements SearchStrategy {
    async indexContent(entries: SearchIndexEntry[]): Promise<void> {
        // Index into TypeSense collection
        // Leverage TypeSense's typo tolerance and faceting
    }

    async search(query: string, options: SearchOptions): Promise<SearchResult[]> {
        // Use TypeSense search with advanced features
        // Typo tolerance, faceting, geo-search, etc.
    }
}
```

### GraphQL Schema Extensions

This only extend the Admin API of Vendure.

```typescript
// packages/dashboard/plugin/api/search-extensions.ts
type GlobalSearchResult {
  id: String!
  type: SearchResultType!
  title: String!
  subtitle: String
  description: String
  url: String!
  thumbnailUrl: String
  metadata: JSON
  relevanceScore: Float!
  lastModified: DateTime
}

enum SearchResultType {
  # Core Entities
  PRODUCT
  PRODUCT_VARIANT
  CUSTOMER
  ORDER
  COLLECTION
  ADMINISTRATOR
  CHANNEL
  ASSET
  FACET
  FACET_VALUE
  PROMOTION
  PAYMENT_METHOD
  SHIPPING_METHOD
  TAX_CATEGORY
  TAX_RATE
  COUNTRY
  ZONE
  ROLE
  CUSTOMER_GROUP
  STOCK_LOCATION
  TAG

  # Custom/Plugin Entities
  CUSTOM_ENTITY

  # Dashboard Content
  NAVIGATION
  SETTINGS
  QUICK_ACTION

  # External Content
  DOCUMENTATION
  BLOG_POST
  PLUGIN
  WEBSITE_CONTENT
}

input GlobalSearchInput {
  query: String!
  types: [SearchResultType!]
  limit: Int = 20
  skip: Int = 0
  channelId: String
}

extend type Query {
  globalSearch(input: GlobalSearchInput!): [GlobalSearchResult!]!
}
```

### Search Service Implementation

```typescript
// packages/dashboard/plugin/service/global-search.service.ts
@Injectable()
export class GlobalSearchService {
    constructor(private searchStrategy: SearchStrategy) {}

    async search(input: GlobalSearchInput): Promise<GlobalSearchResult[]> {
        // Use the configured search strategy to search the index
        const results = await this.searchStrategy.search(input.query, {
            types: input.types,
            limit: input.limit,
            offset: input.skip,
            channelId: input.channelId,
        });

        return results;
    }
}
```

### Search Strategy Interface

```typescript
// packages/dashboard/plugin/service/search-strategy.interface.ts
export interface SearchStrategy {
    // Index content into the search backend
    indexContent(entries: SearchIndexEntry[]): Promise<void>;

    // Remove content from index
    removeFromIndex(ids: string[]): Promise<void>;

    // Search the index
    search(query: string, options: SearchOptions): Promise<SearchResult[]>;

    // Health check for the search backend
    healthCheck(): Promise<boolean>;

    // Get search statistics
    getStats(): Promise<SearchStats>;
}

interface SearchOptions {
    types?: SearchResultType[];
    limit?: number;
    offset?: number;
    channelId?: string;
    permissions?: string[];
}

interface SearchResult {
    id: string;
    type: SearchResultType;
    title: string;
    subtitle?: string;
    description?: string;
    url: string;
    thumbnailUrl?: string;
    metadata: Record<string, any>;
    relevanceScore: number;
    highlights?: SearchHighlight[];
}

interface SearchHighlight {
    field: string;
    snippet: string;
}

interface SearchStats {
    totalEntries: number;
    lastIndexed: Date;
    backendType: string;
    indexSizeBytes?: number;
}
```

### Search Indexing Service

```typescript
// packages/dashboard/plugin/service/search-indexing.service.ts
@Injectable()
export class SearchIndexingService {
    constructor(
        private searchStrategy: SearchStrategy,
        private entityDiscoveryService: EntityDiscoveryService,
        private documentationContentService: DocumentationContentService,
        private websiteContentService: WebsiteContentService,
    ) {}

    // Full reindex of all content
    async fullReindex(): Promise<void> {
        Logger.info('Starting full search index rebuild');

        const entries: SearchIndexEntry[] = [];

        // Index internal entities
        entries.push(...(await this.indexInternalEntities()));

        // Index custom entities
        entries.push(...(await this.indexCustomEntities()));

        // Index external content
        entries.push(...(await this.indexExternalContent()));

        // Update the search index
        await this.searchStrategy.indexContent(entries);

        Logger.info(`Search index rebuilt with ${entries.length} entries`);
    }

    // Incremental update for specific entities
    async updateEntity(entityType: string, entityId: string): Promise<void> {
        const entry = await this.createIndexEntryForEntity(entityType, entityId);
        if (entry) {
            await this.searchStrategy.indexContent([entry]);
        }
    }

    // Remove entity from index
    async removeEntity(entityType: string, entityId: string): Promise<void> {
        const indexId = `${entityType}:${entityId}`;
        await this.searchStrategy.removeFromIndex([indexId]);
    }

    private async indexInternalEntities(): Promise<SearchIndexEntry[]> {
        const entries: SearchIndexEntry[] = [];

        // Index all core Vendure entities
        const entityTypes = [
            'Product',
            'ProductVariant',
            'Customer',
            'Order',
            'Collection',
            'Asset',
            'Facet',
            'FacetValue',
            'Administrator',
            'Role',
            'Channel',
            'Country',
            'Zone',
            'TaxCategory',
            'TaxRate',
            'PaymentMethod',
            'ShippingMethod',
            'Promotion',
            'StockLocation',
        ];

        for (const entityType of entityTypes) {
            entries.push(...(await this.indexEntityType(entityType)));
        }

        return entries;
    }

    private async indexEntityType(entityType: string): Promise<SearchIndexEntry[]> {
        // Implementation specific to each entity type
        // Extract searchable text, permissions, channels, etc.
    }

    private async indexExternalContent(): Promise<SearchIndexEntry[]> {
        const entries: SearchIndexEntry[] = [];

        try {
            // Index documentation content
            const docEntries = await this.documentationContentService.fetchDocumentationContent();
            entries.push(...docEntries);

            // Index blog posts from Storyblok
            const blogEntries = await this.websiteContentService.fetchBlogPosts();
            entries.push(...blogEntries);

            // Index plugins
            const pluginEntries = await this.websiteContentService.fetchPlugins();
            entries.push(...pluginEntries);

            Logger.info(`Indexed ${entries.length} external content items`);
        } catch (error) {
            Logger.error('Failed to index external content', error);
        }

        return entries;
    }

    // Method to refresh only external content (can be called separately)
    async refreshExternalContent(): Promise<void> {
        Logger.info('Refreshing external content index');

        // Remove existing external content from index
        await this.searchStrategy.removeFromIndex(['docs:*', 'blog:*', 'plugin:*']);

        // Re-index external content
        const externalEntries = await this.indexExternalContent();
        await this.searchStrategy.indexContent(externalEntries);

        Logger.info('External content refresh completed');
    }
}
```

### Scheduled Indexing with ScheduledTask and JobQueue

Using Vendure's built-in scheduling features:

```typescript
// packages/dashboard/plugin/tasks/search-index-task.ts
import { ScheduledTask, TaskContext } from '@vendure/core';

export const searchFullReindexTask = new ScheduledTask({
    name: 'search-full-reindex',
    cron: cron => cron.daily().atHour(2), // Daily at 2 AM
    run: async (ctx: TaskContext) => {
        const searchIndexingService = ctx.injector.get(SearchIndexingService);

        try {
            await searchIndexingService.fullReindex();
            ctx.logger.info('Search full reindex completed successfully');
        } catch (error) {
            ctx.logger.error('Search full reindex failed', error);
            throw error;
        }
    },
});

export const searchIncrementalUpdateTask = new ScheduledTask({
    name: 'search-incremental-update',
    cron: cron => cron.everyMinutes(15), // Every 15 minutes
    run: async (ctx: TaskContext) => {
        const searchIndexingService = ctx.injector.get(SearchIndexingService);

        try {
            await searchIndexingService.incrementalUpdate();
            ctx.logger.info('Search incremental update completed');
        } catch (error) {
            ctx.logger.error('Search incremental update failed', error);
            throw error;
        }
    },
});

export const searchExternalContentRefreshTask = new ScheduledTask({
    name: 'search-external-content-refresh',
    cron: cron => cron.everyHours(12), // Every 12 hours
    run: async (ctx: TaskContext) => {
        const searchIndexingService = ctx.injector.get(SearchIndexingService);

        try {
            await searchIndexingService.refreshExternalContent();
            ctx.logger.info('External content refresh completed');
        } catch (error) {
            ctx.logger.error('External content refresh failed', error);
            throw error;
        }
    },
});
```

### Job Queue Integration

For intensive indexing operations that should run in the background:

```typescript
// packages/dashboard/plugin/service/search-job.service.ts
import { Job, JobQueue, JobQueueService } from '@vendure/core';

interface ReindexJobData {
    entityTypes?: string[];
    forceFullReindex?: boolean;
}

@Injectable()
export class SearchJobService {
    private jobQueue: JobQueue<ReindexJobData>;

    constructor(
        private jobQueueService: JobQueueService,
        private indexingService: SearchIndexingService,
    ) {
        this.jobQueue = this.jobQueueService.createQueue({
            name: 'search-indexing',
            process: this.processSearchJob.bind(this),
        });
    }

    async queueFullReindex(): Promise<Job<ReindexJobData>> {
        return this.jobQueue.add('full-reindex', {
            forceFullReindex: true,
        });
    }

    async queueEntityReindex(entityTypes: string[]): Promise<Job<ReindexJobData>> {
        return this.jobQueue.add('entity-reindex', {
            entityTypes,
        });
    }

    private async processSearchJob(job: Job<ReindexJobData>) {
        const { entityTypes, forceFullReindex } = job.data;

        job.setProgress(0);

        try {
            if (forceFullReindex) {
                await this.indexingService.fullReindex();
            } else if (entityTypes) {
                await this.indexingService.reindexEntityTypes(entityTypes);
            } else {
                await this.indexingService.incrementalUpdate();
            }

            job.setProgress(100);
        } catch (error) {
            Logger.error('Search indexing job failed', error);
            throw error;
        }
    }
}
```

### Entity Discovery Service

````typescript
// packages/dashboard/plugin/service/entity-discovery.service.ts
@Injectable()
export class EntityDiscoveryService {
  async discoverAllEntities(): Promise<EntityMetadata[]> {
    // Auto-discover all TypeORM entities (built-in + custom)
    // Extract searchable fields from entity metadata
    // Handle custom fields dynamically
    // Generate search configurations per entity
  }

  async getCustomEntityTypes(): Promise<string[]> {
    // Identify plugin-defined entities
    // Return entity names not in core Vendure entities list
  }
}
```

### Search Configuration

```typescript
// packages/dashboard/plugin/config/search-config.ts
export interface SearchConfig {
    // Search backend strategy
    strategy: 'database' | 'typesense' | 'custom';

    // Strategy-specific options
    strategyOptions?: {
        database?: DatabaseSearchOptions;
        typesense?: TypeSenseSearchOptions;
        custom?: any;
    };

    // Indexing configuration
    indexing: {
        fullReindexCron: string; // Default: '0 2 * * *'
        incrementalUpdateCron: string; // Default: '*/15 * * * *'
        batchSize: number; // Default: 1000
        maxConcurrency: number; // Default: 5
    };

    // External content sources
    externalSources: {
        documentation: {
            enabled: boolean;
            endpoint: string;
            refreshIntervalHours: number; // Default: 24
        };
        website: {
            enabled: boolean;
            endpoint: string;
            refreshIntervalHours: number; // Default: 12
        };
    };
}

interface DatabaseSearchOptions {
    // Full-text search configuration for different databases
    postgresql?: {
        searchConfig: string; // Default: 'english'
        enableHighlighting: boolean;
    };
    mysql?: {
        minWordLength: number;
        enableBooleanMode: boolean;
    };
}

interface TypeSenseSearchOptions {
    nodes: Array<{
        host: string;
        port: number;
        protocol: 'http' | 'https';
    }>;
    apiKey: string;
    connectionTimeoutSeconds?: number;
    collectionName?: string; // Default: 'vendure_search'
}
```

### Real-time Index Updates

```typescript
// packages/dashboard/plugin/service/search-event-handler.service.ts
@Injectable()
export class SearchEventHandlerService implements OnApplicationBootstrap {
    constructor(
        private eventBus: EventBus,
        private indexingService: SearchIndexingService,
    ) {}

    onApplicationBootstrap() {
        // Listen for entity events to keep index up-to-date
        this.eventBus.ofType(VendureEntityEvent).subscribe(event => {
            this.handleEntityEvent(event);
        });
    }

    private async handleEntityEvent(event: VendureEntityEvent<any>) {
        const { entity, type, ctx } = event;

        try {
            switch (type) {
                case 'created':
                case 'updated':
                    await this.indexingService.updateEntity(
                        entity.constructor.name,
                        entity.id
                    );
                    break;

                case 'deleted':
                    await this.indexingService.removeEntity(
                        entity.constructor.name,
                        event.entity.id
                    );
                    break;
            }
        } catch (error) {
            Logger.error(`Failed to update search index for ${entity.constructor.name}:${entity.id}`, error);
        }
    }
}
```

### External Content Integration

External content is fetched from APIs and indexed locally, so search requests don't hit external services:

#### Documentation Content Service

```typescript
// packages/dashboard/plugin/service/documentation-content.service.ts
@Injectable()
export class DocumentationContentService {
    private readonly DOCS_API_ENDPOINT = 'https://docs.vendure.io/api/content';

    async fetchDocumentationContent(): Promise<SearchIndexEntry[]> {
        try {
            // Fetch all documentation pages from API
            const response = await fetch(this.DOCS_API_ENDPOINT);
            const docs = await response.json();

            return docs.map(doc => ({
                id: `docs:${doc.slug}`,
                type: 'DOCUMENTATION',
                title: doc.title,
                subtitle: doc.category,
                description: doc.excerpt,
                content: doc.content, // Full searchable text
                url: `https://docs.vendure.io/${doc.slug}`,
                thumbnailUrl: doc.imageUrl,
                metadata: {
                    category: doc.category,
                    tags: doc.tags,
                    lastModified: doc.updatedAt,
                },
                permissions: [], // Public content
                channelIds: [], // Available to all channels
                lastUpdated: new Date(),
            }));
        } catch (error) {
            Logger.error('Failed to fetch documentation content', error);
            return [];
        }
    }
}
```

#### Website Content Service

```typescript
// packages/dashboard/plugin/service/website-content.service.ts
@Injectable()
export class WebsiteContentService {
    private readonly STORYBLOK_API_ENDPOINT = 'https://api.storyblok.com/v2/cdn/stories';
    private readonly STORYBLOK_TOKEN = process.env.STORYBLOK_TOKEN;
    private readonly VENDURE_PLUGINS_API = 'https://vendure.io/api/plugins';

    async fetchBlogPosts(): Promise<SearchIndexEntry[]> {
        try {
            // Fetch blog posts from Storyblok CMS
            const response = await fetch(
                `${this.STORYBLOK_API_ENDPOINT}?starts_with=blog&token=${this.STORYBLOK_TOKEN}`
            );
            const { stories } = await response.json();

            return stories.map(story => ({
                id: `blog:${story.slug}`,
                type: 'BLOG_POST',
                title: story.content.title,
                subtitle: `By ${story.content.author}`,
                description: story.content.excerpt,
                content: story.content.body, // Full blog content for search
                url: `https://vendure.io/blog/${story.slug}`,
                thumbnailUrl: story.content.featuredImage?.filename,
                metadata: {
                    author: story.content.author,
                    publishedAt: story.published_at,
                    tags: story.tag_list,
                    readingTime: story.content.readingTime,
                },
                permissions: [], // Public content
                channelIds: [], // Available to all channels
                lastUpdated: new Date(story.published_at),
            }));
        } catch (error) {
            Logger.error('Failed to fetch blog posts from Storyblok', error);
            return [];
        }
    }

    async fetchPlugins(): Promise<SearchIndexEntry[]> {
        try {
            // Fetch plugins from Vendure website API
            const response = await fetch(this.VENDURE_PLUGINS_API);
            const plugins = await response.json();

            return plugins.map(plugin => ({
                id: `plugin:${plugin.id}`,
                type: 'PLUGIN',
                title: plugin.name,
                subtitle: `v${plugin.version} by ${plugin.author}`,
                description: plugin.description,
                content: `${plugin.name} ${plugin.description} ${plugin.readme}`,
                url: `https://vendure.io/plugins/${plugin.slug}`,
                thumbnailUrl: plugin.logoUrl,
                metadata: {
                    author: plugin.author,
                    version: plugin.version,
                    downloads: plugin.downloads,
                    stars: plugin.stars,
                    category: plugin.category,
                    compatibility: plugin.vendureVersion,
                },
                permissions: [], // Public content
                channelIds: [], // Available to all channels
                lastUpdated: new Date(plugin.updatedAt),
            }));
        } catch (error) {
            Logger.error('Failed to fetch plugins', error);
            return [];
        }
    }
}

## Frontend Implementation

### Integration with App Layout

Based on the current dashboard structure, the command palette should be integrated into the main app layout to be available globally. Here's how to modify the existing `app-layout.tsx`:

```typescript
// packages/dashboard/src/lib/components/layout/app-layout.tsx
import { CommandPalette } from '@/vdb/components/search/command-palette.js';
import { SearchProvider } from '@/vdb/providers/search-provider.js';
import { useKeyboardShortcuts } from '@/vdb/hooks/use-keyboard-shortcuts.js';

export function AppLayout() {
    const { settings } = useUserSettings();
    const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useKeyboardShortcuts();
    
    return (
        <SearchProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="container mx-auto">
                        <header className="border-b border-border flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                            <div className="flex items-center justify-between gap-2 px-4 w-full">
                                <div className="flex items-center justify-start gap-2">
                                    <SidebarTrigger className="-ml-1" />
                                    <Separator orientation="vertical" className="mr-2 h-4" />
                                    <GeneratedBreadcrumbs />
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    {settings.devMode && <DevModeIndicator />}
                                    <Alerts />
                                </div>
                            </div>
                        </header>
                        <Outlet />
                    </div>
                </SidebarInset>
                <PrereleasePopup />
                
                {/* Global Command Palette */}
                <CommandPalette 
                    isOpen={isCommandPaletteOpen}
                    onOpenChange={setIsCommandPaletteOpen}
                />
            </SidebarProvider>
        </SearchProvider>
    );
}
```

### Search Component Structure

```

src/lib/components/global-search/
├── global-search-trigger.tsx // Search button/shortcut in header
├── global-search-dialog.tsx // Main search interface
├── search-results-list.tsx // Results container
├── search-result-item.tsx // Individual result component
├── search-filters.tsx // Type/category filters
├── search-history.tsx // Recent searches
├── quick-actions-list.tsx // Quick actions display (Frontend only)
├── quick-action-item.tsx // Individual quick action
└── hooks/
├── use-global-search.ts // Search API integration
├── use-search-history.ts // Local search history
├── use-search-shortcuts.ts // Keyboard shortcuts
└── use-quick-actions.ts // Quick actions management (Frontend only)

````

### Quick Actions (Frontend Only)

Quick actions are managed entirely in the React application and do not go through the GraphQL API:

```typescript
// src/lib/components/global-search/hooks/use-quick-actions.ts
export interface QuickAction {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    shortcut?: string;
    isContextAware: boolean;
    requiredPermissions?: string[];
    handler: QuickActionHandler;
    params?: Record<string, any>;
}

export type QuickActionHandler = (context: QuickActionContext) => void | Promise<void>;

export interface QuickActionContext {
    // Current page context
    currentRoute: string;
    currentEntityType?: string;
    currentEntityId?: string;

    // Available utilities
    navigate: (path: string) => void;
    showNotification: (message: string, type?: 'success' | 'error' | 'warning') => void;
    confirm: (message: string) => Promise<boolean>;

    // Data access (if needed)
    executeApiOperation: (query: string, variables?: any) => Promise<any>;
}

export const useQuickActions = () => {
    const [globalActions, setGlobalActions] = useState<QuickAction[]>([]);
    const [contextActions, setContextActions] = useState<QuickAction[]>([]);
    const location = useLocation();
    const navigate = useNavigate();

    // Built-in global actions
    const builtInGlobalActions: QuickAction[] = [
        {
            id: 'create-product',
            label: 'Create New Product',
            icon: 'plus',
            shortcut: 'ctrl+shift+p',
            isContextAware: false,
            handler: context => context.navigate('/products/new'),
        },
        {
            id: 'create-customer',
            label: 'Create New Customer',
            icon: 'user-plus',
            shortcut: 'ctrl+shift+c',
            isContextAware: false,
            handler: context => context.navigate('/customers/new'),
        },
        // ... more global actions
    ];

    // Built-in context-aware actions
    const getContextActions = (route: string, entityType?: string) => {
        const actions: QuickAction[] = [];

        if (route.includes('/products/') && entityType === 'product') {
            actions.push({
                id: 'save-product',
                label: 'Save Product',
                icon: 'save',
                shortcut: 'ctrl+s',
                isContextAware: true,
                handler: async context => {
                    // Trigger save action for current product
                    // This would integrate with the product form
                },
            });
        }

        return actions;
    };

    // Register custom actions (from defineDashboardExtensions)
    const registerAction = useCallback((action: QuickAction) => {
        if (action.isContextAware) {
            setContextActions(prev => [...prev, action]);
        } else {
            setGlobalActions(prev => [...prev, action]);
        }
    }, []);

    // Get all available actions for current context
    const getAvailableActions = useMemo(() => {
        const currentContextActions = getContextActions(
            location.pathname,
            // Extract entity type from route
            location.pathname.split('/')[1]
        );

        return [
            ...builtInGlobalActions,
            ...globalActions,
            ...currentContextActions,
            ...contextActions,
        ];
    }, [location.pathname, globalActions, contextActions]);

    return {
        actions: getAvailableActions,
        registerAction,
    };
};
```

### Search Hooks and Context

```typescript
// packages/dashboard/src/lib/providers/search-provider.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
    isCommandPaletteOpen: boolean;
    setIsCommandPaletteOpen: (open: boolean) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: SearchResult[];
    setSearchResults: (results: SearchResult[]) => void;
    isSearching: boolean;
    setIsSearching: (searching: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    return (
        <SearchContext.Provider 
            value={{
                isCommandPaletteOpen,
                setIsCommandPaletteOpen,
                searchQuery,
                setSearchQuery,
                searchResults,
                setSearchResults,
                isSearching,
                setIsSearching,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearchContext must be used within SearchProvider');
    }
    return context;
};
```

```typescript
// packages/dashboard/src/lib/hooks/use-global-search.ts
import { useQuery } from '@apollo/client';
import { useDebounce } from '@/vdb/hooks/use-debounce.js';
import { useSearchContext } from '@/vdb/providers/search-provider.js';
import { globalSearchDocument } from '@/vdb/graphql/search.js';

export const useGlobalSearch = () => {
    const { searchQuery, setSearchResults, setIsSearching } = useSearchContext();
    const debouncedQuery = useDebounce(searchQuery, 300);

    const { data, loading, error } = useQuery(globalSearchDocument, {
        variables: {
            input: {
                query: debouncedQuery,
                types: [], // All types by default
                limit: 20,
            }
        },
        skip: !debouncedQuery || debouncedQuery.length < 2,
        onCompleted: (data) => {
            setSearchResults(data.globalSearch.items);
            setIsSearching(false);
        },
        onError: () => {
            setSearchResults([]);
            setIsSearching(false);
        }
    });

    // Update loading state
    React.useEffect(() => {
        setIsSearching(loading);
    }, [loading, setIsSearching]);

    return {
        results: data?.globalSearch.items || [],
        loading,
        error,
        totalCount: data?.globalSearch.totalItems || 0,
    };
};
```
    };

    // Register custom actions from extensions
    const registerCustomAction = (action: QuickAction) => {
        if (action.isContextAware) {
            setContextActions(prev => [...prev, action]);
        } else {
            setGlobalActions(prev => [...prev, action]);
        }
    };

    return {
        globalActions: [...builtInGlobalActions, ...globalActions],
        contextActions: [...getContextActions(location.pathname), ...contextActions],
        registerCustomAction,
    };
};
```

### Integration Points

- **AppLayout Header**: Search trigger button (🔍 + Cmd/Ctrl+K)
- **Keyboard Shortcuts**: Global hotkey handling + custom action shortcuts
- **Navigation**: Direct routing to search results
- **Context Awareness**: Pre-filter based on current page + show relevant quick actions
- **Extension API**: Integration with `defineDashboardExtensions` for custom actions
- **Page Components**: Context-aware actions registration from individual pages

## User Experience Design

### Search Interface

- **Trigger**: Prominent search icon in header
- **Modal**: Full-screen overlay with cmdk-style interface
- **Input**: Auto-focus with placeholder suggestions
- **Shortcuts**: Cmd/Ctrl+K to open, Esc to close
- **Loading States**: Skeleton loaders, progressive results

### Result Categories

**Quick Actions Section (Always at Top):**

- **Global Actions** - Create entities, navigate, account actions
- **Context Actions** - Save, duplicate, delete (when on detail pages)
- **Custom Actions** - Developer-registered actions via extensions

**Search Results:**

- **Recent Items** - Recently viewed/edited entities
- **Products** - With thumbnails, SKUs, status
- **Customers** - With avatars, contact info
- **Orders** - With status badges, customer names
- **Content** - Collections, promotions, assets
- **System** - Settings, admin tools, reports
- **Help** - Documentation, tutorials
- **Blog** - Articles, guides, announcements
- **Plugins** - Community and official plugins
- **Resources** - Website content, guides

### Result Actions

**Quick Actions:**

- **Execute**: Run the action immediately (with keyboard shortcuts)
- **Parameters**: Some actions may require parameters/confirmation

**Entity Results:**

- **Primary**: Navigate to entity detail page
- **Secondary**: Quick actions (edit, duplicate, archive)
- **Contextual**: Entity-specific actions in dropdown

**External Content:**

- **Primary**: Open in new tab
- **Secondary**: Copy link, bookmark

## Technical Implementation Plan

### Phase 1: Core Infrastructure (Week 1-2)

#### 1. Backend API Setup & Indexing Infrastructure

- Create search GraphQL schema extensions
- Implement search strategy interface and database strategy
- Set up search index table/collection structure
- Implement basic search indexing service
- Create scheduled indexing tasks (full + incremental)
- Add search resolver with permission filtering

#### 2. Frontend Foundation & Quick Actions

- Create search dialog component using existing Command UI
- Implement search hook with GraphQL integration
- Add keyboard shortcut handling (global + custom action shortcuts)
- Create basic result list with entity routing
- Implement quick actions service and components
- Set up context-aware action registration system

### Phase 2: Entity Integration (Week 3-4)

#### 3. Core Entity Indexing & Search Implementation

**Initial Indexing (High Priority):**

- Implement indexing for core entities: Products, Customers, Orders, Collections
- Set up entity event handlers for real-time index updates
- Create entity-specific index entry builders
- Test search functionality with basic relevance scoring

**Extended Entity Indexing:**

- Index remaining built-in entities (Assets, Facets, Administrators, etc.)
- Implement custom field indexing
- Add support for multi-language content
- Optimize search relevance and ranking

#### 4. UI Enhancement & Built-in Quick Actions

- Result categorization and grouping with quick actions at top
- Thumbnail/avatar display for entities
- Status badges and metadata display
- Search result actions (view, edit, duplicate)
- Implement built-in global actions (create, navigate, account)
- Implement built-in context-aware actions (save, duplicate, delete)

### Phase 3: Advanced Features (Week 5-6)

#### 5. Search Optimization & Alternative Backend Support

- Implement TypeSense search strategy
- Add search highlighting and snippets
- Create search filters by entity type and metadata
- Add recent items prioritization and search history
- Performance optimization and query tuning

#### 6. Custom Actions API & Polish

- Implement `defineDashboardExtensions` API integration
- Custom action registration and validation system
- Result caching and pagination improvements
- Search analytics and usage tracking
- Accessibility improvements (ARIA, keyboard nav)
- Mobile responsive design

### Phase 4: Extended Coverage (Week 7-8)

#### 7. Complete Entity Coverage

**Remaining Built-in Entities:**

- Stock Locations, Tags, Global Settings
- History Entries, Sessions, Users
- Order Lines, Payments, Fulfillments, Refunds
- Addresses, Customer Groups

**Settings Pages Integration:**

- Global settings, channel settings, tax configuration
- System health, job queue, scheduled tasks
- Navigation menu items and quick actions

#### 8. Custom Entity & External Content Integration

**Custom Entity Discovery:**

- Auto-discovery of plugin-defined entities
- Dynamic indexing of custom fields
- Entity extension search support

**External Content Integration:**

- Documentation search API integration
- Blog posts and website content (Storyblok CMS)
- Plugin directory integration (Vendure app)
- Content caching and refresh strategies

#### 9. Advanced Search Features

- Search syntax (quotes, operators, filters)
- Saved searches and bookmarks
- Search scoping by channel/context
- Search result preview/quick view

## Performance Considerations

### Indexing Performance

- **Scheduled Indexing**: Full reindex daily, incremental updates every 15 minutes
- **Batch Processing**: Process entities in batches (default 1000) to avoid memory issues
- **Concurrent Processing**: Parallel indexing with configurable concurrency
- **Real-time Updates**: Entity events trigger immediate index updates
- **Index Optimization**: Database-specific optimizations (PostgreSQL ts_vector, MySQL FULLTEXT)

### Search Performance

- **Index-based Search**: All searches query the dedicated search index
- **Search Strategy Abstraction**: Pluggable backends (Database, TypeSense, Elasticsearch)
- **Result Caching**: Cache frequent searches client-side
- **Search Debouncing**: 300ms delay to reduce API calls
- **Pagination**: Efficient offset-based pagination with limits
- **Permission Filtering**: Index stores required permissions for efficient filtering

### Backend-Specific Optimizations

- **Database Strategy**: Leverage native full-text search (ts_rank for PostgreSQL, MATCH AGAINST for MySQL)
- **TypeSense Strategy**: Advanced features like typo tolerance, faceting, geo-search
- **Memory Usage**: Configurable batch sizes and connection pooling
- **External Content Caching**: Cache with TTL, configurable refresh intervals

## Security & Permissions

- **Permission Filtering**: Results filtered by user permissions
- **Channel Scoping**: Respect channel access restrictions
- **Sensitive Data**: Exclude private/internal information
- **Rate Limiting**: Prevent search API abuse

## Testing Strategy

- **Unit Tests**: Search service logic, result formatting
- **Integration Tests**: GraphQL API endpoints, permissions
- **E2E Tests**: Full search workflow, keyboard shortcuts
- **Performance Tests**: Search response times, large datasets

## Success Metrics

- **Usage**: Search queries per user per session
- **Performance**: Average search response time < 300ms
- **Effectiveness**: Click-through rate on search results
- **User Satisfaction**: Search success rate, user feedback

## File Structure Impact

### New Files to Create

```

packages/dashboard/plugin/api/search-extensions.ts
packages/dashboard/plugin/service/global-search.service.ts
packages/dashboard/plugin/service/search-indexing.service.ts
packages/dashboard/plugin/service/search-job.service.ts
packages/dashboard/plugin/service/search-event-handler.service.ts
packages/dashboard/plugin/service/entity-discovery.service.ts
packages/dashboard/plugin/service/documentation-content.service.ts
packages/dashboard/plugin/service/website-content.service.ts
packages/dashboard/plugin/strategies/database-search.strategy.ts
packages/dashboard/plugin/strategies/typesense-search.strategy.ts
packages/dashboard/plugin/tasks/search-index-task.ts
packages/dashboard/plugin/resolver/global-search.resolver.ts
packages/dashboard/plugin/config/search-config.ts
packages/dashboard/src/lib/components/global-search/
├── global-search-trigger.tsx
├── global-search-dialog.tsx
├── search-results-list.tsx
├── search-result-item.tsx
├── search-filters.tsx
├── search-history.tsx
├── quick-actions-list.tsx
├── quick-action-item.tsx
└── hooks/
├── use-global-search.ts
├── use-search-history.ts
├── use-search-shortcuts.ts
└── use-quick-actions.ts

```

### Files to Modify

- `packages/dashboard/plugin/dashboard.plugin.ts` - Add search resolver and scheduled tasks
- `packages/dashboard/src/lib/components/layout/app-layout.tsx` - Add search trigger
- `packages/dashboard/plugin/api/api-extensions.ts` - Include search schema
- `packages/dashboard/src/lib/framework/extension-api/` - Add quick actions to extension API

### Database Migration

```sql
-- Migration for search index table (PostgreSQL example)
CREATE TABLE search_index (
    id VARCHAR(255) PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500),
    description TEXT,
    content TEXT NOT NULL,
    url VARCHAR(1000) NOT NULL,
    thumbnail_url VARCHAR(1000),
    metadata JSONB,
    permissions VARCHAR(100)[] DEFAULT '{}',
    channel_ids VARCHAR(36)[] DEFAULT '{}',
    entity_id VARCHAR(36),
    last_updated TIMESTAMP NOT NULL DEFAULT NOW(),
    search_vector tsvector,
    relevance_score FLOAT DEFAULT 0
);

-- Indexes for performance
CREATE INDEX idx_search_index_type ON search_index(type);
CREATE INDEX idx_search_index_permissions ON search_index USING GIN(permissions);
CREATE INDEX idx_search_index_channels ON search_index USING GIN(channel_ids);
CREATE INDEX idx_search_index_updated ON search_index(last_updated);
CREATE INDEX idx_search_index_fts ON search_index USING GIN(search_vector);

-- Trigger to automatically update search_vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english',
        COALESCE(NEW.title, '') || ' ' ||
        COALESCE(NEW.subtitle, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.content, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER search_vector_update
    BEFORE INSERT OR UPDATE ON search_index
    FOR EACH ROW EXECUTE FUNCTION update_search_vector();
```

## Configuration Examples

### Basic Database Search (Default)

```typescript
// In vendure-config.ts
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import {
    searchFullReindexTask,
    searchIncrementalUpdateTask,
    searchExternalContentRefreshTask,
} from '@vendure/dashboard/plugin/tasks/search-index-task';

const config: VendureConfig = {
    plugins: [
        DashboardPlugin.init({
            route: 'dashboard',
            appDir: './dist/dashboard',
            search: {
                strategy: 'database',
                indexing: {
                    fullReindexCron: '0 2 * * *', // Daily at 2 AM
                    incrementalUpdateCron: '*/15 * * * *', // Every 15 minutes
                },
                externalSources: {
                    documentation: {
                        enabled: true,
                        endpoint: 'https://docs.vendure.io/api/search',
                        refreshIntervalHours: 24,
                    },
                    website: {
                        enabled: true,
                        endpoint: 'https://vendure.io/api/search',
                        refreshIntervalHours: 12,
                    },
                },
            },
        }),
    ],
    scheduledTasks: [searchFullReindexTask, searchIncrementalUpdateTask],
};
```

### TypeSense Search Configuration

```typescript
const config: VendureConfig = {
    plugins: [
        DashboardPlugin.init({
            route: 'dashboard',
            appDir: './dist/dashboard',
            search: {
                strategy: 'typesense',
                strategyOptions: {
                    typesense: {
                        nodes: [
                            {
                                host: 'localhost',
                                port: 8108,
                                protocol: 'http',
                            },
                        ],
                        apiKey: 'xyz123',
                        collectionName: 'vendure_search',
                    },
                },
                // ... other config
            },
        }),
    ],
};
```

## Custom Actions Integration via defineDashboardExtensions

### Extension API Integration

```typescript
// Extension API for registering custom quick actions
interface QuickActionExtension {
    // Global actions (available everywhere)
    globalActions?: QuickActionDefinition[];

    // Context-aware actions (route/page specific)
    contextActions?: {
        [routePattern: string]: QuickActionDefinition[];
    };

    // Entity-specific actions (based on entity type)
    entityActions?: {
        [entityType: string]: QuickActionDefinition[];
    };
}

interface QuickActionDefinition {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    shortcut?: string;
    requiredPermissions?: string[];
    handler: QuickActionHandler;
    params?: Record<string, any>;
}

type QuickActionHandler = (context: QuickActionContext) => void | Promise<void>;

interface QuickActionContext {
    // Current page context
    currentRoute: string;
    currentEntityType?: string;
    currentEntityId?: string;

    // Available utilities
    navigate: (path: string) => void;
    showNotification: (message: string, type?: 'success' | 'error' | 'warning') => void;
    confirm: (message: string) => Promise<boolean>;

    // Data access (if needed)
    executeGraphQL: (query: string, variables?: any) => Promise<any>;
}
```

### Developer Usage Examples

#### Global Custom Action

```typescript
// In a plugin or custom extension
defineDashboardExtensions({
    globalActions: [
        {
            id: 'export-all-orders',
            label: 'Export All Orders',
            description: 'Export all orders to CSV',
            icon: 'download',
            shortcut: 'ctrl+shift+e',
            requiredPermissions: ['ReadOrder'],
            handler: async context => {
                const confirmed = await context.confirm('Export all orders to CSV?');
                if (confirmed) {
                    // Implementation here
                    context.showNotification('Export started', 'success');
                }
            },
        },
    ],
});
```

#### Context-Aware Custom Action

```typescript
defineDashboardExtensions({
    contextActions: {
        // Only show on product detail pages
        '/products/:id': [
            {
                id: 'sync-inventory',
                label: 'Sync Inventory',
                description: 'Sync product inventory with external system',
                icon: 'refresh',
                shortcut: 'ctrl+shift+s',
                handler: async context => {
                    if (context.currentEntityId) {
                        // Sync specific product
                        await syncProductInventory(context.currentEntityId);
                        context.showNotification('Inventory synced', 'success');
                    }
                },
            },
        ],

        // Show on any list page
        '/**/list': [
            {
                id: 'bulk-export',
                label: 'Bulk Export',
                icon: 'download',
                handler: context => {
                    context.navigate('/export?type=' + context.currentEntityType);
                },
            },
        ],
    },
});
```

### Built-in Action Examples

#### Global Built-in Actions

- **Create New Product** - `ctrl+shift+p` - Navigate to product creation
- **Create New Order** - `ctrl+shift+o` - Navigate to order creation
- **Create New Customer** - `ctrl+shift+c` - Navigate to customer creation
- **Go to Profile** - `ctrl+shift+u` - Navigate to user profile
- **Quick Open Order** - `ctrl+o` - Show order search dialog

#### Context-Aware Built-in Actions

- **Product Detail Page:**
    - **Save Product** - `ctrl+s` - Save current product
    - **Duplicate Product** - `ctrl+d` - Duplicate current product
    - **Add Variant** - `ctrl+shift+v` - Add new product variant

- **Order Detail Page:**
    - **Fulfill Order** - `ctrl+f` - Open fulfillment dialog
    - **Cancel Order** - `ctrl+shift+x` - Cancel order with confirmation
    - **Add Payment** - `ctrl+p` - Add payment to order

- **Any List Page:**
    - **Export Data** - `ctrl+e` - Export current filtered data
    - **Bulk Edit** - `ctrl+b` - Enter bulk edit mode
    - **New Item** - `ctrl+n` - Create new item of current type

## Next Steps

1. Review and refine this implementation plan
2. Define specific search result formats for each entity type
3. Create detailed wireframes for the search interface
4. Set up development environment and project structure
5. Begin Phase 1 implementation

---

_This document is a living plan and should be updated as the implementation progresses and requirements evolve._

```

```
