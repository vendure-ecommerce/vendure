import { Injectable } from '@angular/core';
import { FacetWithValues } from 'shared/generated-types';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { getDefaultLanguage } from '../../../common/utilities/get-default-language';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable()
export class FacetResolver extends BaseEntityResolver<FacetWithValues> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'Facet' as 'Facet',
                id: '',
                languageCode: getDefaultLanguage(),
                name: '',
                code: '',
                translations: [],
                values: [],
            },
            id => this.dataService.facet.getFacet(id).mapStream(data => data.facet),
        );
    }
}
