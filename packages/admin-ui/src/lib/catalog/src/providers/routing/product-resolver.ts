import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    BaseEntityResolver,
    DataService,
    getDefaultUiLanguage,
    GetProductWithVariantsQuery,
} from '@vendure/admin-ui/core';

@Injectable({
    providedIn: 'root',
})
export class ProductResolver extends BaseEntityResolver<GetProductWithVariantsQuery['product']> {
    constructor(dataService: DataService, router: Router) {
        super(
            router,
            {
                __typename: 'Product' as 'Product',
                id: '',
                createdAt: '',
                updatedAt: '',
                enabled: true,
                languageCode: getDefaultUiLanguage(),
                name: '',
                slug: '',
                featuredAsset: null,
                assets: [],
                description: '',
                translations: [],
                optionGroups: [],
                facetValues: [],
                variantList: { items: [], totalItems: 0 },
                channels: [],
            },
            id =>
                dataService.product
                    .getProduct(id, { take: 10 })
                    .refetchOnChannelChange()
                    .mapStream(data => data.product),
        );
    }
}
