import { IntegerIdStrategy } from '../../src/config/entity-id-strategy/entity-id-strategy';

/**
 * A testing entity id strategy which prefixes all IDs with a constant string. This is used in the
 * e2e tests to ensure that all ID properties in arguments are being
 * correctly decoded.
 */
export class TestingEntityIdStrategy implements IntegerIdStrategy {
    readonly primaryKeyType = 'increment';
    decodeId(id: string): number {
        const asNumber = parseInt(id.replace('T_', ''), 10);
        return Number.isNaN(asNumber) ? -1 : asNumber;
    }
    encodeId(primaryKey: number): string {
        return 'T_' + primaryKey.toString();
    }
}
