import { buyXGetYFreeAction } from './actions/buy-x-get-y-free-action';
import { discountOnItemWithFacets } from './actions/facet-values-percentage-discount-action';
import { freeShipping } from './actions/free-shipping-action';
import { orderFixedDiscount } from './actions/order-fixed-discount-action';
import { orderPercentageDiscount } from './actions/order-percentage-discount-action';
import { productsPercentageDiscount } from './actions/product-percentage-discount-action';
import { buyXGetYFreeCondition } from './conditions/buy-x-get-y-free-condition';
import { containsProducts } from './conditions/contains-products-condition';
import { customerGroup } from './conditions/customer-group-condition';
import { hasFacetValues } from './conditions/has-facet-values-condition';
import { minimumOrderAmount } from './conditions/min-order-amount-condition';

export * from './promotion-action';
export * from './promotion-condition';
export * from './actions/facet-values-percentage-discount-action';
export * from './actions/order-percentage-discount-action';
export * from './actions/product-percentage-discount-action';
export * from './conditions/has-facet-values-condition';
export * from './conditions/min-order-amount-condition';
export * from './conditions/contains-products-condition';
export * from './conditions/customer-group-condition';
export * from './utils/facet-value-checker';

export const defaultPromotionActions = [
    orderFixedDiscount,
    orderPercentageDiscount,
    discountOnItemWithFacets,
    productsPercentageDiscount,
    freeShipping,
    buyXGetYFreeAction,
];
export const defaultPromotionConditions = [
    minimumOrderAmount,
    hasFacetValues,
    containsProducts,
    customerGroup,
    buyXGetYFreeCondition,
];
