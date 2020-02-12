import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    DeletionResponse,
    MutationCreateTaxRateArgs,
    MutationDeleteTaxRateArgs,
    MutationUpdateTaxRateArgs,
    Permission,
    QueryTaxRateArgs,
    QueryTaxRatesArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { TaxRate } from '../../../entity/tax-rate/tax-rate.entity';
import { TaxRateService } from '../../../service/services/tax-rate.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('TaxRate')
export class TaxRateResolver {
    constructor(private taxRateService: TaxRateService) {}

    @Query()
    @Allow(Permission.ReadSettings, Permission.ReadCatalog)
    taxRates(@Ctx() ctx: RequestContext, @Args() args: QueryTaxRatesArgs): Promise<PaginatedList<TaxRate>> {
        return this.taxRateService.findAll(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadSettings, Permission.ReadCatalog)
    async taxRate(@Ctx() ctx: RequestContext, @Args() args: QueryTaxRateArgs): Promise<TaxRate | undefined> {
        return this.taxRateService.findOne(args.id);
    }

    @Mutation()
    @Allow(Permission.CreateSettings)
    async createTaxRate(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateTaxRateArgs,
    ): Promise<TaxRate> {
        return this.taxRateService.create(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    async updateTaxRate(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateTaxRateArgs,
    ): Promise<TaxRate> {
        return this.taxRateService.update(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.DeleteSettings)
    async deleteTaxRate(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteTaxRateArgs,
    ): Promise<DeletionResponse> {
        return this.taxRateService.delete(args.id);
    }
}
