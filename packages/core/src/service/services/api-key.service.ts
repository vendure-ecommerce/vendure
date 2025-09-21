import { Injectable } from '@nestjs/common';
import { CreateApiKeyInput, CreateApiKeyResult } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { ApiType, RelationPaths, RequestContext } from '../../api';
import {
    assertFound,
    Instrument,
    InternalServerError,
    ListQueryOptions,
    Translated,
    UserInputError,
} from '../../common';
import {
    API_KEY_AUTH_STRATEGY_NAME,
    ApiKeyGenerationStrategy,
    ApiKeyHashingStrategy,
    ConfigService,
    Logger,
} from '../../config';
import { TransactionalConnection } from '../../connection';
import { ApiKeyTranslation } from '../../entity/api-key/api-key-translation.entity';
import { ApiKey } from '../../entity/api-key/api-key.entity';
import { EventBus } from '../../event-bus';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';

import { ChannelService } from './channel.service';
import { SessionService } from './session.service';
import { UserService } from './user.service';

@Injectable()
@Instrument()
export class ApiKeyService {
    constructor(
        private channelService: ChannelService,
        private configService: ConfigService,
        private connection: TransactionalConnection,
        private customFieldRelationService: CustomFieldRelationService,
        private eventBus: EventBus,
        private listQueryBuilder: ListQueryBuilder,
        private sessionService: SessionService,
        private translatableSaver: TranslatableSaver,
        private translator: TranslatorService,
        private userService: UserService,
    ) {}

    /**
     * @throws {InternalServerError} When {@link ApiKeyHashingStrategy} has not been configured.
     */
    getHashingStrategyByApiType(apiType: ApiType): ApiKeyHashingStrategy {
        const options =
            apiType === 'admin'
                ? this.configService.authOptions.adminApiKeyAuthorizationOptions
                : this.configService.authOptions.shopApiKeyAuthorizationOptions;

        if (!options.hashingStrategy)
            throw new InternalServerError('FAILED TO CONFIGURE APIKEYHASHINGSTRATEGY'); // TODO i18n key

        return options.hashingStrategy;
    }

    /**
     * @throws {InternalServerError} When {@link ApiKeyGenerationStrategy} has not been configured.
     */
    getGenerationStrategyByApiType(apiType: ApiType): ApiKeyGenerationStrategy {
        const options =
            apiType === 'admin'
                ? this.configService.authOptions.adminApiKeyAuthorizationOptions
                : this.configService.authOptions.shopApiKeyAuthorizationOptions;

        if (!options.generationStrategy)
            throw new InternalServerError('FAILED TO CONFIGURE APIKEYGENERATIONSTRATEGY'); // TODO i18n key

        return options.generationStrategy;
    }

    // TODO extract common creation logic for use between forAdmin and forCustomer

    /**
     * Creates a new API-Key.
     *
     * The owner of the API-Key is determined by the active User ID inside the RequestContext.
     *
     * @throws {UserInputError} When the context has no active User ID
     * @throws {InternalServerError} When either {@link ApiKeyGenerationStrategy} or {@link ApiKeyHashingStrategy}
     * have not been configured.
     */
    async create(
        ctx: RequestContext,
        // TODO need permissions either in creation and or update
        input: CreateApiKeyInput,
        relations?: RelationPaths<ApiKey>,
    ): Promise<CreateApiKeyResult> {
        const ownerId = ctx.activeUserId;
        if (!ownerId) throw new UserInputError('CONTEXT HAS NO ACTIVE USER'); // TODO i18n key

        const apiKeyUser = await this.userService.createApiKeyUser(ctx, []); // TODO roles
        const apiKey = await this.getGenerationStrategyByApiType(ctx.apiType).generateApiKey(ctx);
        const hash = await this.getHashingStrategyByApiType(ctx.apiType).hash(apiKey);

        const newEntity = await this.translatableSaver.create({
            ctx,
            input,
            entityType: ApiKey,
            translationType: ApiKeyTranslation,
            beforeSave: async e => {
                e.ownerId = ownerId;
                e.apiKeyUserId = apiKeyUser.id;
                e.apiKeyHash = hash;
                await this.channelService.assignToCurrentChannel(e, ctx);
            },
        });

        await this.customFieldRelationService.updateRelations(ctx, ApiKey, input, newEntity);

        // Important: The hash becomes the session token, this is what allows us to authorize on a per-request basis
        // Important: The User of the session is not the owner, it's a new User to allow configuring separate permissions
        await this.sessionService.createNewAuthenticatedSession(
            ctx,
            apiKeyUser,
            API_KEY_AUTH_STRATEGY_NAME,
            hash,
        );

        Logger.verbose(
            `Created ApiKey (${newEntity.id}) for User (${ownerId}) with ApiKeyUser (${apiKeyUser.id}, ${apiKeyUser.identifier})`,
        );
        // await this.eventBus.publish(new ApiKeyEvent(ctx, entity, "created", input)); // TODO

        return {
            apiKey,
            entity: await assertFound(this.findOne(ctx, newEntity.id, relations)),
        };
    }

    /**
     * Is channel aware and translates the entity as well.
     */
    async findOne(
        ctx: RequestContext,
        id: ID,
        relations?: RelationPaths<ApiKey>,
    ): Promise<Translated<ApiKey> | null> {
        const entity = await this.connection.findOneInChannel(ctx, ApiKey, id, ctx.channelId, { relations });
        if (!entity) return null;
        return this.translator.translate(entity, ctx);
    }

    /**
     * Is channel-aware and translates the entity as well.
     */
    async findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<ApiKey>,
        relations?: RelationPaths<ApiKey>,
    ): Promise<PaginatedList<Translated<ApiKey>>> {
        return this.listQueryBuilder
            .build(ApiKey, options, {
                relations,
                channelId: ctx.channelId,
                ctx,
            })
            .getManyAndCount()
            .then(([notifications, totalItems]) => {
                const items = notifications.map(n => this.translator.translate(n, ctx));
                return { items, totalItems };
            });
    }

    // TODO other helper methods like delete, findByUserId, etc. after we had a discussion about the approach
}
