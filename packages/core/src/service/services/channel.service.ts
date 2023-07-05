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
import { ID, PaginatedList, Type } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import { FindOneOptions } from 'typeorm';

import { RelationPaths } from '../../api';
import { RequestContext } from '../../api/common/request-context';
import { ErrorResultUnion, isGraphQlErrorResult } from '../../common/error/error-result';
import {
    ChannelNotFoundError,
    EntityNotFoundError,
    InternalServerError,
    UserInputError,
} from '../../common/error/errors';
import { LanguageNotAvailableError } from '../../common/error/generated-graphql-admin-errors';
import { createSelfRefreshingCache, SelfRefreshingCache } from '../../common/self-refreshing-cache';
import { ChannelAware, ListQueryOptions } from '../../common/types/common-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { VendureEntity } from '../../entity/base/base.entity';
import { Channel } from '../../entity/channel/channel.entity';
import { Order } from '../../entity/order/order.entity';
import { ProductVariantPrice } from '../../entity/product-variant/product-variant-price.entity';
import { Seller } from '../../entity/seller/seller.entity';
import { Session } from '../../entity/session/session.entity';
import { Zone } from '../../entity/zone/zone.entity';
import { EventBus } from '../../event-bus';
import { ChangeChannelEvent } from '../../event-bus/events/change-channel-event';
import { ChannelEvent } from '../../event-bus/events/channel-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { patchEntity } from '../helpers/utils/patch-entity';

import { GlobalSettingsService } from './global-settings.service';

/**
 * @description
 * Contains methods relating to {@link Channel} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class ChannelService {
    private allChannels: SelfRefreshingCache<Channel[], [RequestContext]>;

    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private globalSettingsService: GlobalSettingsService,
        private customFieldRelationService: CustomFieldRelationService,
        private eventBus: EventBus,
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    /**
     * When the app is bootstrapped, ensure a default Channel exists and populate the
     * channel lookup array.
     *
     * @internal
     */
    async initChannels() {
        await this.ensureDefaultChannelExists();
        await this.ensureCacheExists();
    }

    /**
     * Creates a channels cache, that can be used to reduce number of channel queries to database
     *
     * @internal
     */
    async createCache(): Promise<SelfRefreshingCache<Channel[], [RequestContext]>> {
        return createSelfRefreshingCache({
            name: 'ChannelService.allChannels',
            ttl: this.configService.entityOptions.channelCacheTtl,
            refresh: {
                fn: async ctx => {
                    const result = await this.listQueryBuilder
                        .build(
                            Channel,
                            {},
                            {
                                ctx,
                                relations: ['defaultShippingZone', 'defaultTaxZone'],
                                ignoreQueryLimits: true,
                            },
                        )
                        .getManyAndCount()
                        .then(([items, totalItems]) => ({
                            items,
                            totalItems,
                        }));
                    return result.items;
                },
                defaultArgs: [RequestContext.empty()],
            },
        });
    }

    /**
     * @description
     * Assigns a ChannelAware entity to the default Channel as well as any channel
     * specified in the RequestContext.
     */
    async assignToCurrentChannel<T extends ChannelAware & VendureEntity>(
        entity: T,
        ctx: RequestContext,
    ): Promise<T> {
        const defaultChannel = await this.getDefaultChannel(ctx);
        const channelIds = unique([ctx.channelId, defaultChannel.id]);
        entity.channels = channelIds.map(id => ({ id })) as any;
        this.eventBus.publish(new ChangeChannelEvent(ctx, entity, [ctx.channelId], 'assigned'));
        return entity;
    }

    /**
     * @description
     * Assigns the entity to the given Channels and saves.
     */
    async assignToChannels<T extends ChannelAware & VendureEntity>(
        ctx: RequestContext,
        entityType: Type<T>,
        entityId: ID,
        channelIds: ID[],
    ): Promise<T> {
        const relations = ['channels'];
        // This is a work-around for https://github.com/vendure-ecommerce/vendure/issues/1391
        // A better API would be to allow the consumer of this method to supply an entity instance
        // so that this join could be done prior to invoking this method.
        // TODO: overload the assignToChannels method to allow it to take an entity instance
        if (entityType === (Order as any)) {
            relations.push('lines', 'shippingLines');
        }
        const entity = await this.connection.getEntityOrThrow(ctx, entityType, entityId, {
            relations,
        });
        for (const id of channelIds) {
            const channel = await this.connection.getEntityOrThrow(ctx, Channel, id);
            entity.channels.push(channel);
        }
        await this.connection.getRepository(ctx, entityType).save(entity as any, { reload: false });
        this.eventBus.publish(new ChangeChannelEvent(ctx, entity, channelIds, 'assigned', entityType));
        return entity;
    }

    /**
     * @description
     * Removes the entity from the given Channels and saves.
     */
    async removeFromChannels<T extends ChannelAware & VendureEntity>(
        ctx: RequestContext,
        entityType: Type<T>,
        entityId: ID,
        channelIds: ID[],
    ): Promise<T | undefined> {
        const entity = await this.connection.getRepository(ctx, entityType).findOne({
            where: { id: entityId },
            relations: ['channels'],
        } as FindOneOptions<T>);
        if (!entity) {
            return;
        }
        for (const id of channelIds) {
            entity.channels = entity.channels.filter(c => !idsAreEqual(c.id, id));
        }
        await this.connection.getRepository(ctx, entityType).save(entity as any, { reload: false });
        this.eventBus.publish(new ChangeChannelEvent(ctx, entity, channelIds, 'removed', entityType));
        return entity;
    }
    /**
     * @description
     * Given a channel token, returns the corresponding Channel if it exists, else will throw
     * a {@link ChannelNotFoundError}.
     */
    async getChannelFromToken(token: string): Promise<Channel>;
    async getChannelFromToken(ctx: RequestContext, token: string): Promise<Channel>;
    async getChannelFromToken(ctxOrToken: RequestContext | string, token?: string): Promise<Channel> {
        const [ctx, channelToken] =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ctxOrToken instanceof RequestContext ? [ctxOrToken, token!] : [undefined, ctxOrToken];

        const allChannels = await this.allChannels.value(ctx);

        if (allChannels.length === 1 || channelToken === '') {
            // there is only the default channel, so return it
            return this.getDefaultChannel(ctx);
        }
        const channel = allChannels.find(c => c.token === channelToken);
        if (!channel) {
            throw new ChannelNotFoundError(channelToken);
        }
        return channel;
    }

    /**
     * @description
     * Returns the default Channel.
     */
    async getDefaultChannel(ctx?: RequestContext): Promise<Channel> {
        const allChannels = await this.allChannels.value(ctx);
        const defaultChannel = allChannels.find(channel => channel.code === DEFAULT_CHANNEL_CODE);

        if (!defaultChannel) {
            throw new InternalServerError('error.default-channel-not-found');
        }
        return defaultChannel;
    }

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Channel>,
        relations?: RelationPaths<Channel>,
    ): Promise<PaginatedList<Channel>> {
        return this.listQueryBuilder
            .build(Channel, options, {
                relations: relations ?? ['defaultShippingZone', 'defaultTaxZone'],
                ctx,
            })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(ctx: RequestContext, id: ID): Promise<Channel | undefined> {
        return this.connection
            .getRepository(ctx, Channel)
            .findOne({ where: { id }, relations: ['defaultShippingZone', 'defaultTaxZone'] })
            .then(result => result ?? undefined);
    }

    async create(
        ctx: RequestContext,
        input: CreateChannelInput,
    ): Promise<ErrorResultUnion<CreateChannelResult, Channel>> {
        const defaultCurrencyCode = input.defaultCurrencyCode || input.currencyCode;
        if (!defaultCurrencyCode) {
            throw new UserInputError('Either a defaultCurrencyCode or currencyCode must be provided');
        }
        const channel = new Channel({
            ...input,
            defaultCurrencyCode,
            availableCurrencyCodes:
                input.availableCurrencyCodes ?? (defaultCurrencyCode ? [defaultCurrencyCode] : []),
            availableLanguageCodes: input.availableLanguageCodes ?? [input.defaultLanguageCode],
        });
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
        if (input.sellerId) {
            const seller = await this.connection.getEntityOrThrow(ctx, Seller, input.sellerId);
            newChannel.seller = seller;
            await this.connection.getRepository(ctx, Channel).save(newChannel);
        }
        await this.customFieldRelationService.updateRelations(ctx, Channel, input, newChannel);
        await this.allChannels.refresh(ctx);
        this.eventBus.publish(new ChannelEvent(ctx, newChannel, 'created', input));
        return newChannel;
    }

    async update(
        ctx: RequestContext,
        input: UpdateChannelInput,
    ): Promise<ErrorResultUnion<UpdateChannelResult, Channel>> {
        const channel = await this.findOne(ctx, input.id);
        if (!channel) {
            throw new EntityNotFoundError('Channel', input.id);
        }
        const originalDefaultCurrencyCode = channel.defaultCurrencyCode;
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
        if (input.sellerId) {
            const seller = await this.connection.getEntityOrThrow(ctx, Seller, input.sellerId);
            updatedChannel.seller = seller;
        }
        if (input.currencyCode) {
            updatedChannel.defaultCurrencyCode = input.currencyCode;
        }
        if (input.currencyCode || input.defaultCurrencyCode) {
            const newCurrencyCode = input.defaultCurrencyCode || input.currencyCode;
            if (originalDefaultCurrencyCode !== newCurrencyCode) {
                // When updating the default currency code for a Channel, we also need to update
                // and ProductVariantPrices in that channel which use the old currency code.
                const qb = this.connection
                    .getRepository(ctx, ProductVariantPrice)
                    .createQueryBuilder('pvp')
                    .update()
                    .where('channelId = :channelId', { channelId: channel.id })
                    .andWhere('currencyCode = :currencyCode', {
                        currencyCode: originalDefaultCurrencyCode,
                    })
                    .set({ currencyCode: newCurrencyCode });

                await qb.execute();
            }
        }
        await this.connection.getRepository(ctx, Channel).save(updatedChannel, { reload: false });
        await this.customFieldRelationService.updateRelations(ctx, Channel, input, updatedChannel);
        await this.allChannels.refresh(ctx);
        this.eventBus.publish(new ChannelEvent(ctx, channel, 'updated', input));
        return assertFound(this.findOne(ctx, channel.id));
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const channel = await this.connection.getEntityOrThrow(ctx, Channel, id);
        const deletedChannel = new Channel(channel);
        await this.connection.getRepository(ctx, Session).delete({ activeChannelId: id });
        await this.connection.getRepository(ctx, Channel).delete(id);
        await this.connection.getRepository(ctx, ProductVariantPrice).delete({
            channelId: id,
        });
        this.eventBus.publish(new ChannelEvent(ctx, deletedChannel, 'deleted', id));

        return {
            result: DeletionResult.DELETED,
        };
    }

    /**
     * @description
     * Type guard method which returns true if the given entity is an
     * instance of a class which implements the {@link ChannelAware} interface.
     */
    public isChannelAware(entity: VendureEntity): entity is VendureEntity & ChannelAware {
        const entityType = Object.getPrototypeOf(entity).constructor;
        return !!this.connection.rawConnection
            .getMetadata(entityType)
            .relations.find(r => r.type === Channel && r.propertyName === 'channels');
    }

    /**
     * Ensures channel cache exists. If not, this method creates one.
     */
    private async ensureCacheExists() {
        if (this.allChannels) {
            return;
        }

        this.allChannels = await this.createCache();
    }

    /**
     * There must always be a default Channel. If none yet exists, this method creates one.
     * Also ensures the default Channel token matches the defaultChannelToken config setting.
     */
    private async ensureDefaultChannelExists() {
        const { defaultChannelToken } = this.configService;
        let defaultChannel = await this.connection.rawConnection.getRepository(Channel).findOne({
            where: {
                code: DEFAULT_CHANNEL_CODE,
            },
            relations: ['seller'],
        });

        if (!defaultChannel) {
            defaultChannel = new Channel({
                code: DEFAULT_CHANNEL_CODE,
                defaultLanguageCode: this.configService.defaultLanguageCode,
                availableLanguageCodes: [this.configService.defaultLanguageCode],
                pricesIncludeTax: false,
                defaultCurrencyCode: CurrencyCode.USD,
                availableCurrencyCodes: [CurrencyCode.USD],
                token: defaultChannelToken,
            });
        } else if (defaultChannelToken && defaultChannel.token !== defaultChannelToken) {
            defaultChannel.token = defaultChannelToken;
            await this.connection.rawConnection
                .getRepository(Channel)
                .save(defaultChannel, { reload: false });
        }
        if (!defaultChannel.seller) {
            const seller = await this.connection.rawConnection.getRepository(Seller).find();
            if (seller.length === 0) {
                throw new InternalServerError('No Sellers were found. Could not initialize default Channel.');
            }
            defaultChannel.seller = seller[0];
            await this.connection.rawConnection
                .getRepository(Channel)
                .save(defaultChannel, { reload: false });
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
                return new LanguageNotAvailableError({ languageCode: input.defaultLanguageCode });
            }
        }
    }
}
