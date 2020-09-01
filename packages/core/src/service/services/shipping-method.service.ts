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
import { ShippingMethod } from '../../entity/shipping-method/shipping-method.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { ShippingConfiguration } from '../helpers/shipping-configuration/shipping-configuration';
import { findOneInChannel } from '../helpers/utils/channel-aware-orm-utils';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { patchEntity } from '../helpers/utils/patch-entity';
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
    ) {}

    async initShippingMethods() {
        await this.updateActiveShippingMethods();
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
            })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(ctx: RequestContext, shippingMethodId: ID): Promise<ShippingMethod | undefined> {
        return findOneInChannel(this.connection, ShippingMethod, shippingMethodId, ctx.channelId, {
            relations: ['channels'],
            where: { deletedAt: null },
        });
    }

    async create(ctx: RequestContext, input: CreateShippingMethodInput): Promise<ShippingMethod> {
        const shippingMethod = new ShippingMethod({
            code: input.code,
            description: input.description,
            checker: this.shippingConfiguration.parseCheckerInput(input.checker),
            calculator: this.shippingConfiguration.parseCalculatorInput(input.calculator),
        });
        this.channelService.assignToCurrentChannel(shippingMethod, ctx);
        const newShippingMethod = await this.connection.getRepository(ShippingMethod).save(shippingMethod);
        await this.updateActiveShippingMethods();
        return assertFound(this.findOne(ctx, newShippingMethod.id));
    }

    async update(ctx: RequestContext, input: UpdateShippingMethodInput): Promise<ShippingMethod> {
        const shippingMethod = await this.findOne(ctx, input.id);
        if (!shippingMethod) {
            throw new EntityNotFoundError('ShippingMethod', input.id);
        }
        const updatedShippingMethod = patchEntity(shippingMethod, omit(input, ['checker', 'calculator']));
        if (input.checker) {
            updatedShippingMethod.checker = this.shippingConfiguration.parseCheckerInput(input.checker);
        }
        if (input.calculator) {
            updatedShippingMethod.calculator = this.shippingConfiguration.parseCalculatorInput(
                input.calculator,
            );
        }
        await this.connection.getRepository(ShippingMethod).save(updatedShippingMethod, { reload: false });
        await this.updateActiveShippingMethods();
        return assertFound(this.findOne(ctx, shippingMethod.id));
    }

    async softDelete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const shippingMethod = await getEntityOrThrow(this.connection, ShippingMethod, id, ctx.channelId, {
            where: { deletedAt: null },
        });
        shippingMethod.deletedAt = new Date();
        await this.connection.getRepository(ShippingMethod).save(shippingMethod, { reload: false });
        await this.updateActiveShippingMethods();
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

    private async updateActiveShippingMethods() {
        this.activeShippingMethods = await this.connection.getRepository(ShippingMethod).find({
            relations: ['channels'],
            where: { deletedAt: null },
        });
    }
}
