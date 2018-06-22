import { StringIdStrategy } from './entity-id-strategy';

/**
 * An id strategy which simply uses auto-increment integers as primary keys
 * for all entities.
 */
export class UuidIdStrategy implements StringIdStrategy {
    primaryKeyType: 'uuid';
    decodeId(id: string): string {
        return id;
    }
    encodeId(primaryKey: string): string {
        return primaryKey;
    }
}
