import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Permission } from '@vendure/common/lib/generated-types';
import { JsonCompatible } from '@vendure/common/lib/shared-types';
import ms from 'ms';

import { RequestContext } from '../../../api/common/request-context';
import { InternalServerError, UserInputError } from '../../../common/error/errors';
import { Injector } from '../../../common/injector';
import { ConfigService } from '../../../config/config.service';
import {
    CleanupOrphanedEntriesOptions,
    CleanupOrphanedEntriesResult,
    KeyValueFieldConfig,
    KeyValueRegistration,
    KeyValueScopes,
    OrphanedKeyValueEntry,
    SetKeyValueResult,
} from '../../../config/key-value/key-value-types';
import { Logger } from '../../../config/logger/vendure-logger';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { KeyValueEntry } from '../../../entity/key-value-entry/key-value-entry.entity';

/**
 * @description
 * The KeyValueService provides a flexible key-value storage system with support for
 * scoping, permissions, and validation. It allows plugins and the core system to
 * store and retrieve configuration data with fine-grained control over access and isolation.
 *
 * ## Usage
 *
 * Values are automatically scoped according to their field configuration:
 *
 * @example
 * ```ts
 * // In a service
 * const userTheme = await this.keyValueService.get('dashboard.theme', ctx);
 * await this.keyValueService.set('dashboard.theme', 'dark', ctx);
 *
 * // Get multiple values
 * const settings = await this.keyValueService.getMany([
 *   'dashboard.theme',
 *   'dashboard.tableFilters'
 * ], ctx);
 * ```
 *
 * @docsCategory services
 */
@Injectable()
export class KeyValueService implements OnModuleInit {
    private readonly fieldRegistry = new Map<string, KeyValueFieldConfig>();
    private readonly injector: Injector;

    constructor(
        private readonly connection: TransactionalConnection,
        private readonly moduleRef: ModuleRef,
        private readonly configService: ConfigService,
    ) {
        this.injector = new Injector(this.moduleRef);
    }

    onModuleInit() {
        this.initializeFieldRegistrations();
    }

    /**
     * @description
     * Initialize field registrations from the Vendure configuration.
     * Called during module initialization.
     */
    private initializeFieldRegistrations(): void {
        const keyValueFields = this.configService.keyValueFields || {};

        for (const [namespace, fields] of Object.entries(keyValueFields)) {
            this.register({ namespace, fields });
        }
    }

    /**
     * @description
     * Register key-value fields. This is typically called during application
     * bootstrap when processing the VendureConfig.
     */
    register(registration: KeyValueRegistration): void {
        for (const field of registration.fields) {
            const fullKey = `${registration.namespace}.${field.name}`;
            this.fieldRegistry.set(fullKey, field);
            Logger.debug(`Registered key-value field: ${fullKey}`);
        }
    }

    /**
     * @description
     * Get a value for the specified key. The value is automatically scoped
     * according to the field's scope configuration.
     *
     * @param key - The full key (namespace.field)
     * @param ctx - Request context for scoping and permissions
     * @returns The stored value or undefined if not found or access denied
     */
    async get<T = JsonCompatible<any>>(key: string, ctx: RequestContext): Promise<T | undefined> {
        const fieldConfig = this.getFieldConfig(key);

        if (!this.hasPermission(ctx, fieldConfig)) {
            return undefined;
        }

        const scope = this.generateScope(key, undefined, ctx, fieldConfig);

        const entry = await this.connection.getRepository(ctx, KeyValueEntry).findOne({
            where: { key, scope },
        });

        return entry?.value as T;
    }

    /**
     * @description
     * Get multiple values efficiently. Each key is scoped according to
     * its individual field configuration.
     *
     * @param keys - Array of full keys to retrieve
     * @param ctx - Request context for scoping and permissions
     * @returns Object mapping keys to their values
     */
    async getMany(keys: string[], ctx: RequestContext): Promise<Record<string, JsonCompatible<any>>> {
        const result: Record<string, any> = {};

        // Build array of key/scopeKey pairs for authorized keys
        const queries: Array<{ key: string; scope: string }> = [];

        for (const key of keys) {
            const fieldConfig = this.getFieldConfig(key);

            if (this.hasPermission(ctx, fieldConfig)) {
                const scope = this.generateScope(key, undefined, ctx, fieldConfig);
                queries.push({ key, scope });
            }
        }

        if (queries.length === 0) {
            return result;
        }

        // Execute single query for all authorized keys using OR conditions
        const qb = this.connection.getRepository(ctx, KeyValueEntry).createQueryBuilder('entry');

        // Build OR conditions for each key/scope pair
        const orConditions = queries
            .map((q, index) => `(entry.key = :key${index} AND entry.scope = :scope${index})`)
            .join(' OR ');

        if (orConditions) {
            qb.where(orConditions);
            // Add parameters
            queries.forEach((q, index) => {
                qb.setParameter(`key${index}`, q.key);
                qb.setParameter(`scope${index}`, q.scope);
            });
        }

        const entries = await qb.getMany();

        // Map results back to keys
        for (const entry of entries) {
            result[entry.key] = entry.value;
        }

        return result;
    }

    /**
     * @description
     * Set a value for the specified key with structured result feedback.
     * This version returns detailed information about the success or failure
     * of the operation instead of throwing errors.
     *
     * @param key - The full key (namespace.field)
     * @param value - The value to store (must be JSON serializable)
     * @param ctx - Request context for scoping and permissions
     * @returns SetKeyValueResult with operation status and error details
     */
    async set<T extends JsonCompatible<any> = JsonCompatible<any>>(
        key: string,
        value: T,
        ctx: RequestContext,
    ): Promise<SetKeyValueResult> {
        try {
            const fieldConfig = this.getFieldConfig(key);

            if (!this.hasPermission(ctx, fieldConfig)) {
                return {
                    key,
                    result: false,
                    error: 'Insufficient permissions to set key-value',
                };
            }

            if (fieldConfig.readonly) {
                return {
                    key,
                    result: false,
                    error: 'Cannot modify readonly key-value field via API',
                };
            }

            // Validate the value
            await this.validateValue(key, value, ctx);

            const scope = this.generateScope(key, value, ctx, fieldConfig);
            const repo = this.connection.getRepository(ctx, KeyValueEntry);

            // Find existing entry or create new one
            const entry = await repo.findOne({
                where: { key, scope },
            });

            if (entry) {
                entry.value = value;
                await repo.save(entry);
            } else {
                await repo.save({
                    key,
                    scope,
                    value,
                });
            }

            return {
                key,
                result: true,
            };
        } catch (error) {
            return {
                key,
                result: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            };
        }
    }

    /**
     * @description
     * Set multiple values with structured result feedback for each operation.
     * Unlike setMany, this method will not throw errors but will return
     * detailed results for each key-value pair.
     *
     * @param values - Object mapping keys to their values
     * @param ctx - Request context for scoping and permissions
     * @returns Array of SetKeyValueResult with operation status for each key
     */
    async setMany(
        values: Record<string, JsonCompatible<any>>,
        ctx: RequestContext,
    ): Promise<SetKeyValueResult[]> {
        const results: SetKeyValueResult[] = [];

        for (const [key, value] of Object.entries(values)) {
            const result = await this.set(key, value, ctx);
            results.push(result);
        }

        return results;
    }

    /**
     * @description
     * Get the field configuration for a key.
     */
    getFieldDefinition(key: string): KeyValueFieldConfig | undefined {
        return this.fieldRegistry.get(key);
    }

    /**
     * @description
     * Validate a value against its field definition.
     */
    async validateValue(key: string, value: any, ctx: RequestContext): Promise<string | void> {
        const fieldConfig = this.fieldRegistry.get(key);
        if (!fieldConfig?.validate) {
            return;
        }

        const result = await fieldConfig.validate(value, this.injector, ctx);
        if (typeof result === 'string') {
            throw new UserInputError(`Validation failed for ${key}: ${result}`);
        }
        if (Array.isArray(result)) {
            throw new UserInputError(`Validation failed for ${key}: ${JSON.stringify(result)}`);
        }
    }

    /**
     * @description
     * Generate the scope key for a given field and context.
     */
    private generateScope(
        key: string,
        value: any,
        ctx: RequestContext,
        fieldConfig: KeyValueFieldConfig,
    ): string {
        const scopeFunction = fieldConfig.scope || KeyValueScopes.global;
        return scopeFunction({ key, value, ctx });
    }

    /**
     * @description
     * Get field configuration, throwing if not found.
     */
    private getFieldConfig(key: string): KeyValueFieldConfig {
        const config = this.fieldRegistry.get(key);
        if (!config) {
            throw new InternalServerError(`Key-value field not registered: ${key}`);
        }
        return config;
    }

    /**
     * @description
     * Find orphaned key-value entries that no longer have corresponding field definitions.
     *
     * @param options - Options for filtering orphaned entries
     * @returns Array of orphaned entries
     */
    async findOrphanedEntries(options: CleanupOrphanedEntriesOptions = {}): Promise<OrphanedKeyValueEntry[]> {
        const { olderThan = '7d', maxDeleteCount = 1000 } = options;

        // Parse duration to get cutoff date
        const cutoffDate = this.parseDuration(olderThan);

        const qb = this.connection.rawConnection
            .getRepository(KeyValueEntry)
            .createQueryBuilder('entry')
            .where('entry.updatedAt < :cutoffDate', { cutoffDate })
            .orderBy('entry.updatedAt', 'ASC')
            .limit(maxDeleteCount);

        const allEntries = await qb.getMany();
        const orphanedEntries: OrphanedKeyValueEntry[] = [];

        // Check each entry against registered fields
        for (const entry of allEntries) {
            const fieldConfig = this.fieldRegistry.get(entry.key);
            if (!fieldConfig) {
                // This entry has no field definition - it's orphaned
                orphanedEntries.push({
                    key: entry.key,
                    scope: entry.scope || '',
                    updatedAt: entry.updatedAt,
                    valuePreview: this.getValuePreview(entry.value),
                });
            }
        }

        return orphanedEntries;
    }

    /**
     * @description
     * Clean up orphaned key-value entries from the database.
     *
     * @param options - Options for the cleanup operation
     * @returns Result of the cleanup operation
     */
    async cleanupOrphanedEntries(
        options: CleanupOrphanedEntriesOptions = {},
    ): Promise<CleanupOrphanedEntriesResult> {
        const { dryRun = false, batchSize = 100, maxDeleteCount = 1000 } = options;

        // Find orphaned entries first
        const orphanedEntries = await this.findOrphanedEntries(options);

        if (dryRun) {
            return {
                deletedCount: orphanedEntries.length,
                dryRun: true,
                deletedEntries: orphanedEntries.slice(0, 10), // Sample for preview
            };
        }

        let totalDeleted = 0;
        const sampleDeletedEntries: OrphanedKeyValueEntry[] = [];

        // Delete in batches
        for (let i = 0; i < orphanedEntries.length && totalDeleted < maxDeleteCount; i += batchSize) {
            const batch = orphanedEntries.slice(i, i + batchSize);

            // Extract keys and scopes for deletion
            const conditions = batch.map(entry => ({ key: entry.key, scope: entry.scope }));

            await this.connection.rawConnection.getRepository(KeyValueEntry).delete(conditions);

            totalDeleted += batch.length;

            // Keep first batch as sample
            if (i === 0) {
                sampleDeletedEntries.push(...batch.slice(0, 10));
            }

            Logger.verbose(`Deleted batch of ${batch.length} orphaned key-value entries`);
        }

        Logger.info(`Cleanup completed: deleted ${totalDeleted} orphaned key-value entries`);

        return {
            deletedCount: totalDeleted,
            dryRun: false,
            deletedEntries: sampleDeletedEntries,
        };
    }

    /**
     * @description
     * Parse a duration string (e.g., '7d', '30m', '2h') into a Date object.
     */
    private parseDuration(duration: string): Date {
        const milliseconds = ms(duration);
        if (!milliseconds) {
            throw new Error(`Invalid duration format: ${duration}. Use format like '7d', '2h', '30m'`);
        }

        return new Date(Date.now() - milliseconds);
    }

    /**
     * @description
     * Get a preview of a value for logging purposes, truncating if too large.
     */
    private getValuePreview(value: any): string {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        return stringValue.length > 100 ? stringValue.substring(0, 100) + '...' : stringValue;
    }

    /**
     * @description
     * Check if the current user has permission to access a field.
     */
    private hasPermission(ctx: RequestContext, fieldConfig: KeyValueFieldConfig): boolean {
        // Admin API: check required permissions
        const requiredPermissions = fieldConfig.requiresPermission;
        if (requiredPermissions) {
            const permissions = Array.isArray(requiredPermissions)
                ? requiredPermissions
                : [requiredPermissions];
            return ctx.userHasPermissions(permissions as any);
        }

        // Default: require authentication
        return ctx.userHasPermissions([Permission.Authenticated]);
    }
}
