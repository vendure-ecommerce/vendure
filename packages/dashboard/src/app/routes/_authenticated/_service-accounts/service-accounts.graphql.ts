import { graphql } from '@/vdb/graphql/graphql.js';

export const serviceAccountItemFragment = graphql(`
    fragment ServiceAccountItem on Administrator {
        id
        createdAt
        updatedAt
        firstName
        lastName
        emailAddress
        user {
            id
            identifier
            lastLogin
            roles {
                id
                createdAt
                updatedAt
                code
                description
                channels {
                    id
                    code
                }
            }
        }
    }
`);

export const serviceAccountListDocument = graphql(
    `
        query ServiceAccountList($options: AdministratorListOptions) {
            administrators(options: $options) {
                items {
                    ...ServiceAccountItem
                }
                totalItems
            }
        }
    `,
    [serviceAccountItemFragment],
);

export const serviceAccountDetailDocument = graphql(
    `
        query ServiceAccountDetail($id: ID!) {
            administrator(id: $id) {
                ...ServiceAccountItem
                customFields
            }
        }
    `,
    [serviceAccountItemFragment],
);

export const createServiceAccountDocument = graphql(`
    mutation CreateServiceAccount($input: CreateAdministratorInput!) {
        createAdministrator(input: $input) {
            id
        }
    }
`);

export const updateServiceAccountDocument = graphql(`
    mutation UpdateServiceAccount($input: UpdateAdministratorInput!) {
        updateAdministrator(input: $input) {
            id
        }
    }
`);

export const apiKeyListDocument = graphql(`
    query ApiKeyList($administratorId: ID!, $options: ApiKeyListOptions) {
        apiKeys(administratorId: $administratorId, options: $options) {
            items {
                id
                createdAt
                updatedAt
                name
                prefix
                status
                expiresAt
                revokedAt
                lastUsedAt
                version
                notes
            }
            totalItems
        }
    }
`);

export const createApiKeyDocument = graphql(`
    mutation CreateApiKey($administratorId: ID!, $name: String!, $expiresAt: DateTime, $notes: String) {
        createApiKey(administratorId: $administratorId, name: $name, expiresAt: $expiresAt, notes: $notes) {
            apiKey {
                id
                name
                prefix
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
                prefix
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
