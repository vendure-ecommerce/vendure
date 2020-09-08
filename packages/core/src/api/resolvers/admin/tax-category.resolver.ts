import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    DeletionResponse,
    MutationCreateTaxCategoryArgs,
    MutationDeleteTaxCategoryArgs,
    MutationUpdateTaxCategoryArgs,
    Permission,
    QueryTaxCategoryArgs,
} from '@vendure/common/lib/generated-types';

import { TaxCategory } from '../../../entity/tax-category/tax-category.entity';
import { TaxCategoryService } from '../../../service/services/tax-category.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver('TaxCategory')
export class TaxCategoryResolver {
    constructor(private taxCategoryService: TaxCategoryService) {}

    @Query()
    @Allow(Permission.ReadSettings, Permission.ReadCatalog)
    taxCategories(@Ctx() ctx: RequestContext): Promise<TaxCategory[]> {
        return this.taxCategoryService.findAll(ctx);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    async taxCategory(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryTaxCategoryArgs,
    ): Promise<TaxCategory | undefined> {
        return this.taxCategoryService.findOne(ctx, args.id);
    }

    @Transaction
    @Mutation()
    @Allow(Permission.CreateSettings)
    async createTaxCategory(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateTaxCategoryArgs,
    ): Promise<TaxCategory> {
        return this.taxCategoryService.create(ctx, args.input);
    }

    @Transaction
    @Mutation()
    @Allow(Permission.UpdateSettings)
    async updateTaxCategory(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateTaxCategoryArgs,
    ): Promise<TaxCategory> {
        return this.taxCategoryService.update(ctx, args.input);
    }

    @Transaction
    @Mutation()
    @Allow(Permission.DeleteSettings)
    async deleteTaxCategory(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteTaxCategoryArgs,
    ): Promise<DeletionResponse> {
        return this.taxCategoryService.delete(ctx, args.id);
    }
}
