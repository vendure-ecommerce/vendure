export const CALCULATED_PROPERTIES = '__calculatedProperties__';

/**
 * Used to define calculated entity getters. The decorator simply attaches an array of "calculated"
 * property names to the entity's prototype. This array is then used by the {@link CalculatedPropertySubscriber}
 * to transfer the getter function from the prototype to the entity instance.
 */
export function Calculated(): MethodDecorator {
    return (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        if (target[CALCULATED_PROPERTIES]) {
            if (!target[CALCULATED_PROPERTIES].includes(propertyKey)) {
                target[CALCULATED_PROPERTIES].push(propertyKey);
            }
        } else {
            target[CALCULATED_PROPERTIES] = [propertyKey];
        }
    };
}
