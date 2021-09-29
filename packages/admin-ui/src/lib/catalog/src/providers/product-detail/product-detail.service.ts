import { Injectable } from '@angular/core';
import {
    CreateProductInput,
    CreateProductVariantInput,
    DataService,
    DeletionResult,
    FacetWithValues,
    findTranslation,
    LanguageCode,
    ProductWithVariants,
    UpdateProductInput,
    UpdateProductMutation,
    UpdateProductOptionInput,
    UpdateProductVariantInput,
    UpdateProductVariantsMutation,
} from '@vendure/admin-ui/core';
import { normalizeString } from '@vendure/common/lib/normalize-string';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { map, mergeMap, shareReplay, switchMap } from 'rxjs/operators';

import { CreateProductVariantsConfig } from '../../components/generate-product-variants/generate-product-variants.component';

import { replaceLast } from './replace-last';

/**
 * Handles the logic for making the API calls to perform CRUD operations on a Product and its related
 * entities. This logic was extracted out of the component because it became too large and hard to follow.
 */
@Injectable({
    providedIn: 'root',
})
export class ProductDetailService {
    constructor(private dataService: DataService) {}

    getFacets(): Observable<FacetWithValues.Fragment[]> {
        return this.dataService.facet.getAllFacets().mapSingle(data => data.facets.items);
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

    updateProduct(updateOptions: {
        product: ProductWithVariants.Fragment;
        languageCode: LanguageCode;
        autoUpdate: boolean;
        productInput?: UpdateProductInput;
        variantsInput?: UpdateProductVariantInput[];
    }) {
        const { product, languageCode, autoUpdate, productInput, variantsInput } = updateOptions;
        const updateOperations: Array<Observable<UpdateProductMutation | UpdateProductVariantsMutation>> = [];
        const updateVariantsInput = variantsInput || [];
        if (productInput) {
            updateOperations.push(this.dataService.product.updateProduct(productInput));

            const productOldName = findTranslation(product, languageCode)?.name ?? '';
            const productNewName = findTranslation(productInput, languageCode)?.name;
            if (productNewName && productOldName !== productNewName && autoUpdate) {
                for (const variant of product.variants) {
                    const currentVariantName = findTranslation(variant, languageCode)?.name || '';
                    let variantInput: UpdateProductVariantInput;
                    const existingVariantInput = updateVariantsInput.find(i => i.id === variant.id);
                    if (existingVariantInput) {
                        variantInput = existingVariantInput;
                    } else {
                        variantInput = {
                            id: variant.id,
                            translations: [{ languageCode, name: currentVariantName }],
                        };
                        updateVariantsInput.push(variantInput);
                    }
                    const variantTranslation = findTranslation(variantInput, languageCode);
                    if (variantTranslation) {
                        if (variantTranslation.name) {
                            variantTranslation.name = replaceLast(
                                variantTranslation.name,
                                productOldName,
                                productNewName,
                            );
                        } else {
                            // The variant translation was falsy, which occurs
                            // when defining the product name for a new translation
                            // language that had not yet been defined.
                            variantTranslation.name = [
                                productNewName,
                                ...variant.options.map(o => o.name),
                            ].join(' ');
                        }
                    }
                }
            }
        }
        if (updateVariantsInput.length) {
            updateOperations.push(this.dataService.product.updateProductVariants(updateVariantsInput));
        }
        return forkJoin(updateOperations);
    }

    updateProductOption(
        input: UpdateProductOptionInput & { autoUpdate: boolean },
        product: ProductWithVariants.Fragment,
        languageCode: LanguageCode,
    ) {
        let updateProductVariantNames$: Observable<any> = of([]);
        if (input.autoUpdate) {
            // Update any ProductVariants' names which include the option name
            let oldOptionName: string | undefined;
            const newOptionName = findTranslation(input, languageCode)?.name;
            if (!newOptionName) {
                updateProductVariantNames$ = of([]);
            }
            const variantsToUpdate: UpdateProductVariantInput[] = [];
            for (const variant of product.variants) {
                if (variant.options.map(o => o.id).includes(input.id)) {
                    if (!oldOptionName) {
                        oldOptionName = findTranslation(
                            variant.options.find(o => o.id === input.id),
                            languageCode,
                        )?.name;
                    }
                    const variantName = findTranslation(variant, languageCode)?.name || '';
                    if (oldOptionName && newOptionName && variantName.includes(oldOptionName)) {
                        variantsToUpdate.push({
                            id: variant.id,
                            translations: [
                                {
                                    languageCode,
                                    name: replaceLast(variantName, oldOptionName, newOptionName),
                                },
                            ],
                        });
                    }
                }
            }
            if (variantsToUpdate.length) {
                updateProductVariantNames$ = this.dataService.product.updateProductVariants(variantsToUpdate);
            }
        }
        return this.dataService.product
            .updateProductOption(input)
            .pipe(mergeMap(() => updateProductVariantNames$));
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
