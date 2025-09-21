import { Injectable } from '@nestjs/common';
import {
    CreateApiKeyInput,
    CreateApiKeyResult,
    DeleteApiKeyInput,
    DeletionResponse,
    DeletionResult,
    UpdateApiKeyInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { In } from 'typeorm';

import { ApiType, RelationPaths, RequestContext } from '../../api';
import {
    assertFound,
    EntityNotFoundError,
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
import { Role } from '../../entity';
import { ApiKeyTranslation } from '../../entity/api-key/api-key-translation.entity';
import { ApiKey } from '../../entity/api-key/api-key.entity';
import { EventBus } from '../../event-bus';
import { ApiKeyEvent } from '../../event-bus/events/api-key-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';
import { getChannelPermissions } from '../helpers/utils/get-user-channels-permissions';

import { ChannelService } from './channel.service';
import { RoleService } from './role.service';
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
        private roleService: RoleService,
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

    /**
     * Checks that the active user is allowed to grant the specified Roles for an API-Key
     *
     * // TODO this is duplicated from admin service, could merge to not repeat logic
     *
     * @returns Role-Entities with relations to Channels
     */
    private async checkActiveUserCanGrantRoles(ctx: RequestContext, roleIds: ID[]): Promise<Role[]> {
        const roles = await this.connection.getRepository(ctx, Role).find({
            where: { id: In(roleIds) },
            relations: { channels: true },
        });
        const permissionsRequired = getChannelPermissions(roles);
        for (const channelPermissions of permissionsRequired) {
            const isAllowed = await this.roleService.userHasAllPermissionsOnChannel(
                ctx,
                channelPermissions.id,
                channelPermissions.permissions,
            );

            if (!isAllowed)
                throw new UserInputError('error.active-user-does-not-have-sufficient-permissions');
        }

        return roles;
    }

    /**
     * Creates a new API-Key for the given User
     *
     * @throws {UserInputError} When the User tries to grant a role which they themselves dont have
     * @throws {InternalServerError} When either {@link ApiKeyGenerationStrategy} or
     * {@link ApiKeyHashingStrategy} have not been configured.
     */
    async create(
        ctx: RequestContext,
        input: CreateApiKeyInput,
        userIdOwner: ID,
        relations?: RelationPaths<ApiKey>,
    ): Promise<CreateApiKeyResult> {
        const roles = await this.checkActiveUserCanGrantRoles(ctx, input.roleIds);
        const apiKeyUser = await this.userService.createApiKeyUser(ctx, roles);
        const apiKey = await this.getGenerationStrategyByApiType(ctx.apiType).generateApiKey(ctx);
        const hash = await this.getHashingStrategyByApiType(ctx.apiType).hash(apiKey);

        const newEntity = await this.translatableSaver.create({
            ctx,
            input,
            entityType: ApiKey,
            translationType: ApiKeyTranslation,
            beforeSave: async e => {
                e.ownerId = userIdOwner;
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
            `Created ApiKey (${newEntity.id}) for User (${userIdOwner}) with ApiKeyUser (${apiKeyUser.id}, ${apiKeyUser.identifier})`,
        );
        await this.eventBus.publish(new ApiKeyEvent(ctx, newEntity, 'created', input));

        return {
            apiKey,
            entity: await assertFound(this.findOne(ctx, newEntity.id, relations)),
        };
    }

    /**
     * Updates an API-Key. Is Channel-Aware.
     *
     * @throws {EntityNotFoundError} If API-Key cannot be found
     */
    async update(
        ctx: RequestContext,
        input: UpdateApiKeyInput,
        relations?: RelationPaths<ApiKey>,
    ): Promise<Translated<ApiKey>> {
        await this.connection.getEntityOrThrow(ctx, ApiKey, input.id, { channelId: ctx.channelId });
        const apiKey = await this.translatableSaver.update({
            ctx,
            input,
            entityType: ApiKey,
            translationType: ApiKeyTranslation,
        });
        await this.customFieldRelationService.updateRelations(ctx, ApiKey, input, apiKey);

        Logger.verbose(`Updated ApiKey (${apiKey.id}) by User (${String(ctx.activeUserId)})`);
        await this.eventBus.publish(new ApiKeyEvent(ctx, apiKey, 'updated', input));

        return assertFound(this.findOne(ctx, input.id, relations));
    }

    /**
     * Deletes an API-Key and its session. Is Channel-Aware.
     *
     * @throws {EntityNotFoundError} If API-Key cannot be found
     */
    async delete(ctx: RequestContext, input: DeleteApiKeyInput): Promise<DeletionResponse> {
        const apiKey = await this.connection.getEntityOrThrow(ctx, ApiKey, input.id, {
            channelId: ctx.channelId,
        });

        // SoftDelete should also delete the related sessions
        await this.userService.softDelete(ctx, apiKey.apiKeyUserId);
        // TODO because its only a soft delete the IDs stay in the `user_roles_role` junction table huh
        const deletedApiKey = new ApiKey(apiKey); // For retaining the ID
        await this.connection.getRepository(ctx, ApiKey).remove(apiKey);

        Logger.verbose(`Deleted ApiKey (${String(input.id)}) by User (${String(ctx.activeUserId)})`);
        await this.eventBus.publish(new ApiKeyEvent(ctx, deletedApiKey, 'deleted', input));

        return { result: DeletionResult.DELETED };
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
}
