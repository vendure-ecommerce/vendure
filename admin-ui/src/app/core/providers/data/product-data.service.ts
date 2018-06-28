import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ID } from '../../../../../../shared/shared-types';
import { getProductById } from '../../../common/queries/get-product-by-id';
import { getProductList } from '../../../common/queries/get-product-list';
import {
    GetProductByIdQuery,
    GetProductByIdQueryVariables,
    GetProductListQuery,
    GetProductListQueryVariables,
} from '../../../common/types/gql-generated-types';
import { BaseDataService } from './base-data.service';

export class ProductDataService {

    constructor(private baseDataService: BaseDataService) {}

    getProducts(take: number = 10, skip: number = 0): Observable<GetProductListQuery['products']> {
        return this.baseDataService.query<GetProductListQuery, GetProductListQueryVariables>(getProductList, { take, skip }).pipe(
            map(data => data.products),
        );
    }

    getProduct(id: ID): Observable<GetProductByIdQuery['product']> {
        const stringId = id.toString();
        return this.baseDataService.query<GetProductByIdQuery, GetProductByIdQueryVariables>(getProductById, { id: stringId }).pipe(
            map(data => data.product),
        );
    }

}
