import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DocumentNode } from 'graphql/index';
import { print } from 'graphql/language/printer';

import { VendureClientError } from './vendure-client-error.js';

export interface VendureClientOptions<
    FetchContextPre extends Record<string, any> | undefined = undefined,
    FetchContextPost extends Record<string, any> | undefined = undefined,
    ResultContext extends Record<string, any> = Record<string, any>,
> {
    apiUrl: string;
    preFetch?: (request: Request, context: FetchContextPre) => Request | Promise<Request>;
    postFetch?: (response: Response, context: FetchContextPost) => ResultContext | Promise<ResultContext>;
    channelTokenKey?: string;
    authTokenHeaderKey?: string;
    fetch?: typeof fetch;
    getFormData?: () => FormData;
}

type MergedContexts<
    FetchContextPre extends Record<string, any> | undefined = undefined,
    FetchContextPost extends Record<string, any> | undefined = undefined,
> = FetchContextPre extends undefined
    ? FetchContextPost extends undefined
        ? undefined
        : FetchContextPost
    : FetchContextPost extends undefined
    ? FetchContextPre
    : FetchContextPre & FetchContextPost;

type HasNonNullableProperty<T> = {
    [K in keyof T]: undefined extends T[K] ? never : true;
}[keyof T];

export type ExecuteArgs<
    T = any,
    V extends Record<string, any> = Record<string, any>,
    FetchContext extends Record<string, any> | undefined = undefined,
> = {
    document: DocumentNode | TypedDocumentNode<T, V>;
    variables?: V;
    queryParams?: Record<string, string>;
} & (FetchContext extends undefined
    ? { fetchContext: never }
    : HasNonNullableProperty<FetchContext> extends undefined
    ? { fetchContext?: FetchContext }
    : { fetchContext: FetchContext });

export function createClient<
    FetchContextPre extends Record<string, any> | undefined = undefined,
    FetchContextPost extends Record<string, any> | undefined = undefined,
    ResultContext extends Record<string, any> = Record<string, any>,
>(options: VendureClientOptions<FetchContextPre, FetchContextPost, ResultContext>) {
    return new VendureClient<MergedContexts<FetchContextPre, FetchContextPost>, ResultContext>(
        options as any,
    );
}

export class VendureClient<
    FetchContext extends Record<string, any> | undefined,
    ResultContext extends Record<string, any>,
> {
    constructor(private options: VendureClientOptions<FetchContext, ResultContext>) {}

    private authToken: string;
    private channelToken: string | null = null;
    private languageCode: string | null = null;
    private headers: { [key: string]: any } = {};

    protected get authTokenHeaderKey(): string {
        return this.options.authTokenHeaderKey ?? 'vendure-auth-token';
    }

    protected get channelTokenKey(): string {
        return this.options.channelTokenKey ?? 'vendure-token';
    }

    /**
     * @description
     * Sets the authToken to be used in each GraphQL request.
     */
    setAuthToken(token: string) {
        this.authToken = token;
        this.headers.Authorization = `Bearer ${this.authToken}`;
    }

    /**
     * @description
     * Sets the authToken to be used in each GraphQL request.
     */
    setChannelToken(token: string | null) {
        this.channelToken = token;
        this.headers[this.channelTokenKey] = this.channelToken;
    }

    /**
     * @description
     * Sets the authToken to be used in each GraphQL request.
     */
    setLanguageCode(languageCode: string | null) {
        this.languageCode = languageCode;
    }

    /**
     * @description
     * Performs both query and mutation operations.
     */
    async execute<T = any, V extends Record<string, any> = Record<string, any>>(
        args: ExecuteArgs<T, V, FetchContext>,
    ): Promise<{ data: T; response: Response } & ResultContext> {
        const { document, variables, queryParams, fetchContext } = args;
        const documentString = print(document);
        const body = JSON.stringify({
            query: documentString,
            variables: variables ? variables : undefined,
        });
        const url = `${this.options.apiUrl}${this.getQueryParamsString(queryParams)}`;
        const { response, postFetchData } = await this.fetch(url, fetchContext, { method: 'POST', body });
        const result = await this.getResult(response);

        if (response.ok && !result.errors && result.data) {
            return {
                data: result.data,
                response,
                ...postFetchData,
            };
        } else {
            const errorResult = typeof result === 'string' ? { error: result } : result;
            throw new VendureClientError(
                { ...errorResult, status: response.status },
                { query: print(document), variables },
            );
        }
    }

    /**
     * @description
     * Performs a raw HTTP request to the given URL, but also includes the authToken & channelToken
     * headers if they have been set. Useful for testing non-GraphQL endpoints, e.g. for plugins
     * which make use of REST controllers.
     */
    async fetch(url: string, context: Record<string, any> | undefined, options: RequestInit = {}) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            ...this.headers,
            ...options.headers,
        });

        const fetchImpl = this.options.fetch || fetch;
        let request = new Request(url, {
            ...options,
            headers,
            credentials: 'include',
        });
        if (this.options.preFetch && typeof this.options.preFetch === 'function') {
            request = await this.options.preFetch(request, context as any);
        }
        const response = await fetchImpl(url, request);
        let postFetchData: ResultContext = {} as ResultContext;
        if (this.options.postFetch && typeof this.options.postFetch === 'function') {
            const result = await this.options.postFetch(response, context as any);
            postFetchData = { ...postFetchData, ...result };
        }
        const authToken = response.headers.get(this.authTokenHeaderKey);
        if (authToken != null) {
            this.setAuthToken(authToken);
        }
        return { response, postFetchData };
    }

    private getQueryParamsString(queryParams?: Record<string, string>): string {
        const params = new URLSearchParams(queryParams ?? {});
        if (this.languageCode) {
            params.set('languageCode', this.languageCode);
        }
        return params.toString();
    }

    private getResult(response: Response): Promise<any> {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.startsWith('application/json')) {
            return response.json();
        } else {
            return response.text();
        }
    }
}
