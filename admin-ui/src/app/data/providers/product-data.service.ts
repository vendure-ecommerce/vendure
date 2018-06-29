import { QueryRef } from 'apollo-angular';

import { ID } from '../../../../../shared/shared-types';
import { getProductById } from '../../common/queries/get-product-by-id';
import { getProductList } from '../../common/queries/get-product-list';
import {
    GetProductByIdQuery,
    GetProductByIdQueryVariables,
    GetProductListQuery,
    GetProductListQueryVariables,
    LanguageCode,
} from '../../common/types/gql-generated-types';

import { BaseDataService } from './base-data.service';

export class ProductDataService {

    constructor(private baseDataService: BaseDataService) {}

    getProducts(take: number = 10, skip: number = 0): QueryRef<GetProductListQuery, GetProductListQueryVariables> {
        return this.baseDataService
            .query<GetProductListQuery, GetProductListQueryVariables>(getProductList, { take, skip, languageCode: LanguageCode.en });
    }

    getProduct(id: ID): any {
        const stringId = id.toString();
        return this.baseDataService.query<GetProductByIdQuery, GetProductByIdQueryVariables>(getProductById, { id: stringId });
    }

}
