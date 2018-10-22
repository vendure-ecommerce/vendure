import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';

import { CALCULATED_PROPERTIES } from '../common/calculated-decorator';

import { ProductVariantSubscriber } from './product-variant/product-variant.subscriber';

@EventSubscriber()
export class CalculatedPropertySubscriber implements EntitySubscriberInterface {
    afterLoad(event: any) {
        this.moveCalculatedGettersToInstance(event);
    }

    afterInsert(event: InsertEvent<any>): Promise<any> | void {
        this.moveCalculatedGettersToInstance(event.entity);
    }

    /**
     * For any entity properties decorated with @Calculated(), this subscriber transfers
     * the getter from the entity prototype to the entity instance, so that it can be
     * correctly enumerated and serialized in the API response.
     */
    private moveCalculatedGettersToInstance(entity: any) {
        if (entity) {
            const prototype = Object.getPrototypeOf(entity);
            if (prototype.hasOwnProperty(CALCULATED_PROPERTIES)) {
                for (const property of prototype[CALCULATED_PROPERTIES]) {
                    const getterDescriptor = Object.getOwnPropertyDescriptor(prototype, property);
                    const getFn = getterDescriptor && getterDescriptor.get;
                    if (getFn) {
                        const boundGetFn = getFn.bind(entity);
                        Object.defineProperties(entity, {
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
}

/**
 * A map of the core TypeORM Subscribers.
 */
export const coreSubscribersMap = {
    ProductVariantSubscriber,
    CalculatedPropertySubscriber,
};
