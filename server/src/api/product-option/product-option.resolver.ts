import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { Product } from '../../entity/product/product.entity';
import { ProductOptionGroupService } from '../../service/product-option-group.service';
import { ProductOptionService } from '../../service/product-option.service';
import { ProductVariantService } from '../../service/product-variant.service';
import { ProductService } from '../../service/product.service';

@Resolver('Product')
export class ProductOptionResolver {
    constructor(
        private productOptionGroupService: ProductOptionGroupService,
        private productOptionService: ProductOptionService,
    ) {}

    @Query('productOptionGroups')
    productOptionGroups(obj, args): Promise<ProductOptionGroup[]> {
        return this.productOptionGroupService.findAll(args.languageCode);
    }

    @Query('productOptionGroup')
    productOptionGroup(obj, args): Promise<ProductOptionGroup | undefined> {
        return this.productOptionGroupService.findOne(args.id, args.languageCode);
    }

    @Mutation()
    async createProductOptionGroup(_, args): Promise<ProductOptionGroup> {
        const { input } = args;
        const group = await this.productOptionGroupService.create(args.input);

        if (input.options && input.options.length) {
            for (const option of input.options) {
                await this.productOptionService.create(group, option);
            }
        }

        return group;
    }

    @Mutation()
    async updateProductOptionGroup(_, args): Promise<ProductOptionGroup> {
        const { input } = args;
        return this.productOptionGroupService.update(args.input);
    }
}
