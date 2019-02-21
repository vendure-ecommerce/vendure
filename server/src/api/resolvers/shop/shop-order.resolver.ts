import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import ms from 'ms';

import {
    AddItemToOrderMutationArgs,
    AddPaymentToOrderMutationArgs,
    AdjustItemQuantityMutationArgs,
    OrderByCodeQueryArgs,
    OrderQueryArgs,
    Permission,
    RemoveItemFromOrderMutationArgs,
    SetCustomerForOrderMutationArgs,
    SetOrderShippingAddressMutationArgs,
    SetOrderShippingMethodMutationArgs,
    ShippingMethodQuote,
    TransitionOrderToStateMutationArgs,
} from '../../../../../shared/generated-shop-types';
import { CountriesQueryArgs } from '../../../../../shared/generated-types';
import { ForbiddenError, InternalServerError } from '../../../common/error/errors';
import { Translated } from '../../../common/types/locale-types';
import { idsAreEqual } from '../../../common/utils';
import { Country } from '../../../entity';
import { Order } from '../../../entity/order/order.entity';
import { CountryService } from '../../../service';
import { OrderState } from '../../../service/helpers/order-state-machine/order-state';
import { AuthService } from '../../../service/services/auth.service';
import { CustomerService } from '../../../service/services/customer.service';
import { OrderService } from '../../../service/services/order.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Decode } from '../../decorators/decode.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver()
export class ShopOrderResolver {
    constructor(
        private orderService: OrderService,
        private customerService: CustomerService,
        private authService: AuthService,
        private countryService: CountryService,
    ) {}

    @Query()
    availableCountries(
        @Ctx() ctx: RequestContext,
        @Args() args: CountriesQueryArgs,
    ): Promise<Array<Translated<Country>>> {
        return this.countryService
            .findAll(ctx, {
                filter: {
                    enabled: {
                        eq: true,
                    },
                },
                skip: 0,
                take: 99999,
            })
            .then(data => data.items);
    }

    @Query()
    @Allow(Permission.Owner)
    async order(@Ctx() ctx: RequestContext, @Args() args: OrderQueryArgs): Promise<Order | undefined> {
        const order = await this.orderService.findOne(ctx, args.id);
        if (order && ctx.authorizedAsOwnerOnly) {
            const orderUserId = order.customer && order.customer.user && order.customer.user.id;
            if (idsAreEqual(ctx.activeUserId, orderUserId)) {
                return order;
            } else {
                return;
            }
        }
    }

    @Query()
    @Allow(Permission.Owner)
    async activeOrder(@Ctx() ctx: RequestContext): Promise<Order | undefined> {
        if (ctx.authorizedAsOwnerOnly) {
            const sessionOrder = await this.getOrderFromContext(ctx);
            if (sessionOrder) {
                return this.orderService.findOne(ctx, sessionOrder.id);
            } else {
                return;
            }
        }
    }

    @Query()
    @Allow(Permission.Owner)
    async orderByCode(
        @Ctx() ctx: RequestContext,
        @Args() args: OrderByCodeQueryArgs,
    ): Promise<Order | undefined> {
        if (ctx.authorizedAsOwnerOnly) {
            const order = await this.orderService.findOneByCode(ctx, args.code);

            if (order) {
                // For guest Customers, allow access to the Order for the following
                // time period
                const anonymousAccessLimit = ms('2h');
                const orderPlaced = order.orderPlacedAt ? +order.orderPlacedAt : 0;
                const activeUserMatches = !!(
                    order &&
                    order.customer &&
                    order.customer.user &&
                    order.customer.user.id === ctx.activeUserId
                );
                const now = +new Date();
                const isWithinAnonymousAccessLimit = now - orderPlaced < anonymousAccessLimit;
                if (
                    (ctx.activeUserId && activeUserMatches) ||
                    (!ctx.activeUserId && isWithinAnonymousAccessLimit)
                ) {
                    return this.orderService.findOne(ctx, order.id);
                }
            }
            // We throw even if the order does not exist, since giving a different response
            // opens the door to an enumeration attack to find valid order codes.
            throw new ForbiddenError();
        }
    }

    @Mutation()
    @Allow(Permission.Owner)
    async setOrderShippingAddress(
        @Ctx() ctx: RequestContext,
        @Args() args: SetOrderShippingAddressMutationArgs,
    ): Promise<Order | undefined> {
        if (ctx.authorizedAsOwnerOnly) {
            const sessionOrder = await this.getOrderFromContext(ctx);
            if (sessionOrder) {
                return this.orderService.setShippingAddress(ctx, sessionOrder.id, args.input);
            } else {
                return;
            }
        }
    }

    @Query()
    @Allow(Permission.Owner)
    async eligibleShippingMethods(@Ctx() ctx: RequestContext): Promise<ShippingMethodQuote[]> {
        if (ctx.authorizedAsOwnerOnly) {
            const sessionOrder = await this.getOrderFromContext(ctx);
            if (sessionOrder) {
                return this.orderService.getEligibleShippingMethods(ctx, sessionOrder.id);
            }
        }
        return [];
    }

    @Mutation()
    @Allow(Permission.Owner)
    @Decode('shippingMethodId')
    async setOrderShippingMethod(
        @Ctx() ctx: RequestContext,
        @Args() args: SetOrderShippingMethodMutationArgs,
    ): Promise<Order | undefined> {
        if (ctx.authorizedAsOwnerOnly) {
            const sessionOrder = await this.getOrderFromContext(ctx);
            if (sessionOrder) {
                return this.orderService.setShippingMethod(ctx, sessionOrder.id, args.shippingMethodId);
            }
        }
    }

    @Query()
    @Allow(Permission.Owner)
    async nextOrderStates(@Ctx() ctx: RequestContext): Promise<string[]> {
        if (ctx.authorizedAsOwnerOnly) {
            const sessionOrder = await this.getOrderFromContext(ctx, true);
            return this.orderService.getNextOrderStates(sessionOrder);
        }
        return [];
    }

    @Mutation()
    @Allow(Permission.Owner)
    async transitionOrderToState(
        @Ctx() ctx: RequestContext,
        @Args() args: TransitionOrderToStateMutationArgs,
    ): Promise<Order | undefined> {
        if (ctx.authorizedAsOwnerOnly) {
            const sessionOrder = await this.getOrderFromContext(ctx, true);
            return this.orderService.transitionToState(ctx, sessionOrder.id, args.state as OrderState);
        }
    }

    @Mutation()
    @Allow(Permission.UpdateOrder, Permission.Owner)
    @Decode('productVariantId')
    async addItemToOrder(
        @Ctx() ctx: RequestContext,
        @Args() args: AddItemToOrderMutationArgs,
    ): Promise<Order> {
        const order = await this.getOrderFromContext(ctx, true);
        return this.orderService.addItemToOrder(ctx, order.id, args.productVariantId, args.quantity);
    }

    @Mutation()
    @Allow(Permission.UpdateOrder, Permission.Owner)
    @Decode('orderItemId')
    async adjustItemQuantity(
        @Ctx() ctx: RequestContext,
        @Args() args: AdjustItemQuantityMutationArgs,
    ): Promise<Order> {
        const order = await this.getOrderFromContext(ctx, true);
        return this.orderService.adjustItemQuantity(ctx, order.id, args.orderItemId, args.quantity);
    }

    @Mutation()
    @Allow(Permission.UpdateOrder, Permission.Owner)
    @Decode('orderItemId')
    async removeItemFromOrder(
        @Ctx() ctx: RequestContext,
        @Args() args: RemoveItemFromOrderMutationArgs,
    ): Promise<Order> {
        const order = await this.getOrderFromContext(ctx, true);
        return this.orderService.removeItemFromOrder(ctx, order.id, args.orderItemId);
    }

    @Mutation()
    @Allow(Permission.UpdateOrder, Permission.Owner)
    async addPaymentToOrder(@Ctx() ctx: RequestContext, @Args() args: AddPaymentToOrderMutationArgs) {
        if (ctx.authorizedAsOwnerOnly) {
            const sessionOrder = await this.getOrderFromContext(ctx);
            if (sessionOrder) {
                const order = await this.orderService.addPaymentToOrder(ctx, sessionOrder.id, args.input);
                if (order.active === false) {
                    const { customer } = order;
                    // If the Customer has no addresses yet, use the shipping address data
                    // to populate the initial default Address.
                    if (customer && (!customer.addresses || customer.addresses.length === 0)) {
                        const address = order.shippingAddress;
                        await this.customerService.createAddress(ctx, customer.id as string, {
                            ...address,
                            streetLine1: address.streetLine1 || '',
                            countryCode: address.countryCode || '',
                            defaultBillingAddress: true,
                            defaultShippingAddress: true,
                        });
                    }
                }
                if (
                    order.active === false &&
                    ctx.session &&
                    ctx.session.activeOrder &&
                    ctx.session.activeOrder.id === sessionOrder.id
                ) {
                    await this.authService.unsetActiveOrder(ctx.session);
                }
                return order;
            }
        }
    }

    @Mutation()
    @Allow(Permission.Owner)
    async setCustomerForOrder(@Ctx() ctx: RequestContext, @Args() args: SetCustomerForOrderMutationArgs) {
        if (ctx.authorizedAsOwnerOnly) {
            const sessionOrder = await this.getOrderFromContext(ctx);
            if (sessionOrder) {
                const customer = await this.customerService.createOrUpdate(args.input);
                return this.orderService.addCustomerToOrder(ctx, sessionOrder.id, customer);
            }
        }
    }

    private async getOrderFromContext(ctx: RequestContext): Promise<Order | undefined>;
    private async getOrderFromContext(ctx: RequestContext, createIfNotExists: true): Promise<Order>;
    private async getOrderFromContext(
        ctx: RequestContext,
        createIfNotExists = false,
    ): Promise<Order | undefined> {
        if (!ctx.session) {
            throw new InternalServerError(`error.no-active-session`);
        }
        let order = ctx.session.activeOrder;
        if (!order) {
            if (ctx.activeUserId) {
                order = (await this.orderService.getActiveOrderForUser(ctx, ctx.activeUserId)) || null;
            }

            if (!order && createIfNotExists) {
                order = await this.orderService.create(ctx, ctx.activeUserId);
            }

            if (order) {
                await this.authService.setActiveOrder(ctx.session, order);
            }
        }
        return order || undefined;
    }
}
