import { Injectable } from '@nestjs/common';
import { ApplyCouponCodeResult } from '@vendure/common/lib/generated-shop-types';
import {
    Adjustment,
    AdjustmentType,
    ConfigurableOperation,
    ConfigurableOperationDefinition,
    ConfigurableOperationInput,
    CreatePromotionInput,
    CreatePromotionResult,
    DeletionResponse,
    DeletionResult,
    UpdatePromotionInput,
    UpdatePromotionResult,
} from '@vendure/common/lib/generated-types';
import { omit } from '@vendure/common/lib/omit';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';

import { RequestContext } from '../../api/common/request-context';
import { ErrorResultUnion, JustErrorResults } from '../../common/error/error-result';
import { UserInputError } from '../../common/error/errors';
import { MissingConditionsError } from '../../common/error/generated-graphql-admin-errors';
import {
    CouponCodeExpiredError,
    CouponCodeInvalidError,
    CouponCodeLimitError,
} from '../../common/error/generated-graphql-shop-errors';
import { AdjustmentSource } from '../../common/types/adjustment-source';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { PromotionAction } from '../../config/promotion/promotion-action';
import { PromotionCondition } from '../../config/promotion/promotion-condition';
import { Order } from '../../entity/order/order.entity';
import { Promotion } from '../../entity/promotion/promotion.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { patchEntity } from '../helpers/utils/patch-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

import { ChannelService } from './channel.service';

@Injectable()
export class PromotionService {
    availableConditions: PromotionCondition[] = [];
    availableActions: PromotionAction[] = [];
    /**
     * All active AdjustmentSources are cached in memory becuase they are needed
     * every time an order is changed, which will happen often. Caching them means
     * a DB call is not required newly each time.
     */
    private activePromotions: Promotion[] = [];

    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private channelService: ChannelService,
        private listQueryBuilder: ListQueryBuilder,
    ) {
        this.availableConditions = this.configService.promotionOptions.promotionConditions || [];
        this.availableActions = this.configService.promotionOptions.promotionActions || [];
    }

    findAll(ctx: RequestContext, options?: ListQueryOptions<Promotion>): Promise<PaginatedList<Promotion>> {
        return this.listQueryBuilder
            .build(Promotion, options, {
                where: { deletedAt: null },
                channelId: ctx.channelId,
                relations: ['channels'],
                ctx,
            })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    async findOne(ctx: RequestContext, adjustmentSourceId: ID): Promise<Promotion | undefined> {
        return this.connection.findOneInChannel(ctx, Promotion, adjustmentSourceId, ctx.channelId, {
            where: { deletedAt: null },
        });
    }

    getPromotionConditions(ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.availableConditions.map(x => x.toGraphQlType(ctx));
    }

    getPromotionActions(ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.availableActions.map(x => x.toGraphQlType(ctx));
    }

    /**
     * Returns all active AdjustmentSources.
     */
    async getActivePromotions(): Promise<Promotion[]> {
        if (!this.activePromotions.length) {
            await this.updatePromotions();
        }
        return this.activePromotions;
    }

    async createPromotion(
        ctx: RequestContext,
        input: CreatePromotionInput,
    ): Promise<ErrorResultUnion<CreatePromotionResult, Promotion>> {
        const promotion = new Promotion({
            name: input.name,
            enabled: input.enabled,
            couponCode: input.couponCode,
            perCustomerUsageLimit: input.perCustomerUsageLimit,
            startsAt: input.startsAt,
            endsAt: input.endsAt,
            conditions: input.conditions.map(c => this.parseOperationArgs('condition', c)),
            actions: input.actions.map(a => this.parseOperationArgs('action', a)),
            priorityScore: this.calculatePriorityScore(input),
        });
        if (promotion.conditions.length === 0 && !promotion.couponCode) {
            return new MissingConditionsError();
        }
        this.channelService.assignToCurrentChannel(promotion, ctx);
        const newPromotion = await this.connection.getRepository(ctx, Promotion).save(promotion);
        await this.updatePromotions();
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
            updatedPromotion.conditions = input.conditions.map(c => this.parseOperationArgs('condition', c));
        }
        if (input.actions) {
            updatedPromotion.actions = input.actions.map(a => this.parseOperationArgs('action', a));
        }
        if (promotion.conditions.length === 0 && !promotion.couponCode) {
            return new MissingConditionsError();
        }
        promotion.priorityScore = this.calculatePriorityScore(input);
        await this.connection.getRepository(ctx, Promotion).save(updatedPromotion, { reload: false });
        await this.updatePromotions();
        return assertFound(this.findOne(ctx, updatedPromotion.id));
    }

    async softDeletePromotion(ctx: RequestContext, promotionId: ID): Promise<DeletionResponse> {
        await this.connection.getEntityOrThrow(ctx, Promotion, promotionId);
        await this.connection
            .getRepository(ctx, Promotion)
            .update({ id: promotionId }, { deletedAt: new Date() });
        return {
            result: DeletionResult.DELETED,
        };
    }

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
        });
        if (!promotion) {
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
            .andWhere('order.customer = :customerId', { customerId });

        return qb.getCount();
    }
    /**
     * Converts the input values of the "create" and "update" mutations into the format expected by the AdjustmentSource entity.
     */
    private parseOperationArgs(
        type: 'condition' | 'action',
        input: ConfigurableOperationInput,
    ): ConfigurableOperation {
        const match = this.getAdjustmentOperationByCode(type, input.code);
        const output: ConfigurableOperation = {
            code: input.code,
            args: input.arguments,
        };
        return output;
    }

    private calculatePriorityScore(input: CreatePromotionInput | UpdatePromotionInput): number {
        const conditions = input.conditions
            ? input.conditions.map(c => this.getAdjustmentOperationByCode('condition', c.code))
            : [];
        const actions = input.actions
            ? input.actions.map(c => this.getAdjustmentOperationByCode('action', c.code))
            : [];
        return [...conditions, ...actions].reduce((score, op) => score + op.priorityValue, 0);
    }

    private getAdjustmentOperationByCode(
        type: 'condition' | 'action',
        code: string,
    ): PromotionCondition | PromotionAction {
        const available: Array<PromotionAction | PromotionCondition> =
            type === 'condition' ? this.availableConditions : this.availableActions;
        const match = available.find(a => a.code === code);
        if (!match) {
            throw new UserInputError(`error.adjustment-operation-with-code-not-found`, { code });
        }
        return match;
    }

    /**
     * Update the activeSources cache.
     */
    private async updatePromotions() {
        this.activePromotions = await this.connection.getRepository(Promotion).find({
            where: { enabled: true },
        });
    }
}
