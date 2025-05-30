import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { AwesomeGraphQLClient } from 'awesome-graphql-client';
import { DocumentNode, print } from 'graphql';
import { uiConfig } from 'virtual:vendure-ui-config';

const API_URL = uiConfig.apiHost + (uiConfig.apiPort !== 'auto' ? `:${uiConfig.apiPort}` : '') + '/admin-api';

export type Variables = object;
export type RequestDocument = string | DocumentNode;

const awesomeClient = new AwesomeGraphQLClient({
    endpoint: API_URL,
    fetch: async (url: string, options: RequestInit = {}) => {
        // Get the active channel token from localStorage
        const channelToken = localStorage.getItem('vendure-selected-channel-token');
        const headers = new Headers(options.headers);

        if (channelToken) {
            headers.set('vendure-token', channelToken);
        }

        return fetch(url, {
            ...options,
            headers,
            credentials: 'include',
            mode: 'cors',
        });
    },
});

export type VariablesAndRequestHeadersArgs<V extends Variables> =
    V extends Record<any, never>
        ? [variables?: V, requestHeaders?: HeadersInit]
        : [variables: V, requestHeaders?: HeadersInit];

function query<T, V extends Variables = Variables>(
    document: RequestDocument | TypedDocumentNode<T, V>,
    variables?: V,
): Promise<T> {
    const documentString = typeof document === 'string' ? document : print(document);
    return awesomeClient.request(documentString, variables) as any;
}

function mutate<T, V extends Variables = Variables>(
    document: TypedDocumentNode<T, V>,
): (variables: V) => Promise<T>;
function mutate(document: RequestDocument): (variables: Variables) => Promise<unknown>;
function mutate<T, V extends Variables = Variables>(
    document: TypedDocumentNode<T, V>,
    variables: V,
): Promise<T>;
function mutate(document: RequestDocument, variables: Variables): Promise<unknown>;
function mutate<T, V extends Variables = Variables>(
    document: RequestDocument | TypedDocumentNode<T, V>,
    maybeVariables?: V,
): Promise<T> | ((variables: V) => Promise<T>) {
    const documentString = typeof document === 'string' ? document : print(document);
    if (maybeVariables) {
        return awesomeClient.request(documentString, maybeVariables) as any;
    } else {
        return (variables: V): Promise<T> => {
            return awesomeClient.request(documentString, variables) as any;
        };
    }
}

export const api = {
    query,
    mutate,
};
