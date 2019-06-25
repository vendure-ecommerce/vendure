import { Injectable } from '@angular/core';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { FacetWithValues } from '../../../common/generated-types';
import { getDefaultLanguage } from '../../../common/utilities/get-default-language';
import { DataService } from '../../../data/providers/data.service';

@Injectable()
export class FacetResolver extends BaseEntityResolver<FacetWithValues.Fragment> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'Facet' as 'Facet',
                id: '',
                isPrivate: false,
                languageCode: getDefaultLanguage(),
                name: '',
                code: '',
                updatedAt: '',
                translations: [],
                values: [],
            },
            id => this.dataService.facet.getFacet(id).mapStream(data => data.facet),
        );
    }
}
