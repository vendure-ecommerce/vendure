import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import {
    ConfigurableOperation,
    ConfigurableOperationInput,
    CreatePromotionInput,
    DeletionResponse,
    DeletionResult,
    UpdatePromotionInput,
} from '../../../../shared/generated-types';
import { omit } from '../../../../shared/omit';
import { ID, PaginatedList } from '../../../../shared/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { configurableDefToOperation } from '../../common/configurable-operation';
import { UserInputError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { PromotionAction } from '../../config/promotion/promotion-action';
import { PromotionCondition } from '../../config/promotion/promotion-condition';
import { Promotion } from '../../entity/promotion/promotion.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { patchEntity } from '../helpers/utils/patch-entity';

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
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
        private channelService: ChannelService,
        private listQueryBuilder: ListQueryBuilder,
    ) {
        this.availableConditions = this.configService.promotionOptions.promotionConditions || [];
        this.availableActions = this.configService.promotionOptions.promotionActions || [];
    }

    findAll(options?: ListQueryOptions<Promotion>): Promise<PaginatedList<Promotion>> {
        return this.listQueryBuilder
            .build(Promotion, options, { where: { deletedAt: null } })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    async findOne(adjustmentSourceId: ID): Promise<Promotion | undefined> {
        return this.connection.manager.findOne(Promotion, adjustmentSourceId, { where: { deletedAt: null } });
    }

    /**
     * Returns all available AdjustmentOperations.
     */
    getAdjustmentOperations(): {
        conditions: ConfigurableOperation[];
        actions: ConfigurableOperation[];
    } {
        return {
            conditions: this.availableConditions.map(configurableDefToOperation),
            actions: this.availableActions.map(configurableDefToOperation),
        };
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

    async createPromotion(ctx: RequestContext, input: CreatePromotionInput): Promise<Promotion> {
        const adjustmentSource = new Promotion({
            name: input.name,
            enabled: input.enabled,
            conditions: input.conditions.map(c => this.parseOperationArgs('condition', c)),
            actions: input.actions.map(a => this.parseOperationArgs('action', a)),
            priorityScore: this.calculatePriorityScore(input),
        });
        this.channelService.assignToChannels(adjustmentSource, ctx);
        const newAdjustmentSource = await this.connection.manager.save(adjustmentSource);
        await this.updatePromotions();
        return assertFound(this.findOne(newAdjustmentSource.id));
    }

    async updatePromotion(ctx: RequestContext, input: UpdatePromotionInput): Promise<Promotion> {
        const adjustmentSource = await getEntityOrThrow(this.connection, Promotion, input.id);
        const updatedAdjustmentSource = patchEntity(adjustmentSource, omit(input, ['conditions', 'actions']));
        if (input.conditions) {
            updatedAdjustmentSource.conditions = input.conditions.map(c =>
                this.parseOperationArgs('condition', c),
            );
        }
        if (input.actions) {
            updatedAdjustmentSource.actions = input.actions.map(a => this.parseOperationArgs('action', a));
        }
        (adjustmentSource.priorityScore = this.calculatePriorityScore(input)),
            await this.connection.manager.save(updatedAdjustmentSource);
        await this.updatePromotions();
        return assertFound(this.findOne(updatedAdjustmentSource.id));
    }

    async softDeletePromotion(promotionId: ID): Promise<DeletionResponse> {
        await getEntityOrThrow(this.connection, Promotion, promotionId);
        await this.connection.getRepository(Promotion).update({ id: promotionId }, { deletedAt: new Date() });
        return {
            result: DeletionResult.DELETED,
        };
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
            description: match.description,
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
