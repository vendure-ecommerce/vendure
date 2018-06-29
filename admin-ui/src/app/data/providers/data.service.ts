import { Injectable } from '@angular/core';

import { BaseDataService } from './base-data.service';
import { LocalDataService } from './local-data.service';
import { ProductDataService } from './product-data.service';
import { UserDataService } from './user-data.service';

@Injectable()
export class DataService {
    user: UserDataService;
    product: ProductDataService;
    local: LocalDataService;

    constructor(baseDataService: BaseDataService) {
        this.user = new UserDataService(baseDataService);
        this.product = new ProductDataService(baseDataService);
        this.local = new LocalDataService(baseDataService);
    }

}
