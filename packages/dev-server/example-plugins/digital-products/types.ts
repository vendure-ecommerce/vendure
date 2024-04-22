import {
    CustomProductVariantFields,
    CustomFulfillmentFields,
    CustomShippingMethodFields,
} from '@bb-vendure/core/dist/entity/custom-entity-fields';

declare module '@bb-vendure/core/dist/entity/custom-entity-fields' {
    interface CustomProductVariantFields {
        isDigital: boolean;
    }
    interface CustomShippingMethodFields {
        isDigital: boolean;
    }
    interface CustomFulfillmentFields {
        downloadUrls: string[] | null;
    }
}
