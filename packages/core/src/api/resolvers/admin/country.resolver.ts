import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    DeletionResponse,
    MutationCreateCountryArgs,
    MutationDeleteCountryArgs,
    MutationUpdateCountryArgs,
    Permission,
    QueryCountriesArgs,
    QueryCountryArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { Translated } from '../../../common/types/locale-types';
import { Country } from '../../../entity/country/country.entity';
import { CountryService } from '../../../service/services/country.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver('Country')
export class CountryResolver {
    constructor(private countryService: CountryService) {}

    @Query()
    @Allow(Permission.ReadSettings, Permission.ReadCountry)
    countries(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryCountriesArgs,
    ): Promise<PaginatedList<Translated<Country>>> {
        return this.countryService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadSettings, Permission.ReadCountry)
    async country(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryCountryArgs,
    ): Promise<Translated<Country> | undefined> {
        return this.countryService.findOne(ctx, args.id);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.CreateSettings, Permission.CreateCountry)
    async createCountry(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateCountryArgs,
    ): Promise<Translated<Country>> {
        return this.countryService.create(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateSettings, Permission.UpdateCountry)
    async updateCountry(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateCountryArgs,
    ): Promise<Translated<Country>> {
        return this.countryService.update(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.DeleteSettings, Permission.DeleteCountry)
    async deleteCountry(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteCountryArgs,
    ): Promise<DeletionResponse> {
        return this.countryService.delete(ctx, args.id);
    }
}
