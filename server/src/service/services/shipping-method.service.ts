import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import {
    AdjustmentOperation,
    AdjustmentOperationInput,
    CreateShippingMethodInput,
    UpdateShippingMethodInput,
} from '../../../../shared/generated-types';
import { omit } from '../../../../shared/omit';
import { ID, PaginatedList } from '../../../../shared/shared-types';
import { EntityNotFoundError, UserInputError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { ShippingCalculator } from '../../config/shipping-method/shipping-calculator';
import { ShippingEligibilityChecker } from '../../config/shipping-method/shipping-eligibility-checker';
import { Channel } from '../../entity/channel/channel.entity';
import { ShippingMethod } from '../../entity/shipping-method/shipping-method.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { patchEntity } from '../helpers/utils/patch-entity';

import { ChannelService } from './channel.service';

@Injectable()
export class ShippingMethodService {
    shippingEligibilityCheckers: ShippingEligibilityChecker[];
    shippingCalculators: ShippingCalculator[];
    private activeShippingMethods: ShippingMethod[];

    constructor(
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
        private listQueryBuilder: ListQueryBuilder,
        private channelService: ChannelService,
    ) {
        this.shippingEligibilityCheckers =
            this.configService.shippingOptions.shippingEligibilityCheckers || [];
        this.shippingCalculators = this.configService.shippingOptions.shippingCalculators || [];
    }

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
            checker: this.parseOperationArgs(input.checker, this.getChecker(input.checker.code)),
            calculator: this.parseOperationArgs(input.calculator, this.getCalculator(input.calculator.code)),
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
            updatedShippingMethod.checker = this.parseOperationArgs(
                input.checker,
                this.getChecker(input.checker.code),
            );
        }
        if (input.calculator) {
            updatedShippingMethod.calculator = this.parseOperationArgs(
                input.calculator,
                this.getCalculator(input.calculator.code),
            );
        }
        await this.connection.manager.save(updatedShippingMethod);
        await this.updateActiveShippingMethods();
        return assertFound(this.findOne(shippingMethod.id));
    }

    getShippingEligibilityCheckers(): AdjustmentOperation[] {
        return this.shippingEligibilityCheckers.map(this.toAdjustmentOperation);
    }

    getShippingCalculators(): AdjustmentOperation[] {
        return this.shippingCalculators.map(this.toAdjustmentOperation);
    }

    getActiveShippingMethods(channel: Channel): ShippingMethod[] {
        return this.activeShippingMethods.filter(sm => sm.channels.find(c => c.id === channel.id));
    }

    private toAdjustmentOperation(source: ShippingCalculator | ShippingEligibilityChecker) {
        return {
            code: source.code,
            description: source.description,
            args: Object.entries(source.args).map(([name, type]) => ({ name, type })),
        };
    }

    /**
     * Converts the input values of the "create" and "update" mutations into the format expected by the ShippingMethod entity.
     */
    private parseOperationArgs(
        input: AdjustmentOperationInput,
        adjustmentSource: ShippingEligibilityChecker | ShippingCalculator,
    ): AdjustmentOperation {
        const output: AdjustmentOperation = {
            code: input.code,
            description: adjustmentSource.description,
            args: input.arguments.map((inputArg, i) => {
                return {
                    name: inputArg.name,
                    type: adjustmentSource.args[inputArg.name],
                    value: inputArg.value,
                };
            }),
        };
        return output;
    }

    private getChecker(code: string): ShippingEligibilityChecker {
        const match = this.shippingEligibilityCheckers.find(a => a.code === code);
        if (!match) {
            throw new UserInputError(`error.shipping-eligibility-checker-with-code-not-found`, { code });
        }
        return match;
    }

    private getCalculator(code: string): ShippingCalculator {
        const match = this.shippingCalculators.find(a => a.code === code);
        if (!match) {
            throw new UserInputError(`error.shipping-calculator-with-code-not-found`, { code });
        }
        return match;
    }

    private async updateActiveShippingMethods() {
        this.activeShippingMethods = await this.connection.getRepository(ShippingMethod).find({
            relations: ['channels'],
        });
    }
}
