import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver } from '@vendure/admin-ui/core';
import { Collection, ProductWithVariants } from '@vendure/admin-ui/core';
import { getDefaultLanguage } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

@Injectable({
    providedIn: 'root',
})
export class CollectionResolver extends BaseEntityResolver<Collection.Fragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'Collection' as 'Collection',
                id: '',
                createdAt: '',
                updatedAt: '',
                languageCode: getDefaultLanguage(),
                name: '',
                isPrivate: false,
                description: '',
                featuredAsset: null,
                assets: [],
                translations: [],
                filters: [],
                parent: {} as any,
                children: null,
            },
            id => dataService.collection.getCollection(id).mapStream(data => data.collection),
        );
    }
}
