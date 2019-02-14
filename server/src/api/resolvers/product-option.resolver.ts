import { Args, Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';

import {
    CreateProductOptionGroupMutationArgs,
    Permission,
    ProductOptionGroupQueryArgs,
    ProductOptionGroupsQueryArgs,
    UpdateProductOptionGroupMutationArgs,
} from '../../../../shared/generated-types';
import { Translated } from '../../common/types/locale-types';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { ProductOption } from '../../entity/product-option/product-option.entity';
import { ProductOptionGroupService } from '../../service/services/product-option-group.service';
import { ProductOptionService } from '../../service/services/product-option.service';
import { IdCodecService } from '../common/id-codec.service';
import { RequestContext } from '../common/request-context';
import { Allow } from '../decorators/allow.decorator';
import { Ctx } from '../decorators/request-context.decorator';

@Resolver('ProductOptionGroup')
export class ProductOptionResolver {
    constructor(
        private productOptionGroupService: ProductOptionGroupService,
        private productOptionService: ProductOptionService,
        private idCodecService: IdCodecService,
    ) {}

    @Query()
    @Allow(Permission.ReadCatalog)
    productOptionGroups(
        @Ctx() ctx: RequestContext,
        @Args() args: ProductOptionGroupsQueryArgs,
    ): Promise<Array<Translated<ProductOptionGroup>>> {
        return this.productOptionGroupService.findAll(ctx.languageCode, args.filterTerm || undefined);
    }

    @Query()
    @Allow(Permission.ReadCatalog)
    productOptionGroup(
        @Ctx() ctx: RequestContext,
        @Args() args: ProductOptionGroupQueryArgs,
    ): Promise<Translated<ProductOptionGroup> | undefined> {
        return this.productOptionGroupService.findOne(args.id, ctx.languageCode);
    }

    @ResolveProperty()
    @Allow(Permission.ReadCatalog, Permission.Public)
    async options(optionGroup: Translated<ProductOptionGroup>): Promise<Array<Translated<ProductOption>>> {
        if (optionGroup.options) {
            return Promise.resolve(optionGroup.options);
        }
        const id = this.idCodecService.decode(optionGroup.id);
        const group = await this.productOptionGroupService.findOne(id, optionGroup.languageCode);
        return group ? group.options : [];
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
    async createProductOptionGroup(
        @Args() args: CreateProductOptionGroupMutationArgs,
    ): Promise<Translated<ProductOptionGroup>> {
        const { input } = args;
        const group = await this.productOptionGroupService.create(args.input);

        if (input.options && input.options.length) {
            for (const option of input.options) {
                const newOption = await this.productOptionService.create(group, option);
                group.options.push(newOption);
            }
        }
        return group;
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async updateProductOptionGroup(
        @Args() args: UpdateProductOptionGroupMutationArgs,
    ): Promise<Translated<ProductOptionGroup>> {
        const { input } = args;
        return this.productOptionGroupService.update(args.input);
    }
}
