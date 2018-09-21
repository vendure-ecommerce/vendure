import { Args, Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { CreateProductOptionGroupVariables, Permission } from 'shared/generated-types';

import { Translated } from '../../common/types/locale-types';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { ProductOption } from '../../entity/product-option/product-option.entity';
import { ProductOptionGroupService } from '../../service/providers/product-option-group.service';
import { ProductOptionService } from '../../service/providers/product-option.service';
import { Allow } from '../common/roles-guard';

@Resolver('ProductOptionGroup')
export class ProductOptionResolver {
    constructor(
        private productOptionGroupService: ProductOptionGroupService,
        private productOptionService: ProductOptionService,
    ) {}

    @Query()
    @Allow(Permission.ReadCatalog)
    productOptionGroups(@Args() args): Promise<Array<Translated<ProductOptionGroup>>> {
        return this.productOptionGroupService.findAll(args.languageCode, args.filterTerm);
    }

    @Query()
    @Allow(Permission.ReadCatalog)
    productOptionGroup(@Args() args): Promise<Translated<ProductOptionGroup> | undefined> {
        return this.productOptionGroupService.findOne(args.id, args.languageCode);
    }

    @ResolveProperty()
    @Allow(Permission.ReadCatalog)
    async options(optionGroup: Translated<ProductOptionGroup>): Promise<Array<Translated<ProductOption>>> {
        if (optionGroup.options) {
            return Promise.resolve(optionGroup.options);
        }
        const group = await this.productOptionGroupService.findOne(optionGroup.id, optionGroup.languageCode);
        return group ? group.options : [];
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
    async createProductOptionGroup(
        @Args() args: CreateProductOptionGroupVariables,
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
    async updateProductOptionGroup(@Args() args): Promise<Translated<ProductOptionGroup>> {
        const { input } = args;
        return this.productOptionGroupService.update(args.input);
    }
}
