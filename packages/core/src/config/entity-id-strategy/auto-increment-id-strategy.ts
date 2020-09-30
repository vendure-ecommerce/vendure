import { EntityIdStrategy } from './entity-id-strategy';

/**
 * An id strategy which uses auto-increment integers as primary keys
 * for all entities.
 */
export class AutoIncrementIdStrategy implements EntityIdStrategy<'increment'> {
    readonly primaryKeyType = 'increment';
    decodeId(id: string): number {
        const asNumber = +id;
        return Number.isNaN(asNumber) ? -1 : asNumber;
    }
    encodeId(primaryKey: number): string {
        return primaryKey.toString();
    }
}
