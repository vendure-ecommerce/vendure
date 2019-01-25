import { Injectable } from '@angular/core';
import { ProductCategory, ProductWithVariants } from 'shared/generated-types';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { getDefaultLanguage } from '../../../common/utilities/get-default-language';
import { DataService } from '../../../data/providers/data.service';

@Injectable()
export class ProductCategoryResolver extends BaseEntityResolver<ProductCategory.Fragment> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'ProductCategory' as 'ProductCategory',
                id: '',
                languageCode: getDefaultLanguage(),
                name: '',
                description: '',
                featuredAsset: null,
                assets: [],
                translations: [],
                facetValues: [],
                parent: {} as any,
                children: null,
            },
            id => this.dataService.product.getProductCategory(id).mapStream(data => data.productCategory),
        );
    }
}
