import { ID } from '../../../../shared/shared-types';

export type PrimaryKeyType = 'increment' | 'uuid';

/**
 * @description
 * The EntityIdStrategy determines how entity IDs are generated and stored in the
 * database, as well as how they are transformed when being passed from the API to the
 * service layer.
 *
 * @docsCategory
 */
export interface EntityIdStrategy<T extends ID = ID> {
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
