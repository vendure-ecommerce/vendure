import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    AdjustmentOperation,
    AdjustmentOperationInput,
    AdjustmentType,
    CreateAdjustmentSourceInput,
    UpdateAdjustmentSourceInput,
} from 'shared/generated-types';
import { omit } from 'shared/omit';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound } from '../../common/utils';
import {
    AdjustmentActionDefinition,
    AdjustmentConditionDefinition,
} from '../../config/adjustment/adjustment-types';
import { ConfigService } from '../../config/config.service';
import { AdjustmentSource } from '../../entity/adjustment-source/adjustment-source.entity';
import { I18nError } from '../../i18n/i18n-error';
import { buildListQuery } from '../helpers/build-list-query';
import { patchEntity } from '../helpers/patch-entity';

import { ChannelService } from './channel.service';

@Injectable()
export class AdjustmentSourceService {
    availableConditions: AdjustmentConditionDefinition[] = [];
    availableActions: AdjustmentActionDefinition[] = [];
    /**
     * All active AdjustmentSources are cached in memory becuase they are needed
     * every time an order is changed, which will happen often. Caching them means
     * a DB call is not required newly each time.
     */
    private activeSources: AdjustmentSource[] = [];

    constructor(
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
        private channelService: ChannelService,
    ) {
        this.availableConditions = this.configService.adjustmentConditions;
        this.availableActions = this.configService.adjustmentActions;
    }

    findAll(options?: ListQueryOptions<AdjustmentSource>): Promise<PaginatedList<AdjustmentSource>> {
        return buildListQuery(this.connection, AdjustmentSource, options)
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    async findOne(adjustmentSourceId: ID): Promise<AdjustmentSource | undefined> {
        return this.connection.manager.findOne(AdjustmentSource, adjustmentSourceId, {
            relations: [],
        });
    }

    /**
     * Returns all available AdjustmentOperations.
     */
    getAdjustmentOperations(
        type: AdjustmentType,
    ): {
        conditions: AdjustmentConditionDefinition[];
        actions: AdjustmentActionDefinition[];
    } {
        return {
            conditions: this.availableConditions.filter(o => o.type === type),
            actions: this.availableActions.filter(o => o.type === type),
        };
    }

    /**
     * Returns all active AdjustmentSources.
     */
    async getActiveAdjustmentSources(): Promise<AdjustmentSource[]> {
        if (!this.activeSources.length) {
            await this.updateActiveSources();
        }
        return this.activeSources;
    }

    async createAdjustmentSource(
        ctx: RequestContext,
        input: CreateAdjustmentSourceInput,
    ): Promise<AdjustmentSource> {
        const adjustmentSource = new AdjustmentSource({
            name: input.name,
            type: input.type,
            enabled: input.enabled,
            conditions: input.conditions.map(c => this.parseOperationArgs('condition', c)),
            actions: input.actions.map(a => this.parseOperationArgs('action', a)),
        });
        this.channelService.assignToChannels(adjustmentSource, ctx);
        const newAdjustmentSource = await this.connection.manager.save(adjustmentSource);
        await this.updateActiveSources();
        return assertFound(this.findOne(newAdjustmentSource.id));
    }

    async updateAdjustmentSource(
        ctx: RequestContext,
        input: UpdateAdjustmentSourceInput,
    ): Promise<AdjustmentSource> {
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
        await this.updateActiveSources();
        return assertFound(this.findOne(updatedAdjustmentSource.id));
    }

    /**
     * Converts the input values of the "create" and "update" mutations into the format expected by the AdjustmentSource entity.
     */
    private parseOperationArgs(
        type: 'condition' | 'action',
        input: AdjustmentOperationInput,
    ): AdjustmentOperation {
        const match = this.getAdjustmentOperationByCode(type, input.code);
        const output: AdjustmentOperation = {
            code: input.code,
            type: match.type,
            description: match.description,
            args: input.arguments.map((inputArg, i) => {
                return {
                    name: match.args[i].name,
                    type: match.args[i].type,
                    value: inputArg,
                };
            }),
        };
        return output;
    }

    private getAdjustmentOperationByCode(type: 'condition' | 'action', code: string): AdjustmentOperation {
        const available: AdjustmentOperation[] =
            type === 'condition' ? this.availableConditions : this.availableActions;
        const match = available.find(a => a.code === code);
        if (!match) {
            throw new I18nError(`error.adjustment-operation-with-code-not-found`, { code });
        }
        return match;
    }

    /**
     * Update the activeSources cache.
     */
    private async updateActiveSources() {
        this.activeSources = await this.connection.getRepository(AdjustmentSource).find({
            where: { enabled: true },
        });
    }
}
