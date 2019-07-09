import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    MutationCreateProductOptionArgs,
    MutationCreateProductOptionGroupArgs,
    MutationUpdateProductOptionArgs,
    MutationUpdateProductOptionGroupArgs,
    Permission,
    QueryProductOptionGroupArgs,
    QueryProductOptionGroupsArgs,
} from '@vendure/common/lib/generated-types';

import { Translated } from '../../../common/types/locale-types';
import { ProductOptionGroup } from '../../../entity/product-option-group/product-option-group.entity';
import { ProductOption } from '../../../entity/product-option/product-option.entity';
import { ProductOptionGroupService } from '../../../service/services/product-option-group.service';
import { ProductOptionService } from '../../../service/services/product-option.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Decode } from '../../decorators/decode.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver()
export class ProductOptionResolver {
    constructor(
        private productOptionGroupService: ProductOptionGroupService,
        private productOptionService: ProductOptionService,
    ) {}

    @Query()
    @Allow(Permission.ReadCatalog)
    productOptionGroups(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryProductOptionGroupsArgs,
    ): Promise<Array<Translated<ProductOptionGroup>>> {
        return this.productOptionGroupService.findAll(ctx, args.filterTerm || undefined);
    }

    @Query()
    @Allow(Permission.ReadCatalog)
    productOptionGroup(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryProductOptionGroupArgs,
    ): Promise<Translated<ProductOptionGroup> | undefined> {
        return this.productOptionGroupService.findOne(ctx, args.id);
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
    async createProductOptionGroup(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateProductOptionGroupArgs,
    ): Promise<Translated<ProductOptionGroup>> {
        const { input } = args;
        const group = await this.productOptionGroupService.create(ctx, input);

        if (input.options && input.options.length) {
            for (const option of input.options) {
                const newOption = await this.productOptionService.create(ctx, group, option);
                group.options.push(newOption);
            }
        }
        return group;
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async updateProductOptionGroup(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateProductOptionGroupArgs,
    ): Promise<Translated<ProductOptionGroup>> {
        const { input } = args;
        return this.productOptionGroupService.update(ctx, input);
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
    @Decode('productOptionGroupId')
    async createProductOption(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateProductOptionArgs,
    ): Promise<Translated<ProductOption>> {
        const { input } = args;
        return this.productOptionService.create(ctx, input.productOptionGroupId, input);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @Decode('productOptionGroupId')
    async updateProductOption(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateProductOptionArgs,
    ): Promise<Translated<ProductOption>> {
        const { input } = args;
        return this.productOptionService.update(ctx, input);
    }
}
