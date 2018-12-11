import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Stream } from 'stream';

import { ImportInfo, LanguageCode } from '../../../../../shared/generated-types';
import { normalizeString } from '../../../../../shared/normalize-string';
import { RequestContext } from '../../../api/common/request-context';
import { ConfigService } from '../../../config/config.service';
import { Asset } from '../../../entity/asset/asset.entity';
import { TaxCategory } from '../../../entity/tax-category/tax-category.entity';
import { AssetService } from '../../../service/services/asset.service';
import { ChannelService } from '../../../service/services/channel.service';
import { ProductOptionGroupService } from '../../../service/services/product-option-group.service';
import { ProductOptionService } from '../../../service/services/product-option.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { ProductService } from '../../../service/services/product.service';
import { TaxCategoryService } from '../../../service/services/tax-category.service';
import { ImportParser, ParsedProductWithVariants } from '../import-parser/import-parser';

@Injectable()
export class Importer {
    private taxCategoryMatches: { [name: string]: string } = {};

    constructor(
        private configService: ConfigService,
        private importParser: ImportParser,
        private channelService: ChannelService,
        private productService: ProductService,
        private productVariantService: ProductVariantService,
        private productOptionGroupService: ProductOptionGroupService,
        private assetService: AssetService,
        private taxCategoryService: TaxCategoryService,
        private productOptionService: ProductOptionService,
    ) {}

    async parseAndImport(
        input: string | Stream,
        ctxOrLanguageCode: RequestContext | LanguageCode,
    ): Promise<ImportInfo> {
        let ctx: RequestContext;
        if (ctxOrLanguageCode instanceof RequestContext) {
            ctx = ctxOrLanguageCode;
        } else {
            const channel = await this.channelService.getDefaultChannel();
            ctx = new RequestContext({
                isAuthorized: true,
                authorizedAsOwnerOnly: false,
                channel,
                languageCode: ctxOrLanguageCode,
            });
        }

        let parsed: ParsedProductWithVariants[];
        try {
            parsed = await this.importParser.parseProducts(input);
        } catch (err) {
            return {
                errors: [err.message],
                importedCount: 0,
            };
        }

        if (parsed) {
            try {
                const result = await this.importProducts(ctx, parsed);
                return {
                    errors: [],
                    importedCount: parsed.length,
                };
            } catch (err) {
                return {
                    errors: [err.message],
                    importedCount: 0,
                };
            }
        } else {
            return {
                errors: ['nothing to parse!'],
                importedCount: 0,
            };
        }
    }

    private async importProducts(ctx: RequestContext, rows: ParsedProductWithVariants[]) {
        const languageCode = ctx.languageCode;
        const taxCategories = await this.taxCategoryService.findAll();
        for (const { product, variants } of rows) {
            const productAssets = await this.createAssets(product.assetPaths);
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
            });

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
                    await this.productOptionService.create(group, {
                        code: normalizeString(option, '-'),
                        translations: [
                            {
                                languageCode,
                                name: option,
                            },
                        ],
                    });
                }
                await this.productService.addOptionGroupToProduct(ctx, createdProduct.id, group.id);
            }

            for (const variant of variants) {
                const variantAssets = await this.createAssets(variant.assetPaths);
                await this.productVariantService.create(ctx, createdProduct, {
                    featuredAssetId: variantAssets.length ? (variantAssets[0].id as string) : undefined,
                    assetIds: variantAssets.map(a => a.id) as string[],
                    sku: variant.sku,
                    taxCategoryId: this.getMatchingTaxCategoryId(variant.taxCategory, taxCategories),
                    optionCodes: variant.optionValues.map(v => normalizeString(v, '-')),
                    translations: [
                        {
                            languageCode,
                            name: [product.name, ...variant.optionValues].join(' '),
                        },
                    ],
                    price: Math.round(variant.price * 100),
                });
            }
        }
    }

    private async createAssets(assetPaths: string[]): Promise<Asset[]> {
        const assets: Asset[] = [];
        const { importAssetsDir } = this.configService.importExportOptions;
        for (const assetPath of assetPaths) {
            const filename = path.join(importAssetsDir, assetPath);
            const stream = fs.createReadStream(filename);
            const asset = await this.assetService.createFromFileStream(stream);
            assets.push(asset);
        }
        return assets;
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
