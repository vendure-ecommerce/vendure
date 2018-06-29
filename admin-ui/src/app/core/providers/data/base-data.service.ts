import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { DocumentNode } from 'graphql/language/ast';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { API_URL } from '../../../app.config';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable()
export class BaseDataService {

    constructor(private apollo: Apollo,
                private httpClient: HttpClient,
                private localStorageService: LocalStorageService) {}

    /**
     * Performs a GraphQL query
     */
    query<T, V = Record<string, any>>(query: DocumentNode, variables?: V): QueryRef<T> {
        return this.apollo.watchQuery<T, V>({
            query,
            variables,
            context: {
                headers: {
                    Authorization: this.getAuthHeader(),
                },
            },
        });
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
