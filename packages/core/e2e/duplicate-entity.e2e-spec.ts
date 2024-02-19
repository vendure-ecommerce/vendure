import {
    Collection,
    CollectionService,
    defaultEntityDuplicators,
    EntityDuplicator,
    LanguageCode,
    mergeConfig,
    PermissionDefinition,
    TransactionalConnection,
} from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import * as Codegen from './graphql/generated-e2e-admin-types';
import {
    AdministratorFragment,
    CreateAdministratorMutation,
    CreateAdministratorMutationVariables,
    CreateRoleMutation,
    CreateRoleMutationVariables,
    Permission,
    RoleFragment,
} from './graphql/generated-e2e-admin-types';
import { CREATE_ADMINISTRATOR, CREATE_ROLE, GET_COLLECTIONS } from './graphql/shared-definitions';

const customPermission = new PermissionDefinition({
    name: 'custom',
});

let collectionService: CollectionService;
let connection: TransactionalConnection;

const customCollectionDuplicator = new EntityDuplicator({
    code: 'custom-collection-duplicator',
    description: [{ languageCode: LanguageCode.en, value: 'Custom Collection Duplicator' }],
    args: {
        throwError: {
            type: 'boolean',
            defaultValue: false,
        },
    },
    forEntities: ['Collection'],
    requiresPermission: customPermission.Permission,
    init(injector) {
        collectionService = injector.get(CollectionService);
        connection = injector.get(TransactionalConnection);
    },
    duplicate: async input => {
        const { ctx, id, args } = input;

        const original = await connection.getEntityOrThrow(ctx, Collection, id, {
            relations: {
                assets: true,
                featuredAsset: true,
            },
        });
        const newCollection = await collectionService.create(ctx, {
            isPrivate: original.isPrivate,
            customFields: original.customFields,
            assetIds: original.assets.map(a => a.id),
            featuredAssetId: original.featuredAsset?.id,
            parentId: original.parentId,
            filters: original.filters.map(f => ({
                code: f.code,
                arguments: f.args,
            })),
            inheritFilters: original.inheritFilters,
            translations: original.translations.map(t => ({
                languageCode: t.languageCode,
                name: `${t.name} (copy)`,
                slug: `${t.slug}-copy`,
                description: t.description,
                customFields: t.customFields,
            })),
        });

        if (args.throwError) {
            throw new Error('Dummy error');
        }

        return newCollection;
    },
});

describe('Duplicating entities', () => {
    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            authOptions: {
                customPermissions: [customPermission],
            },
            entityOptions: {
                entityDuplicators: [/* ...defaultEntityDuplicators */ customCollectionDuplicator],
            },
        }),
    );

    const duplicateEntityGuard: ErrorResultGuard<{ newEntityId: string }> = createErrorResultGuard(
        result => !!result.newEntityId,
    );

    let testRole: RoleFragment;
    let testAdmin: AdministratorFragment;

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();

        // create a new role and Admin and sign in as that Admin
        const { createRole } = await adminClient.query<CreateRoleMutation, CreateRoleMutationVariables>(
            CREATE_ROLE,
            {
                input: {
                    channelIds: ['T_1'],
                    code: 'test-role',
                    description: 'Testing custom permissions',
                    permissions: [
                        Permission.CreateCollection,
                        Permission.UpdateCollection,
                        Permission.ReadCollection,
                    ],
                },
            },
        );
        testRole = createRole;
        const { createAdministrator } = await adminClient.query<
            CreateAdministratorMutation,
            CreateAdministratorMutationVariables
        >(CREATE_ADMINISTRATOR, {
            input: {
                firstName: 'Test',
                lastName: 'Admin',
                emailAddress: 'test@admin.com',
                password: 'test',
                roleIds: [testRole.id],
            },
        });

        testAdmin = createAdministrator;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('get entity duplicators', async () => {
        const { entityDuplicators } = await adminClient.query<Codegen.GetEntityDuplicatorsQuery>(
            GET_ENTITY_DUPLICATORS,
        );

        expect(entityDuplicators).toEqual([
            {
                args: [
                    {
                        defaultValue: false,
                        name: 'throwError',
                        type: 'boolean',
                    },
                ],
                code: 'custom-collection-duplicator',
                description: 'Custom Collection Duplicator',
                forEntities: ['Collection'],
                requiresPermission: ['custom'],
            },
        ]);
    });

    it('cannot duplicate if lacking permissions', async () => {
        await adminClient.asUserWithCredentials(testAdmin.emailAddress, 'test');

        const { duplicateEntity } = await adminClient.query<
            Codegen.DuplicateEntityMutation,
            Codegen.DuplicateEntityMutationVariables
        >(DUPLICATE_ENTITY, {
            input: {
                entityName: 'Collection',
                entityId: 'T_2',
                duplicatorInput: {
                    code: 'custom-collection-duplicator',
                    arguments: [
                        {
                            name: 'throwError',
                            value: 'false',
                        },
                    ],
                },
            },
        });

        duplicateEntityGuard.assertErrorResult(duplicateEntity);

        expect(duplicateEntity.message).toBe('The entity could not be duplicated');
        expect(duplicateEntity.duplicationError).toBe(
            'You do not have the required permissions to duplicate this entity',
        );
    });

    it('errors thrown in duplicator cause ErrorResult', async () => {
        await adminClient.asSuperAdmin();

        const { duplicateEntity } = await adminClient.query<
            Codegen.DuplicateEntityMutation,
            Codegen.DuplicateEntityMutationVariables
        >(DUPLICATE_ENTITY, {
            input: {
                entityName: 'Collection',
                entityId: 'T_2',
                duplicatorInput: {
                    code: 'custom-collection-duplicator',
                    arguments: [
                        {
                            name: 'throwError',
                            value: 'true',
                        },
                    ],
                },
            },
        });

        duplicateEntityGuard.assertErrorResult(duplicateEntity);

        expect(duplicateEntity.message).toBe('The entity could not be duplicated');
        expect(duplicateEntity.duplicationError).toBe('Dummy error');
    });

    it('errors thrown cause all DB changes to be rolled back', async () => {
        await adminClient.asSuperAdmin();

        const { collections } = await adminClient.query<Codegen.GetCollectionsQuery>(GET_COLLECTIONS);

        expect(collections.items.length).toBe(1);
        expect(collections.items.map(i => i.name)).toEqual(['Plants']);
    });

    it('returns ID of new entity', async () => {
        await adminClient.asSuperAdmin();

        const { duplicateEntity } = await adminClient.query<
            Codegen.DuplicateEntityMutation,
            Codegen.DuplicateEntityMutationVariables
        >(DUPLICATE_ENTITY, {
            input: {
                entityName: 'Collection',
                entityId: 'T_2',
                duplicatorInput: {
                    code: 'custom-collection-duplicator',
                    arguments: [
                        {
                            name: 'throwError',
                            value: 'false',
                        },
                    ],
                },
            },
        });

        duplicateEntityGuard.assertSuccess(duplicateEntity);

        expect(duplicateEntity.newEntityId).toBe('T_3');
    });

    it('duplicate gets created', async () => {
        const { collection } = await adminClient.query<
            Codegen.GetDuplicatedCollectionQuery,
            Codegen.GetDuplicatedCollectionQueryVariables
        >(GET_DUPLICATED_COLLECTION, {
            id: 'T_3',
        });

        expect(collection).toEqual({
            id: 'T_3',
            name: 'Plants (copy)',
            slug: 'plants-copy',
        });
    });
});

const GET_ENTITY_DUPLICATORS = gql`
    query GetEntityDuplicators {
        entityDuplicators {
            code
            description
            requiresPermission
            forEntities
            args {
                name
                type
                defaultValue
            }
        }
    }
`;

const DUPLICATE_ENTITY = gql`
    mutation DuplicateEntity($input: DuplicateEntityInput!) {
        duplicateEntity(input: $input) {
            ... on DuplicateEntitySuccess {
                newEntityId
            }
            ... on DuplicateEntityError {
                message
                duplicationError
            }
        }
    }
`;

export const GET_DUPLICATED_COLLECTION = gql`
    query GetDuplicatedCollection($id: ID) {
        collection(id: $id) {
            id
            name
            slug
        }
    }
`;
