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
    UnauthorizedError,
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

import { AdministratorService } from './administrator.service';
import { ChannelService } from './channel.service';
import { SessionService } from './session.service';

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
        private adminService: AdministratorService,
    ) {}

    getHashingStrategyByApiType(apiType: ApiType): ApiKeyHashingStrategy {
        const options =
            apiType === 'admin'
                ? this.configService.authOptions.adminApiKeyAuthorizationOptions
                : this.configService.authOptions.shopApiKeyAuthorizationOptions;

        if (!options.hashingStrategy)
            throw new InternalServerError('FAILED TO CONFIGURE APIKEYHASHINGSTRATEGY'); // TODO i18n key

        return options.hashingStrategy;
    }

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
     * Restricts API-Key creation to the active user! Allowing Admins to create keys for others,
     * comes with the risk of privilege escalation and impersonation.
     *
     * @throws {UnauthorizedError} When creating an API-Key for someone other than yourself
     * @throws {InternalServerError} When either {@link ApiKeyGenerationStrategy} or {@link ApiKeyHashingStrategy}
     * have not been configured.
     */
    async createForAdministrator(
        ctx: RequestContext,
        input: CreateApiKeyInput,
        relations?: RelationPaths<ApiKey>,
    ): Promise<CreateApiKeyResult> {
        const admin = await this.adminService.findOne(
            ctx,
            input.administratorId,
            // We specifically need channels for the session creation, important! (2025-09-20)
            ['user', 'user.roles', 'user.roles.channels'],
        );
        // We could allow superadmins to create for others too here would be convenient
        // Dont throw EntityNotFound so as to not leak Admin IDs
        if (!admin || input.administratorId !== admin.id) throw new UnauthorizedError();

        const apiKey =
            await this.configService.authOptions.adminApiKeyAuthorizationOptions.generationStrategy?.generateApiKey(
                ctx,
            );
        if (!apiKey) throw new InternalServerError('GENERATION STRATEGY MISSING'); // TODO proper i18n key

        const hash =
            await this.configService.authOptions.adminApiKeyAuthorizationOptions.hashingStrategy?.hash(
                apiKey,
            );
        if (!hash) throw new InternalServerError('HASHING STRATEGY MISSING'); // TODO proper i18n key

        const newEntity = await this.translatableSaver.create({
            ctx,
            input,
            entityType: ApiKey,
            translationType: ApiKeyTranslation,
            beforeSave: async e => {
                e.user = admin.user;
                e.apiKeyHash = hash;
                await this.channelService.assignToCurrentChannel(e, ctx);
            },
        });

        await this.customFieldRelationService.updateRelations(ctx, ApiKey, input, newEntity);

        // Important: The Hash is now a session token, this is what allows us to authorize on a per-request basis
        await this.sessionService.createNewAuthenticatedSession(
            ctx,
            admin.user,
            API_KEY_AUTH_STRATEGY_NAME,
            hash,
        );

        Logger.verbose(`Created ApiKey (${newEntity.id}) for Administrator (${admin.id})`); // TODO i18n key
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
