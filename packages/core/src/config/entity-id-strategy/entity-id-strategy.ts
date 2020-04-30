import { ID } from '@vendure/common/lib/shared-types';

import { InjectableStrategy } from '../../common/types/injectable-strategy';

/**
 * @description
 * Defines the type of primary key used for all entities in the database.
 * "increment" uses an auto-incrementing integer, whereas "uuid" uses a
 * uuid string.
 *
 * @docsCategory entities
 * @docsPage Entity Configuration
 */
export type PrimaryKeyType = 'increment' | 'uuid';

/**
 * @description
 * The EntityIdStrategy determines how entity IDs are generated and stored in the
 * database, as well as how they are transformed when being passed from the API to the
 * service layer.
 *
 * @docsCategory entities
 * @docsPage Entity Configuration
 * */
export interface EntityIdStrategy<T extends ID = ID> extends InjectableStrategy {
    readonly primaryKeyType: PrimaryKeyType;
    encodeId: (primaryKey: T) => string;
    decodeId: (id: string) => T;
}

export interface IntegerIdStrategy extends EntityIdStrategy<number> {
    readonly primaryKeyType: 'increment';
    encodeId: (primaryKey: number) => string;
    decodeId: (id: string) => number;
}

export interface StringIdStrategy extends EntityIdStrategy<string> {
    readonly primaryKeyType: 'uuid';
    encodeId: (primaryKey: string) => string;
    decodeId: (id: string) => string;
}
