import { getConfig } from '../../config/vendure-config';

import { IdCodec } from './id-codec';

export type IdCodecType = { [K in keyof IdCodec]: IdCodec[K] };

/**
 * A decorator for use on resolver methods which automatically applies the configured
 * EntityIdStrategy to the arguments & return values of the resolver.
 *
 * @param transformKeys - An optional array of keys of the arguments object to be decoded. If not set,
 * then the arguments will be walked recursively and any `id` property will be decoded.
 * @param customIdCodec - A custom IdCodec instance, primarily intended for testing.
 */
export function ApplyIdCodec(transformKeys?: string[], customIdCodec?: IdCodecType) {
    let idCodec: IdCodecType;

    return (target: any, name: string | symbol, descriptor: PropertyDescriptor) => {
        if (!customIdCodec) {
            const strategy = getConfig().entityIdStrategy;
            idCodec = new IdCodec(strategy);
        } else {
            idCodec = customIdCodec;
        }

        const originalFn = descriptor.value;
        if (typeof originalFn === 'function') {
            descriptor.value = function(rootValue?: any, args?: any, context?: any, info?: any) {
                const encodedArgs = idCodec.decode(args, transformKeys);
                const result = originalFn.apply(this, [rootValue, encodedArgs, context, info]);
                if (result.then) {
                    return result.then(data => idCodec.encode(data));
                } else {
                    return idCodec.encode(result);
                }
            };
        }
    };
}
