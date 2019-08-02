import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    ConfigurableOperation,
    CreateShippingMethodInput,
    UpdateShippingMethodInput,
} from '@vendure/common/lib/generated-types';
import { omit } from '@vendure/common/lib/omit';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';

import { configurableDefToOperation } from '../../common/configurable-operation';
import { EntityNotFoundError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { Channel } from '../../entity/channel/channel.entity';
import { ShippingMethod } from '../../entity/shipping-method/shipping-method.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { ShippingConfiguration } from '../helpers/shipping-configuration/shipping-configuration';
import { patchEntity } from '../helpers/utils/patch-entity';

import { ChannelService } from './channel.service';

@Injectable()
export class ShippingMethodService {
    private activeShippingMethods: ShippingMethod[];

    constructor(
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
        private listQueryBuilder: ListQueryBuilder,
        private channelService: ChannelService,
        private shippingConfiguration: ShippingConfiguration,
    ) {}

    async initShippingMethods() {
        await this.updateActiveShippingMethods();
    }

    findAll(options?: ListQueryOptions<ShippingMethod>): Promise<PaginatedList<ShippingMethod>> {
        return this.listQueryBuilder
            .build(ShippingMethod, options, { relations: ['channels'] })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(shippingMethodId: ID): Promise<ShippingMethod | undefined> {
        return this.connection.manager.findOne(ShippingMethod, shippingMethodId, {
            relations: ['channels'],
        });
    }

    async create(input: CreateShippingMethodInput): Promise<ShippingMethod> {
        const shippingMethod = new ShippingMethod({
            code: input.code,
            description: input.description,
            checker: this.shippingConfiguration.parseCheckerInput(input.checker),
            calculator: this.shippingConfiguration.parseCalculatorInput(input.calculator),
        });
        shippingMethod.channels = [this.channelService.getDefaultChannel()];
        const newShippingMethod = await this.connection.manager.save(shippingMethod);
        await this.updateActiveShippingMethods();
        return assertFound(this.findOne(newShippingMethod.id));
    }

    async update(input: UpdateShippingMethodInput): Promise<ShippingMethod> {
        const shippingMethod = await this.findOne(input.id);
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
        await this.connection.manager.save(updatedShippingMethod);
        await this.updateActiveShippingMethods();
        return assertFound(this.findOne(shippingMethod.id));
    }

    getShippingEligibilityCheckers(): ConfigurableOperation[] {
        return this.shippingConfiguration.shippingEligibilityCheckers.map(configurableDefToOperation);
    }

    getShippingCalculators(): ConfigurableOperation[] {
        return this.shippingConfiguration.shippingCalculators.map(configurableDefToOperation);
    }

    getActiveShippingMethods(channel: Channel): ShippingMethod[] {
        return this.activeShippingMethods.filter(sm => sm.channels.find(c => c.id === channel.id));
    }

    private async updateActiveShippingMethods() {
        this.activeShippingMethods = await this.connection.getRepository(ShippingMethod).find({
            relations: ['channels'],
        });
    }
}
