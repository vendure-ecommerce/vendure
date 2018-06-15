import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql/language/ast';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from 'apollo-client/core/types';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../app.config';
import { map } from 'rxjs/operators';
import { StateStore } from '../../../state/state-store.service';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable()
export class BaseDataService {

    constructor(private apollo: Apollo,
                private httpClient: HttpClient,
                private localStorageService: LocalStorageService) {}

    /**
     * Performs a GraphQL query
     */
    query<T, V = Record<string, any>>(query: DocumentNode, variables?: V): Observable<T> {
        return this.apollo.query<T, V>({
            query,
            variables,
            context: {
                headers: {
                    Authorization: this.getAuthHeader(),
                },
            },
        }).pipe(map(result => result.data));
    }

    /**
     * Perform REST POST
     */
    post(path: string, payload: Record<string, any>): Observable<any> {
        return this.httpClient.post(`${API_URL}/${path}`, payload, {
            headers: {
                Authorization: this.getAuthHeader(),
            },
        });
    }

    /**
     * Perform REST GET
     */
    get(path: string): Observable<any> {
        return this.httpClient.get(`${API_URL}/${path}`, {
            headers: {
                Authorization: this.getAuthHeader(),
            },
        });
    }

    private getAuthHeader(): string {
        const authToken = this.localStorageService.get('authToken');
        return `Bearer ${authToken}`;
    }

}
