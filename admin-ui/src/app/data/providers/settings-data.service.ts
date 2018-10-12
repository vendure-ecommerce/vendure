import {
    AddMembersToZone,
    CreateCountry,
    CreateCountryInput,
    CreateTaxCategory,
    CreateTaxCategoryInput,
    CreateZone,
    CreateZoneInput,
    GetCountry,
    GetCountryList,
    GetTaxCategories,
    GetTaxCategory,
    GetZone,
    GetZones,
    RemoveMembersFromZone,
    UpdateCountry,
    UpdateCountryInput,
    UpdateTaxCategory,
    UpdateTaxCategoryInput,
    UpdateZone,
    UpdateZoneInput,
} from 'shared/generated-types';

import {
    ADD_MEMBERS_TO_ZONE,
    CREATE_COUNTRY,
    CREATE_TAX_CATEGORY,
    CREATE_ZONE,
    GET_COUNTRY,
    GET_COUNTRY_LIST,
    GET_TAX_CATEGORIES,
    GET_TAX_CATEGORY,
    GET_ZONES,
    REMOVE_MEMBERS_FROM_ZONE,
    UPDATE_COUNTRY,
    UPDATE_TAX_CATEGORY,
    UPDATE_ZONE,
} from '../definitions/settings-definitions';

import { BaseDataService } from './base-data.service';

export class SettingsDataService {
    constructor(private baseDataService: BaseDataService) {}

    getCountries(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<GetCountryList.Query, GetCountryList.Variables>(GET_COUNTRY_LIST, {
            options: {
                take,
                skip,
            },
        });
    }

    getCountry(id: string) {
        return this.baseDataService.query<GetCountry.Query, GetCountry.Variables>(GET_COUNTRY, { id });
    }

    createCountry(input: CreateCountryInput) {
        return this.baseDataService.mutate<CreateCountry.Mutation, CreateCountry.Variables>(CREATE_COUNTRY, {
            input,
        });
    }

    updateCountry(input: UpdateCountryInput) {
        return this.baseDataService.mutate<UpdateCountry.Mutation, UpdateCountry.Variables>(UPDATE_COUNTRY, {
            input,
        });
    }

    getZones() {
        return this.baseDataService.query<GetZones.Query>(GET_ZONES);
    }

    getZone(id: string) {
        return this.baseDataService.query<GetZone.Query, GetZone.Variables>(GET_ZONES, { id });
    }

    createZone(input: CreateZoneInput) {
        return this.baseDataService.mutate<CreateZone.Mutation, CreateZone.Variables>(CREATE_ZONE, {
            input,
        });
    }

    updateZone(input: UpdateZoneInput) {
        return this.baseDataService.mutate<UpdateZone.Mutation, UpdateZone.Variables>(UPDATE_ZONE, {
            input,
        });
    }

    addMembersToZone(zoneId: string, memberIds: string[]) {
        return this.baseDataService.mutate<AddMembersToZone.Mutation, AddMembersToZone.Variables>(
            ADD_MEMBERS_TO_ZONE,
            {
                zoneId,
                memberIds,
            },
        );
    }

    removeMembersFromZone(zoneId: string, memberIds: string[]) {
        return this.baseDataService.mutate<RemoveMembersFromZone.Mutation, RemoveMembersFromZone.Variables>(
            REMOVE_MEMBERS_FROM_ZONE,
            {
                zoneId,
                memberIds,
            },
        );
    }

    getTaxCategories() {
        return this.baseDataService.query<GetTaxCategories.Query>(GET_TAX_CATEGORIES);
    }

    getTaxCategory(id: string) {
        return this.baseDataService.query<GetTaxCategory.Query, GetTaxCategory.Variables>(GET_TAX_CATEGORY, {
            id,
        });
    }

    createTaxCategory(input: CreateTaxCategoryInput) {
        return this.baseDataService.mutate<CreateTaxCategory.Mutation, CreateTaxCategory.Variables>(
            CREATE_TAX_CATEGORY,
            {
                input,
            },
        );
    }

    updateTaxCategory(input: UpdateTaxCategoryInput) {
        return this.baseDataService.mutate<UpdateTaxCategory.Mutation, UpdateTaxCategory.Variables>(
            UPDATE_TAX_CATEGORY,
            {
                input,
            },
        );
    }
}
