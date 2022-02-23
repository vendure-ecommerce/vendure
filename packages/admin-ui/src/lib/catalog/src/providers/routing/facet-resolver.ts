import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    BaseEntityResolver,
    DataService,
    FacetWithValuesFragment,
    getDefaultUiLanguage,
} from '@vendure/admin-ui/core';

@Injectable({
    providedIn: 'root',
})
export class FacetResolver extends BaseEntityResolver<FacetWithValuesFragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'Facet' as 'Facet',
                id: '',
                createdAt: '',
                updatedAt: '',
                isPrivate: false,
                languageCode: getDefaultUiLanguage(),
                name: '',
                code: '',
                translations: [],
                values: [],
            },
            id => dataService.facet.getFacet(id).mapStream(data => data.facet),
        );
    }
}
