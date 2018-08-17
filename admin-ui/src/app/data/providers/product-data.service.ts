import { Observable } from 'rxjs';

import { getDefaultLanguage } from '../../common/utilities/get-default-language';
import { addCustomFields } from '../add-custom-fields';
import {
    ADD_OPTION_GROUP_TO_PRODUCT,
    CREATE_PRODUCT,
    CREATE_PRODUCT_OPTION_GROUP,
    GENERATE_PRODUCT_VARIANTS,
    REMOVE_OPTION_GROUP_FROM_PRODUCT,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
} from '../mutations/product-mutations';
import {
    GET_PRODUCT_LIST,
    GET_PRODUCT_OPTION_GROUPS,
    GET_PRODUCT_WITH_VARIANTS,
} from '../queries/product-queries';
import {
    AddOptionGroupToProduct,
    AddOptionGroupToProductVariables,
    CreateProduct,
    CreateProductInput,
    CreateProductOptionGroup,
    CreateProductOptionGroupInput,
    CreateProductOptionGroupVariables,
    CreateProductVariables,
    GenerateProductVariants,
    GenerateProductVariantsVariables,
    GetProductList,
    GetProductListVariables,
    GetProductOptionGroups,
    GetProductOptionGroupsVariables,
    GetProductWithVariants,
    GetProductWithVariantsVariables,
    RemoveOptionGroupFromProduct,
    RemoveOptionGroupFromProductVariables,
    UpdateProduct,
    UpdateProductInput,
    UpdateProductVariables,
    UpdateProductVariantInput,
    UpdateProductVariants,
    UpdateProductVariantsVariables,
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
            addCustomFields(GET_PRODUCT_WITH_VARIANTS),
            {
                id,
                languageCode: getDefaultLanguage(),
            },
        );
    }

    createProduct(product: CreateProductInput): Observable<CreateProduct> {
        const input: CreateProductVariables = {
            input: {
                image: product.image,
                translations: product.translations,
                optionGroupCodes: product.optionGroupCodes,
                customFields: product.customFields,
            },
        };
        return this.baseDataService.mutate<CreateProduct, CreateProductVariables>(
            addCustomFields(CREATE_PRODUCT),
            input,
        );
    }

    updateProduct(product: UpdateProductInput): Observable<UpdateProduct> {
        const input: UpdateProductVariables = {
            input: {
                id: product.id,
                image: product.image,
                translations: product.translations,
                customFields: product.customFields,
            },
        };
        return this.baseDataService.mutate<UpdateProduct, UpdateProductVariables>(
            addCustomFields(UPDATE_PRODUCT),
            input,
        );
    }

    generateProductVariants(
        productId: string,
        defaultPrice?: number,
        defaultSku?: string,
    ): Observable<GenerateProductVariants> {
        return this.baseDataService.mutate<GenerateProductVariants, GenerateProductVariantsVariables>(
            GENERATE_PRODUCT_VARIANTS,
            { productId, defaultPrice, defaultSku },
        );
    }

    updateProductVariants(variants: UpdateProductVariantInput[]): Observable<UpdateProductVariants> {
        const input: UpdateProductVariantsVariables = {
            input: variants.map(v => ({
                id: v.id,
                translations: v.translations,
                sku: v.sku,
                image: v.image,
                price: v.price,
            })),
        };
        return this.baseDataService.mutate<UpdateProductVariants, UpdateProductVariantsVariables>(
            UPDATE_PRODUCT_VARIANTS,
            input,
        );
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

    removeOptionGroupFromProduct(
        variables: RemoveOptionGroupFromProductVariables,
    ): Observable<RemoveOptionGroupFromProduct> {
        return this.baseDataService.mutate<
            RemoveOptionGroupFromProduct,
            RemoveOptionGroupFromProductVariables
        >(REMOVE_OPTION_GROUP_FROM_PRODUCT, variables);
    }

    getProductOptionGroups(
        filterTerm?: string,
    ): QueryResult<GetProductOptionGroups, GetProductOptionGroupsVariables> {
        return this.baseDataService.query<GetProductOptionGroups, GetProductOptionGroupsVariables>(
            GET_PRODUCT_OPTION_GROUPS,
            {
                filterTerm,
                languageCode: getDefaultLanguage(),
            },
        );
    }
}
