import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { ProductWithVariants } from '../../../common/generated-types';
import { getDefaultLanguage } from '../../../common/utilities/get-default-language';
import { DataService } from '../../../data/providers/data.service';

@Injectable()
export class ProductResolver extends BaseEntityResolver<ProductWithVariants.Fragment> {
    constructor(dataService: DataService, router: Router) {
        super(
            router,
            {
                __typename: 'Product' as 'Product',
                id: '',
                createdAt: '',
                updatedAt: '',
                enabled: true,
                languageCode: getDefaultLanguage(),
                name: '',
                slug: '',
                featuredAsset: null,
                assets: [],
                description: '',
                translations: [],
                optionGroups: [],
                facetValues: [],
                variants: [],
                channels: [],
            },
            id =>
                dataService.product
                    .getProduct(id)
                    .refetchOnChannelChange()
                    .mapStream(data => data.product),
        );
    }
}
