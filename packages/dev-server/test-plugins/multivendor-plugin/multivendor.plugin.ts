import {
    ChannelService,
    CustomOrderProcess,
    EntityHydrator,
    ID,
    idsAreEqual,
    Injector,
    Order,
    OrderLine,
    OrderSellerStrategy,
    PartialOrder,
    PluginCommonModule,
    RequestContext,
    ShippingLine,
    ShippingLineAssignmentStrategy,
    VendurePlugin,
} from '@vendure/core';

const multivendorOrderProcess: CustomOrderProcess<any> = {
    onTransitionStart(fromState, toState, data) {
        if (fromState === 'AddingItems' && toState === 'ArrangingPayment') {
            for (const line of data.order.lines) {
                if (!line.shippingLineId) {
                    return 'not all lines have shipping';
                }
            }
        }
    },
};

class MultivendorSellerStrategy implements OrderSellerStrategy {
    private entityHydrator: EntityHydrator;
    private channelService: ChannelService;

    init(injector: Injector) {
        this.entityHydrator = injector.get(EntityHydrator);
        this.channelService = injector.get(ChannelService);
    }

    async setOrderLineSellerData(ctx: RequestContext, orderLine: OrderLine) {
        await this.entityHydrator.hydrate(ctx, orderLine.productVariant, { relations: ['channels.seller'] });
        const defaultChannel = await this.channelService.getDefaultChannel();
        if (orderLine.productVariant.channels.length === 2) {
            const sellerChannel = orderLine.productVariant.channels.find(
                c => !idsAreEqual(c.id, defaultChannel.id),
            );
            if (sellerChannel) {
                return {
                    channelId: sellerChannel.id,
                    sellerName: sellerChannel.seller.name,
                };
            }
        }

        return {
            channelId: defaultChannel.id,
            sellerName: 'Default',
        };
    }

    async splitOrder(ctx: RequestContext, order: Order): Promise<PartialOrder[]> {
        const partialOrders = new Map<ID, PartialOrder>();
        for (const line of order.lines) {
            const sellerChannelId = line.sellerData?.channelId;
            if (sellerChannelId) {
                let partialOrder = partialOrders.get(sellerChannelId);
                if (!partialOrder) {
                    partialOrder = {
                        channelId: sellerChannelId,
                        shippingLines: [],
                        surcharges: [],
                        lines: [],
                        state: order.state,
                        payments: [],
                    };
                    partialOrders.set(sellerChannelId, partialOrder);
                }
                partialOrder.lines.push(line);
            }
        }
        for (const partialOrder of partialOrders.values()) {
            const shippingLineIds = new Set(partialOrder.lines.map(l => l.shippingLineId));
            partialOrder.shippingLines = order.shippingLines.filter(shippingLine =>
                shippingLineIds.has(shippingLine.id),
            );
        }
        return [...partialOrders.values()];
    }
}

class MultivendorShippingLineAssignmentStrategy implements ShippingLineAssignmentStrategy {
    private entityHydrator: EntityHydrator;
    private channelService: ChannelService;

    init(injector: Injector) {
        this.entityHydrator = injector.get(EntityHydrator);
        this.channelService = injector.get(ChannelService);
    }

    async assignShippingLineToOrderLines(ctx: RequestContext, shippingLine: ShippingLine, order: Order) {
        const defaultChannel = await this.channelService.getDefaultChannel();
        await this.entityHydrator.hydrate(ctx, shippingLine, { relations: ['shippingMethod.channels'] });
        const { channels } = shippingLine.shippingMethod;
        if (channels.length === 2) {
            const sellerChannel = channels.find(c => !idsAreEqual(c.id, defaultChannel.id));
            if (sellerChannel) {
                return order.lines.filter(line => idsAreEqual(line.sellerData.channelId, sellerChannel.id));
            }
        }
        return order.lines;
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    configuration: config => {
        config.orderOptions.process.push(multivendorOrderProcess);
        config.orderOptions.orderSellerStrategy = new MultivendorSellerStrategy();
        config.shippingOptions.shippingLineAssignmentStrategy =
            new MultivendorShippingLineAssignmentStrategy();
        return config;
    },
})
export class MultivendorPlugin {}
