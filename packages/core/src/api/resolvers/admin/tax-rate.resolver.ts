import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
    CreateTaxRateMutationArgs,
    Permission,
    TaxRateQueryArgs,
    TaxRatesQueryArgs,
    UpdateTaxRateMutationArgs,
} from '../../../../../../shared/generated-types';
import { PaginatedList } from '../../../../../../shared/shared-types';
import { TaxRate } from '../../../entity/tax-rate/tax-rate.entity';
import { TaxRateService } from '../../../service/services/tax-rate.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Decode } from '../../decorators/decode.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('TaxRate')
export class TaxRateResolver {
    constructor(private taxRateService: TaxRateService) {}

    @Query()
    @Allow(Permission.ReadSettings)
    taxRates(@Ctx() ctx: RequestContext, @Args() args: TaxRatesQueryArgs): Promise<PaginatedList<TaxRate>> {
        return this.taxRateService.findAll(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    async taxRate(@Ctx() ctx: RequestContext, @Args() args: TaxRateQueryArgs): Promise<TaxRate | undefined> {
        return this.taxRateService.findOne(args.id);
    }

    @Mutation()
    @Allow(Permission.CreateSettings)
    @Decode('categoryId', 'zoneId', 'customerGroupId')
    async createTaxRate(
        @Ctx() ctx: RequestContext,
        @Args() args: CreateTaxRateMutationArgs,
    ): Promise<TaxRate> {
        return this.taxRateService.create(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    @Decode('categoryId', 'zoneId', 'customerGroupId')
    async updateTaxRate(
        @Ctx() ctx: RequestContext,
        @Args() args: UpdateTaxRateMutationArgs,
    ): Promise<TaxRate> {
        return this.taxRateService.update(ctx, args.input);
    }
}
