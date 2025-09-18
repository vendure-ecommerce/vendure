import { graphql } from '@/vdb/graphql/graphql.js';

export const apiKeyListDocument = graphql(`
    query ApiKeyList($options: ApiKeyListOptions) {
        apiKeys(options: $options) {
            items {
                id
                createdAt
                updatedAt
                name
                status
                expiresAt
                revokedAt
                lastUsedAt
                notes
            }
            totalItems
        }
    }
`);

export const createApiKeyDocument = graphql(`
    mutation CreateApiKey($name: String!, $expiresAt: DateTime!, $notes: String) {
        createApiKey(name: $name, expiresAt: $expiresAt, notes: $notes) {
            apiKey {
                id
                name
                status
                expiresAt
                createdAt
            }
            rawKey
        }
    }
`);

export const rotateApiKeyDocument = graphql(`
    mutation RotateApiKey($id: ID!) {
        rotateApiKey(id: $id) {
            apiKey {
                id
                name
                status
                expiresAt
                createdAt
            }
            rawKey
        }
    }
`);

export const revokeApiKeyDocument = graphql(`
    mutation RevokeApiKey($id: ID!) {
        revokeApiKey(id: $id) {
            id
            status
            revokedAt
        }
    }
`);

export const invalidateApiKeySessionsDocument = graphql(`
    mutation InvalidateApiKeySessions($id: ID!) {
        invalidateApiKeySessions(id: $id)
    }
`);

export const deleteApiKeyDocument = graphql(`
    mutation DeleteApiKey($id: ID!) {
        deleteApiKey(id: $id) {
            result
            message
        }
    }
`);
