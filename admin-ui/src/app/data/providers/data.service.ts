import { Injectable } from '@angular/core';

import { AuthDataService } from './auth-data.service';
import { BaseDataService } from './base-data.service';
import { ClientDataService } from './client-data.service';
import { FacetDataService } from './facet-data.service';
import { ProductDataService } from './product-data.service';

@Injectable()
export class DataService {
    auth: AuthDataService;
    product: ProductDataService;
    client: ClientDataService;
    facet: FacetDataService;

    constructor(baseDataService: BaseDataService) {
        this.auth = new AuthDataService(baseDataService);
        this.product = new ProductDataService(baseDataService);
        this.client = new ClientDataService(baseDataService);
        this.facet = new FacetDataService(baseDataService);
    }
}
