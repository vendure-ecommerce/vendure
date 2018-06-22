import { IntegerIdStrategy } from './entity-id-strategy';

/**
 * An id strategy which uses auto-increment integers as primary keys
 * for all entities.
 */
export class AutoIncrementIdStrategy implements IntegerIdStrategy {
    readonly primaryKeyType = 'increment';
    decodeId(id: string): number {
        return +id;
    }
    encodeId(primaryKey: number): string {
        return primaryKey.toString();
    }
}
