import Stripe from 'stripe';

const MAX_KEYS = 50;
const MAX_KEY_NAME_LENGTH = 40;
const MAX_VALUE_LENGTH = 500;
/**
 * @description
 * Santitize metadata to ensure it follow Stripe's instructions
 *
 * @link
 * https://stripe.com/docs/api/metadata
 *
 * @Restriction
 * You can specify up to 50 keys, with key names up to 40 characters long and values up to 500 characters long.
 *
 */
export function sanitizeMetadata(metadata: Stripe.MetadataParam) {
    if (typeof metadata !== 'object' && metadata !== null) return {};

    const keys = Object.keys(metadata)
        .filter(keyName => keyName.length <= MAX_KEY_NAME_LENGTH)
        .filter(
            keyName =>
                typeof metadata[keyName] !== 'string' ||
                (metadata[keyName] as string).length <= MAX_VALUE_LENGTH,
        )
        .slice(0, MAX_KEYS) as Array<keyof Stripe.MetadataParam>;

    const sanitizedMetadata = keys.reduce((obj, keyName) => {
        obj[keyName] = metadata[keyName];
        return obj;
    }, {} as Stripe.MetadataParam);

    return sanitizedMetadata;
}
