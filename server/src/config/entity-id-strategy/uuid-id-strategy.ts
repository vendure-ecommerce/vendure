import { StringIdStrategy } from './entity-id-strategy';

/**
 * An id strategy which uses string uuids as primary keys
 * for all entities.
 */
export class UuidIdStrategy implements StringIdStrategy {
    readonly primaryKeyType = 'uuid';
    decodeId(id: string): string {
        return id;
    }
    encodeId(primaryKey: string): string {
        return primaryKey;
    }
}
