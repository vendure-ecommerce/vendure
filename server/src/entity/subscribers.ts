import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';

import { CALCULATED_PROPERTIES } from '../common/calculated-decorator';

import { ProductVariantSubscriber } from './product-variant/product-variant.subscriber';

@EventSubscriber()
export class CalculatedPropertySubscriber implements EntitySubscriberInterface {
    /**
     * For any entity properties decorated with @Calculated(), this subscriber transfers
     * the getter from the entity prototype to the entity instance, so that it can be
     * correctly enumerated and serialized in the API response.
     */
    afterLoad(event: any) {
        const prototype = Object.getPrototypeOf(event);
        if (prototype.hasOwnProperty(CALCULATED_PROPERTIES)) {
            for (const property of prototype[CALCULATED_PROPERTIES]) {
                const getterDescriptor = Object.getOwnPropertyDescriptor(prototype, property);
                const getFn = getterDescriptor && getterDescriptor.get;
                if (getFn) {
                    const boundGetFn = getFn.bind(event);
                    Object.defineProperties(event, {
                        [property]: {
                            get: () => boundGetFn(),
                            enumerable: true,
                        },
                    });
                }
            }
        }
    }
}

/**
 * A map of the core TypeORM Subscribers.
 */
export const coreSubscribersMap = {
    ProductVariantSubscriber,
    CalculatedPropertySubscriber,
};
