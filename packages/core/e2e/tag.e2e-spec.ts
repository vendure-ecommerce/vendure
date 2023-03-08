import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { createTestEnvironment } from '../../testing/lib/create-test-environment';

import * as Codegen from './graphql/generated-e2e-admin-types';

describe('Tag resolver', () => {
    const { server, adminClient } = createTestEnvironment(testConfig());

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('create', async () => {
        const { createTag } = await adminClient.query<
            Codegen.CreateTagMutation,
            Codegen.CreateTagMutationVariables
        >(CREATE_TAG, {
            input: { value: 'tag1' },
        });

        expect(createTag).toEqual({
            id: 'T_1',
            value: 'tag1',
        });
    });

    it('create with existing value returns existing tag', async () => {
        const { createTag } = await adminClient.query<
            Codegen.CreateTagMutation,
            Codegen.CreateTagMutationVariables
        >(CREATE_TAG, {
            input: { value: 'tag1' },
        });

        expect(createTag).toEqual({
            id: 'T_1',
            value: 'tag1',
        });
    });

    it('update', async () => {
        const { updateTag } = await adminClient.query<
            Codegen.UpdateTagMutation,
            Codegen.UpdateTagMutationVariables
        >(UPDATE_TAG, {
            input: { id: 'T_1', value: 'tag1-updated' },
        });

        expect(updateTag).toEqual({
            id: 'T_1',
            value: 'tag1-updated',
        });
    });

    it('tag', async () => {
        const { tag } = await adminClient.query<Codegen.GetTagQuery, Codegen.GetTagQueryVariables>(GET_TAG, {
            id: 'T_1',
        });

        expect(tag).toEqual({
            id: 'T_1',
            value: 'tag1-updated',
        });
    });

    it('tags', async () => {
        const { tags } = await adminClient.query<Codegen.GetTagListQuery, Codegen.GetTagListQueryVariables>(
            GET_TAG_LIST,
        );

        expect(tags).toEqual({
            items: [
                {
                    id: 'T_1',
                    value: 'tag1-updated',
                },
            ],
            totalItems: 1,
        });
    });
});

const GET_TAG_LIST = gql`
    query GetTagList($options: TagListOptions) {
        tags(options: $options) {
            items {
                id
                value
            }
            totalItems
        }
    }
`;

const GET_TAG = gql`
    query GetTag($id: ID!) {
        tag(id: $id) {
            id
            value
        }
    }
`;

const CREATE_TAG = gql`
    mutation CreateTag($input: CreateTagInput!) {
        createTag(input: $input) {
            id
            value
        }
    }
`;

const UPDATE_TAG = gql`
    mutation UpdateTag($input: UpdateTagInput!) {
        updateTag(input: $input) {
            id
            value
        }
    }
`;

const DELETE_TAG = gql`
    mutation DeleteTag($id: ID!) {
        deleteTag(id: $id) {
            message
            result
        }
    }
`;
