import { Injectable } from '@nestjs/common';
import { CreateAddressInput } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../../api';
import { ConfigService } from '../../../config';
import { Order, OrderItem, OrderLine, ProductVariant, Promotion, ShippingLine } from '../../../entity';
import { CustomerService } from '../../services/customer.service';
import { OrderService } from '../../services/order.service';
import { OrderCalculator } from '../order-calculator/order-calculator';
import { ProductPriceApplicator } from '../product-price-applicator/product-price-applicator';

@Injectable()
export class VariantCalculator {
    constructor(
        private configService: ConfigService,
        private orderService: OrderService,
        private customerService: CustomerService,
        private productPriceApplicator: ProductPriceApplicator,
        private orderCalculator: OrderCalculator,
    ) {}

    /**
     * @description adds the variant to a new order based on `initialOrder` and applies all `promotions`,
     *
     * if no `initialOrder` is supplied, it is based on the users active order
     */
    public async applyVariantPromotions(
        ctx: RequestContext,
        variant: ProductVariant,
        promotions: Promotion[],
        quantity = 1,
        initialOrder?: Order,
    ) {
        const customerId = initialOrder?.customer?.id ?? ctx.activeUserId;
        if (!customerId)
            // FIXME use the appropriate Error type, instead of generic Error
            throw new Error('no active user or order customer');

        const { orderItemPriceCalculationStrategy } = this.configService.orderOptions;
        if (!orderItemPriceCalculationStrategy)
            // FIXME use correct Error type
            throw new Error('no item price calculation strategy found');

        let order: Order;
        if (initialOrder) {
            order = new Order(initialOrder);
        } else if (ctx.session?.activeOrderId) {
            const found = await this.orderService.findOne(ctx, ctx.session?.activeOrderId);
            order = new Order(found);
        } else {
            order = new Order();
        }
        order.lines ??= [];
        order.surcharges ??= [];
        order.modifications ??= [];

        if (!order.customer) {
            order.customer = await this.customerService.findOne(ctx, customerId);
        }

        if (!order.shippingAddress) {
            const addrs = await this.customerService.findAddressesByCustomerId(ctx, customerId);
            // FIXME use correct Error type
            if (addrs.length === 0) throw new Error(`no Address for Customer ${customerId} found`);

            const shippingAddress = addrs.find(x => x.defaultShippingAddress) ?? addrs[0];
            const billingAddress = addrs.find(x => x.defaultBillingAddress) ?? addrs[0];

            order.shippingAddress = {
                ...shippingAddress,
                countryCode: shippingAddress.country.code,
            } as CreateAddressInput;
            order.billingAddress = {
                ...billingAddress,
                countryCode: billingAddress.country.code,
            } as CreateAddressInput;
        }

        const adjustedVariant = await this.productPriceApplicator.applyChannelPriceAndTax(
            variant,
            ctx,
            order,
        );
        const orderLine = new OrderLine({
            productVariant: variant,
            items: [],
            taxCategory: variant.taxCategory,
        });

        const { price, priceIncludesTax } = await orderItemPriceCalculationStrategy.calculateUnitPrice(
            ctx,
            adjustedVariant,
            {},
        );
        const taxRate = adjustedVariant.taxRateApplied;
        const unitPrice = priceIncludesTax ? taxRate.netPriceOf(price) : price;

        for (let i = 0; i < quantity; i++) {
            const orderItem = new OrderItem({
                id: adjustedVariant.id,
                listPrice: price,
                listPriceIncludesTax: priceIncludesTax,
                adjustments: [],
                taxLines: [],
            });
            orderLine.items.push(orderItem);
        }

        order.shippingLines = [
            new ShippingLine({
                listPrice: 0,
                listPriceIncludesTax: ctx.channel.pricesIncludeTax,
                taxLines: [],
                adjustments: [],
            }),
        ];

        order.lines.push(orderLine);
        const adjustedItems = await this.orderCalculator.applyPriceAdjustments(ctx, order, promotions);
        const item = adjustedItems.find(x => x.line?.productVariant.id === variant.id);
        if (!item)
            // TODO figure out how to handle this case and why it can happen
            // since this methods usecase is mostly to display a discounted price
            // it should probably just return the original price when it can't be calculated
            throw new Error('variant was not adjusted');
        return item.discountedUnitPrice;
    }
}
