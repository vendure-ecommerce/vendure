import { Injectable } from '@nestjs/common';
import {
    ConfigurableOperationDefinition,
    CreateShippingMethodInput,
    DeletionResponse,
    DeletionResult,
    UpdateShippingMethodInput,
} from '@vendure/common/lib/generated-types';
import { omit } from '@vendure/common/lib/omit';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { EntityNotFoundError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { Channel } from '../../entity/channel/channel.entity';
import { ShippingMethodTranslation } from '../../entity/shipping-method/shipping-method-translation.entity';
import { ShippingMethod } from '../../entity/shipping-method/shipping-method.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { ShippingConfiguration } from '../helpers/shipping-configuration/shipping-configuration';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { patchEntity } from '../helpers/utils/patch-entity';
import { translateDeep } from '../helpers/utils/translate-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

import { ChannelService } from './channel.service';

@Injectable()
export class ShippingMethodService {
    private activeShippingMethods: ShippingMethod[];

    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private listQueryBuilder: ListQueryBuilder,
        private channelService: ChannelService,
        private shippingConfiguration: ShippingConfiguration,
        private translatableSaver: TranslatableSaver,
    ) {}

    async initShippingMethods() {
        await this.updateActiveShippingMethods(RequestContext.empty());
    }

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<ShippingMethod>,
    ): Promise<PaginatedList<ShippingMethod>> {
        return this.listQueryBuilder
            .build(ShippingMethod, options, {
                relations: ['channels'],
                where: { deletedAt: null },
                channelId: ctx.channelId,
                ctx,
            })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items: items.map(i => translateDeep(i, ctx.languageCode)),
                totalItems,
            }));
    }

    async findOne(ctx: RequestContext, shippingMethodId: ID): Promise<ShippingMethod | undefined> {
        const shippingMethod = await this.connection.findOneInChannel(
            ctx,
            ShippingMethod,
            shippingMethodId,
            ctx.channelId,
            {
                relations: ['channels'],
                where: { deletedAt: null },
            },
        );
        return shippingMethod && translateDeep(shippingMethod, ctx.languageCode);
    }

    async create(ctx: RequestContext, input: CreateShippingMethodInput): Promise<ShippingMethod> {
        const shippingMethod = await this.translatableSaver.create({
            ctx,
            input,
            entityType: ShippingMethod,
            translationType: ShippingMethodTranslation,
            beforeSave: method => {
                method.checker = this.shippingConfiguration.parseCheckerInput(input.checker);
                method.calculator = this.shippingConfiguration.parseCalculatorInput(input.calculator);
            },
        });
        this.channelService.assignToCurrentChannel(shippingMethod, ctx);
        const newShippingMethod = await this.connection
            .getRepository(ctx, ShippingMethod)
            .save(shippingMethod);
        await this.updateActiveShippingMethods(ctx);
        return assertFound(this.findOne(ctx, newShippingMethod.id));
    }

    async update(ctx: RequestContext, input: UpdateShippingMethodInput): Promise<ShippingMethod> {
        const shippingMethod = await this.findOne(ctx, input.id);
        if (!shippingMethod) {
            throw new EntityNotFoundError('ShippingMethod', input.id);
        }
        const updatedShippingMethod = await this.translatableSaver.update({
            ctx,
            input: omit(input, ['checker', 'calculator']),
            entityType: ShippingMethod,
            translationType: ShippingMethodTranslation,
        });
        if (input.checker) {
            updatedShippingMethod.checker = this.shippingConfiguration.parseCheckerInput(input.checker);
        }
        if (input.calculator) {
            updatedShippingMethod.calculator = this.shippingConfiguration.parseCalculatorInput(
                input.calculator,
            );
        }
        await this.connection
            .getRepository(ctx, ShippingMethod)
            .save(updatedShippingMethod, { reload: false });
        await this.updateActiveShippingMethods(ctx);
        return assertFound(this.findOne(ctx, shippingMethod.id));
    }

    async softDelete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const shippingMethod = await this.connection.getEntityOrThrow(ctx, ShippingMethod, id, {
            channelId: ctx.channelId,
            where: { deletedAt: null },
        });
        shippingMethod.deletedAt = new Date();
        await this.connection.getRepository(ctx, ShippingMethod).save(shippingMethod, { reload: false });
        await this.updateActiveShippingMethods(ctx);
        return {
            result: DeletionResult.DELETED,
        };
    }

    getShippingEligibilityCheckers(ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.shippingConfiguration.shippingEligibilityCheckers.map(x => x.toGraphQlType(ctx));
    }

    getShippingCalculators(ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.shippingConfiguration.shippingCalculators.map(x => x.toGraphQlType(ctx));
    }

    getActiveShippingMethods(channel: Channel): ShippingMethod[] {
        return this.activeShippingMethods.filter(sm => sm.channels.find(c => c.id === channel.id));
    }

    private async updateActiveShippingMethods(ctx: RequestContext) {
        const activeShippingMethods = await this.connection.getRepository(ctx, ShippingMethod).find({
            relations: ['channels'],
            where: { deletedAt: null },
        });
        this.activeShippingMethods = activeShippingMethods.map(m => translateDeep(m, ctx.languageCode));
    }
}
