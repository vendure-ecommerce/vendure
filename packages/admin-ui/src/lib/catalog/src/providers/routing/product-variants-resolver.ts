import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver } from '@vendure/admin-ui/core';
import { GetProductVariantOptionsQuery } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

@Injectable({
    providedIn: 'root',
})
export class ProductVariantsResolver extends BaseEntityResolver<GetProductVariantOptionsQuery['product']> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'Product' as 'Product',
                id: '',
                createdAt: '',
                updatedAt: '',
                name: '',
                optionGroups: [],
                variants: [],
            },
            id => dataService.product.getProductVariantsOptions(id).mapStream(data => data.product),
        );
    }
}
