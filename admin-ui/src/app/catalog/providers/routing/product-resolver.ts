
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DataService } from '../../../data/providers/data.service';
import { GetProductWithVariants_product } from '../../../data/types/gql-generated-types';
import { finalize, map, take, tap } from 'rxjs/operators';
/**
 * Resolves the id from the path into a Customer entity.
 */

@Injectable()
export class ProductResolver implements Resolve<Observable<GetProductWithVariants_product>> {

    constructor(private dataService: DataService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<GetProductWithVariants_product>> {
        const id = route.paramMap.get('id');

        if (id) {
            const stream = this.dataService.product.getProduct(id).mapStream(data => data.product);
            return stream.pipe(
                take(1),
                map(() => stream),
            );
        } else {
            return {} as any;
        }
    }
}
