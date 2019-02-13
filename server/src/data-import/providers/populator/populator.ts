import { Injectable } from '@nestjs/common';

import { LanguageCode } from '../../../../../shared/generated-types';
import { normalizeString } from '../../../../../shared/normalize-string';
import { RequestContext } from '../../../api/common/request-context';
import { defaultShippingCalculator, defaultShippingEligibilityChecker } from '../../../config';
import { TaxCategory } from '../../../entity';
import { Zone } from '../../../entity/zone/zone.entity';
import { ShippingMethodService } from '../../../service';
import { ChannelService } from '../../../service/services/channel.service';
import { CountryService } from '../../../service/services/country.service';
import { TaxCategoryService } from '../../../service/services/tax-category.service';
import { TaxRateService } from '../../../service/services/tax-rate.service';
import { ZoneService } from '../../../service/services/zone.service';

type ZoneMap = Map<string, { entity: Zone; members: string[] }>;

export interface CountryData {
    code: string;
    name: string;
    zone: string;
}

export interface InitialData {
    defaultLanguage: LanguageCode;
    defaultZone: string;
    countries: CountryData[];
    taxRates: Array<{ name: string; percentage: number }>;
    shippingMethods: Array<{ name: string; price: number }>;
}

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
    ) {}

    async populateInitialData(data: InitialData) {
        const channel = await this.channelService.getDefaultChannel();
        const ctx = new RequestContext({
            isAuthorized: true,
            authorizedAsOwnerOnly: false,
            channel,
            languageCode: data.defaultLanguage,
        });

        const zoneMap = await this.populateCountries(ctx, data.countries);
        await this.populateTaxRates(ctx, data.taxRates, zoneMap);
        await this.populateShippingMethods(ctx, data.shippingMethods);
        await this.setChannelDefaults(zoneMap, data, channel);
    }

    private async setChannelDefaults(zoneMap, data: InitialData, channel) {
        const defaultZone = zoneMap.get(data.defaultZone);
        if (!defaultZone) {
            throw new Error(
                `The defaultZone (${data.defaultZone}) did not match any zones from the InitialData`,
            );
        }
        const defaultZoneId = defaultZone.entity.id as string;
        await this.channelService.update({
            id: channel.id as string,
            defaultTaxZoneId: defaultZoneId,
            defaultShippingZoneId: defaultZoneId,
        });
    }

    private async populateCountries(ctx: RequestContext, countries: CountryData[]): Promise<ZoneMap> {
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
            zoneItem.members.push(countryEntity.id as string);
        }

        // add the countries to the respective zones
        for (const zoneItem of zones.values()) {
            await this.zoneService.addMembersToZone(ctx, {
                zoneId: zoneItem.entity.id as string,
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
            const category = await this.taxCategoryService.create({ name: taxRate.name });

            for (const { entity } of zoneMap.values()) {
                await this.taxRateService.create({
                    zoneId: entity.id as string,
                    value: taxRate.percentage,
                    categoryId: category.id as string,
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
            await this.shippingMethodService.create({
                checker: {
                    code: defaultShippingEligibilityChecker.code,
                    arguments: [],
                },
                calculator: {
                    code: defaultShippingCalculator.code,
                    arguments: [{ name: 'rate', value: method.price.toString() }],
                },
                description: method.name,
                code: normalizeString(method.name, '-'),
            });
        }
    }
}
