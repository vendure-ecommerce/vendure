import { VendureEntity } from '../../../entity/base/base.entity';

export type InputPatch<T> = { [K in keyof T]?: T[K] | null };

/**
 * Updates only the specified properties from an Input object as long as the value is not
 * undefined. Null values can be passed, however, which will set the corresponding entity
 * field to "null". So care must be taken that this is only done on nullable fields.
 *
 * **Careful: This function returns the same passed in entity, which may have been mutated!**
 *
 * The mutation gets relevant if you bind the return value to a separate variable, then you have
 * two references that may mutate the same object. Example:
 *
 * ```js
 * const admin1 = new Administrator(...);
 * const admin2 = patchEntity(admin1, input);
 * // Changing fields on `admin2` will now also affect `admin1`!
 * // This can be dangerous, use this function responsibly.
 * ```
 */
export function patchEntity<T extends VendureEntity, I extends InputPatch<T>>(entity: T, input: I): T {
    for (const key of Object.keys(entity)) {
        const value = input[key as keyof T];
        if (key === 'customFields' && value) {
            patchEntity((entity as any)[key], value as any);
        } else if (value !== undefined && key !== 'id') {
            entity[key as keyof T] = value as any;
        }
    }
    return entity;
}
