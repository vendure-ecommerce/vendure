import { Observable } from 'rxjs';
import {
    AddOptionGroupToProduct,
    AddOptionGroupToProductVariables,
    ApplyFacetValuesToProductVariants,
    ApplyFacetValuesToProductVariantsVariables,
    CreateAsset,
    CreateAssetInput,
    CreateAssetVariables,
    CreateProduct,
    CreateProductInput,
    CreateProductOptionGroup,
    CreateProductOptionGroupInput,
    CreateProductOptionGroupVariables,
    CreateProductVariables,
    GenerateProductVariants,
    GenerateProductVariantsVariables,
    GetAssetList,
    GetAssetListVariables,
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
} from 'shared/generated-types';
import { pick } from 'shared/pick';

import { getDefaultLanguage } from '../../common/utilities/get-default-language';
import { addCustomFields } from '../add-custom-fields';
import {
    ADD_OPTION_GROUP_TO_PRODUCT,
    APPLY_FACET_VALUE_TO_PRODUCT_VARIANTS,
    CREATE_ASSET,
    CREATE_PRODUCT,
    CREATE_PRODUCT_OPTION_GROUP,
    GENERATE_PRODUCT_VARIANTS,
    GET_ASSET_LIST,
    GET_PRODUCT_LIST,
    GET_PRODUCT_OPTION_GROUPS,
    GET_PRODUCT_WITH_VARIANTS,
    REMOVE_OPTION_GROUP_FROM_PRODUCT,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
} from '../definitions/product-definitions';
import { QueryResult } from '../query-result';

import { BaseDataService } from './base-data.service';

export class ProductDataService {
    constructor(private baseDataService: BaseDataService) {}

    getProducts(take: number = 10, skip: number = 0): QueryResult<GetProductList, GetProductListVariables> {
        return this.baseDataService.query<GetProductList, GetProductListVariables>(GET_PRODUCT_LIST, {
            options: {
                take,
                skip,
            },
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
            input: pick(product, ['image', 'translations', 'optionGroupCodes', 'customFields']),
        };
        return this.baseDataService.mutate<CreateProduct, CreateProductVariables>(
            addCustomFields(CREATE_PRODUCT),
            input,
        );
    }

    updateProduct(product: UpdateProductInput): Observable<UpdateProduct> {
        const input: UpdateProductVariables = {
            input: pick(product, ['id', 'image', 'translations', 'customFields']),
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
            input: variants.map(pick(['id', 'translations', 'sku', 'image', 'price'])),
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

    applyFacetValuesToProductVariants(
        facetValueIds: string[],
        productVariantIds: string[],
    ): Observable<ApplyFacetValuesToProductVariants> {
        return this.baseDataService.mutate<
            ApplyFacetValuesToProductVariants,
            ApplyFacetValuesToProductVariantsVariables
        >(APPLY_FACET_VALUE_TO_PRODUCT_VARIANTS, {
            facetValueIds,
            productVariantIds,
        });
    }

    getAssetList(take: number = 10, skip: number = 0): QueryResult<GetAssetList, GetAssetListVariables> {
        return this.baseDataService.query<GetAssetList, GetAssetListVariables>(GET_ASSET_LIST, {
            options: {
                skip,
                take,
            },
        });
    }

    createAsset(file: File): Observable<CreateAsset> {
        return this.baseDataService.mutate<CreateAsset, CreateAssetVariables>(CREATE_ASSET, {
            input: { file },
        });
    }
}
