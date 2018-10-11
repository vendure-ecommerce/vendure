import {
    CreateCountry,
    CreateCountryInput,
    GetCountry,
    GetCountryList,
    UpdateCountry,
    UpdateCountryInput,
} from 'shared/generated-types';

import {
    CREATE_COUNTRY,
    GET_COUNTRY,
    GET_COUNTRY_LIST,
    UPDATE_COUNTRY,
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
}
