import { RequestContext } from '../../api/common/request-context';
import { idsAreEqual } from '../../common/utils';
import { ProductVariantPrice } from '../../entity/product-variant/product-variant-price.entity';

import { ProductVariantPriceSelectionStrategy } from './product-variant-price-selection-strategy';

/**
 * @description
 * The default strategy for selecting the price for a ProductVariant in a given Channel.
 */
export class DefaultProductVariantPriceSelectionStrategy implements ProductVariantPriceSelectionStrategy {
    selectPrice(ctx: RequestContext, prices: ProductVariantPrice[]) {
        return prices.find(p => idsAreEqual(p.channelId, ctx.channelId));
    }
}
