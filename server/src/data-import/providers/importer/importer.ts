import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Observable } from 'rxjs';
import { Stream } from 'stream';

import { ImportInfo, LanguageCode } from '../../../../../shared/generated-types';
import { normalizeString } from '../../../../../shared/normalize-string';
import { RequestContext } from '../../../api/common/request-context';
import { ConfigService } from '../../../config/config.service';
import { Asset } from '../../../entity/asset/asset.entity';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { Facet } from '../../../entity/facet/facet.entity';
import { TaxCategory } from '../../../entity/tax-category/tax-category.entity';
import { AssetService } from '../../../service/services/asset.service';
import { ChannelService } from '../../../service/services/channel.service';
import { FacetValueService } from '../../../service/services/facet-value.service';
import { FacetService } from '../../../service/services/facet.service';
import { ProductOptionGroupService } from '../../../service/services/product-option-group.service';
import { ProductOptionService } from '../../../service/services/product-option.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { ProductService } from '../../../service/services/product.service';
import { TaxCategoryService } from '../../../service/services/tax-category.service';
import {
    ImportParser,
    ParsedProductVariant,
    ParsedProductWithVariants,
} from '../import-parser/import-parser';

export interface ImportProgress extends ImportInfo {
    currentProduct: string;
}
export type OnProgressFn = (progess: ImportProgress) => void;

@Injectable()
export class Importer {
    private taxCategoryMatches: { [name: string]: string } = {};
    // These Maps are used to cache newly-created entities and prevent duplicates
    // from being created.
    private assetMap = new Map<string, Asset>();
    private facetMap = new Map<string, Facet>();
    private facetValueMap = new Map<string, FacetValue>();

    constructor(
        private configService: ConfigService,
        private importParser: ImportParser,
        private channelService: ChannelService,
        private productService: ProductService,
        private facetService: FacetService,
        private facetValueService: FacetValueService,
        private productVariantService: ProductVariantService,
        private productOptionGroupService: ProductOptionGroupService,
        private assetService: AssetService,
        private taxCategoryService: TaxCategoryService,
        private productOptionService: ProductOptionService,
    ) {}

    parseAndImport(
        input: string | Stream,
        ctxOrLanguageCode: RequestContext | LanguageCode,
    ): Observable<ImportProgress> {
        return new Observable(subscriber => {
            const p = this.doParseAndImport(input, ctxOrLanguageCode, progress => {
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
                errors: ['nothing to parse!'],
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
        const taxCategories = await this.taxCategoryService.findAll();
        for (const { product, variants } of rows) {
            const createProductAssets = await this.getAssets(product.assetPaths);
            const productAssets = createProductAssets.assets;
            if (createProductAssets.errors.length) {
                errors = errors.concat(createProductAssets.errors);
            }
            const createdProduct = await this.productService.create(ctx, {
                featuredAssetId: productAssets.length ? (productAssets[0].id as string) : undefined,
                assetIds: productAssets.map(a => a.id) as string[],
                translations: [
                    {
                        languageCode,
                        name: product.name,
                        description: product.description,
                        slug: product.slug,
                    },
                ],
                customFields: product.customFields,
            });

            const optionsMap: { [optionName: string]: string } = {};
            for (const optionGroup of product.optionGroups) {
                const code = normalizeString(`${product.name}-${optionGroup.name}`, '-');
                const group = await this.productOptionGroupService.create({
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
                    const createdOption = await this.productOptionService.create(group, {
                        code: normalizeString(option, '-'),
                        translations: [
                            {
                                languageCode,
                                name: option,
                            },
                        ],
                    });
                    optionsMap[option] = createdOption.id as string;
                }
                await this.productService.addOptionGroupToProduct(ctx, createdProduct.id, group.id);
            }

            for (const variant of variants) {
                const createVariantAssets = await this.getAssets(variant.assetPaths);
                const variantAssets = createVariantAssets.assets;
                if (createVariantAssets.errors.length) {
                    errors = errors.concat(createVariantAssets.errors);
                }
                let facetValueIds: string[] = [];
                if (0 < variant.facets.length) {
                    facetValueIds = await this.getFacetValueIds(variant.facets, languageCode);
                }
                const createdVariant = await this.productVariantService.create(ctx, createdProduct, {
                    facetValueIds,
                    featuredAssetId: variantAssets.length ? (variantAssets[0].id as string) : undefined,
                    assetIds: variantAssets.map(a => a.id) as string[],
                    sku: variant.sku,
                    taxCategoryId: this.getMatchingTaxCategoryId(variant.taxCategory, taxCategories),
                    optionIds: variant.optionValues.map(v => optionsMap[v]),
                    translations: [
                        {
                            languageCode,
                            name: [product.name, ...variant.optionValues].join(' '),
                        },
                    ],
                    price: Math.round(variant.price * 100),
                    customFields: variant.customFields,
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

    /**
     * Creates Asset entities for the given paths, using the assetMap cache to prevent the
     * creation of duplicates.
     */
    private async getAssets(assetPaths: string[]): Promise<{ assets: Asset[]; errors: string[] }> {
        const assets: Asset[] = [];
        const errors: string[] = [];
        const { importAssetsDir } = this.configService.importExportOptions;
        for (const assetPath of assetPaths) {
            const cachedAsset = this.assetMap.get(assetPath);
            if (cachedAsset) {
                assets.push(cachedAsset);
            } else {
                const filename = path.join(importAssetsDir, assetPath);
                if (fs.existsSync(filename)) {
                    try {
                        const stream = fs.createReadStream(filename);
                        const asset = await this.assetService.createFromFileStream(stream);
                        this.assetMap.set(assetPath, asset);
                        assets.push(asset);
                    } catch (err) {
                        errors.push(err.toString());
                    }
                } else {
                    errors.push(`File "${filename}" does not exist`);
                }
            }
        }
        return { assets, errors };
    }

    private async getFacetValueIds(
        facets: ParsedProductVariant['facets'],
        languageCode: LanguageCode,
    ): Promise<string[]> {
        const facetValueIds: string[] = [];

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
                    facetEntity = await this.facetService.create({
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
                    facetValueEntity = await this.facetValueService.create(facetEntity, {
                        code: normalizeString(valueName, '-'),
                        translations: [{ languageCode, name: valueName }],
                    });
                }
                this.facetValueMap.set(facetValueMapKey, facetValueEntity);
            }
            facetValueIds.push(facetValueEntity.id as string);
        }

        return facetValueIds;
    }

    /**
     * Attempts to match a TaxCategory entity against the name supplied in the import table. If no matches
     * are found, the first TaxCategory id is returned.
     */
    private getMatchingTaxCategoryId(name: string, taxCategories: TaxCategory[]): string {
        if (this.taxCategoryMatches[name]) {
            return this.taxCategoryMatches[name];
        }
        const regex = new RegExp(name, 'i');
        const found = taxCategories.find(tc => !!tc.name.match(regex));
        const match = found ? found : taxCategories[0];
        this.taxCategoryService[name] = match.id;
        return match.id as string;
    }
}
