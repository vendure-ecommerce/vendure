import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { Product } from '../../entity/product/product.entity';
import { ProductOptionService } from '../../service/product-option.service';
import { ProductVariantService } from '../../service/product-variant.service';
import { ProductService } from '../../service/product.service';

@Resolver('Product')
export class ProductOptionResolver {
    constructor(private productOptionService: ProductOptionService) {}

    @Query('productOptionGroups')
    productOptionGroups(obj, args): Promise<ProductOptionGroup[]> {
        return this.productOptionService.findAll(args.languageCode);
    }

    @Query('productOptionGroup')
    productOptionGroup(obj, args): Promise<ProductOptionGroup | undefined> {
        return this.productOptionService.findOne(args.id, args.languageCode);
    }
}
