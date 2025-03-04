import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { GraphQLClient, RequestDocument } from 'graphql-request';
import { request as graphqlRequest, Variables } from 'graphql-request';

const API_URL = 'http://localhost:3000/admin-api';

const client = new GraphQLClient(API_URL, {
    credentials: 'include',
    mode: 'cors',
});

export type VariablesAndRequestHeadersArgs<V extends Variables> =
    V extends Record<any, never>
        ? [variables?: V, requestHeaders?: HeadersInit]
        : [variables: V, requestHeaders?: HeadersInit];

function query<T, V extends Variables = Variables>(
    document: RequestDocument | TypedDocumentNode<T, V>,
    variables?: V,
) {
    return client.request<T>({
        document,
        variables,
    });
}

function mutate2<T, V extends Variables = Variables>(
    document: TypedDocumentNode<T, V>,
): (variables: V) => Promise<T>;
function mutate2<T, V extends Variables = Variables>(
    document: RequestDocument | TypedDocumentNode<T, V>,
    maybeVariables?: V,
): Promise<T> | ((variables: V) => Promise<T>) {
    if (maybeVariables) {
        return client.request<T>({
            document,
            variables: maybeVariables,
        });
    } else {
        return (variables: V): Promise<T> => {
            return client.request<T>({
                document,
                variables,
            });
        };
    }
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
    if (maybeVariables) {
        return client.request<T>({
            document,
            variables: maybeVariables,
        });
    } else {
        return (variables: V): Promise<T> => {
            return client.request<T>({
                document,
                variables,
            });
        };
    }
}

export const api = {
    query,
    mutate,
    mutate2,
};
