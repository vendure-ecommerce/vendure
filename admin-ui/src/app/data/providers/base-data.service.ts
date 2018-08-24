import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DataProxy } from 'apollo-cache';
import { FetchPolicy } from 'apollo-client';
import { ExecutionResult } from 'apollo-link';
import { DocumentNode } from 'graphql/language/ast';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { API_URL } from '../../app.config';
import { LocalStorageService } from '../../core/providers/local-storage/local-storage.service';
import { QueryResult } from '../types/query-result';

/**
 * Make the MutationUpdaterFn type-safe until this issue is resolved: https://github.com/apollographql/apollo-link/issues/616
 */
export type TypedFetchResult<T = Record<string, any>> = ExecutionResult & {
    context?: T;
    data: T;
};
export type TypedMutationUpdateFn<T> = (proxy: DataProxy, mutationResult: TypedFetchResult<T>) => void;

@Injectable()
export class BaseDataService {
    constructor(
        private apollo: Apollo,
        private httpClient: HttpClient,
        private localStorageService: LocalStorageService,
    ) {}

    /**
     * Performs a GraphQL watch query
     */
    query<T, V = Record<string, any>>(
        query: DocumentNode,
        variables?: V,
        fetchPolicy: FetchPolicy = 'cache-and-network',
    ): QueryResult<T, V> {
        const queryRef = this.apollo.watchQuery<T, V>({
            query,
            variables,
            context: {
                headers: {
                    Authorization: this.getAuthHeader(),
                },
            },
            fetchPolicy,
        });
        return new QueryResult<T, any>(queryRef);
    }

    /**
     * Performs a GraphQL mutation
     */
    mutate<T, V = Record<string, any>>(
        mutation: DocumentNode,
        variables?: V,
        update?: TypedMutationUpdateFn<T>,
    ): Observable<T> {
        return this.apollo
            .mutate<T, V>({
                mutation,
                variables,
                update: update as any,
            })
            .pipe(map(result => result.data as T));
    }

    /**
     * Perform REST-like POST
     */
    post(path: string, payload: Record<string, any>): Observable<any> {
        return this.httpClient
            .post(`${API_URL}/${path}`, payload, {
                headers: {
                    Authorization: this.getAuthHeader(),
                },
                observe: 'response',
            })
            .pipe(map(response => response.body));
    }

    /**
     * Perform REST-like GET
     */
    get(path: string): Observable<any> {
        return this.httpClient
            .get(`${API_URL}/${path}`, {
                headers: {
                    Authorization: this.getAuthHeader(),
                },
                observe: 'response',
            })
            .pipe(map(response => response.body));
    }

    private getAuthHeader(): string {
        const authToken = this.localStorageService.get('authToken');
        return `Bearer ${authToken}`;
    }
}
