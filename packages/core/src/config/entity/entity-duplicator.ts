import { ConfigArg, Permission } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/index';
import {
    ConfigArgs,
    ConfigArgValues,
    ConfigurableOperationDef,
    ConfigurableOperationDefOptions,
} from '../../common/configurable-operation';
import { VendureEntity } from '../../entity/index';

export type DuplicateEntityFn<T extends ConfigArgs> = (input: {
    ctx: RequestContext;
    entityName: string;
    id: ID;
    args: ConfigArgValues<T>;
}) => Promise<VendureEntity>;

/**
 * @description
 *
 *
 */
export interface EntityDuplicatorConfig<T extends ConfigArgs> extends ConfigurableOperationDefOptions<T> {
    requiresPermission: Array<Permission | string> | Permission | string;
    forEntities: string[];
    duplicate: DuplicateEntityFn<T>;
}

export class EntityDuplicator<T extends ConfigArgs = ConfigArgs> extends ConfigurableOperationDef<T> {
    private _forEntities: string[];
    private _requiresPermission: Array<Permission | string> | Permission | string;
    private duplicateFn: DuplicateEntityFn<T>;

    canDuplicate(entityName: string): boolean {
        return this._forEntities.includes(entityName);
    }

    get forEntities() {
        return this._forEntities;
    }

    get requiresPermission(): Permission[] {
        return (Array.isArray(this._requiresPermission)
            ? this._requiresPermission
            : [this._requiresPermission]) as any as Permission[];
    }

    constructor(config: EntityDuplicatorConfig<T>) {
        super(config);
        this._forEntities = config.forEntities;
        this._requiresPermission = config.requiresPermission;
        this.duplicateFn = config.duplicate;
    }

    duplicate(input: {
        ctx: RequestContext;
        entityName: string;
        id: ID;
        args: ConfigArg[];
    }): Promise<VendureEntity> {
        return this.duplicateFn({
            ...input,
            args: this.argsArrayToHash(input.args),
        });
    }
}
