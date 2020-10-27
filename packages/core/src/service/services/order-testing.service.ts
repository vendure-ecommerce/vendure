import { Injectable } from '@nestjs/common';
import {
    CreateAddressInput,
    ShippingMethodQuote,
    TestEligibleShippingMethodsInput,
    TestShippingMethodInput,
    TestShippingMethodResult,
} from '@vendure/common/lib/generated-types';

import { ID } from '../../../../common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { ShippingMethod } from '../../entity/shipping-method/shipping-method.entity';
import { OrderCalculator } from '../helpers/order-calculator/order-calculator';
import { ShippingCalculator } from '../helpers/shipping-calculator/shipping-calculator';
import { ShippingConfiguration } from '../helpers/shipping-configuration/shipping-configuration';
import { TransactionalConnection } from '../transaction/transactional-connection';

/**
 * This service is responsible for creating temporary mock Orders against which tests can be run, such as
 * testing a ShippingMethod or Promotion.
 */
@Injectable()
export class OrderTestingService {
    constructor(
        private connection: TransactionalConnection,
        private orderCalculator: OrderCalculator,
        private shippingCalculator: ShippingCalculator,
        private shippingConfiguration: ShippingConfiguration,
    ) {}

    /**
     * Runs a given ShippingMethod configuration against a mock Order to test for eligibility and resulting
     * price.
     */
    async testShippingMethod(
        ctx: RequestContext,
        input: TestShippingMethodInput,
    ): Promise<TestShippingMethodResult> {
        const shippingMethod = new ShippingMethod({
            checker: this.shippingConfiguration.parseCheckerInput(input.checker),
            calculator: this.shippingConfiguration.parseCalculatorInput(input.calculator),
        });
        const mockOrder = await this.buildMockOrder(ctx, input.shippingAddress, input.lines);
        const eligible = await shippingMethod.test(ctx, mockOrder);
        const result = eligible ? await shippingMethod.apply(ctx, mockOrder) : undefined;
        return {
            eligible,
            quote: result && {
                ...result,
                description: shippingMethod.description,
            },
        };
    }

    /**
     * Tests all available ShippingMethods against a mock Order and return those whic hare eligible. This
     * is intended to simulate a call to the `eligibleShippingMethods` query of the Shop API.
     */
    async testEligibleShippingMethods(
        ctx: RequestContext,
        input: TestEligibleShippingMethodsInput,
    ): Promise<ShippingMethodQuote[]> {
        const mockOrder = await this.buildMockOrder(ctx, input.shippingAddress, input.lines);
        const eligibleMethods = await this.shippingCalculator.getEligibleShippingMethods(ctx, mockOrder);
        return eligibleMethods.map(result => ({
            id: result.method.id,
            price: result.result.price,
            priceWithTax: result.result.priceWithTax,
            description: result.method.description,
            metadata: result.result.metadata,
        }));
    }

    private async buildMockOrder(
        ctx: RequestContext,
        shippingAddress: CreateAddressInput,
        lines: Array<{ productVariantId: ID; quantity: number }>,
    ): Promise<Order> {
        const mockOrder = new Order({
            lines: [],
        });
        mockOrder.shippingAddress = shippingAddress;
        for (const line of lines) {
            const productVariant = await this.connection.getEntityOrThrow(
                ctx,
                ProductVariant,
                line.productVariantId,
                { relations: ['taxCategory'] },
            );
            const orderLine = new OrderLine({
                productVariant,
                items: [],
                taxCategory: productVariant.taxCategory,
            });
            mockOrder.lines.push(orderLine);

            for (let i = 0; i < line.quantity; i++) {
                const orderItem = new OrderItem({
                    unitPrice: productVariant.price,
                    pendingAdjustments: [],
                    unitPriceIncludesTax: productVariant.priceIncludesTax,
                    taxRate: productVariant.priceIncludesTax ? productVariant.taxRateApplied.value : 0,
                });
                orderLine.items.push(orderItem);
            }
        }
        await this.orderCalculator.applyPriceAdjustments(ctx, mockOrder, []);
        return mockOrder;
    }
}
