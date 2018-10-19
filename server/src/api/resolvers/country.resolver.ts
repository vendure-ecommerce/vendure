import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    CountriesQueryArgs,
    CountryQueryArgs,
    CreateCountryMutationArgs,
    Permission,
    UpdateCountryMutationArgs,
} from 'shared/generated-types';
import { PaginatedList } from 'shared/shared-types';

import { Country } from '../../entity/country/country.entity';
import { Facet } from '../../entity/facet/facet.entity';
import { CountryService } from '../../service/services/country.service';
import { RequestContext } from '../common/request-context';
import { Allow } from '../decorators/allow.decorator';
import { Ctx } from '../decorators/request-context.decorator';

@Resolver('Country')
export class CountryResolver {
    constructor(private countryService: CountryService) {}

    @Query()
    @Allow(Permission.ReadSettings)
    countries(@Ctx() ctx: RequestContext, @Args() args: CountriesQueryArgs): Promise<PaginatedList<Country>> {
        return this.countryService.findAll(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    async country(@Ctx() ctx: RequestContext, @Args() args: CountryQueryArgs): Promise<Country | undefined> {
        return this.countryService.findOne(args.id);
    }

    @Mutation()
    @Allow(Permission.CreateSettings)
    async createCountry(@Args() args: CreateCountryMutationArgs): Promise<Country> {
        return this.countryService.create(args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    async updateCountry(@Args() args: UpdateCountryMutationArgs): Promise<Country> {
        return this.countryService.update(args.input);
    }
}
