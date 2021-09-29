import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataProxy, MutationUpdaterFn, WatchQueryFetchPolicy } from '@apollo/client/core';
import { simpleDeepClone } from '@vendure/common/lib/simple-deep-clone';
import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql/language/ast';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CustomFields } from '../../common/generated-types';
import { LocalStorageService } from '../../providers/local-storage/local-storage.service';
import { QueryResult } from '../query-result';
import { ServerConfigService } from '../server-config';
import { addCustomFields } from '../utils/add-custom-fields';
import {
    isEntityCreateOrUpdateMutation,
    removeReadonlyCustomFields,
} from '../utils/remove-readonly-custom-fields';
import { transformRelationCustomFieldInputs } from '../utils/transform-relation-custom-field-inputs';

@Injectable()
export class BaseDataService {
    constructor(
        private apollo: Apollo,
        private httpClient: HttpClient,
        private localStorageService: LocalStorageService,
        private serverConfigService: ServerConfigService,
    ) {}

    private get customFields(): CustomFields {
        return this.serverConfigService.serverConfig.customFieldConfig || {};
    }

    /**
     * Performs a GraphQL watch query
     */
    query<T, V = Record<string, any>>(
        query: DocumentNode,
        variables?: V,
        fetchPolicy: WatchQueryFetchPolicy = 'cache-and-network',
    ): QueryResult<T, V> {
        const withCustomFields = addCustomFields(query, this.customFields);
        const queryRef = this.apollo.watchQuery<T, V>({
            query: withCustomFields,
            variables,
            fetchPolicy,
        });
        const queryResult = new QueryResult<T, any>(queryRef, this.apollo);
        return queryResult;
    }

    /**
     * Performs a GraphQL mutation
     */
    mutate<T, V = Record<string, any>>(
        mutation: DocumentNode,
        variables?: V,
        update?: MutationUpdaterFn<T>,
    ): Observable<T> {
        const withCustomFields = addCustomFields(mutation, this.customFields);
        const withoutReadonlyFields = this.prepareCustomFields(mutation, variables);

        return this.apollo
            .mutate<T, V>({
                mutation: withCustomFields,
                variables: withoutReadonlyFields,
                update,
            })
            .pipe(map(result => result.data as T));
    }

    private prepareCustomFields<V>(mutation: DocumentNode, variables: V): V {
        const entity = isEntityCreateOrUpdateMutation(mutation);
        if (entity) {
            const customFieldConfig = this.customFields[entity];
            if (variables && customFieldConfig) {
                let variablesClone = simpleDeepClone(variables as any);
                variablesClone = removeReadonlyCustomFields(variablesClone, customFieldConfig);
                variablesClone = transformRelationCustomFieldInputs(variablesClone, customFieldConfig);
                return variablesClone;
            }
        }
        return variables;
    }
}
