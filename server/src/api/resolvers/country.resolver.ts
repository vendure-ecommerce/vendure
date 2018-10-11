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
import { CountryService } from '../../service/providers/country.service';
import { Allow } from '../common/auth-guard';
import { RequestContext } from '../common/request-context';
import { Ctx } from '../common/request-context.decorator';

@Resolver('Facet')
export class CountryResolver {
    constructor(private countryService: CountryService) {}

    @Query()
    @Allow(Permission.ReadCatalog)
    countries(@Ctx() ctx: RequestContext, @Args() args: CountriesQueryArgs): Promise<PaginatedList<Country>> {
        return this.countryService.findAll(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadCatalog)
    async country(@Ctx() ctx: RequestContext, @Args() args: CountryQueryArgs): Promise<Country | undefined> {
        return this.countryService.findOne(args.id);
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
    async createCountry(@Args() args: CreateCountryMutationArgs): Promise<Country> {
        return this.countryService.create(args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async updateCountry(@Args() args: UpdateCountryMutationArgs): Promise<Country> {
        return this.countryService.update(args.input);
    }
}
