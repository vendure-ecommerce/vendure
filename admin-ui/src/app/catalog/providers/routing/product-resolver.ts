import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { ProductWithVariants } from 'shared/generated-types';
import { notNullOrUndefined } from 'shared/shared-utils';

import { getDefaultLanguage } from '../../../common/utilities/get-default-language';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */

@Injectable()
export class ProductResolver implements Resolve<Observable<ProductWithVariants>> {
    constructor(private dataService: DataService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<Observable<ProductWithVariants>> {
        const id = route.paramMap.get('id');

        if (id === 'create') {
            return of(
                of({
                    __typename: 'Product' as 'Product',
                    id: '',
                    languageCode: getDefaultLanguage(),
                    name: '',
                    slug: '',
                    image: '',
                    description: '',
                    translations: [],
                    optionGroups: [],
                    variants: [],
                }),
            );
        } else if (id) {
            const stream = this.dataService.product
                .getProduct(id)
                .mapStream(data => data.product)
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
