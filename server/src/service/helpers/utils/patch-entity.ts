import { VendureEntity } from '../../../entity/base/base.entity';

export type InputPatch<T> = { [K in keyof T]?: T[K] | null };

/**
 * Updates only the specified properties from an Input object as long as the value is not
 * null or undefined.
 */
export function patchEntity<T extends VendureEntity, I extends InputPatch<T>>(entity: T, input: I): T {
    for (const key of Object.keys(entity)) {
        const value = input[key];
        if (key === 'customFields') {
            patchEntity(entity[key], value);
        } else if (value != null && key !== 'id') {
            entity[key] = value;
        }
    }
    return entity;
}
