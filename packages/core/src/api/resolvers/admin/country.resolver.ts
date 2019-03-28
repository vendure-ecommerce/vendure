import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
    CountriesQueryArgs,
    CountryQueryArgs,
    CreateCountryMutationArgs,
    DeleteCountryMutationArgs,
    DeletionResponse,
    Permission,
    UpdateCountryMutationArgs,
} from '../../../../../../shared/generated-types';
import { PaginatedList } from '../../../../../../shared/shared-types';
import { Translated } from '../../../common/types/locale-types';
import { Country } from '../../../entity/country/country.entity';
import { CountryService } from '../../../service/services/country.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Country')
export class CountryResolver {
    constructor(private countryService: CountryService) {}

    @Query()
    @Allow(Permission.ReadSettings)
    countries(
        @Ctx() ctx: RequestContext,
        @Args() args: CountriesQueryArgs,
    ): Promise<PaginatedList<Translated<Country>>> {
        return this.countryService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    async country(
        @Ctx() ctx: RequestContext,
        @Args() args: CountryQueryArgs,
    ): Promise<Translated<Country> | undefined> {
        return this.countryService.findOne(ctx, args.id);
    }

    @Mutation()
    @Allow(Permission.CreateSettings)
    async createCountry(
        @Ctx() ctx: RequestContext,
        @Args() args: CreateCountryMutationArgs,
    ): Promise<Translated<Country>> {
        return this.countryService.create(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    async updateCountry(
        @Ctx() ctx: RequestContext,
        @Args() args: UpdateCountryMutationArgs,
    ): Promise<Translated<Country>> {
        return this.countryService.update(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.DeleteSettings)
    async deleteCountry(
        @Ctx() ctx: RequestContext,
        @Args() args: DeleteCountryMutationArgs,
    ): Promise<DeletionResponse> {
        return this.countryService.delete(ctx, args.id);
    }
}
