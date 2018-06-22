import { ID } from '../common/common-types';

export type PrimaryKeyType = 'increment' | 'uuid';

export interface EntityIdStrategy<T extends ID = ID> {
    primaryKeyType: PrimaryKeyType;
    encodeId: (primaryKey: T) => string;
    decodeId: (id: string) => T;
}

export interface IntegerIdStrategy extends EntityIdStrategy<number> {
    primaryKeyType: 'increment';
    encodeId: (primaryKey: number) => string;
    decodeId: (id: string) => number;
}

export interface StringIdStrategy extends EntityIdStrategy<string> {
    primaryKeyType: 'uuid';
    encodeId: (primaryKey: string) => string;
    decodeId: (id: string) => string;
}
