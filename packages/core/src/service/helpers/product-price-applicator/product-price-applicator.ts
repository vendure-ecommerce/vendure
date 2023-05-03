import { Injectable } from '@nestjs/common';

import { RequestContext } from '../../../api/common/request-context';
import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
import { InternalServerError } from '../../../common/error/errors';
import { idsAreEqual } from '../../../common/utils';
import { ConfigService } from '../../../config/config.service';
import { Order } from '../../../entity/order/order.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { TaxRateService } from '../../services/tax-rate.service';
import { ZoneService } from '../../services/zone.service';

/**
 * @description
 * This helper is used to apply the correct price to a ProductVariant based on the current context
 * including active Channel, any current Order, etc. If you use the {@link TransactionalConnection} to
 * directly query ProductVariants, you will find that the `price` and `priceWithTax` properties will
 * always be `0` until you use the `applyChannelPriceAndTax()` method:
 *
 * @example
 * ```TypeScript
 * export class MyCustomService {
 *   constructor(private connection: TransactionalConnection,
 *               private productPriceApplicator: ProductPriceApplicator) {}
 *
 *   getVariant(ctx: RequestContext, id: ID) {
 *     const productVariant = await this.connection
 *       .getRepository(ctx, ProductVariant)
 *       .findOne(id, { relations: ['taxCategory'] });
 *
 *     await this.productPriceApplicator
 *       .applyChannelPriceAndTax(productVariant, ctx);
 *
 *     return productVariant;
 *   }
 * }
 * ```
 *
 * @docsCategory service-helpers
 */
@Injectable()
export class ProductPriceApplicator {
    constructor(
        private configService: ConfigService,
        private taxRateService: TaxRateService,
        private zoneService: ZoneService,
        private requestCache: RequestContextCacheService,
    ) {}

    /**
     * @description
     * Populates the `price` field with the price for the specified channel. Make sure that
     * the ProductVariant being passed in has its `taxCategory` relation joined.
     */
    async applyChannelPriceAndTax(
        variant: ProductVariant,
        ctx: RequestContext,
        order?: Order,
    ): Promise<ProductVariant> {
        const { productVariantPriceSelectionStrategy, productVariantPriceCalculationStrategy } =
            this.configService.catalogOptions;
        const channelPrice = await productVariantPriceSelectionStrategy.selectPrice(
            ctx,
            variant.productVariantPrices,
        );
        if (!channelPrice) {
            throw new InternalServerError('error.no-price-found-for-channel', {
                variantId: variant.id,
                channel: ctx.channel.code,
            });
        }
        const { taxZoneStrategy } = this.configService.taxOptions;
        const zones = await this.requestCache.get(ctx, 'allZones', () =>
            this.zoneService.getAllWithMembers(ctx),
        );
        const activeTaxZone = await this.requestCache.get(ctx, 'activeTaxZone', () =>
            taxZoneStrategy.determineTaxZone(ctx, zones, ctx.channel, order),
        );
        if (!activeTaxZone) {
            throw new InternalServerError('error.no-active-tax-zone');
        }
        const applicableTaxRate = await this.requestCache.get(
            ctx,
            `applicableTaxRate-${activeTaxZone.id}-${variant.taxCategory.id}`,
            () => this.taxRateService.getApplicableTaxRate(ctx, activeTaxZone, variant.taxCategory),
        );

        const { price, priceIncludesTax } = await productVariantPriceCalculationStrategy.calculate({
            inputPrice: channelPrice.price,
            taxCategory: variant.taxCategory,
            activeTaxZone,
            ctx,
        });

        variant.listPrice = price;
        variant.listPriceIncludesTax = priceIncludesTax;
        variant.taxRateApplied = applicableTaxRate;
        variant.currencyCode = channelPrice.currencyCode;
        return variant;
    }
}
