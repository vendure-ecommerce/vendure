import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, throwError } from 'rxjs';
import { map, mergeMap, shareReplay, skip, switchMap } from 'rxjs/operators';
import { normalizeString } from 'shared/normalize-string';

import {
    CreateProductInput,
    CreateProductVariantInput,
    DeletionResult,
    FacetWithValues,
    LanguageCode,
    UpdateProductInput,
    UpdateProductMutation,
    UpdateProductOptionInput,
    UpdateProductVariantInput,
    UpdateProductVariantsMutation,
} from '../../common/generated-types';
import { DataService } from '../../data/providers/data.service';
import { CreateProductVariantsConfig } from '../components/generate-product-variants/generate-product-variants.component';

/**
 * Handles the logic for making the API calls to perform CRUD operations on a Product and its related
 * entities. This logic was extracted out of the component because it became too large and hard to follow.
 */
@Injectable()
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

    createProduct(
        input: CreateProductInput,
        createVariantsConfig: CreateProductVariantsConfig,
        languageCode: LanguageCode,
    ) {
        const createProduct$ = this.dataService.product.createProduct(input);

        const createOptionGroups$ = createVariantsConfig.groups.length
            ? forkJoin(
                  createVariantsConfig.groups.map(c => {
                      return this.dataService.product.createProductOptionGroups({
                          code: normalizeString(c.name, '-'),
                          translations: [{ languageCode, name: c.name }],
                          options: c.values.map(v => ({
                              code: normalizeString(v, '-'),
                              translations: [{ languageCode, name: v }],
                          })),
                      });
                  }),
              )
            : of([]);

        return forkJoin(createProduct$, createOptionGroups$).pipe(
            mergeMap(([{ createProduct }, createOptionGroups]) => {
                const optionGroups = createOptionGroups.map(g => g.createProductOptionGroup);
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
                const variants: CreateProductVariantInput[] = createVariantsConfig.variants.map(v => {
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
                    const name = optionGroups.length
                        ? `${createProduct.name} ${v.optionValues.join(' ')}`
                        : createProduct.name;
                    return {
                        productId: createProduct.id,
                        price: v.price,
                        sku: v.sku,
                        stockOnHand: v.stock,
                        translations: [
                            {
                                languageCode,
                                name,
                            },
                        ],
                        optionIds,
                    };
                });
                return this.dataService.product.createProductVariants(variants).pipe(
                    map(({ createProductVariants }) => ({
                        createProductVariants,
                        productId: createProduct.id,
                    })),
                );
            }),
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
