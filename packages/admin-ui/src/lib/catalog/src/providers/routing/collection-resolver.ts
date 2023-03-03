import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    BaseEntityResolver,
    CollectionFragment,
    DataService,
    getDefaultUiLanguage,
} from '@vendure/admin-ui/core';

@Injectable({
    providedIn: 'root',
})
export class CollectionResolver extends BaseEntityResolver<CollectionFragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'Collection' as 'Collection',
                id: '',
                createdAt: '',
                updatedAt: '',
                languageCode: getDefaultUiLanguage(),
                name: '',
                slug: '',
                isPrivate: false,
                breadcrumbs: [],
                description: '',
                featuredAsset: null,
                assets: [],
                translations: [],
                inheritFilters: true,
                filters: [],
                parent: {} as any,
                children: null,
            },
            id => dataService.collection.getCollection(id).mapStream(data => data.collection),
        );
    }
}
