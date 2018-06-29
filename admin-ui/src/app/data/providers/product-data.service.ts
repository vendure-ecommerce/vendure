import { QueryRef } from 'apollo-angular';

import { ID } from '../../../../../shared/shared-types';
import { GET_PRODUCT_BY_ID, GET_PRODUCT_LIST } from '../queries/product-queries';
import { GetProductById, GetProductByIdVariables, GetProductList, GetProductListVariables, LanguageCode } from '../types/gql-generated-types';

import { BaseDataService } from './base-data.service';

export class ProductDataService {

    constructor(private baseDataService: BaseDataService) {}

    getProducts(take: number = 10, skip: number = 0): QueryRef<GetProductList, GetProductListVariables> {
        return this.baseDataService
            .query<GetProductList, GetProductListVariables>(GET_PRODUCT_LIST, { take, skip, languageCode: LanguageCode.en });
    }

    getProduct(id: ID): any {
        const stringId = id.toString();
        return this.baseDataService.query<GetProductById, GetProductByIdVariables>(GET_PRODUCT_BY_ID, { id: stringId });
    }

}
