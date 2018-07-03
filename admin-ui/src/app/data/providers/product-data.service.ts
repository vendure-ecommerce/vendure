import { ID } from '../../../../../shared/shared-types';
import { GET_PRODUCT_BY_ID, GET_PRODUCT_LIST } from '../queries/product-queries';
import { GetProductById, GetProductByIdVariables, GetProductList, GetProductListVariables, LanguageCode } from '../types/gql-generated-types';
import { QueryResult } from '../types/query-result';
import { BaseDataService } from './base-data.service';

export class ProductDataService {

    constructor(private baseDataService: BaseDataService) {}

    getProducts(take: number = 10, skip: number = 0): QueryResult<GetProductList, GetProductListVariables> {
        return this.baseDataService
            .query<GetProductList, GetProductListVariables>(GET_PRODUCT_LIST, { take, skip, languageCode: LanguageCode.en });
    }

    getProduct(id: ID): QueryResult<GetProductById, GetProductByIdVariables> {
        const stringId = id.toString();
        return this.baseDataService.query<GetProductById, GetProductByIdVariables>(GET_PRODUCT_BY_ID, {
            id: stringId,
            languageCode: LanguageCode.en,
        });
    }

}
