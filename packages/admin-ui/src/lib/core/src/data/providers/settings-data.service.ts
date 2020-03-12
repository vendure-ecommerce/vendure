import { pick } from '@vendure/common/lib/pick';
import { FetchPolicy } from 'apollo-client';

import {
    AddMembersToZone,
    CreateChannel,
    CreateChannelInput,
    CreateCountry,
    CreateCountryInput,
    CreateTaxCategory,
    CreateTaxCategoryInput,
    CreateTaxRate,
    CreateTaxRateInput,
    CreateZone,
    CreateZoneInput,
    DeleteChannel,
    DeleteCountry,
    DeleteTaxCategory,
    DeleteTaxRate,
    GetActiveChannel,
    GetAllJobs,
    GetAvailableCountries,
    GetChannel,
    GetChannels,
    GetCountry,
    GetCountryList,
    GetGlobalSettings,
    GetJobInfo,
    GetPaymentMethod,
    GetPaymentMethodList,
    GetTaxCategories,
    GetTaxCategory,
    GetTaxRate,
    GetTaxRateList,
    GetZone,
    GetZones,
    JobState,
    RemoveMembersFromZone,
    SearchForTestOrder,
    UpdateChannel,
    UpdateChannelInput,
    UpdateCountry,
    UpdateCountryInput,
    UpdateGlobalSettings,
    UpdateGlobalSettingsInput,
    UpdatePaymentMethod,
    UpdatePaymentMethodInput,
    UpdateTaxCategory,
    UpdateTaxCategoryInput,
    UpdateTaxRate,
    UpdateTaxRateInput,
    UpdateZone,
    UpdateZoneInput,
} from '../../common/generated-types';
import {
    ADD_MEMBERS_TO_ZONE,
    CREATE_CHANNEL,
    CREATE_COUNTRY,
    CREATE_TAX_CATEGORY,
    CREATE_TAX_RATE,
    CREATE_ZONE,
    DELETE_CHANNEL,
    DELETE_COUNTRY,
    DELETE_TAX_CATEGORY,
    DELETE_TAX_RATE,
    GET_ACTIVE_CHANNEL,
    GET_ALL_JOBS,
    GET_AVAILABLE_COUNTRIES,
    GET_CHANNEL,
    GET_CHANNELS,
    GET_COUNTRY,
    GET_COUNTRY_LIST,
    GET_GLOBAL_SETTINGS,
    GET_JOB_INFO,
    GET_PAYMENT_METHOD,
    GET_PAYMENT_METHOD_LIST,
    GET_TAX_CATEGORIES,
    GET_TAX_CATEGORY,
    GET_TAX_RATE,
    GET_TAX_RATE_LIST,
    GET_ZONES,
    REMOVE_MEMBERS_FROM_ZONE,
    SEARCH_FOR_TEST_ORDER,
    UPDATE_CHANNEL,
    UPDATE_COUNTRY,
    UPDATE_GLOBAL_SETTINGS,
    UPDATE_PAYMENT_METHOD,
    UPDATE_TAX_CATEGORY,
    UPDATE_TAX_RATE,
    UPDATE_ZONE,
} from '../definitions/settings-definitions';

import { BaseDataService } from './base-data.service';

export class SettingsDataService {
    constructor(private baseDataService: BaseDataService) {}

    getCountries(take: number = 10, skip: number = 0, filterTerm?: string) {
        return this.baseDataService.query<GetCountryList.Query, GetCountryList.Variables>(GET_COUNTRY_LIST, {
            options: {
                take,
                skip,
                filter: {
                    name: filterTerm ? { contains: filterTerm } : null,
                },
            },
        });
    }

    getAvailableCountries() {
        return this.baseDataService.query<GetAvailableCountries.Query>(GET_AVAILABLE_COUNTRIES);
    }

    getCountry(id: string) {
        return this.baseDataService.query<GetCountry.Query, GetCountry.Variables>(GET_COUNTRY, { id });
    }

    createCountry(input: CreateCountryInput) {
        return this.baseDataService.mutate<CreateCountry.Mutation, CreateCountry.Variables>(CREATE_COUNTRY, {
            input: pick(input, ['code', 'enabled', 'translations']),
        });
    }

    updateCountry(input: UpdateCountryInput) {
        return this.baseDataService.mutate<UpdateCountry.Mutation, UpdateCountry.Variables>(UPDATE_COUNTRY, {
            input: pick(input, ['id', 'code', 'enabled', 'translations']),
        });
    }

    deleteCountry(id: string) {
        return this.baseDataService.mutate<DeleteCountry.Mutation, DeleteCountry.Variables>(DELETE_COUNTRY, {
            id,
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

    deleteTaxCategory(id: string) {
        return this.baseDataService.mutate<DeleteTaxCategory.Mutation, DeleteTaxRate.Variables>(
            DELETE_TAX_CATEGORY,
            {
                id,
            },
        );
    }

    getTaxRates(take: number = 10, skip: number = 0, fetchPolicy?: FetchPolicy) {
        return this.baseDataService.query<GetTaxRateList.Query, GetTaxRateList.Variables>(
            GET_TAX_RATE_LIST,
            {
                options: {
                    take,
                    skip,
                },
            },
            fetchPolicy,
        );
    }

    getTaxRate(id: string) {
        return this.baseDataService.query<GetTaxRate.Query, GetTaxRate.Variables>(GET_TAX_RATE, {
            id,
        });
    }

    createTaxRate(input: CreateTaxRateInput) {
        return this.baseDataService.mutate<CreateTaxRate.Mutation, CreateTaxRate.Variables>(CREATE_TAX_RATE, {
            input,
        });
    }

    updateTaxRate(input: UpdateTaxRateInput) {
        return this.baseDataService.mutate<UpdateTaxRate.Mutation, UpdateTaxRate.Variables>(UPDATE_TAX_RATE, {
            input,
        });
    }

    deleteTaxRate(id: string) {
        return this.baseDataService.mutate<DeleteTaxRate.Mutation, DeleteTaxRate.Variables>(DELETE_TAX_RATE, {
            id,
        });
    }

    getChannels() {
        return this.baseDataService.query<GetChannels.Query>(GET_CHANNELS);
    }

    getChannel(id: string) {
        return this.baseDataService.query<GetChannel.Query, GetChannel.Variables>(GET_CHANNEL, {
            id,
        });
    }

    getActiveChannel(fetchPolicy?: FetchPolicy) {
        return this.baseDataService.query<GetActiveChannel.Query, GetActiveChannel.Variables>(
            GET_ACTIVE_CHANNEL,
            {},
            fetchPolicy,
        );
    }

    createChannel(input: CreateChannelInput) {
        return this.baseDataService.mutate<CreateChannel.Mutation, CreateChannel.Variables>(CREATE_CHANNEL, {
            input,
        });
    }

    updateChannel(input: UpdateChannelInput) {
        return this.baseDataService.mutate<UpdateChannel.Mutation, UpdateChannel.Variables>(UPDATE_CHANNEL, {
            input,
        });
    }

    deleteChannel(id: string) {
        return this.baseDataService.mutate<DeleteChannel.Mutation, DeleteChannel.Variables>(DELETE_CHANNEL, {
            id,
        });
    }

    getPaymentMethods(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<GetPaymentMethodList.Query, GetPaymentMethodList.Variables>(
            GET_PAYMENT_METHOD_LIST,
            {
                options: {
                    skip,
                    take,
                },
            },
        );
    }

    getPaymentMethod(id: string) {
        return this.baseDataService.query<GetPaymentMethod.Query, GetPaymentMethod.Variables>(
            GET_PAYMENT_METHOD,
            {
                id,
            },
        );
    }

    updatePaymentMethod(input: UpdatePaymentMethodInput) {
        return this.baseDataService.mutate<UpdatePaymentMethod.Mutation, UpdatePaymentMethod.Variables>(
            UPDATE_PAYMENT_METHOD,
            {
                input,
            },
        );
    }

    getGlobalSettings() {
        return this.baseDataService.query<GetGlobalSettings.Query>(GET_GLOBAL_SETTINGS);
    }

    updateGlobalSettings(input: UpdateGlobalSettingsInput) {
        return this.baseDataService.mutate<UpdateGlobalSettings.Mutation, UpdateGlobalSettings.Variables>(
            UPDATE_GLOBAL_SETTINGS,
            {
                input,
            },
        );
    }

    getJob(id: string) {
        return this.baseDataService.query<GetJobInfo.Query, GetJobInfo.Variables>(GET_JOB_INFO, { id });
    }

    pollJobs(ids: string[]) {
        return this.baseDataService.query<GetAllJobs.Query, GetAllJobs.Variables>(GET_ALL_JOBS, {
            input: { ids },
        });
    }

    getRunningJobs() {
        return this.baseDataService.query<GetAllJobs.Query, GetAllJobs.Variables>(GET_ALL_JOBS, {
            input: { state: JobState.RUNNING },
        });
    }

    searchForTestOrder(term: string, take: number) {
        return this.baseDataService.query<SearchForTestOrder.Query, SearchForTestOrder.Variables>(
            SEARCH_FOR_TEST_ORDER,
            {
                take,
                term,
            },
        );
    }
}
