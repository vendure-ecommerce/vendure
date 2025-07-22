import { LocalizedString, Permission } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../api/common/request-context';
import { Injector } from '../../common/injector';

/**
 * @description
 * A function that determines how a key-value entry should be scoped.
 * Returns a string that will be used as the scope key for storage isolation.
 *
 * @example
 * ```ts
 * // User-specific scoping
 * const userScope: KeyValueScopeFunction = ({ ctx }) => ctx.activeUserId || '';
 *
 * // Channel-specific scoping
 * const channelScope: KeyValueScopeFunction = ({ ctx }) => ctx.channelId || '';
 *
 * // User and channel scoping
 * const userAndChannelScope: KeyValueScopeFunction = ({ ctx }) =>
 *   `${ctx.activeUserId || ''}:${ctx.channelId || ''}`;
 * ```
 *
 * @docsCategory KeyValueStorage
 * @since 3.4.0
 */
export type KeyValueScopeFunction = (params: { key: string; value?: any; ctx: RequestContext }) => string;

/**
 * @description
 * Configuration for a key-value field, defining how it should be stored,
 * scoped, validated, and accessed.
 *
 * @docsCategory KeyValueStorage
 * @since 3.4.0
 */
export interface KeyValueFieldConfig {
    /**
     * @description
     * The name of the field. This will be combined with the namespace
     * to create the full key (e.g., 'dashboard.theme').
     */
    name: string;

    /**
     * @description
     * Function that determines how this field should be scoped.
     * Defaults to global scoping (no isolation).
     */
    scope?: KeyValueScopeFunction;

    /**
     * @description
     * Whether this field is readonly via the GraphQL API.
     * Readonly fields can still be modified programmatically via a service.
     * @default false
     */
    readonly?: boolean;

    /**
     * @description
     * Permissions required to access this field. If not specified,
     * basic authentication is required for admin API access.
     */
    requiresPermission?: Array<Permission | string> | Permission | string;

    /**
     * @description
     * Custom validation function for field values.
     */
    validate?: (
        value: any,
        injector: Injector,
        ctx: RequestContext,
    ) => string | LocalizedString[] | void | Promise<string | LocalizedString[] | void>;
}

/**
 * @description
 * Configuration for registering a namespace of key-value fields.
 *
 * @docsCategory KeyValueStorage
 * @since 3.4.0
 */
export interface KeyValueRegistration {
    /**
     * @description
     * The namespace for these fields (e.g., 'dashboard', 'payment').
     * Field names will be prefixed with this namespace.
     */
    namespace: string;

    /**
     * @description
     * Array of field configurations for this namespace.
     */
    fields: KeyValueFieldConfig[];
}

/**
 * @description
 * This is how KeyValueFields are defined in the {@link VendureConfig} object.
 *
 * @since 3.4.0
 * @docsCategory configuration
 */
export type KeyValueFields = {
    [namespace: string]: KeyValueFieldConfig[];
};

/**
 * @description
 * Pre-built scope functions for common scoping patterns.
 *
 * @example
 * ```ts
 * const config: VendureConfig = {
 *   keyValueFields: {
 *     dashboard: [
 *       {
 *         name: 'theme',
 *         scope: KeyValueScopes.user, // User-specific
 *       },
 *       {
 *         name: 'currency',
 *         scope: KeyValueScopes.channel, // Channel-specific
 *       },
 *       {
 *         name: 'tableFilters',
 *         scope: KeyValueScopes.userAndChannel, // User-specific per channel
 *       }
 *     ]
 *   }
 * };
 * ```
 *
 * @docsCategory KeyValueStorage
 * @since 3.4.0
 */
export const KeyValueScopes = {
    /**
     * @description
     * Global scoping - no isolation, single value for all users and channels.
     */
    global: (): string => '',

    /**
     * @description
     * User-specific scoping - separate values per user.
     */
    user: ({ ctx }: { ctx: RequestContext }): string => `user:${ctx.activeUserId || 'unknown'}`,

    /**
     * @description
     * Channel-specific scoping - separate values per channel.
     */
    channel: ({ ctx }: { ctx: RequestContext }): string => `channel:${ctx.channelId || 'unknown'}`,

    /**
     * @description
     * User and channel specific scoping - separate values per user per channel.
     */
    userAndChannel: ({ ctx }: { ctx: RequestContext }): string =>
        `user:${ctx.activeUserId || ''}:channel:${ctx.channelId || ''}`,
};

/**
 * @description
 * Result type for key-value set operations, providing detailed feedback
 * about the success or failure of each operation.
 *
 * @docsCategory KeyValueStorage
 * @since 3.4.0
 */
export interface SetKeyValueResult {
    /**
     * @description
     * The key that was attempted to be set.
     */
    key: string;

    /**
     * @description
     * Whether the set operation was successful.
     */
    result: boolean;

    /**
     * @description
     * Error message if the operation failed, null if successful.
     */
    error?: string;
}

/**
 * @description
 * Represents an orphaned key-value entry that no longer has a corresponding
 * field definition in the configuration.
 *
 * @docsCategory KeyValueStorage
 * @since 3.4.0
 */
export interface OrphanedKeyValueEntry {
    /**
     * @description
     * The orphaned key.
     */
    key: string;

    /**
     * @description
     * The scope of the orphaned entry.
     */
    scope: string;

    /**
     * @description
     * When the entry was last updated.
     */
    updatedAt: Date;

    /**
     * @description
     * Preview of the stored value (truncated for large values).
     */
    valuePreview: string;
}

/**
 * @description
 * Options for cleaning up orphaned key-value entries.
 *
 * @docsCategory KeyValueStorage
 * @since 3.4.0
 */
export interface CleanupOrphanedEntriesOptions {
    /**
     * @description
     * If true, perform a dry run without actually deleting entries.
     * @default false
     */
    dryRun?: boolean;

    /**
     * @description
     * Only delete entries older than this duration.
     * Examples: '30d', '7d', '1h', '30m'
     * @default '7d'
     */
    olderThan?: string;

    /**
     * @description
     * Maximum number of entries to delete in a single operation.
     * @default 1000
     */
    maxDeleteCount?: number;

    /**
     * @description
     * Batch size for deletion operations.
     * @default 100
     */
    batchSize?: number;
}

/**
 * @description
 * Result of a cleanup operation for orphaned key-value entries.
 *
 * @docsCategory KeyValueStorage
 * @since 3.4.0
 */
export interface CleanupOrphanedEntriesResult {
    /**
     * @description
     * Number of entries that were (or would be) deleted.
     */
    deletedCount: number;

    /**
     * @description
     * Whether this was a dry run.
     */
    dryRun: boolean;

    /**
     * @description
     * Sample of deleted entries (for logging/audit purposes).
     */
    deletedEntries: OrphanedKeyValueEntry[];
}
