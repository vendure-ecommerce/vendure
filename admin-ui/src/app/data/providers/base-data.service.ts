import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql/language/ast';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from '../../app.config';
import { LocalStorageService } from '../../core/providers/local-storage/local-storage.service';
import { QueryResult } from '../types/query-result';

@Injectable()
export class BaseDataService {

    constructor(private apollo: Apollo,
                private httpClient: HttpClient,
                private localStorageService: LocalStorageService) {}

    /**
     * Performs a GraphQL watch query
     */
    query<T, V = Record<string, any>>(query: DocumentNode, variables?: V): QueryResult<T, V> {
        const queryRef = this.apollo.watchQuery<T, V>({
            query,
            variables,
            context: {
                headers: {
                    Authorization: this.getAuthHeader(),
                },
            },
        });
        return new QueryResult<T, any>(queryRef);
    }

    /**
     * Performs a GraphQL mutation
     */
    mutate<T, V = Record<string, any>>(mutation: DocumentNode, variables?: V): Observable<T> {
        return this.apollo.mutate<T, V>({ mutation, variables }).pipe(
            map(result => result.data as T));
    }

    /**
     * Perform REST-like POST
     */
    post(path: string, payload: Record<string, any>): Observable<any> {
        return this.httpClient.post(`${API_URL}/${path}`, payload, {
            headers: {
                Authorization: this.getAuthHeader(),
            },
            observe: 'response',
        }).pipe(
            map(response => response.body),
        );
    }

    /**
     * Perform REST-like GET
     */
    get(path: string): Observable<any> {
        return this.httpClient.get(`${API_URL}/${path}`, {
            headers: {
                Authorization: this.getAuthHeader(),
            },
            observe: 'response',
        }).pipe(
            map(response => response.body),
        );
    }

    private getAuthHeader(): string {
        const authToken = this.localStorageService.get('authToken');
        return `Bearer ${authToken}`;
    }

}
