import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver } from '@vendure/admin-ui/core';
import { ProductWithVariants } from '@vendure/admin-ui/core';
import { getDefaultLanguage } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

@Injectable({
    providedIn: 'root',
})
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
