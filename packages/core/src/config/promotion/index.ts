import { discountOnItemWithFacets } from './actions/facet-values-discount-action';
import { orderPercentageDiscount } from './actions/order-percentage-discount-action';
import { productsPercentageDiscount } from './actions/product-discount-action';
import { containsProducts } from './conditions/contains-products-condition';
import { customerGroup } from './conditions/customer-group-condition';
import { hasFacetValues } from './conditions/has-facet-values-condition';
import { minimumOrderAmount } from './conditions/min-order-amount-condition';

export * from './promotion-action';
export * from './promotion-condition';
export * from './actions/facet-values-discount-action';
export * from './actions/order-percentage-discount-action';
export * from './actions/product-discount-action';
export * from './conditions/has-facet-values-condition';
export * from './conditions/min-order-amount-condition';
export * from './conditions/contains-products-condition';
export * from './conditions/customer-group-condition';

export const defaultPromotionActions = [
    orderPercentageDiscount,
    discountOnItemWithFacets,
    productsPercentageDiscount,
];
export const defaultPromotionConditions = [
    minimumOrderAmount,
    hasFacetValues,
    containsProducts,
    customerGroup,
];
