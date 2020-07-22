import { discountOnItemWithFacets } from './actions/facet-values-discount-action';
import { orderPercentageDiscount } from './actions/order-percentage-discount-action';
import { hasFacetValues } from './conditions/has-facet-values-condition';
import { minimumOrderAmount } from './conditions/min-order-amount-condition';

export * from './promotion-action';
export * from './promotion-condition';
export * from './actions/facet-values-discount-action';
export * from './actions/order-percentage-discount-action';
export * from './conditions/has-facet-values-condition';
export * from './conditions/min-order-amount-condition';

export const defaultPromotionActions = [orderPercentageDiscount, discountOnItemWithFacets];
export const defaultPromotionConditions = [minimumOrderAmount, hasFacetValues];
