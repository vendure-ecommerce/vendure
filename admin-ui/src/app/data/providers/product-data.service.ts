import { Observable } from 'rxjs';

import { ID } from '../../../../../shared/shared-types';
import { getDefaultLanguage } from '../../common/utilities/get-default-language';
import { CREATE_PRODUCT_OPTION_GROUP, UPDATE_PRODUCT } from '../mutations/product-mutations';
import { GET_PRODUCT_LIST, GET_PRODUCT_WITH_VARIANTS } from '../queries/product-queries';
import {
    GetProductList,
    GetProductListVariables,
    GetProductWithVariants, GetProductWithVariants_product,
    GetProductWithVariantsVariables,
    LanguageCode,
    ProductWithVariants,
    UpdateProduct,
    UpdateProductInput,
    UpdateProductVariables,
} from '../types/gql-generated-types';
import { QueryResult } from '../types/query-result';
import { BaseDataService } from './base-data.service';

export class ProductDataService {

    constructor(private baseDataService: BaseDataService) {}

    getProducts(take: number = 10, skip: number = 0): QueryResult<GetProductList, GetProductListVariables> {
        return this.baseDataService
            .query<GetProductList, GetProductListVariables>(GET_PRODUCT_LIST, { take, skip, languageCode: LanguageCode.en });
    }

    getProduct(id: ID): QueryResult<GetProductWithVariants, GetProductWithVariantsVariables> {
        const stringId = id.toString();
        return this.baseDataService.query<GetProductWithVariants, GetProductWithVariantsVariables>(GET_PRODUCT_WITH_VARIANTS, {
            id: stringId,
            languageCode: getDefaultLanguage(),
        });
    }

    updateProduct(product: GetProductWithVariants_product): Observable<UpdateProduct> {
        const input: UpdateProductVariables = {
            input: {
                id: product.id,
                image: product.image,
                translations: product.translations,
            },
        };
        return this.baseDataService.mutate<UpdateProduct, UpdateProductVariables>(UPDATE_PRODUCT, input);
    }

}
