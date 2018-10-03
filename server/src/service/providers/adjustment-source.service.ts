import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    AdjustmentOperation,
    AdjustmentOperationInput,
    AdjustmentSource as ResolvedAdjustmentSource,
    AdjustmentType,
    CreateAdjustmentSourceInput,
    UpdateAdjustmentSourceInput,
} from 'shared/generated-types';
import { omit } from 'shared/omit';
import { pick } from 'shared/pick';
import { ID, PaginatedList } from 'shared/shared-types';
import { assertNever } from 'shared/shared-utils';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound } from '../../common/utils';
import {
    AdjustmentActionArgType,
    AdjustmentActionConfig,
    AdjustmentConditionArgType,
    AdjustmentConditionConfig,
} from '../../config/adjustment/adjustment-types';
import { ConfigService } from '../../config/config.service';
import {
    AdjustmentOperationValues,
    AdjustmentSource,
} from '../../entity/adjustment-source/adjustment-source.entity';
import { I18nError } from '../../i18n/i18n-error';
import { buildListQuery } from '../helpers/build-list-query';
import { patchEntity } from '../helpers/patch-entity';

import { ChannelService } from './channel.service';

@Injectable()
export class AdjustmentSourceService {
    availableConditions: Array<AdjustmentConditionConfig<any>> = [];
    availableActions: Array<AdjustmentActionConfig<any>> = [];

    constructor(
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
        private channelService: ChannelService,
    ) {
        this.availableConditions = this.configService.adjustmentConditions;
        this.availableActions = this.configService.adjustmentActions;
    }

    findAll(
        type: AdjustmentType,
        options?: ListQueryOptions<AdjustmentSource>,
    ): Promise<PaginatedList<ResolvedAdjustmentSource>> {
        return buildListQuery(this.connection, AdjustmentSource, options)
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items: items.map(i => this.asResolvedAdjustmentSource(i)),
                totalItems,
            }));
    }

    async findOne(adjustmentSourceId: ID): Promise<ResolvedAdjustmentSource | undefined> {
        const adjustmentSource = await this.connection.manager.findOne(AdjustmentSource, adjustmentSourceId, {
            relations: [],
        });
        if (adjustmentSource) {
            return this.asResolvedAdjustmentSource(adjustmentSource);
        }
    }

    /**
     * Returns all available AdjustmentOperations.
     */
    getAdjustmentOperations(
        type: AdjustmentType,
    ): {
        conditions: Array<AdjustmentConditionConfig<any>>;
        actions: Array<AdjustmentActionConfig<any>>;
    } {
        return {
            conditions: this.availableConditions.filter(o => o.type === type),
            actions: this.availableActions.filter(o => o.type === type),
        };
    }

    async createAdjustmentSource(
        ctx: RequestContext,
        input: CreateAdjustmentSourceInput,
    ): Promise<ResolvedAdjustmentSource> {
        const adjustmentSource = new AdjustmentSource({
            name: input.name,
            type: input.type,
            conditions: input.conditions.map(c => this.parseOperationArgs('condition', c)),
            actions: input.actions.map(a => this.parseOperationArgs('action', a)),
        });
        this.channelService.assignToChannels(adjustmentSource, ctx);
        const newAdjustmentSource = await this.connection.manager.save(adjustmentSource);
        return assertFound(this.findOne(newAdjustmentSource.id));
    }

    async updateAdjustmentSource(
        ctx: RequestContext,
        input: UpdateAdjustmentSourceInput,
    ): Promise<ResolvedAdjustmentSource> {
        const adjustmentSource = await this.connection.getRepository(AdjustmentSource).findOne(input.id);
        if (!adjustmentSource) {
            throw new I18nError(`error.entity-with-id-not-found`, {
                entityName: 'AdjustmentSource',
                id: input.id,
            });
        }
        const updatedAdjustmentSource = patchEntity(adjustmentSource, omit(input, ['conditions', 'actions']));
        if (input.conditions) {
            updatedAdjustmentSource.conditions = input.conditions.map(c =>
                this.parseOperationArgs('condition', c),
            );
        }
        if (input.actions) {
            updatedAdjustmentSource.actions = input.actions.map(a => this.parseOperationArgs('action', a));
        }
        await this.connection.manager.save(updatedAdjustmentSource);
        return assertFound(this.findOne(updatedAdjustmentSource.id));
    }

    /**
     * The internal entity (AdjustmentSource) differs from the object returned by the GraphQL API (ResolvedAdjustmentSource) in that
     * the external object combines the AdjustmentOperation definition with the argument values. This method augments
     * an AdjustmentSource entity so that it fits the ResolvedAdjustmentSource interface.
     */
    private asResolvedAdjustmentSource(adjustmentSource: AdjustmentSource): ResolvedAdjustmentSource {
        const output = {
            ...pick(adjustmentSource, ['id', 'createdAt', 'updatedAt', 'name', 'type']),
            ...{
                conditions: this.mapOperationValuesToOperation('condition', adjustmentSource.conditions),
                actions: this.mapOperationValuesToOperation('action', adjustmentSource.actions),
            },
        };
        return output;
    }

    private mapOperationValuesToOperation(
        type: 'condition' | 'action',
        values: AdjustmentOperationValues[],
    ): AdjustmentOperation[] {
        return values.map(v => {
            const match = this.getAdjustmentOperationByCode(type, v.code);
            return {
                type: match.type,
                target: match.target,
                code: v.code,
                args: match.args.map((args, i) => ({
                    ...args,
                    value: !!v.args[i] ? v.args[i].toString() : '',
                })),
                description: match.description,
            };
        });
    }

    /**
     * Converts the input values of the "create" and "update" mutations into the format expected by the AdjustmentSource entity.
     */
    private parseOperationArgs(
        type: 'condition' | 'action',
        input: AdjustmentOperationInput,
    ): AdjustmentOperationValues {
        const match = this.getAdjustmentOperationByCode(type, input.code);
        const output: AdjustmentOperationValues = {
            code: input.code,
            args: input.arguments.map((inputArg, i) => {
                return this.castArgument(inputArg, match.args[i].type as any);
            }),
        };
        return output;
    }

    private getAdjustmentOperationByCode(type: 'condition' | 'action', code: string): AdjustmentOperation {
        const available: AdjustmentOperation[] =
            type === 'condition' ? this.availableConditions : this.availableActions;
        const match = available.find(a => a.code === code);
        if (!match) {
            throw new I18nError(`error.adjustment-source-with-code-not-found`, { code });
        }
        return match;
    }

    /**
     * Input arguments are always received as strings, but for certain parameter types they
     * should be cast to a different type.
     */
    private castArgument(
        inputArg: string,
        type: AdjustmentConditionArgType | AdjustmentActionArgType,
    ): string | number {
        switch (type) {
            case 'string':
            case 'datetime':
                return inputArg;
            case 'money':
            case 'int':
            case 'percentage':
                return Number.parseInt(inputArg, 10);
            default:
                assertNever(type);
                return inputArg;
        }
    }
}
