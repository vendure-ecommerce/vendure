import { FetchPolicy, WatchQueryFetchPolicy } from '@apollo/client/core';
import { pick } from '@vendure/common/lib/pick';

import * as Codegen from '../../common/generated-types';
import { JobListOptions, JobState } from '../../common/generated-types';
import {
    ADD_MEMBERS_TO_ZONE,
    CANCEL_JOB,
    CREATE_CHANNEL,
    CREATE_COUNTRY,
    CREATE_PAYMENT_METHOD,
    CREATE_TAX_CATEGORY,
    CREATE_TAX_RATE,
    CREATE_ZONE,
    DELETE_CHANNEL,
    DELETE_COUNTRY,
    DELETE_PAYMENT_METHOD,
    DELETE_TAX_CATEGORY,
    DELETE_TAX_RATE,
    DELETE_ZONE,
    GET_ACTIVE_CHANNEL,
    GET_AVAILABLE_COUNTRIES,
    GET_CHANNEL,
    GET_CHANNELS,
    GET_COUNTRY,
    GET_COUNTRY_LIST,
    GET_GLOBAL_SETTINGS,
    GET_JOBS_BY_ID,
    GET_JOBS_LIST,
    GET_JOB_INFO,
    GET_JOB_QUEUE_LIST,
    GET_PAYMENT_METHOD,
    GET_PAYMENT_METHOD_LIST,
    GET_PAYMENT_METHOD_OPERATIONS,
    GET_TAX_CATEGORIES,
    GET_TAX_CATEGORY,
    GET_TAX_RATE,
    GET_TAX_RATE_LIST,
    GET_TAX_RATE_LIST_SIMPLE,
    GET_ZONES,
    REMOVE_MEMBERS_FROM_ZONE,
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
        return this.baseDataService.query<
            Codegen.GetCountryListQuery,
            Codegen.GetCollectionListQueryVariables
        >(GET_COUNTRY_LIST, {
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
        return this.baseDataService.query<Codegen.GetAvailableCountriesQuery>(GET_AVAILABLE_COUNTRIES);
    }

    getCountry(id: string) {
        return this.baseDataService.query<Codegen.GetCountryQuery, Codegen.GetCountryQueryVariables>(
            GET_COUNTRY,
            { id },
        );
    }

    createCountry(input: Codegen.CreateCountryInput) {
        return this.baseDataService.mutate<
            Codegen.CreateCountryMutation,
            Codegen.CreateCountryMutationVariables
        >(CREATE_COUNTRY, {
            input: pick(input, ['code', 'enabled', 'translations', 'customFields']),
        });
    }

    updateCountry(input: Codegen.UpdateCountryInput) {
        return this.baseDataService.mutate<
            Codegen.UpdateCountryMutation,
            Codegen.UpdateCountryMutationVariables
        >(UPDATE_COUNTRY, {
            input: pick(input, ['id', 'code', 'enabled', 'translations', 'customFields']),
        });
    }

    deleteCountry(id: string) {
        return this.baseDataService.mutate<
            Codegen.DeleteCountryMutation,
            Codegen.DeleteCountryMutationVariables
        >(DELETE_COUNTRY, {
            id,
        });
    }

    getZones() {
        return this.baseDataService.query<Codegen.GetZonesQuery>(GET_ZONES);
    }

    getZone(id: string) {
        return this.baseDataService.query<Codegen.GetZoneQuery, Codegen.GetZoneQueryVariables>(GET_ZONES, {
            id,
        });
    }

    createZone(input: Codegen.CreateZoneInput) {
        return this.baseDataService.mutate<Codegen.CreateZoneMutation, Codegen.CreateZoneMutationVariables>(
            CREATE_ZONE,
            {
                input,
            },
        );
    }

    updateZone(input: Codegen.UpdateZoneInput) {
        return this.baseDataService.mutate<Codegen.UpdateZoneMutation, Codegen.UpdateZoneMutationVariables>(
            UPDATE_ZONE,
            {
                input,
            },
        );
    }

    deleteZone(id: string) {
        return this.baseDataService.mutate<Codegen.DeleteZoneMutation, Codegen.DeleteZoneMutationVariables>(
            DELETE_ZONE,
            {
                id,
            },
        );
    }

    addMembersToZone(zoneId: string, memberIds: string[]) {
        return this.baseDataService.mutate<
            Codegen.AddMembersToZoneMutation,
            Codegen.AddMembersToZoneMutationVariables
        >(ADD_MEMBERS_TO_ZONE, {
            zoneId,
            memberIds,
        });
    }

    removeMembersFromZone(zoneId: string, memberIds: string[]) {
        return this.baseDataService.mutate<
            Codegen.RemoveMembersFromZoneMutation,
            Codegen.RemoveMembersFromZoneMutationVariables
        >(REMOVE_MEMBERS_FROM_ZONE, {
            zoneId,
            memberIds,
        });
    }

    getTaxCategories() {
        return this.baseDataService.query<Codegen.GetTaxCategoriesQuery>(GET_TAX_CATEGORIES);
    }

    getTaxCategory(id: string) {
        return this.baseDataService.query<Codegen.GetTaxCategoryQuery, Codegen.GetTaxCategoryQueryVariables>(
            GET_TAX_CATEGORY,
            {
                id,
            },
        );
    }

    createTaxCategory(input: Codegen.CreateTaxCategoryInput) {
        return this.baseDataService.mutate<
            Codegen.CreateTaxCategoryMutation,
            Codegen.CreateTaxCategoryMutationVariables
        >(CREATE_TAX_CATEGORY, {
            input,
        });
    }

    updateTaxCategory(input: Codegen.UpdateTaxCategoryInput) {
        return this.baseDataService.mutate<
            Codegen.UpdateTaxCategoryMutation,
            Codegen.UpdateTaxCategoryMutationVariables
        >(UPDATE_TAX_CATEGORY, {
            input,
        });
    }

    deleteTaxCategory(id: string) {
        return this.baseDataService.mutate<
            Codegen.DeleteTaxCategoryMutation,
            Codegen.DeleteTaxRateMutationVariables
        >(DELETE_TAX_CATEGORY, {
            id,
        });
    }

    getTaxRates(take: number = 10, skip: number = 0, fetchPolicy?: FetchPolicy) {
        return this.baseDataService.query<Codegen.GetTaxRateListQuery, Codegen.GetTaxRateListQueryVariables>(
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

    getTaxRatesSimple(take: number = 10, skip: number = 0, fetchPolicy?: FetchPolicy) {
        return this.baseDataService.query<
            Codegen.GetTaxRateListSimpleQuery,
            Codegen.GetTaxRateListSimpleQueryVariables
        >(
            GET_TAX_RATE_LIST_SIMPLE,
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
        return this.baseDataService.query<Codegen.GetTaxRateQuery, Codegen.GetTaxRateQueryVariables>(
            GET_TAX_RATE,
            {
                id,
            },
        );
    }

    createTaxRate(input: Codegen.CreateTaxRateInput) {
        return this.baseDataService.mutate<
            Codegen.CreateTaxRateMutation,
            Codegen.CreateTaxRateMutationVariables
        >(CREATE_TAX_RATE, {
            input,
        });
    }

    updateTaxRate(input: Codegen.UpdateTaxRateInput) {
        return this.baseDataService.mutate<
            Codegen.UpdateTaxRateMutation,
            Codegen.UpdateTaxRateMutationVariables
        >(UPDATE_TAX_RATE, {
            input,
        });
    }

    deleteTaxRate(id: string) {
        return this.baseDataService.mutate<
            Codegen.DeleteTaxRateMutation,
            Codegen.DeleteTaxRateMutationVariables
        >(DELETE_TAX_RATE, {
            id,
        });
    }

    getChannels() {
        return this.baseDataService.query<Codegen.GetChannelsQuery>(GET_CHANNELS);
    }

    getChannel(id: string) {
        return this.baseDataService.query<Codegen.GetChannelQuery, Codegen.GetChannelQueryVariables>(
            GET_CHANNEL,
            {
                id,
            },
        );
    }

    getActiveChannel(fetchPolicy?: FetchPolicy) {
        return this.baseDataService.query<
            Codegen.GetActiveChannelQuery,
            Codegen.GetActiveChannelQueryVariables
        >(GET_ACTIVE_CHANNEL, {}, fetchPolicy);
    }

    createChannel(input: Codegen.CreateChannelInput) {
        return this.baseDataService.mutate<
            Codegen.CreateChannelMutation,
            Codegen.CreateChannelMutationVariables
        >(CREATE_CHANNEL, {
            input,
        });
    }

    updateChannel(input: Codegen.UpdateChannelInput) {
        return this.baseDataService.mutate<
            Codegen.UpdateChannelMutation,
            Codegen.UpdateChannelMutationVariables
        >(UPDATE_CHANNEL, {
            input,
        });
    }

    deleteChannel(id: string) {
        return this.baseDataService.mutate<
            Codegen.DeleteChannelMutation,
            Codegen.DeleteChannelMutationVariables
        >(DELETE_CHANNEL, {
            id,
        });
    }

    getPaymentMethods(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<
            Codegen.GetPaymentMethodListQuery,
            Codegen.GetPaymentMethodListQueryVariables
        >(GET_PAYMENT_METHOD_LIST, {
            options: {
                skip,
                take,
            },
        });
    }

    getPaymentMethod(id: string) {
        return this.baseDataService.query<
            Codegen.GetPaymentMethodQuery,
            Codegen.GetPaymentMethodQueryVariables
        >(GET_PAYMENT_METHOD, {
            id,
        });
    }

    createPaymentMethod(input: Codegen.CreatePaymentMethodInput) {
        return this.baseDataService.mutate<
            Codegen.CreatePaymentMethodMutation,
            Codegen.CreatePaymentMethodMutationVariables
        >(CREATE_PAYMENT_METHOD, {
            input,
        });
    }

    updatePaymentMethod(input: Codegen.UpdatePaymentMethodInput) {
        return this.baseDataService.mutate<
            Codegen.UpdatePaymentMethodMutation,
            Codegen.UpdatePaymentMethodMutationVariables
        >(UPDATE_PAYMENT_METHOD, {
            input,
        });
    }

    deletePaymentMethod(id: string, force: boolean) {
        return this.baseDataService.mutate<
            Codegen.DeletePaymentMethodMutation,
            Codegen.DeletePaymentMethodMutationVariables
        >(DELETE_PAYMENT_METHOD, {
            id,
            force,
        });
    }

    getPaymentMethodOperations() {
        return this.baseDataService.query<Codegen.GetPaymentMethodOperationsQuery>(
            GET_PAYMENT_METHOD_OPERATIONS,
        );
    }

    getGlobalSettings(fetchPolicy?: WatchQueryFetchPolicy) {
        return this.baseDataService.query<Codegen.GetGlobalSettingsQuery>(
            GET_GLOBAL_SETTINGS,
            undefined,
            fetchPolicy,
        );
    }

    updateGlobalSettings(input: Codegen.UpdateGlobalSettingsInput) {
        return this.baseDataService.mutate<
            Codegen.UpdateGlobalSettingsMutation,
            Codegen.UpdateGlobalSettingsMutationVariables
        >(UPDATE_GLOBAL_SETTINGS, {
            input,
        });
    }

    getJob(id: string) {
        return this.baseDataService.query<Codegen.GetJobInfoQuery, Codegen.GetJobInfoQueryVariables>(
            GET_JOB_INFO,
            {
                id,
            },
        );
    }

    pollJobs(ids: string[]) {
        return this.baseDataService.query<Codegen.GetJobsByIdQuery, Codegen.GetJobsByIdQueryVariables>(
            GET_JOBS_BY_ID,
            {
                ids,
            },
        );
    }

    getAllJobs(options?: JobListOptions) {
        return this.baseDataService.query<Codegen.GetAllJobsQuery, Codegen.GetAllJobsQueryVariables>(
            GET_JOBS_LIST,
            {
                options,
            },
            'cache-first',
        );
    }

    getJobQueues() {
        return this.baseDataService.query<Codegen.GetJobQueueListQuery>(GET_JOB_QUEUE_LIST);
    }

    getRunningJobs() {
        return this.baseDataService.query<Codegen.GetAllJobsQuery, Codegen.GetAllJobsQueryVariables>(
            GET_JOBS_LIST,
            {
                options: {
                    filter: {
                        state: {
                            eq: JobState.RUNNING,
                        },
                    },
                },
            },
        );
    }

    cancelJob(id: string) {
        return this.baseDataService.mutate<Codegen.CancelJobMutation, Codegen.CancelJobMutationVariables>(
            CANCEL_JOB,
            {
                id,
            },
        );
    }
}
