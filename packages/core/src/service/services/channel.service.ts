import { Injectable } from '@nestjs/common';
import {
    CreateChannelInput,
    CreateChannelResult,
    CurrencyCode,
    DeletionResponse,
    DeletionResult,
    UpdateChannelInput,
    UpdateChannelResult,
} from '@vendure/common/lib/generated-types';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { ID, Type } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';

import { RequestContext } from '../../api/common/request-context';
import { ErrorResultUnion, isGraphQlErrorResult } from '../../common/error/error-result';
import { ChannelNotFoundError, EntityNotFoundError, InternalServerError } from '../../common/error/errors';
import { LanguageNotAvailableError } from '../../common/error/generated-graphql-admin-errors';
import { ChannelAware } from '../../common/types/common-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { VendureEntity } from '../../entity/base/base.entity';
import { Channel } from '../../entity/channel/channel.entity';
import { ProductVariantPrice } from '../../entity/product-variant/product-variant-price.entity';
import { Zone } from '../../entity/zone/zone.entity';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { patchEntity } from '../helpers/utils/patch-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

import { GlobalSettingsService } from './global-settings.service';

@Injectable()
export class ChannelService {
    private allChannels: Channel[] = [];

    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private globalSettingsService: GlobalSettingsService,
        private customFieldRelationService: CustomFieldRelationService,
    ) {}

    /**
     * When the app is bootstrapped, ensure a default Channel exists and populate the
     * channel lookup array.
     */
    async initChannels() {
        await this.ensureDefaultChannelExists();
        await this.updateAllChannels();
    }

    /**
     * Assigns a ChannelAware entity to the default Channel as well as any channel
     * specified in the RequestContext.
     */
    assignToCurrentChannel<T extends ChannelAware>(entity: T, ctx: RequestContext): T {
        const channelIds = unique([ctx.channelId, this.getDefaultChannel().id]);
        entity.channels = channelIds.map(id => ({ id })) as any;
        return entity;
    }

    /**
     * Assigns the entity to the given Channels and saves.
     */
    async assignToChannels<T extends ChannelAware & VendureEntity>(
        ctx: RequestContext,
        entityType: Type<T>,
        entityId: ID,
        channelIds: ID[],
    ): Promise<T> {
        const entity = await this.connection.getEntityOrThrow(ctx, entityType, entityId, {
            relations: ['channels'],
        });
        for (const id of channelIds) {
            const channel = await this.connection.getEntityOrThrow(ctx, Channel, id);
            entity.channels.push(channel);
        }
        await this.connection.getRepository(ctx, entityType).save(entity as any, { reload: false });
        return entity;
    }

    /**
     * Removes the entity from the given Channels and saves.
     */
    async removeFromChannels<T extends ChannelAware & VendureEntity>(
        ctx: RequestContext,
        entityType: Type<T>,
        entityId: ID,
        channelIds: ID[],
    ): Promise<T> {
        const entity = await this.connection.getEntityOrThrow(ctx, entityType, entityId, {
            relations: ['channels'],
        });
        for (const id of channelIds) {
            entity.channels = entity.channels.filter(c => !idsAreEqual(c.id, id));
        }
        await this.connection.getRepository(ctx, entityType).save(entity as any, { reload: false });
        return entity;
    }

    /**
     * Given a channel token, returns the corresponding Channel if it exists.
     */
    getChannelFromToken(token: string): Channel {
        if (this.allChannels.length === 1 || token === '') {
            // there is only the default channel, so return it
            return this.getDefaultChannel();
        }
        const channel = this.allChannels.find(c => c.token === token);
        if (!channel) {
            throw new ChannelNotFoundError(token);
        }
        return channel;
    }

    /**
     * Returns the default Channel.
     */
    getDefaultChannel(): Channel {
        const defaultChannel = this.allChannels.find(channel => channel.code === DEFAULT_CHANNEL_CODE);

        if (!defaultChannel) {
            throw new InternalServerError(`error.default-channel-not-found`);
        }
        return defaultChannel;
    }

    findAll(ctx: RequestContext): Promise<Channel[]> {
        return this.connection
            .getRepository(ctx, Channel)
            .find({ relations: ['defaultShippingZone', 'defaultTaxZone'] });
    }

    findOne(ctx: RequestContext, id: ID): Promise<Channel | undefined> {
        return this.connection
            .getRepository(ctx, Channel)
            .findOne(id, { relations: ['defaultShippingZone', 'defaultTaxZone'] });
    }

    async create(
        ctx: RequestContext,
        input: CreateChannelInput,
    ): Promise<ErrorResultUnion<CreateChannelResult, Channel>> {
        const channel = new Channel(input);
        const defaultLanguageValidationResult = await this.validateDefaultLanguageCode(ctx, input);
        if (isGraphQlErrorResult(defaultLanguageValidationResult)) {
            return defaultLanguageValidationResult;
        }
        if (input.defaultTaxZoneId) {
            channel.defaultTaxZone = await this.connection.getEntityOrThrow(
                ctx,
                Zone,
                input.defaultTaxZoneId,
            );
        }
        if (input.defaultShippingZoneId) {
            channel.defaultShippingZone = await this.connection.getEntityOrThrow(
                ctx,
                Zone,
                input.defaultShippingZoneId,
            );
        }
        const newChannel = await this.connection.getRepository(ctx, Channel).save(channel);
        await this.customFieldRelationService.updateRelations(ctx, Channel, input, newChannel);
        await this.updateAllChannels(ctx);
        return channel;
    }

    async update(
        ctx: RequestContext,
        input: UpdateChannelInput,
    ): Promise<ErrorResultUnion<UpdateChannelResult, Channel>> {
        const channel = await this.findOne(ctx, input.id);
        if (!channel) {
            throw new EntityNotFoundError('Channel', input.id);
        }
        const defaultLanguageValidationResult = await this.validateDefaultLanguageCode(ctx, input);
        if (isGraphQlErrorResult(defaultLanguageValidationResult)) {
            return defaultLanguageValidationResult;
        }
        const updatedChannel = patchEntity(channel, input);
        if (input.defaultTaxZoneId) {
            updatedChannel.defaultTaxZone = await this.connection.getEntityOrThrow(
                ctx,
                Zone,
                input.defaultTaxZoneId,
            );
        }
        if (input.defaultShippingZoneId) {
            updatedChannel.defaultShippingZone = await this.connection.getEntityOrThrow(
                ctx,
                Zone,
                input.defaultShippingZoneId,
            );
        }
        await this.connection.getRepository(ctx, Channel).save(updatedChannel, { reload: false });
        await this.customFieldRelationService.updateRelations(ctx, Channel, input, updatedChannel);
        await this.updateAllChannels(ctx);
        return assertFound(this.findOne(ctx, channel.id));
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        await this.connection.getEntityOrThrow(ctx, Channel, id);
        await this.connection.getRepository(ctx, Channel).delete(id);
        await this.connection.getRepository(ctx, ProductVariantPrice).delete({
            channelId: id,
        });
        return {
            result: DeletionResult.DELETED,
        };
    }

    /**
     * There must always be a default Channel. If none yet exists, this method creates one.
     * Also ensures the default Channel token matches the defaultChannelToken config setting.
     */
    private async ensureDefaultChannelExists() {
        const { defaultChannelToken } = this.configService;
        const defaultChannel = await this.connection.getRepository(Channel).findOne({
            where: {
                code: DEFAULT_CHANNEL_CODE,
            },
        });

        if (!defaultChannel) {
            const newDefaultChannel = new Channel({
                code: DEFAULT_CHANNEL_CODE,
                defaultLanguageCode: this.configService.defaultLanguageCode,
                pricesIncludeTax: false,
                currencyCode: CurrencyCode.USD,
                token: defaultChannelToken,
            });
            await this.connection.getRepository(Channel).save(newDefaultChannel, { reload: false });
        } else if (defaultChannelToken && defaultChannel.token !== defaultChannelToken) {
            defaultChannel.token = defaultChannelToken;
            await this.connection.getRepository(Channel).save(defaultChannel, { reload: false });
        }
    }

    private async validateDefaultLanguageCode(
        ctx: RequestContext,
        input: CreateChannelInput | UpdateChannelInput,
    ): Promise<LanguageNotAvailableError | undefined> {
        if (input.defaultLanguageCode) {
            const availableLanguageCodes = await this.globalSettingsService
                .getSettings(ctx)
                .then(s => s.availableLanguages);
            if (!availableLanguageCodes.includes(input.defaultLanguageCode)) {
                return new LanguageNotAvailableError(input.defaultLanguageCode);
            }
        }
    }

    private async updateAllChannels(ctx?: RequestContext) {
        this.allChannels = await this.findAll(ctx || RequestContext.empty());
    }
}
