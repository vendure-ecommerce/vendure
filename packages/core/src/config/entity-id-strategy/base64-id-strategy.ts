import { IntegerIdStrategy } from './entity-id-strategy';

/**
 * An example custom strategy which uses base64 encoding on integer ids.
 */
export class Base64IdStrategy implements IntegerIdStrategy {
    readonly primaryKeyType = 'increment';
    decodeId(id: string): number {
        const asNumber = +Buffer.from(id, 'base64').toString();
        return Number.isNaN(asNumber) ? -1 : asNumber;
    }
    encodeId(primaryKey: number): string {
        return Buffer.from(primaryKey.toString())
            .toString('base64')
            .replace(/=+$/, '');
    }
}
