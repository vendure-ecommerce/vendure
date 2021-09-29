import { Injectable } from '@nestjs/common';
import { GlobalFlag, ImportInfo, LanguageCode } from '@vendure/common/lib/generated-types';
import { normalizeString } from '@vendure/common/lib/normalize-string';
import { ID } from '@vendure/common/lib/shared-types';
import ProgressBar from 'progress';
import { Observable } from 'rxjs';
import { Stream } from 'stream';

import { RequestContext } from '../../../api/common/request-context';
import { ConfigService } from '../../../config/config.service';
import { CustomFieldConfig } from '../../../config/custom-field/custom-field-types';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { Facet } from '../../../entity/facet/facet.entity';
import { TaxCategory } from '../../../entity/tax-category/tax-category.entity';
import { ChannelService } from '../../../service/services/channel.service';
import { FacetValueService } from '../../../service/services/facet-value.service';
import { FacetService } from '../../../service/services/facet.service';
import { TaxCategoryService } from '../../../service/services/tax-category.service';
import { AssetImporter } from '../asset-importer/asset-importer';
import {
    ImportParser,
    ParsedProductVariant,
    ParsedProductWithVariants,
} from '../import-parser/import-parser';

import { FastImporterService } from './fast-importer.service';

export interface ImportProgress extends ImportInfo {
    currentProduct: string;
}

export type OnProgressFn = (progess: ImportProgress) => void;

@Injectable()
export class Importer {
    private taxCategoryMatches: { [name: string]: ID } = {};
    // These Maps are used to cache newly-created entities and prevent duplicates
    // from being created.
    private facetMap = new Map<string, Facet>();
    private facetValueMap = new Map<string, FacetValue>();

    constructor(
        private configService: ConfigService,
        private importParser: ImportParser,
        private channelService: ChannelService,
        private facetService: FacetService,
        private facetValueService: FacetValueService,
        private taxCategoryService: TaxCategoryService,
        private assetImporter: AssetImporter,
        private fastImporter: FastImporterService,
    ) {}

    parseAndImport(
        input: string | Stream,
        ctxOrLanguageCode: RequestContext | LanguageCode,
        reportProgress: boolean = false,
    ): Observable<ImportProgress> {
        let bar: ProgressBar | undefined;

        return new Observable(subscriber => {
            const p = this.doParseAndImport(input, ctxOrLanguageCode, progress => {
                if (reportProgress) {
                    if (!bar) {
                        bar = new ProgressBar('  importing [:bar] :percent :etas  Importing: :prodName', {
                            complete: '=',
                            incomplete: ' ',
                            total: progress.processed,
                            width: 40,
                        });
                    }
                    bar.tick({ prodName: progress.currentProduct });
                }
                subscriber.next(progress);
            }).then(value => {
                subscriber.next({ ...value, currentProduct: 'Complete' });
                subscriber.complete();
            });
        });
    }

    private async doParseAndImport(
        input: string | Stream,
        ctxOrLanguageCode: RequestContext | LanguageCode,
        onProgress: OnProgressFn,
    ): Promise<ImportInfo> {
        const ctx = await this.getRequestContext(ctxOrLanguageCode);
        const parsed = await this.importParser.parseProducts(input);
        if (parsed && parsed.results.length) {
            try {
                const importErrors = await this.importProducts(ctx, parsed.results, progess => {
                    onProgress({
                        ...progess,
                        processed: parsed.processed,
                    });
                });
                return {
                    errors: parsed.errors.concat(importErrors),
                    imported: parsed.results.length,
                    processed: parsed.processed,
                };
            } catch (err) {
                return {
                    errors: [err.message],
                    imported: 0,
                    processed: parsed.processed,
                };
            }
        } else {
            return {
                errors: [],
                imported: 0,
                processed: parsed.processed,
            };
        }
    }

    private async getRequestContext(
        ctxOrLanguageCode: RequestContext | LanguageCode,
    ): Promise<RequestContext> {
        if (ctxOrLanguageCode instanceof RequestContext) {
            return ctxOrLanguageCode;
        } else {
            const channel = await this.channelService.getDefaultChannel();
            return new RequestContext({
                apiType: 'admin',
                isAuthorized: true,
                authorizedAsOwnerOnly: false,
                channel,
                languageCode: ctxOrLanguageCode,
            });
        }
    }

    /**
     * Imports the products specified in the rows object. Return an array of error messages.
     */
    private async importProducts(
        ctx: RequestContext,
        rows: ParsedProductWithVariants[],
        onProgress: OnProgressFn,
    ): Promise<string[]> {
        let errors: string[] = [];
        let imported = 0;
        const languageCode = ctx.languageCode;
        const taxCategories = await this.taxCategoryService.findAll(ctx);
        await this.fastImporter.initialize();
        for (const { product, variants } of rows) {
            const createProductAssets = await this.assetImporter.getAssets(product.assetPaths);
            const productAssets = createProductAssets.assets;
            if (createProductAssets.errors.length) {
                errors = errors.concat(createProductAssets.errors);
            }
            const customFields = this.processCustomFieldValues(
                product.customFields,
                this.configService.customFields.Product,
            );
            const createdProductId = await this.fastImporter.createProduct({
                featuredAssetId: productAssets.length ? productAssets[0].id : undefined,
                assetIds: productAssets.map(a => a.id),
                facetValueIds: await this.getFacetValueIds(product.facets, languageCode),
                translations: [
                    {
                        languageCode,
                        name: product.name,
                        description: product.description,
                        slug: product.slug,
                        customFields,
                    },
                ],
                customFields,
            });

            const optionsMap: { [optionName: string]: ID } = {};
            for (const optionGroup of product.optionGroups) {
                const code = normalizeString(`${product.name}-${optionGroup.name}`, '-');
                const groupId = await this.fastImporter.createProductOptionGroup({
                    code,
                    options: optionGroup.values.map(name => ({} as any)),
                    translations: [
                        {
                            languageCode,
                            name: optionGroup.name,
                        },
                    ],
                });
                for (const option of optionGroup.values) {
                    const createdOptionId = await this.fastImporter.createProductOption({
                        productOptionGroupId: groupId,
                        code: normalizeString(option, '-'),
                        translations: [
                            {
                                languageCode,
                                name: option,
                            },
                        ],
                    });
                    optionsMap[option] = createdOptionId;
                }
                await this.fastImporter.addOptionGroupToProduct(createdProductId, groupId);
            }

            for (const variant of variants) {
                const createVariantAssets = await this.assetImporter.getAssets(variant.assetPaths);
                const variantAssets = createVariantAssets.assets;
                if (createVariantAssets.errors.length) {
                    errors = errors.concat(createVariantAssets.errors);
                }
                let facetValueIds: ID[] = [];
                if (0 < variant.facets.length) {
                    facetValueIds = await this.getFacetValueIds(variant.facets, languageCode);
                }
                const createdVariant = await this.fastImporter.createProductVariant({
                    productId: createdProductId,
                    facetValueIds,
                    featuredAssetId: variantAssets.length ? variantAssets[0].id : undefined,
                    assetIds: variantAssets.map(a => a.id),
                    sku: variant.sku,
                    taxCategoryId: this.getMatchingTaxCategoryId(variant.taxCategory, taxCategories),
                    stockOnHand: variant.stockOnHand,
                    trackInventory: variant.trackInventory,
                    optionIds: variant.optionValues.map(v => optionsMap[v]),
                    translations: [
                        {
                            languageCode,
                            name: [product.name, ...variant.optionValues].join(' '),
                        },
                    ],
                    price: Math.round(variant.price * 100),
                    customFields: this.processCustomFieldValues(
                        variant.customFields,
                        this.configService.customFields.ProductVariant,
                    ),
                });
            }
            imported++;
            onProgress({
                processed: 0,
                imported,
                errors,
                currentProduct: product.name,
            });
        }
        return errors;
    }

    private async getFacetValueIds(
        facets: ParsedProductVariant['facets'],
        languageCode: LanguageCode,
    ): Promise<ID[]> {
        const facetValueIds: ID[] = [];
        const ctx = new RequestContext({
            channel: this.channelService.getDefaultChannel(),
            apiType: 'admin',
            isAuthorized: true,
            authorizedAsOwnerOnly: false,
            session: {} as any,
        });

        for (const item of facets) {
            const facetName = item.facet;
            const valueName = item.value;

            let facetEntity: Facet;
            const cachedFacet = this.facetMap.get(facetName);
            if (cachedFacet) {
                facetEntity = cachedFacet;
            } else {
                const existing = await this.facetService.findByCode(normalizeString(facetName), languageCode);
                if (existing) {
                    facetEntity = existing;
                } else {
                    facetEntity = await this.facetService.create(ctx, {
                        isPrivate: false,
                        code: normalizeString(facetName, '-'),
                        translations: [{ languageCode, name: facetName }],
                    });
                }
                this.facetMap.set(facetName, facetEntity);
            }

            let facetValueEntity: FacetValue;
            const facetValueMapKey = `${facetName}:${valueName}`;
            const cachedFacetValue = this.facetValueMap.get(facetValueMapKey);
            if (cachedFacetValue) {
                facetValueEntity = cachedFacetValue;
            } else {
                const existing = facetEntity.values.find(v => v.name === valueName);
                if (existing) {
                    facetValueEntity = existing;
                } else {
                    facetValueEntity = await this.facetValueService.create(
                        RequestContext.empty(),
                        facetEntity,
                        {
                            code: normalizeString(valueName, '-'),
                            translations: [{ languageCode, name: valueName }],
                        },
                    );
                }
                this.facetValueMap.set(facetValueMapKey, facetValueEntity);
            }
            facetValueIds.push(facetValueEntity.id);
        }

        return facetValueIds;
    }

    private processCustomFieldValues(customFields: { [field: string]: string }, config: CustomFieldConfig[]) {
        const processed: { [field: string]: string | string[] } = {};
        for (const fieldDef of config) {
            const value = customFields[fieldDef.name];
            processed[fieldDef.name] =
                fieldDef.list === true ? value?.split('|').filter(val => val.trim() !== '') : value;
        }
        return processed;
    }

    /**
     * Attempts to match a TaxCategory entity against the name supplied in the import table. If no matches
     * are found, the first TaxCategory id is returned.
     */
    private getMatchingTaxCategoryId(name: string, taxCategories: TaxCategory[]): ID {
        if (this.taxCategoryMatches[name]) {
            return this.taxCategoryMatches[name];
        }
        const regex = new RegExp(name, 'i');
        const found = taxCategories.find(tc => !!tc.name.match(regex));
        const match = found ? found : taxCategories[0];
        this.taxCategoryMatches[name] = match.id;
        return match.id;
    }
}
