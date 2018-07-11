import { Observable } from 'rxjs';

import { getDefaultLanguage } from '../../common/utilities/get-default-language';
import {
    ADD_OPTION_GROUP_TO_PRODUCT,
    CREATE_PRODUCT_OPTION_GROUP,
    UPDATE_PRODUCT,
} from '../mutations/product-mutations';
import { GET_PRODUCT_LIST, GET_PRODUCT_WITH_VARIANTS } from '../queries/product-queries';
import {
    AddOptionGroupToProduct,
    AddOptionGroupToProductVariables,
    CreateProductOptionGroup,
    CreateProductOptionGroupInput,
    CreateProductOptionGroupVariables,
    GetProductList,
    GetProductListVariables,
    GetProductWithVariants,
    GetProductWithVariantsVariables,
    UpdateProduct,
    UpdateProductInput,
    UpdateProductVariables,
} from '../types/gql-generated-types';
import { QueryResult } from '../types/query-result';

import { BaseDataService } from './base-data.service';

export class ProductDataService {
    constructor(private baseDataService: BaseDataService) {}

    getProducts(take: number = 10, skip: number = 0): QueryResult<GetProductList, GetProductListVariables> {
        return this.baseDataService.query<GetProductList, GetProductListVariables>(GET_PRODUCT_LIST, {
            take,
            skip,
            languageCode: getDefaultLanguage(),
        });
    }

    getProduct(id: string): QueryResult<GetProductWithVariants, GetProductWithVariantsVariables> {
        return this.baseDataService.query<GetProductWithVariants, GetProductWithVariantsVariables>(
            GET_PRODUCT_WITH_VARIANTS,
            {
                id,
                languageCode: getDefaultLanguage(),
            },
        );
    }

    updateProduct(product: UpdateProductInput): Observable<UpdateProduct> {
        const input: UpdateProductVariables = {
            input: {
                id: product.id,
                image: product.image,
                translations: product.translations,
            },
        };
        return this.baseDataService.mutate<UpdateProduct, UpdateProductVariables>(UPDATE_PRODUCT, input);
    }

    createProductOptionGroups(
        productOptionGroup: CreateProductOptionGroupInput,
    ): Observable<CreateProductOptionGroup> {
        const input: CreateProductOptionGroupVariables = {
            input: productOptionGroup,
        };
        return this.baseDataService.mutate<CreateProductOptionGroup, CreateProductOptionGroupVariables>(
            CREATE_PRODUCT_OPTION_GROUP,
            input,
        );
    }

    addOptionGroupToProduct(
        variables: AddOptionGroupToProductVariables,
    ): Observable<AddOptionGroupToProduct> {
        return this.baseDataService.mutate<AddOptionGroupToProduct, AddOptionGroupToProductVariables>(
            ADD_OPTION_GROUP_TO_PRODUCT,
            variables,
        );
    }
}
