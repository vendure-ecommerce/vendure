import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { notNullOrUndefined } from '../../../../../../shared/shared-utils';
import { getDefaultLanguage } from '../../../common/utilities/get-default-language';
import { DataService } from '../../../data/providers/data.service';
import { FacetWithValues } from '../../../data/types/gql-generated-types';

/**
 * Resolves the id from the path into a Customer entity.
 */

@Injectable()
export class FacetResolver implements Resolve<Observable<FacetWithValues>> {
    constructor(private dataService: DataService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<Observable<FacetWithValues>> {
        const id = route.paramMap.get('id');

        if (id === 'create') {
            return of(
                of({
                    __typename: 'Facet' as 'Facet',
                    id: '',
                    languageCode: getDefaultLanguage(),
                    name: '',
                    code: '',
                    translations: [],
                    values: [],
                }),
            );
        } else if (id) {
            const stream = this.dataService.facet
                .getFacet(id)
                .mapStream(data => data.facet)
                .pipe(filter(notNullOrUndefined));

            return stream.pipe(
                take(1),
                map(() => stream),
            );
        } else {
            return {} as any;
        }
    }
}
