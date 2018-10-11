import { Injectable } from '@angular/core';

import { AdjustmentSourceDataService } from './adjustment-source-data.service';
import { AdministratorDataService } from './administrator-data.service';
import { AuthDataService } from './auth-data.service';
import { BaseDataService } from './base-data.service';
import { ClientDataService } from './client-data.service';
import { FacetDataService } from './facet-data.service';
import { OrderDataService } from './order-data.service';
import { ProductDataService } from './product-data.service';
import { SettingsDataService } from './settings-data.service';

@Injectable()
export class DataService {
    adjustmentSource: AdjustmentSourceDataService;
    administrator: AdministratorDataService;
    auth: AuthDataService;
    product: ProductDataService;
    client: ClientDataService;
    facet: FacetDataService;
    order: OrderDataService;
    settings: SettingsDataService;

    constructor(baseDataService: BaseDataService) {
        this.adjustmentSource = new AdjustmentSourceDataService(baseDataService);
        this.administrator = new AdministratorDataService(baseDataService);
        this.auth = new AuthDataService(baseDataService);
        this.product = new ProductDataService(baseDataService);
        this.client = new ClientDataService(baseDataService);
        this.facet = new FacetDataService(baseDataService);
        this.order = new OrderDataService(baseDataService);
        this.settings = new SettingsDataService(baseDataService);
    }
}
