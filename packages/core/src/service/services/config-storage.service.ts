import { Injectable } from '@nestjs/common';
import { Instrument } from '../../common/instrument-decorator';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { RequestContext } from '../../api/common/request-context';
import { ForbiddenError, InternalServerError } from '../../common/error/errors';
import { Config } from '../../entity/config/config.entity';
import { Permission } from '@vendure/common/lib/generated-types';

/**
 * @description
 * Defines a config key registration with default value and CRUD permissions.
 */
export interface ConfigKeyDefinition {
    /** The plugin which owns this config key */
    plugin: string;
    /** The unique key identifier */
    key: string;
    /** The default value for this config key */
    defaultValue: any;
    /** Permissions required for each CRUD operation */
    permissions: {
        create: Permission[];
        read: Permission[];
        update: Permission[];
        delete: Permission[];
    };
}

/**
 * @description
 * A global key-value storage system allowing plugins to register and manage config values.
 * Config entries and their permissions are persisted in the database.
 *
 * @docsCategory services
 */
@Injectable()
@Instrument()
export class ConfigStorageService {
    private static definitions: ConfigKeyDefinition[] = [];

    constructor(private connection: TransactionalConnection) {}

    /**
     * Register a config key definition. Plugins should call this to define keys,
     * default values, and CRUD permissions.
     */
    static registerDefinition(def: ConfigKeyDefinition): void {
        if (this.definitions.find(d => d.key === def.key)) {
            throw new Error(`Config key '${def.key}' is already registered`);
        }
        this.definitions.push(def);
    }

    /**
     * Initializes the config entries in the database for all registered definitions.
     */
    async initConfigDefinitions(): Promise<void> {
        const repo = this.connection.rawConnection.getRepository(Config);
        for (const def of ConfigStorageService.definitions) {
            let entity = await repo.findOne({ where: { key: def.key } });
            if (!entity) {
                entity = repo.create({
                    key: def.key,
                    plugin: def.plugin,
                    value: JSON.stringify(def.defaultValue),
                    createPermissions: def.permissions.create,
                    readPermissions: def.permissions.read,
                    updatePermissions: def.permissions.update,
                    deletePermissions: def.permissions.delete,
                });
                await repo.save(entity);
            } else {
                let changed = false;
                if (entity.plugin !== def.plugin) {
                    entity.plugin = def.plugin;
                    changed = true;
                }
                if (!this.arraysEqual(entity.createPermissions, def.permissions.create)) {
                    entity.createPermissions = def.permissions.create;
                    changed = true;
                }
                if (!this.arraysEqual(entity.readPermissions, def.permissions.read)) {
                    entity.readPermissions = def.permissions.read;
                    changed = true;
                }
                if (!this.arraysEqual(entity.updatePermissions, def.permissions.update)) {
                    entity.updatePermissions = def.permissions.update;
                    changed = true;
                }
                if (!this.arraysEqual(entity.deletePermissions, def.permissions.delete)) {
                    entity.deletePermissions = def.permissions.delete;
                    changed = true;
                }
                if (changed) {
                    await repo.save(entity);
                }
            }
        }
    }

    /**
     * Returns all config entries.
     */
    async getConfigs(ctx: RequestContext): Promise<Config[]> {
        return this.connection.getRepository(ctx, Config).find();
    }

    /**
     * Returns the config entry for the given key.
     */
    async getConfig(ctx: RequestContext, key: string): Promise<Config | undefined> {
        const entity = await this.connection.getRepository(ctx, Config).findOne({ where: { key } });
        if (!entity) {
            return undefined;
        }
        this.assertPermission(ctx, entity, 'read');
        return entity;
    }

    /**
     * Creates a new config entry. The key must be registered via registerDefinition().
     */
    async createConfig(ctx: RequestContext, input: { key: string; plugin: string; value: any; createPermissions: Permission[]; readPermissions: Permission[]; updatePermissions: Permission[]; deletePermissions: Permission[]; }): Promise<Config> {
        const def = this.getDefinition(input.key);
        this.assertPermission(ctx, def, 'create');
        const repo = this.connection.getRepository(ctx, Config);
        const exists = await repo.findOne({ where: { key: input.key } });
        if (exists) {
            throw new InternalServerError(`Config key '${input.key}' already exists`);
        }
        const entity = repo.create({
            key: input.key,
            plugin: def.plugin,
            value: JSON.stringify(input.value),
            createPermissions: def.permissions.create,
            readPermissions: def.permissions.read,
            updatePermissions: def.permissions.update,
            deletePermissions: def.permissions.delete,
        });
        return repo.save(entity);
    }

    /**
     * Updates an existing config entry.
     */
    async updateConfig(ctx: RequestContext, input: { key: string; value?: any; createPermissions?: Permission[]; readPermissions?: Permission[]; updatePermissions?: Permission[]; deletePermissions?: Permission[]; }): Promise<Config> {
        const repo = this.connection.getRepository(ctx, Config);
        const entity = await repo.findOne({ where: { key: input.key } });
        if (!entity) {
            throw new InternalServerError(`Config key '${input.key}' not found`);
        }
        this.assertPermission(ctx, entity, 'update');
        if (input.value !== undefined) {
            entity.value = JSON.stringify(input.value);
        }
        if (input.createPermissions) {
            entity.createPermissions = input.createPermissions;
        }
        if (input.readPermissions) {
            entity.readPermissions = input.readPermissions;
        }
        if (input.updatePermissions) {
            entity.updatePermissions = input.updatePermissions;
        }
        if (input.deletePermissions) {
            entity.deletePermissions = input.deletePermissions;
        }
        return repo.save(entity);
    }

    /**
     * Deletes the config entry for the given key.
     */
    async deleteConfig(ctx: RequestContext, key: string): Promise<{ result: 'DELETED'; message?: string }> {
        const repo = this.connection.getRepository(ctx, Config);
        const entity = await repo.findOne({ where: { key } });
        if (!entity) {
            throw new InternalServerError(`Config key '${key}' not found`);
        }
        this.assertPermission(ctx, entity, 'delete');
        await repo.remove(entity as any);
        return { result: 'DELETED' };
    }

    private getDefinition(key: string): ConfigKeyDefinition {
        const def = ConfigStorageService.definitions.find(d => d.key === key);
        if (!def) {
            throw new InternalServerError(`Config key '${key}' is not registered`);
        }
        return def;
    }

    private assertPermission(ctx: RequestContext, target: ConfigKeyDefinition | Config, operation: keyof ConfigKeyDefinition['permissions']): void {
        const perms = target instanceof Config ? target[`${operation}Permissions`] : target.permissions[operation];
        if (perms.length && !perms.some(p => ctx.hasPermission(p))) {
            throw new ForbiddenError();
        }
    }

    private arraysEqual(a: any[], b: any[]): boolean {
        return a.length === b.length && a.every((v, i) => v === b[i]);
    }
}