import { WatchQueryFetchPolicy } from 'apollo-client';

export interface BaseExtensionMessage {
    requestId: string;
    type: string;
    data: any;
}

export interface QueryMessage extends BaseExtensionMessage {
    type: 'query';
    data: {
        document: string;
        variables?: { [key: string]: any };
        fetchPolicy?: WatchQueryFetchPolicy;
    };
}

export interface MutationMessage extends BaseExtensionMessage {
    type: 'mutation';
    data: {
        document: string;
        variables?: { [key: string]: any };
    };
}

export type ExtensionMesssage = QueryMessage | MutationMessage;
