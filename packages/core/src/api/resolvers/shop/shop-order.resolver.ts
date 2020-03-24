import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    MutationAddItemToOrderArgs,
    MutationAddPaymentToOrderArgs,
    MutationAdjustOrderLineArgs,
    MutationApplyCouponCodeArgs,
    MutationRemoveOrderLineArgs,
    MutationSetCustomerForOrderArgs,
    MutationSetOrderShippingAddressArgs,
    MutationSetOrderShippingMethodArgs,
    MutationTransitionOrderToStateArgs,
    Permission,
    QueryOrderArgs,
    QueryOrderByCodeArgs,
    ShippingMethodQuote,
} from '@vendure/common/lib/generated-shop-types';
import { QueryCountriesArgs } from '@vendure/common/lib/generated-types';
import ms from 'ms';

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
        @Args() args: QueryCountriesArgs,
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
    async order(@Ctx() ctx: RequestContext, @Args() args: QueryOrderArgs): Promise<Order | undefined> {
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
        @Args() args: QueryOrderByCodeArgs,
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
        @Args() args: MutationSetOrderShippingAddressArgs,
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
    async setOrderShippingMethod(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationSetOrderShippingMethodArgs,
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
        @Args() args: MutationTransitionOrderToStateArgs,
    ): Promise<Order | undefined> {
        if (ctx.authorizedAsOwnerOnly) {
            const sessionOrder = await this.getOrderFromContext(ctx, true);
            return this.orderService.transitionToState(ctx, sessionOrder.id, args.state as OrderState);
        }
    }

    @Mutation()
    @Allow(Permission.UpdateOrder, Permission.Owner)
    async addItemToOrder(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationAddItemToOrderArgs,
    ): Promise<Order> {
        const order = await this.getOrderFromContext(ctx, true);
        return this.orderService.addItemToOrder(
            ctx,
            order.id,
            args.productVariantId,
            args.quantity,
            (args as any).customFields,
        );
    }

    @Mutation()
    @Allow(Permission.UpdateOrder, Permission.Owner)
    async adjustOrderLine(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationAdjustOrderLineArgs,
    ): Promise<Order> {
        const order = await this.getOrderFromContext(ctx, true);
        return this.orderService.adjustOrderLine(
            ctx,
            order.id,
            args.orderLineId,
            args.quantity,
            (args as any).customFields,
        );
    }

    @Mutation()
    @Allow(Permission.UpdateOrder, Permission.Owner)
    async removeOrderLine(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationRemoveOrderLineArgs,
    ): Promise<Order> {
        const order = await this.getOrderFromContext(ctx, true);
        return this.orderService.removeItemFromOrder(ctx, order.id, args.orderLineId);
    }

    @Mutation()
    @Allow(Permission.UpdateOrder, Permission.Owner)
    async applyCouponCode(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationApplyCouponCodeArgs,
    ): Promise<Order> {
        const order = await this.getOrderFromContext(ctx, true);
        return this.orderService.applyCouponCode(ctx, order.id, args.couponCode);
    }

    @Mutation()
    @Allow(Permission.UpdateOrder, Permission.Owner)
    async removeCouponCode(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationApplyCouponCodeArgs,
    ): Promise<Order> {
        const order = await this.getOrderFromContext(ctx, true);
        return this.orderService.removeCouponCode(ctx, order.id, args.couponCode);
    }

    @Mutation()
    @Allow(Permission.UpdateOrder, Permission.Owner)
    async addPaymentToOrder(@Ctx() ctx: RequestContext, @Args() args: MutationAddPaymentToOrderArgs) {
        if (ctx.authorizedAsOwnerOnly) {
            const sessionOrder = await this.getOrderFromContext(ctx);
            if (sessionOrder) {
                const order = await this.orderService.addPaymentToOrder(ctx, sessionOrder.id, args.input);
                if (order.active === false) {
                    if (order.customer) {
                        const addresses = await this.customerService.findAddressesByCustomerId(
                            ctx,
                            order.customer.id,
                        );
                        // If the Customer has no addresses yet, use the shipping address data
                        // to populate the initial default Address.
                        if (addresses.length === 0) {
                            const address = order.shippingAddress;
                            await this.customerService.createAddress(ctx, order.customer.id as string, {
                                ...address,
                                streetLine1: address.streetLine1 || '',
                                streetLine2: address.streetLine2 || '',
                                countryCode: address.countryCode || '',
                                defaultBillingAddress: true,
                                defaultShippingAddress: true,
                            });
                        }
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
    async setCustomerForOrder(@Ctx() ctx: RequestContext, @Args() args: MutationSetCustomerForOrderArgs) {
        if (ctx.authorizedAsOwnerOnly) {
            const sessionOrder = await this.getOrderFromContext(ctx);
            if (sessionOrder) {
                const customer = await this.customerService.createOrUpdate(args.input, true);
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
        if (order && order.active === false) {
            // edge case where an inactive order may not have been
            // removed from the session, i.e. the regular process was interrupted
            await this.authService.unsetActiveOrder(ctx.session);
            order = null;
        }
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
