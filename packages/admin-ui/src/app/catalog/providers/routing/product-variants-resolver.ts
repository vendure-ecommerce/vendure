import { Injectable } from '@angular/core';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { GetProductVariantOptions } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Injectable()
export class ProductVariantsResolver extends BaseEntityResolver<GetProductVariantOptions.Product> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'Product' as 'Product',
                id: '',
                createdAt: '',
                updatedAt: '',
                name: '',
                optionGroups: [],
                variants: [],
            },
            id => this.dataService.product.getProductVariantsOptions(id).mapStream(data => data.product),
        );
    }
}
