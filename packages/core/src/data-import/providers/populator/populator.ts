import { Injectable } from '@nestjs/common';
import { ConfigurableOperationInput, LanguageCode } from '@vendure/common/lib/generated-types';
import { normalizeString } from '@vendure/common/lib/normalize-string';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';

import { RequestContext } from '../../../api/common/request-context';
import { defaultShippingCalculator, defaultShippingEligibilityChecker } from '../../../config';
import { manualFulfillmentHandler } from '../../../config/fulfillment/manual-fulfillment-handler';
import { Channel, Collection, FacetValue, TaxCategory } from '../../../entity';
import {
    CollectionService,
    FacetValueService,
    PaymentMethodService,
    ShippingMethodService,
} from '../../../service';
import { ChannelService } from '../../../service/services/channel.service';
import { CountryService } from '../../../service/services/country.service';
import { SearchService } from '../../../service/services/search.service';
import { TaxCategoryService } from '../../../service/services/tax-category.service';
import { TaxRateService } from '../../../service/services/tax-rate.service';
import { ZoneService } from '../../../service/services/zone.service';
import { CollectionFilterDefinition, CountryDefinition, InitialData, ZoneMap } from '../../types';
import { AssetImporter } from '../asset-importer/asset-importer';

/**
 * Responsible for populating the database with initial data.
 */
@Injectable()
export class Populator {
    constructor(
        private countryService: CountryService,
        private zoneService: ZoneService,
        private channelService: ChannelService,
        private taxRateService: TaxRateService,
        private taxCategoryService: TaxCategoryService,
        private shippingMethodService: ShippingMethodService,
        private paymentMethodService: PaymentMethodService,
        private collectionService: CollectionService,
        private facetValueService: FacetValueService,
        private searchService: SearchService,
        private assetImporter: AssetImporter,
    ) {}

    /**
     * Should be run *before* populating the products, so that there are TaxRates by which
     * product prices can be set.
     */
    async populateInitialData(data: InitialData) {
        const { channel, ctx } = await this.createRequestContext(data);

        const zoneMap = await this.populateCountries(ctx, data.countries);
        await this.populateTaxRates(ctx, data.taxRates, zoneMap);
        await this.populateShippingMethods(ctx, data.shippingMethods);
        await this.populatePaymentMethods(ctx, data.paymentMethods);
        await this.setChannelDefaults(zoneMap, data, channel);
    }

    /**
     * Should be run *after* the products have been populated, otherwise the expected FacetValues will not
     * yet exist.
     */
    async populateCollections(data: InitialData) {
        const { ctx } = await this.createRequestContext(data);

        const allFacetValues = await this.facetValueService.findAll(ctx.languageCode);
        const collectionMap = new Map<string, Collection>();
        for (const collectionDef of data.collections) {
            const parent = collectionDef.parentName && collectionMap.get(collectionDef.parentName);
            const parentId = parent ? parent.id.toString() : undefined;
            const { assets } = await this.assetImporter.getAssets(collectionDef.assetPaths || []);

            const collection = await this.collectionService.create(ctx, {
                translations: [
                    {
                        languageCode: ctx.languageCode,
                        name: collectionDef.name,
                        description: collectionDef.description || '',
                        slug: collectionDef.slug ?? collectionDef.name,
                    },
                ],
                isPrivate: collectionDef.private || false,
                parentId,
                assetIds: assets.map(a => a.id.toString()),
                featuredAssetId: assets.length ? assets[0].id.toString() : undefined,
                filters: (collectionDef.filters || []).map(filter =>
                    this.processFilterDefinition(filter, allFacetValues),
                ),
            });
            collectionMap.set(collectionDef.name, collection);
        }
        // Wait for the created collection operations to complete before running
        // the reindex of the search index.
        await new Promise(resolve => setTimeout(resolve, 50));
        await this.searchService.reindex(ctx);
    }

    private processFilterDefinition(
        filter: CollectionFilterDefinition,
        allFacetValues: FacetValue[],
    ): ConfigurableOperationInput {
        switch (filter.code) {
            case 'facet-value-filter':
                const facetValueIds = filter.args.facetValueNames
                    .map(name => allFacetValues.find(fv => fv.name === name))
                    .filter(notNullOrUndefined)
                    .map(fv => fv.id);
                return {
                    code: filter.code,
                    arguments: [
                        {
                            name: 'facetValueIds',
                            value: JSON.stringify(facetValueIds),
                        },
                        {
                            name: 'containsAny',
                            value: filter.args.containsAny.toString(),
                        },
                    ],
                };
            default:
                throw new Error(`Filter with code "${filter.code}" is not recognized.`);
        }
    }

    private async createRequestContext(data: InitialData) {
        const channel = await this.channelService.getDefaultChannel();
        const ctx = new RequestContext({
            apiType: 'admin',
            isAuthorized: true,
            authorizedAsOwnerOnly: false,
            channel,
            languageCode: data.defaultLanguage,
        });
        return { channel, ctx };
    }

    private async setChannelDefaults(zoneMap: ZoneMap, data: InitialData, channel: Channel) {
        const defaultZone = zoneMap.get(data.defaultZone);
        if (!defaultZone) {
            throw new Error(
                `The defaultZone (${data.defaultZone}) did not match any zones from the InitialData`,
            );
        }
        const defaultZoneId = defaultZone.entity.id;
        await this.channelService.update(RequestContext.empty(), {
            id: channel.id,
            defaultTaxZoneId: defaultZoneId,
            defaultShippingZoneId: defaultZoneId,
        });
    }

    private async populateCountries(ctx: RequestContext, countries: CountryDefinition[]): Promise<ZoneMap> {
        const zones: ZoneMap = new Map();
        for (const { name, code, zone } of countries) {
            const countryEntity = await this.countryService.create(ctx, {
                code,
                enabled: true,
                translations: [{ languageCode: ctx.languageCode, name }],
            });

            let zoneItem = zones.get(zone);
            if (!zoneItem) {
                const zoneEntity = await this.zoneService.create(ctx, { name: zone });
                zoneItem = { entity: zoneEntity, members: [] };
                zones.set(zone, zoneItem);
            }
            zoneItem.members.push(countryEntity.id);
        }

        // add the countries to the respective zones
        for (const zoneItem of zones.values()) {
            await this.zoneService.addMembersToZone(ctx, {
                zoneId: zoneItem.entity.id,
                memberIds: zoneItem.members,
            });
        }
        return zones;
    }

    private async populateTaxRates(
        ctx: RequestContext,
        taxRates: Array<{ name: string; percentage: number }>,
        zoneMap: ZoneMap,
    ) {
        const taxCategories: TaxCategory[] = [];

        for (const taxRate of taxRates) {
            const category = await this.taxCategoryService.create(ctx, { name: taxRate.name });

            for (const { entity } of zoneMap.values()) {
                await this.taxRateService.create(ctx, {
                    zoneId: entity.id,
                    value: taxRate.percentage,
                    categoryId: category.id,
                    name: `${taxRate.name} ${entity.name}`,
                    enabled: true,
                });
            }
        }
    }

    private async populateShippingMethods(
        ctx: RequestContext,
        shippingMethods: Array<{ name: string; price: number }>,
    ) {
        for (const method of shippingMethods) {
            await this.shippingMethodService.create(ctx, {
                fulfillmentHandler: manualFulfillmentHandler.code,
                checker: {
                    code: defaultShippingEligibilityChecker.code,
                    arguments: [{ name: 'orderMinimum', value: '0' }],
                },
                calculator: {
                    code: defaultShippingCalculator.code,
                    arguments: [
                        { name: 'rate', value: method.price.toString() },
                        { name: 'taxRate', value: '0' },
                    ],
                },
                code: normalizeString(method.name, '-'),
                translations: [{ languageCode: ctx.languageCode, name: method.name, description: '' }],
            });
        }
    }

    private async populatePaymentMethods(ctx: RequestContext, paymentMethods: InitialData['paymentMethods']) {
        for (const method of paymentMethods) {
            await this.paymentMethodService.create(ctx, {
                name: method.name,
                code: normalizeString(method.name, '-'),
                enabled: true,
                handler: method.handler,
            });
        }
    }
}
