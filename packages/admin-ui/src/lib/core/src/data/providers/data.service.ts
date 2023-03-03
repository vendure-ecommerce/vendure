import { Injectable } from '@angular/core';
import { MutationUpdaterFn, WatchQueryFetchPolicy } from '@apollo/client/core';
import { DocumentNode } from 'graphql';
import { Observable } from 'rxjs';

import { QueryResult } from '../query-result';

import { AdministratorDataService } from './administrator-data.service';
import { AuthDataService } from './auth-data.service';
import { BaseDataService } from './base-data.service';
import { ClientDataService } from './client-data.service';
import { CollectionDataService } from './collection-data.service';
import { CustomerDataService } from './customer-data.service';
import { FacetDataService } from './facet-data.service';
import { OrderDataService } from './order-data.service';
import { ProductDataService } from './product-data.service';
import { PromotionDataService } from './promotion-data.service';
import { SettingsDataService } from './settings-data.service';
import { ShippingMethodDataService } from './shipping-method-data.service';

/**
 * @description
 * Used to interact with the Admin API via GraphQL queries. Internally this service uses the
 * Apollo Client, which means it maintains a normalized entity cache. For this reason, it is
 * advisable to always select the `id` field of any entity, which will allow the returned data
 * to be effectively cached.
 *
 * @docsCategory providers
 * @docsPage DataService
 * @docsWeight 0
 */
@Injectable()
export class DataService {
    /** @internal */ promotion: PromotionDataService;
    /** @internal */ administrator: AdministratorDataService;
    /** @internal */ auth: AuthDataService;
    /** @internal */ collection: CollectionDataService;
    /** @internal */ product: ProductDataService;
    /** @internal */ client: ClientDataService;
    /** @internal */ facet: FacetDataService;
    /** @internal */ order: OrderDataService;
    /** @internal */ settings: SettingsDataService;
    /** @internal */ customer: CustomerDataService;
    /** @internal */ shippingMethod: ShippingMethodDataService;

    /** @internal */
    constructor(private baseDataService: BaseDataService) {
        this.promotion = new PromotionDataService(baseDataService);
        this.administrator = new AdministratorDataService(baseDataService);
        this.auth = new AuthDataService(baseDataService);
        this.collection = new CollectionDataService(baseDataService);
        this.product = new ProductDataService(baseDataService);
        this.client = new ClientDataService(baseDataService);
        this.facet = new FacetDataService(baseDataService);
        this.order = new OrderDataService(baseDataService);
        this.settings = new SettingsDataService(baseDataService);
        this.customer = new CustomerDataService(baseDataService);
        this.shippingMethod = new ShippingMethodDataService(baseDataService);
    }

    /**
     * @description
     * Perform a GraphQL query. Returns a {@link QueryResult} which allows further control over
     * they type of result returned, e.g. stream of values, single value etc.
     *
     * @example
     * ```TypeScript
     * const result$ = this.dataService.query(gql`
     *   query MyQuery($id: ID!) {
     *     product(id: $id) {
     *       id
     *       name
     *       slug
     *     }
     *   },
     *   { id: 123 },
     * ).mapSingle(data => data.product);
     * ```
     */
    query<T, V = Record<string, any>>(
        query: DocumentNode,
        variables?: V,
        fetchPolicy: WatchQueryFetchPolicy = 'cache-and-network',
    ): QueryResult<T, V> {
        return this.baseDataService.query(query, variables, fetchPolicy);
    }

    /**
     * @description
     * Perform a GraphQL mutation.
     *
     * @example
     * ```TypeScript
     * const result$ = this.dataService.mutate(gql`
     *   mutation MyMutation($Codegen.UpdateEntityInput!) {
     *     updateEntity(input: $input) {
     *       id
     *       name
     *     }
     *   },
     *   { Codegen.updateEntityInput },
     * );
     * ```
     */
    mutate<T, V = Record<string, any>>(
        mutation: DocumentNode,
        variables?: V,
        update?: MutationUpdaterFn<T>,
    ): Observable<T> {
        return this.baseDataService.mutate(mutation, variables, update);
    }
}
