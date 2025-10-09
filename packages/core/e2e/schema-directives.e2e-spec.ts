import { GraphQLTypesLoader } from '@nestjs/graphql';
import {
    VendurePlugin,
    defaultConfig,
    getFinalVendureSchema,
    mergeConfig,
    VENDURE_ADMIN_API_TYPE_PATHS,
    VENDURE_SHOP_API_TYPE_PATHS,
} from '@vendure/core';
import { GraphQLInputObjectType, GraphQLSchema, isNonNullType } from 'graphql';
import gql from 'graphql-tag';
import { describe, expect, it } from 'vitest';

@VendurePlugin({
    adminApiExtensions: {
        schema: gql`
            input AdminRemovalDirectiveInput {
                keep: String!
                legacy: String @vendureRemove @deprecated(reason: "Use keep instead")
            }

            extend type Mutation {
                removalDirectiveTest(input: AdminRemovalDirectiveInput!): Boolean!
            }
        `,
    },
})
class AdminRemoveFieldPlugin {}

@VendurePlugin({
    adminApiExtensions: {
        schema: gql`
            input AdminNullableDirectiveInput {
                keep: String!
                adjustable: [ID!]! @vendureMakeNullable @deprecated(reason: "Optional now")
            }

            extend type Mutation {
                nullableDirectiveTest(input: AdminNullableDirectiveInput!): Boolean!
            }
        `,
    },
})
class AdminMakeFieldNullablePlugin {}

@VendurePlugin({
    shopApiExtensions: {
        schema: gql`
            input ShopRemovalDirectiveInput {
                keep: String!
                legacy: String @vendureRemove @deprecated(reason: "Use keep instead")
            }

            extend type Mutation {
                shopRemovalDirectiveTest(input: ShopRemovalDirectiveInput!): Boolean!
            }
        `,
    },
})
class ShopRemoveFieldPlugin {}

@VendurePlugin({
    shopApiExtensions: {
        schema: gql`
            input ShopNullableDirectiveInput {
                keep: String!
                adjustable: [ID!]! @vendureMakeNullable @deprecated(reason: "Optional now")
            }

            extend type Mutation {
                shopNullableDirectiveTest(input: ShopNullableDirectiveInput!): Boolean!
            }
        `,
    },
})
class ShopMakeFieldNullablePlugin {}

async function buildSchemaWithPlugin(apiType: 'admin' | 'shop', plugin: any): Promise<GraphQLSchema> {
    const config = mergeConfig(defaultConfig, {
        plugins: [...(defaultConfig.plugins ?? []), plugin],
    });
    const typesLoader = new GraphQLTypesLoader();
    return getFinalVendureSchema({
        config,
        typePaths: apiType === 'admin' ? VENDURE_ADMIN_API_TYPE_PATHS : VENDURE_SHOP_API_TYPE_PATHS,
        typesLoader,
        apiType,
    });
}

describe('Admin schema directives', () => {
    it('removes a field when @vendureRemove is present', async () => {
        const schema = await buildSchemaWithPlugin('admin', AdminRemoveFieldPlugin);
        const inputType = schema.getType('AdminRemovalDirectiveInput');
        expect(inputType instanceof GraphQLInputObjectType).toBe(true);
        const fields = (inputType as GraphQLInputObjectType).getFields();
        expect(fields.keep).toBeDefined();
        expect(fields.legacy).toBeUndefined();
    });

    it('unwraps NonNull when @vendureMakeNullable is present', async () => {
        const schema = await buildSchemaWithPlugin('admin', AdminMakeFieldNullablePlugin);
        const inputType = schema.getType('AdminNullableDirectiveInput');
        expect(inputType instanceof GraphQLInputObjectType).toBe(true);
        const fields = (inputType as GraphQLInputObjectType).getFields();
        const adjustableField = fields.adjustable;
        expect(adjustableField).toBeDefined();
        expect(isNonNullType(adjustableField!.type)).toBe(false);
    });
});

describe('Shop schema directives', () => {
    it('removes a field when @vendureRemove is present', async () => {
        const schema = await buildSchemaWithPlugin('shop', ShopRemoveFieldPlugin);
        const inputType = schema.getType('ShopRemovalDirectiveInput');
        expect(inputType instanceof GraphQLInputObjectType).toBe(true);
        const fields = (inputType as GraphQLInputObjectType).getFields();
        expect(fields.keep).toBeDefined();
        expect(fields.legacy).toBeUndefined();
    });

    it('unwraps NonNull when @vendureMakeNullable is present', async () => {
        const schema = await buildSchemaWithPlugin('shop', ShopMakeFieldNullablePlugin);
        const inputType = schema.getType('ShopNullableDirectiveInput');
        expect(inputType instanceof GraphQLInputObjectType).toBe(true);
        const fields = (inputType as GraphQLInputObjectType).getFields();
        const adjustableField = fields.adjustable;
        expect(adjustableField).toBeDefined();
        expect(isNonNullType(adjustableField!.type)).toBe(false);
    });
});
