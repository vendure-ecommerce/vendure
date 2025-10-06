import { Injectable } from '@nestjs/common';
import {
    CreateApiKeyInput,
    CreateApiKeyResult,
    DeleteApiKeyInput,
    DeletionResponse,
    DeletionResult,
    RotateApiKeyInput,
    RotateApiKeyResult,
    UpdateApiKeyInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { In, UpdateResult } from 'typeorm';

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
import { ApiKeyLookupIdGenerationStrategy } from '../../config/api-key-strategy/api-key-lookup-id-generation-strategy';
import { TransactionalConnection } from '../../connection';
import { AuthenticationMethod, Role, User } from '../../entity';
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
     * @throws {InternalServerError} When {@link ApiKeyLookupIdGenerationStrategy} has not been configured.
     */
    getLookupIdStrategyByApiType(apiType: ApiType): ApiKeyLookupIdGenerationStrategy {
        const options =
            apiType === 'admin'
                ? this.configService.authOptions.adminApiKeyAuthorizationOptions
                : this.configService.authOptions.shopApiKeyAuthorizationOptions;

        if (!options.lookupIdStrategy)
            throw new InternalServerError('FAILED TO CONFIGURE APIKEYLOOKUPIDSTRATEGY'); // TODO i18n key

        return options.lookupIdStrategy;
    }

    /**
     * Checks that the active user is allowed to grant the specified Roles for an API-Key
     *
     * // TODO this is taken & slightly modified from adminservice, could merge to not repeat logic
     *
     * @throws {UserInputError} If the active User has insufficient permissions
     * @returns Role-Entities with relations to Channels
     */
    private async assertActiveUserCanGrantRoles(ctx: RequestContext, roleIds: ID[]): Promise<Role[]> {
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

    private generateApiKeyUserIdentifier(lookupId: string): string {
        // Too long identifiers could be an issue depending on the underlying DB
        return `apikey-user-${lookupId}`;
    }

    /**
     * Creates a new API-Key for the given User
     *
     * **Important**: The caller is responsible for avoiding privilege escalations by
     * verifying `userIdOwner` and `userIdApiKeyUser`; **Use this with great care!**
     *
     * If you allow users to specify these IDs, they may leak existing User IDs via thrown errors.
     *
     * @throws {EntityNotFoundError} When either Owner or ApiKeyUser cannot be found
     * @throws {UserInputError} When the User tries to grant a role which they themselves dont have
     * @throws {InternalServerError} When either {@link ApiKeyGenerationStrategy} or
     * {@link ApiKeyHashingStrategy} have not been configured.
     */
    async create(
        ctx: RequestContext,
        input: CreateApiKeyInput,
        userIdOwner: ID,
        /**
         * Optionally allow overriding the creation of a separate User.
         * This is an advanced use case for plugin-authors to allow impersonation.
         * You are responsible for avoiding privilege escalation by verifying this ID.
         */
        userIdApiKeyUser?: ID,
    ): Promise<CreateApiKeyResult> {
        const roles = await this.assertActiveUserCanGrantRoles(ctx, input.roleIds);

        const ownerUser = await this.connection.getEntityOrThrow(ctx, User, userIdOwner);
        const lookupId = await this.getLookupIdStrategyByApiType(ctx.apiType).generateLookupId(ctx);
        const apiKeyUser = userIdApiKeyUser
            ? await this.connection.getEntityOrThrow(ctx, User, userIdApiKeyUser, {
                  // ApiKeyUsers generally require roles and their channels, its important for sessions!
                  relations: { roles: { channels: true } },
              })
            : await this.userService.createApiKeyUser(
                  ctx,
                  roles,
                  this.generateApiKeyUserIdentifier(lookupId),
              );

        const apiKey = await this.getGenerationStrategyByApiType(ctx.apiType).generateApiKey(ctx);
        const hash = await this.getHashingStrategyByApiType(ctx.apiType).hash(apiKey);

        const newEntity = await this.translatableSaver.create({
            ctx,
            input,
            entityType: ApiKey,
            translationType: ApiKeyTranslation,
            beforeSave: async e => {
                e.ownerId = ownerUser.id;
                e.apiKeyUserId = apiKeyUser.id;
                e.apiKeyHash = hash;
                e.lookupId = lookupId;
                await this.channelService.assignToCurrentChannel(e, ctx);
            },
        });

        await this.customFieldRelationService.updateRelations(ctx, ApiKey, input, newEntity);

        // Important: The hash becomes the session token, this is what allows us to authorize on a per-request basis
        // Important: The User of the session may be new User to allow configuring separate permissions
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

        return { apiKey, lookupId, entityId: newEntity.id };
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

        const hasAuthMethod = await this.connection.getRepository(ctx, AuthenticationMethod).existsBy({
            user: { id: apiKey.apiKeyUserId },
        });

        // If this is an impersonated user who can login, we dont want to delete them
        if (hasAuthMethod) {
            await this.sessionService.deleteApiKeySession(ctx, apiKey);
        }
        // If this is an underlying user solely for holding permission, delete them
        else {
            // SoftDelete should also delete the related sessions & cache
            // TODO because its only a soft delete the IDs stay in the `user_roles_role` junction table huh
            await this.userService.softDelete(ctx, apiKey.apiKeyUserId);
        }

        const deletedApiKey = new ApiKey(apiKey); // For retaining the ID
        await this.connection.getRepository(ctx, ApiKey).remove(apiKey);

        Logger.verbose(`Deleted ApiKey (${String(input.id)}) by User (${String(ctx.activeUserId)})`);
        await this.eventBus.publish(new ApiKeyEvent(ctx, deletedApiKey, 'deleted', input));

        return { result: DeletionResult.DELETED };
    }

    /**
     * Replaces the old with a new API-Key.
     *
     * This is a convenience method to invalidate an API-Key without
     * deleting the underlying roles and permissions.
     *
     * @throws {EntityNotFoundError} If API-Key cannot be found
     * @throws {InternalServerError} When either {@link ApiKeyGenerationStrategy} or
     * {@link ApiKeyHashingStrategy} have not been configured.
     */
    async rotate(ctx: RequestContext, input: RotateApiKeyInput): Promise<RotateApiKeyResult> {
        const entity = await this.connection.getEntityOrThrow(ctx, ApiKey, input.id, {
            channelId: ctx.channelId,
            // Need roles and channels for session
            relations: { apiKeyUser: { roles: { channels: true } } },
        });

        const apiKey = await this.getGenerationStrategyByApiType(ctx.apiType).generateApiKey(ctx);
        const hash = await this.getHashingStrategyByApiType(ctx.apiType).hash(apiKey);

        await this.sessionService.deleteApiKeySession(ctx, entity);
        await this.sessionService.createNewAuthenticatedSession(
            ctx,
            entity.apiKeyUser,
            API_KEY_AUTH_STRATEGY_NAME,
            hash,
        );

        entity.apiKeyHash = hash;
        await this.connection.getRepository(ctx, ApiKey).save(entity, { reload: false });

        Logger.verbose(`Rotated ApiKey (${entity.id}) by User (${String(ctx.activeUserId)})`);
        await this.eventBus.publish(new ApiKeyEvent(ctx, entity, 'updated', input));

        return { apiKey };
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

    /**
     * Helper, intended for the AuthGuard to quickly find the ApiKeyHash
     */
    async getHashByLookupId(lookupId: NonNullable<ApiKey['lookupId']>): Promise<string | null> {
        const entity = await this.connection.rawConnection.getRepository(ApiKey).findOneBy({ lookupId });
        return entity?.apiKeyHash ?? null;
    }

    /**
     * Helper, intended for the AuthGuard to quickly update the lastUsedAt timestamp
     */
    async updateLastUsedAtByLookupId(lookupId: NonNullable<ApiKey['lookupId']>): Promise<UpdateResult> {
        return this.connection.rawConnection
            .getRepository(ApiKey)
            .update({ lookupId }, { lastUsedAt: new Date() });
    }
}
