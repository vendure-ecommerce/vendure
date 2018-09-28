import { Injectable } from '@angular/core';

import { AdministratorDataService } from './administrator-data.service';
import { AuthDataService } from './auth-data.service';
import { BaseDataService } from './base-data.service';
import { ClientDataService } from './client-data.service';
import { FacetDataService } from './facet-data.service';
import { OrderDataService } from './order-data.service';
import { ProductDataService } from './product-data.service';

@Injectable()
export class DataService {
    administrator: AdministratorDataService;
    auth: AuthDataService;
    product: ProductDataService;
    client: ClientDataService;
    facet: FacetDataService;
    order: OrderDataService;

    constructor(baseDataService: BaseDataService) {
        this.administrator = new AdministratorDataService(baseDataService);
        this.auth = new AuthDataService(baseDataService);
        this.product = new ProductDataService(baseDataService);
        this.client = new ClientDataService(baseDataService);
        this.facet = new FacetDataService(baseDataService);
        this.order = new OrderDataService(baseDataService);
    }
}
