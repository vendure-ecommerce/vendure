import { Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { CreateProductOptionGroupVariables } from 'shared/generated-types';

import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { ProductOption } from '../../entity/product-option/product-option.entity';
import { Translated } from '../../locale/locale-types';
import { ProductOptionGroupService } from '../../service/product-option-group.service';
import { ProductOptionService } from '../../service/product-option.service';
import { ApplyIdCodec } from '../common/apply-id-codec-decorator';

@Resolver('ProductOptionGroup')
export class ProductOptionResolver {
    constructor(
        private productOptionGroupService: ProductOptionGroupService,
        private productOptionService: ProductOptionService,
    ) {}

    @Query('productOptionGroups')
    @ApplyIdCodec()
    productOptionGroups(obj, args): Promise<Array<Translated<ProductOptionGroup>>> {
        return this.productOptionGroupService.findAll(args.languageCode, args.filterTerm);
    }

    @Query('productOptionGroup')
    @ApplyIdCodec()
    productOptionGroup(obj, args): Promise<Translated<ProductOptionGroup> | undefined> {
        return this.productOptionGroupService.findOne(args.id, args.languageCode);
    }

    @ResolveProperty('options')
    @ApplyIdCodec()
    async options(optionGroup: Translated<ProductOptionGroup>): Promise<Array<Translated<ProductOption>>> {
        if (optionGroup.options) {
            return Promise.resolve(optionGroup.options);
        }
        const group = await this.productOptionGroupService.findOne(optionGroup.id, optionGroup.languageCode);
        return group ? group.options : [];
    }

    @Mutation()
    @ApplyIdCodec()
    async createProductOptionGroup(
        _,
        args: CreateProductOptionGroupVariables,
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
    @ApplyIdCodec()
    async updateProductOptionGroup(_, args): Promise<Translated<ProductOptionGroup>> {
        const { input } = args;
        return this.productOptionGroupService.update(args.input);
    }
}
