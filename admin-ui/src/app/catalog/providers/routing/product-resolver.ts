import { Injectable } from '@angular/core';
import { ProductWithVariants } from 'shared/generated-types';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { getDefaultLanguage } from '../../../common/utilities/get-default-language';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */

@Injectable()
export class ProductResolver extends BaseEntityResolver<ProductWithVariants> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'Product' as 'Product',
                id: '',
                languageCode: getDefaultLanguage(),
                name: '',
                slug: '',
                featuredAsset: null,
                assets: [],
                description: '',
                translations: [],
                optionGroups: [],
                variants: [],
            },
            id => this.dataService.product.getProduct(id).mapStream(data => data.product),
        );
    }
}
