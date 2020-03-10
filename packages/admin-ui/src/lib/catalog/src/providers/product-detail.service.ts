import { Injectable } from '@angular/core';
import {
    CreateProductInput,
    CreateProductVariantInput,
    DeletionResult,
    FacetWithValues,
    LanguageCode,
    ProductOptionGroup,
    UpdateProductInput,
    UpdateProductMutation,
    UpdateProductOptionInput,
    UpdateProductVariantInput,
    UpdateProductVariantsMutation,
} from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';
import { normalizeString } from '@vendure/common/lib/normalize-string';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { BehaviorSubject, forkJoin, Observable, of, throwError } from 'rxjs';
import { map, mergeMap, shareReplay, skip, switchMap } from 'rxjs/operators';

import { CreateProductVariantsConfig } from '../components/generate-product-variants/generate-product-variants.component';

/**
 * Handles the logic for making the API calls to perform CRUD operations on a Product and its related
 * entities. This logic was extracted out of the component because it became too large and hard to follow.
 */
@Injectable({
    providedIn: 'root',
})
export class ProductDetailService {
    private facetsSubject = new BehaviorSubject<FacetWithValues.Fragment[]>([]);

    constructor(private dataService: DataService) {}

    getFacets(): Observable<FacetWithValues.Fragment[]> {
        let skipValue = 0;
        if (this.facetsSubject.value.length === 0) {
            this.dataService.facet
                .getFacets(9999999, 0)
                .mapSingle(data => data.facets.items)
                .subscribe(items => this.facetsSubject.next(items));
            skipValue = 1;
        }

        return this.facetsSubject.pipe(
            skip(skipValue),
            shareReplay(1),
        );
    }

    getTaxCategories() {
        return this.dataService.settings
            .getTaxCategories()
            .mapSingle(data => data.taxCategories)
            .pipe(shareReplay(1));
    }

    createProductWithVariants(
        input: CreateProductInput,
        createVariantsConfig: CreateProductVariantsConfig,
        languageCode: LanguageCode,
    ) {
        const createProduct$ = this.dataService.product.createProduct(input);
        const nonEmptyOptionGroups = createVariantsConfig.groups.filter(g => 0 < g.values.length);
        const createOptionGroups$ = this.createProductOptionGroups(nonEmptyOptionGroups, languageCode);

        return forkJoin(createProduct$, createOptionGroups$).pipe(
            mergeMap(([{ createProduct }, optionGroups]) => {
                const addOptionsToProduct$ = optionGroups.length
                    ? forkJoin(
                          optionGroups.map(optionGroup => {
                              return this.dataService.product.addOptionGroupToProduct({
                                  productId: createProduct.id,
                                  optionGroupId: optionGroup.id,
                              });
                          }),
                      )
                    : of([]);
                return addOptionsToProduct$.pipe(
                    map(() => {
                        return { createProduct, optionGroups };
                    }),
                );
            }),
            mergeMap(({ createProduct, optionGroups }) => {
                const variants = createVariantsConfig.variants.map(v => {
                    const optionIds = optionGroups.length
                        ? v.optionValues.map((optionName, index) => {
                              const option = optionGroups[index].options.find(o => o.name === optionName);
                              if (!option) {
                                  throw new Error(
                                      `Could not find a matching ProductOption "${optionName}" when creating variant`,
                                  );
                              }
                              return option.id;
                          })
                        : [];
                    return {
                        ...v,
                        optionIds,
                    };
                });
                const options = optionGroups.map(og => og.options).reduce((flat, o) => [...flat, ...o], []);
                return this.createProductVariants(createProduct, variants, options, languageCode);
            }),
        );
    }

    createProductOptionGroups(groups: Array<{ name: string; values: string[] }>, languageCode: LanguageCode) {
        return groups.length
            ? forkJoin(
                  groups.map(c => {
                      return this.dataService.product
                          .createProductOptionGroups({
                              code: normalizeString(c.name, '-'),
                              translations: [{ languageCode, name: c.name }],
                              options: c.values.map(v => ({
                                  code: normalizeString(v, '-'),
                                  translations: [{ languageCode, name: v }],
                              })),
                          })
                          .pipe(map(data => data.createProductOptionGroup));
                  }),
              )
            : of([]);
    }

    createProductVariants(
        product: { name: string; id: string },
        variantData: Array<{ price: number; sku: string; stock: number; optionIds: string[] }>,
        options: Array<{ id: string; name: string }>,
        languageCode: LanguageCode,
    ) {
        const variants: CreateProductVariantInput[] = variantData.map(v => {
            const name = options.length
                ? `${product.name} ${v.optionIds
                      .map(id => options.find(o => o.id === id))
                      .filter(notNullOrUndefined)
                      .map(o => o.name)
                      .join(' ')}`
                : product.name;
            return {
                productId: product.id,
                price: v.price,
                sku: v.sku,
                stockOnHand: v.stock,
                translations: [
                    {
                        languageCode,
                        name,
                    },
                ],
                optionIds: v.optionIds,
            };
        });
        return this.dataService.product.createProductVariants(variants).pipe(
            map(({ createProductVariants }) => ({
                createProductVariants,
                productId: product.id,
            })),
        );
    }

    updateProduct(productInput?: UpdateProductInput, variantInput?: UpdateProductVariantInput[]) {
        const updateOperations: Array<Observable<UpdateProductMutation | UpdateProductVariantsMutation>> = [];
        if (productInput) {
            updateOperations.push(this.dataService.product.updateProduct(productInput));
        }
        if (variantInput) {
            updateOperations.push(this.dataService.product.updateProductVariants(variantInput));
        }
        return forkJoin(updateOperations);
    }

    updateProductOption(input: UpdateProductOptionInput) {
        return this.dataService.product.updateProductOption(input);
    }

    deleteProductVariant(id: string, productId: string) {
        return this.dataService.product.deleteProductVariant(id).pipe(
            switchMap(result => {
                if (result.deleteProductVariant.result === DeletionResult.DELETED) {
                    return this.dataService.product.getProduct(productId).single$;
                } else {
                    return throwError(result.deleteProductVariant.message);
                }
            }),
        );
    }
}
