import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Permission } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../../api/common/request-context';
import { InternalServerError, UserInputError } from '../../../common/error/errors';
import { Injector } from '../../../common/injector';
import { ConfigService } from '../../../config/config.service';
import {
    KeyValueFieldConfig,
    KeyValueRegistration,
    KeyValueScopes,
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
        private connection: TransactionalConnection,
        private moduleRef: ModuleRef,
        private configService: ConfigService,
    ) {
        this.injector = new Injector(this.moduleRef);
    }

    async onModuleInit() {
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
    async get<T = any>(key: string, ctx: RequestContext): Promise<T | undefined> {
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
     * Set a value for the specified key. The value is automatically scoped
     * according to the field's scope configuration.
     *
     * @param key - The full key (namespace.field)
     * @param value - The value to store (must be JSON serializable)
     * @param ctx - Request context for scoping and permissions
     */
    async set<T = any>(key: string, value: T, ctx: RequestContext): Promise<void> {
        const fieldConfig = this.getFieldConfig(key);

        if (!this.hasPermission(ctx, fieldConfig)) {
            throw new UserInputError('Insufficient permissions to set key-value');
        }

        if (fieldConfig.readonly) {
            throw new UserInputError('Cannot modify readonly key-value field via API');
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
    async getMany(keys: string[], ctx: RequestContext): Promise<Record<string, any>> {
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
     * Set multiple values in a transaction. Each key is scoped according to
     * its individual field configuration.
     *
     * @param values - Object mapping keys to their values
     * @param ctx - Request context for scoping and permissions
     */
    async setMany(values: Record<string, any>, ctx: RequestContext): Promise<void> {
        await this.connection.rawConnection.transaction(async manager => {
            for (const [key, value] of Object.entries(values)) {
                const fieldConfig = this.getFieldConfig(key);

                if (!this.hasPermission(ctx, fieldConfig)) {
                    throw new UserInputError(`Insufficient permissions to set key-value: ${key}`);
                }

                if (fieldConfig.readonly) {
                    throw new UserInputError(`Cannot modify readonly key-value field: ${key}`);
                }

                // Validate the value
                await this.validateValue(key, value, ctx);

                const scope = this.generateScope(key, value, ctx, fieldConfig);
                const repo = manager.getRepository(KeyValueEntry);

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
            }
        });
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
