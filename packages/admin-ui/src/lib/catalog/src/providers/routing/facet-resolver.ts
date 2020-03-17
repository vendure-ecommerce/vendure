import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver } from '@vendure/admin-ui/core';
import { FacetWithValues } from '@vendure/admin-ui/core';
import { getDefaultLanguage } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

@Injectable({
    providedIn: 'root',
})
export class FacetResolver extends BaseEntityResolver<FacetWithValues.Fragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'Facet' as 'Facet',
                id: '',
                createdAt: '',
                updatedAt: '',
                isPrivate: false,
                languageCode: getDefaultLanguage(),
                name: '',
                code: '',
                translations: [],
                values: [],
            },
            id => dataService.facet.getFacet(id).mapStream(data => data.facet),
        );
    }
}
