import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { FacetWithValues } from '../../../common/generated-types';
import { getDefaultLanguage } from '../../../common/utilities/get-default-language';
import { DataService } from '../../../data/providers/data.service';

@Injectable()
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
