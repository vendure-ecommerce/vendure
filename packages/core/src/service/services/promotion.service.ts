import { Injectable } from '@nestjs/common';
import { ApplyCouponCodeResult } from '@vendure/common/lib/generated-shop-types';
import {
    AssignPromotionsToChannelInput,
    ConfigurableOperation,
    ConfigurableOperationDefinition,
    CreatePromotionInput,
    CreatePromotionResult,
    DeletionResponse,
    DeletionResult,
    RemovePromotionsFromChannelInput,
    UpdatePromotionInput,
    UpdatePromotionResult,
} from '@vendure/common/lib/generated-types';
import { omit } from '@vendure/common/lib/omit';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';

import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/index';
import { ErrorResultUnion, JustErrorResults } from '../../common/error/error-result';
import { IllegalOperationError, UserInputError } from '../../common/error/errors';
import { MissingConditionsError } from '../../common/error/generated-graphql-admin-errors';
import {
    CouponCodeExpiredError,
    CouponCodeInvalidError,
    CouponCodeLimitError,
} from '../../common/error/generated-graphql-shop-errors';
import { AdjustmentSource } from '../../common/types/adjustment-source';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { PromotionAction } from '../../config/promotion/promotion-action';
import { PromotionCondition } from '../../config/promotion/promotion-condition';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Order } from '../../entity/order/order.entity';
import { Promotion } from '../../entity/promotion/promotion.entity';
import { EventBus } from '../../event-bus';
import { PromotionEvent } from '../../event-bus/events/promotion-event';
import { ConfigArgService } from '../helpers/config-arg/config-arg.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { OrderState } from '../helpers/order-state-machine/order-state';
import { patchEntity } from '../helpers/utils/patch-entity';

import { ChannelService } from './channel.service';

/**
 * @description
 * Contains methods relating to {@link Promotion} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class PromotionService {
    availableConditions: PromotionCondition[] = [];
    availableActions: PromotionAction[] = [];

    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private channelService: ChannelService,
        private listQueryBuilder: ListQueryBuilder,
        private configArgService: ConfigArgService,
        private eventBus: EventBus,
    ) {
        this.availableConditions = this.configService.promotionOptions.promotionConditions || [];
        this.availableActions = this.configService.promotionOptions.promotionActions || [];
    }

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Promotion>,
        relations: RelationPaths<Promotion> = [],
    ): Promise<PaginatedList<Promotion>> {
        return this.listQueryBuilder
            .build(Promotion, options, {
                where: { deletedAt: null },
                channelId: ctx.channelId,
                relations,
                ctx,
            })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    async findOne(
        ctx: RequestContext,
        adjustmentSourceId: ID,
        relations: RelationPaths<Promotion> = [],
    ): Promise<Promotion | undefined> {
        return this.connection.findOneInChannel(ctx, Promotion, adjustmentSourceId, ctx.channelId, {
            where: { deletedAt: null },
            relations,
        });
    }

    getPromotionConditions(ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.availableConditions.map(x => x.toGraphQlType(ctx));
    }

    getPromotionActions(ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.availableActions.map(x => x.toGraphQlType(ctx));
    }

    async createPromotion(
        ctx: RequestContext,
        input: CreatePromotionInput,
    ): Promise<ErrorResultUnion<CreatePromotionResult, Promotion>> {
        const conditions = input.conditions.map(c =>
            this.configArgService.parseInput('PromotionCondition', c),
        );
        const actions = input.actions.map(a => this.configArgService.parseInput('PromotionAction', a));
        this.validateRequiredConditions(conditions, actions);
        const promotion = new Promotion({
            name: input.name,
            enabled: input.enabled,
            couponCode: input.couponCode,
            perCustomerUsageLimit: input.perCustomerUsageLimit,
            startsAt: input.startsAt,
            endsAt: input.endsAt,
            conditions,
            actions,
            priorityScore: this.calculatePriorityScore(input),
        });
        if (promotion.conditions.length === 0 && !promotion.couponCode) {
            return new MissingConditionsError();
        }
        await this.channelService.assignToCurrentChannel(promotion, ctx);
        const newPromotion = await this.connection.getRepository(ctx, Promotion).save(promotion);
        this.eventBus.publish(new PromotionEvent(ctx, newPromotion, 'created', input));
        return assertFound(this.findOne(ctx, newPromotion.id));
    }

    async updatePromotion(
        ctx: RequestContext,
        input: UpdatePromotionInput,
    ): Promise<ErrorResultUnion<UpdatePromotionResult, Promotion>> {
        const promotion = await this.connection.getEntityOrThrow(ctx, Promotion, input.id, {
            channelId: ctx.channelId,
        });
        const updatedPromotion = patchEntity(promotion, omit(input, ['conditions', 'actions']));
        if (input.conditions) {
            updatedPromotion.conditions = input.conditions.map(c =>
                this.configArgService.parseInput('PromotionCondition', c),
            );
        }
        if (input.actions) {
            updatedPromotion.actions = input.actions.map(a =>
                this.configArgService.parseInput('PromotionAction', a),
            );
        }
        if (promotion.conditions.length === 0 && !promotion.couponCode) {
            return new MissingConditionsError();
        }
        promotion.priorityScore = this.calculatePriorityScore(input);
        await this.connection.getRepository(ctx, Promotion).save(updatedPromotion, { reload: false });
        this.eventBus.publish(new PromotionEvent(ctx, promotion, 'updated', input));
        return assertFound(this.findOne(ctx, updatedPromotion.id));
    }

    async softDeletePromotion(ctx: RequestContext, promotionId: ID): Promise<DeletionResponse> {
        const promotion = await this.connection.getEntityOrThrow(ctx, Promotion, promotionId);
        await this.connection
            .getRepository(ctx, Promotion)
            .update({ id: promotionId }, { deletedAt: new Date() });
        this.eventBus.publish(new PromotionEvent(ctx, promotion, 'deleted', promotionId));

        return {
            result: DeletionResult.DELETED,
        };
    }

    async assignPromotionsToChannel(
        ctx: RequestContext,
        input: AssignPromotionsToChannelInput,
    ): Promise<Promotion[]> {
        const defaultChannel = await this.channelService.getDefaultChannel(ctx);
        if (!idsAreEqual(ctx.channelId, defaultChannel.id)) {
            throw new IllegalOperationError(`promotion-channels-can-only-be-changed-from-default-channel`);
        }
        const promotions = await this.connection.findByIdsInChannel(
            ctx,
            Promotion,
            input.promotionIds,
            ctx.channelId,
            {},
        );
        for (const promotion of promotions) {
            await this.channelService.assignToChannels(ctx, Promotion, promotion.id, [input.channelId]);
        }
        return promotions;
    }

    async removePromotionsFromChannel(ctx: RequestContext, input: RemovePromotionsFromChannelInput) {
        const defaultChannel = await this.channelService.getDefaultChannel(ctx);
        if (!idsAreEqual(ctx.channelId, defaultChannel.id)) {
            throw new IllegalOperationError(`promotion-channels-can-only-be-changed-from-default-channel`);
        }
        const promotions = await this.connection.findByIdsInChannel(
            ctx,
            Promotion,
            input.promotionIds,
            ctx.channelId,
            {},
        );
        for (const promotion of promotions) {
            await this.channelService.removeFromChannels(ctx, Promotion, promotion.id, [input.channelId]);
        }
        return promotions;
    }

    /**
     * @description
     * Checks the validity of a coupon code, by checking that it is associated with an existing,
     * enabled and non-expired Promotion. Additionally, if there is a usage limit on the coupon code,
     * this method will enforce that limit against the specified Customer.
     */
    async validateCouponCode(
        ctx: RequestContext,
        couponCode: string,
        customerId?: ID,
    ): Promise<JustErrorResults<ApplyCouponCodeResult> | Promotion> {
        const promotion = await this.connection.getRepository(ctx, Promotion).findOne({
            where: {
                couponCode,
                enabled: true,
                deletedAt: null,
            },
            relations: ['channels'],
        });
        if (
            !promotion ||
            promotion.couponCode !== couponCode ||
            !promotion.channels.find(c => idsAreEqual(c.id, ctx.channelId))
        ) {
            return new CouponCodeInvalidError(couponCode);
        }
        if (promotion.endsAt && +promotion.endsAt < +new Date()) {
            return new CouponCodeExpiredError(couponCode);
        }
        if (customerId && promotion.perCustomerUsageLimit != null) {
            const usageCount = await this.countPromotionUsagesForCustomer(ctx, promotion.id, customerId);
            if (promotion.perCustomerUsageLimit <= usageCount) {
                return new CouponCodeLimitError(couponCode, promotion.perCustomerUsageLimit);
            }
        }
        return promotion;
    }

    /**
     * @description
     * Used internally to associate a Promotion with an Order, once an Order has been placed.
     */
    async addPromotionsToOrder(ctx: RequestContext, order: Order): Promise<Order> {
        const allPromotionIds = order.discounts.map(
            a => AdjustmentSource.decodeSourceId(a.adjustmentSource).id,
        );
        const promotionIds = unique(allPromotionIds);
        const promotions = await this.connection.getRepository(ctx, Promotion).findByIds(promotionIds);
        order.promotions = promotions;
        return this.connection.getRepository(ctx, Order).save(order);
    }

    private async countPromotionUsagesForCustomer(
        ctx: RequestContext,
        promotionId: ID,
        customerId: ID,
    ): Promise<number> {
        const qb = this.connection
            .getRepository(ctx, Order)
            .createQueryBuilder('order')
            .leftJoin('order.promotions', 'promotion')
            .where('promotion.id = :promotionId', { promotionId })
            .andWhere('order.customer = :customerId', { customerId })
            .andWhere('order.state != :state', { state: 'Cancelled' as OrderState });

        return qb.getCount();
    }

    private calculatePriorityScore(input: CreatePromotionInput | UpdatePromotionInput): number {
        const conditions = input.conditions
            ? input.conditions.map(c => this.configArgService.getByCode('PromotionCondition', c.code))
            : [];
        const actions = input.actions
            ? input.actions.map(c => this.configArgService.getByCode('PromotionAction', c.code))
            : [];
        return [...conditions, ...actions].reduce((score, op) => score + op.priorityValue, 0);
    }

    private validateRequiredConditions(
        conditions: ConfigurableOperation[],
        actions: ConfigurableOperation[],
    ) {
        const conditionCodes: Record<string, string> = conditions.reduce(
            (codeMap, { code }) => ({ ...codeMap, [code]: code }),
            {},
        );
        for (const { code: actionCode } of actions) {
            const actionDef = this.configArgService.getByCode('PromotionAction', actionCode);
            const actionDependencies: PromotionCondition[] = actionDef.conditions || [];
            if (!actionDependencies || actionDependencies.length === 0) {
                continue;
            }
            const missingConditions = actionDependencies.filter(condition => !conditionCodes[condition.code]);
            if (missingConditions.length) {
                throw new UserInputError('error.conditions-required-for-action', {
                    action: actionCode,
                    conditions: missingConditions.map(c => c.code).join(', '),
                });
            }
        }
    }
}
