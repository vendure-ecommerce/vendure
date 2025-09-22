import { DeletionResult, LanguageCode } from '@vendure/common/lib/generated-types';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    ApiKeyDocument,
    ApiKeysDocument,
    CreateApiKeyDocument,
    DeleteApiKeyDocument,
    UpdateApiKeyDocument,
} from './graphql/generated-e2e-admin-types';

describe('ApiKey resolver', () => {
    const { server, adminClient } = createTestEnvironment(testConfig());
    let createdApiKeyId: string;

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

    it('createApiKey', async ({ expect }) => {
        const result = await adminClient.query(CreateApiKeyDocument, {
            input: {
                roleIds: ['1'],
                translations: [{ languageCode: LanguageCode.en, name: 'Test API Key' }],
            },
        });
        expect(result.createApiKey.apiKey).toBeDefined();
        createdApiKeyId = result.createApiKey.entityId;
    });

    it('apiKey', async ({ expect }) => {
        const result = await adminClient.query(ApiKeyDocument, { id: createdApiKeyId });
        expect(result.apiKey).toBeDefined();
        expect(result.apiKey?.id).toBe(createdApiKeyId);
        expect(result.apiKey?.name).toBe('Test API Key');
        expect(result.apiKey?.translations.find(t => t.languageCode === LanguageCode.en)).toBeDefined();
    });

    it('apiKeys', async ({ expect }) => {
        const result = await adminClient.query(ApiKeysDocument);
        expect(result.apiKeys.items.length).toBeGreaterThan(0);
        expect(result.apiKeys.items.some((k: any) => k.id === createdApiKeyId)).toBe(true);
    });

    it('updateApiKey', async ({ expect }) => {
        const result = await adminClient.query(UpdateApiKeyDocument, {
            input: {
                id: createdApiKeyId,
                translations: [
                    { languageCode: LanguageCode.en, name: 'Updated API Key' },
                    { languageCode: LanguageCode.de, name: 'Neuer Eintrag' },
                ],
            },
        });
        expect(result.updateApiKey.id).toBe(createdApiKeyId);
        expect(result.updateApiKey.name).toBe('Updated API Key');
        expect(result.updateApiKey.translations.find(t => t.languageCode === LanguageCode.de)?.name).toBe(
            'Neuer Eintrag',
        );
    });

    it('deleteApiKey', async ({ expect }) => {
        const result = await adminClient.query(DeleteApiKeyDocument, { input: { id: createdApiKeyId } });
        expect(result.deleteApiKey.result).toBe(DeletionResult.DELETED);
        // Should not be found anymore
        const { apiKey } = await adminClient.query(API_KEY, { id: createdApiKeyId });
        expect(apiKey).toBeNull();
    });
});

export const CREATE_API_KEY = gql`
    mutation CreateApiKey($input: CreateApiKeyInput!) {
        createApiKey(input: $input) {
            apiKey
            entityId
        }
    }
`;

export const API_KEY = gql`
    query ApiKey($id: ID!) {
        apiKey(id: $id) {
            id
            name
            translations {
                id
                languageCode
                name
            }
        }
    }
`;

export const API_KEYS = gql`
    query ApiKeys($options: ApiKeyListOptions) {
        apiKeys(options: $options) {
            items {
                id
                name
            }
            totalItems
        }
    }
`;

export const UPDATE_API_KEY = gql`
    mutation UpdateApiKey($input: UpdateApiKeyInput!) {
        updateApiKey(input: $input) {
            id
            name
            translations {
                id
                languageCode
                name
            }
        }
    }
`;

export const DELETE_API_KEY = gql`
    mutation DeleteApiKey($input: DeleteApiKeyInput!) {
        deleteApiKey(input: $input) {
            result
            message
        }
    }
`;
