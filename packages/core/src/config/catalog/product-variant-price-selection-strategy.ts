import { RequestContext } from '../../api/common/request-context';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { ProductVariantPrice } from '../../entity/product-variant/product-variant-price.entity';

export interface ProductVariantPriceSelectionStrategy extends InjectableStrategy {
    selectPrice(
        ctx: RequestContext,
        prices: ProductVariantPrice[],
    ): ProductVariantPrice | undefined | Promise<ProductVariantPrice | undefined>;
}
