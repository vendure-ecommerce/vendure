import { Injectable } from '@angular/core';
import { WatchQueryFetchPolicy } from 'apollo-client';
import { DocumentNode } from 'graphql';
import { Observable } from 'rxjs';

import { QueryResult } from '../query-result';

import { AdministratorDataService } from './administrator-data.service';
import { AuthDataService } from './auth-data.service';
import { BaseDataService, TypedMutationUpdateFn } from './base-data.service';
import { ClientDataService } from './client-data.service';
import { CollectionDataService } from './collection-data.service';
import { CustomerDataService } from './customer-data.service';
import { FacetDataService } from './facet-data.service';
import { OrderDataService } from './order-data.service';
import { ProductDataService } from './product-data.service';
import { PromotionDataService } from './promotion-data.service';
import { SettingsDataService } from './settings-data.service';
import { ShippingMethodDataService } from './shipping-method-data.service';

@Injectable()
export class DataService {
    promotion: PromotionDataService;
    administrator: AdministratorDataService;
    auth: AuthDataService;
    collection: CollectionDataService;
    product: ProductDataService;
    client: ClientDataService;
    facet: FacetDataService;
    order: OrderDataService;
    settings: SettingsDataService;
    customer: CustomerDataService;
    shippingMethod: ShippingMethodDataService;

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
     * Perform a GraphQL query.
     */
    query<T, V = Record<string, any>>(
        query: DocumentNode,
        variables?: V,
        fetchPolicy: WatchQueryFetchPolicy = 'cache-and-network',
    ): QueryResult<T, V> {
        return this.baseDataService.query(query, variables, fetchPolicy);
    }

    /**
     * Perform a GraphQL mutation.
     */
    mutate<T, V = Record<string, any>>(
        mutation: DocumentNode,
        variables?: V,
        update?: TypedMutationUpdateFn<T>,
    ): Observable<T> {
        return this.baseDataService.mutate(mutation, variables, update);
    }
}
