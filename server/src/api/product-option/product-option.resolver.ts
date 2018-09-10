import { Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { CreateProductOptionGroupVariables } from 'shared/generated-types';

import { Translated } from '../../common/types/locale-types';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { ProductOption } from '../../entity/product-option/product-option.entity';
import { Permission } from '../../entity/role/permission';
import { ProductOptionGroupService } from '../../service/product-option-group.service';
import { ProductOptionService } from '../../service/product-option.service';
import { ApplyIdCodec } from '../common/apply-id-codec-decorator';
import { Allow } from '../roles-guard';

@Resolver('ProductOptionGroup')
export class ProductOptionResolver {
    constructor(
        private productOptionGroupService: ProductOptionGroupService,
        private productOptionService: ProductOptionService,
    ) {}

    @Query()
    @Allow(Permission.ReadCatalog)
    @ApplyIdCodec()
    productOptionGroups(obj, args): Promise<Array<Translated<ProductOptionGroup>>> {
        return this.productOptionGroupService.findAll(args.languageCode, args.filterTerm);
    }

    @Query()
    @Allow(Permission.ReadCatalog)
    @ApplyIdCodec()
    productOptionGroup(obj, args): Promise<Translated<ProductOptionGroup> | undefined> {
        return this.productOptionGroupService.findOne(args.id, args.languageCode);
    }

    @ResolveProperty()
    @Allow(Permission.ReadCatalog)
    @ApplyIdCodec()
    async options(optionGroup: Translated<ProductOptionGroup>): Promise<Array<Translated<ProductOption>>> {
        if (optionGroup.options) {
            return Promise.resolve(optionGroup.options);
        }
        const group = await this.productOptionGroupService.findOne(optionGroup.id, optionGroup.languageCode);
        return group ? group.options : [];
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
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
    @Allow(Permission.UpdateCatalog)
    @ApplyIdCodec()
    async updateProductOptionGroup(_, args): Promise<Translated<ProductOptionGroup>> {
        const { input } = args;
        return this.productOptionGroupService.update(args.input);
    }
}
