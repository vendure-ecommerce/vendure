import { Injectable } from '@angular/core';
import { UserDataService } from './user-data.service';
import { BaseDataService } from './base-data.service';
import { ProductDataService } from './product-data.service';

@Injectable()
export class DataService {
    user: UserDataService;
    product: ProductDataService;

    constructor(baseDataService: BaseDataService) {
        this.user = new UserDataService(baseDataService);
        this.product = new ProductDataService(baseDataService);
    }

}
