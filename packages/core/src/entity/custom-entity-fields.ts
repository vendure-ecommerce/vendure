import { ID } from '../../dist';

import { Customer } from '.';

export class CustomAddressFields {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}
export class CustomAdministratorFields {}
export class CustomAssetFields {}
export class CustomChannelFields {
    longitude: number;
    latitude: number;
    location: string;
    name: string;
}
export class CustomCollectionFields {}
export class CustomCollectionFieldsTranslation {}
export class CustomCountryFields {}
export class CustomCountryFieldsTranslation {}
export class CustomCustomerFields {
    referredBy?: ID;
    isReferralCompleted?: boolean;
    loyaltyPoints: number;
    referralCode?: string;
}
export class CustomCustomerGroupFields {}
export class CustomFacetFields {
    color1: string;
    color2: string;
}
export class CustomFacetFieldsTranslation {}
export class CustomFacetValueFields {
    color1: string;
    color2: string;
}
export class CustomFacetValueFieldsTranslation {}
export class CustomFulfillmentFields {}
export class CustomGlobalSettingsFields {}
export class CustomOrderFields {}
export class CustomOrderLineFields {}
export class CustomPaymentMethodFields {}
export class CustomProductFields {}
export class CustomProductFieldsTranslation {}
export class CustomProductOptionFields {}
export class CustomProductOptionFieldsTranslation {}
export class CustomProductOptionGroupFields {}
export class CustomProductOptionGroupFieldsTranslation {}
export class CustomProductVariantFields {}
export class CustomProductVariantFieldsTranslation {}
export class CustomPromotionFields {}
export class CustomShippingMethodFields {}
export class CustomShippingMethodFieldsTranslation {}
export class CustomTaxCategoryFields {}
export class CustomTaxRateFields {}
export class CustomUserFields {}
export class CustomZoneFields {}
