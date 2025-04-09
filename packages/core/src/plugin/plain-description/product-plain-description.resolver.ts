import { Resolver, ResolveField, Parent } from '@nestjs/graphql';

import { Product } from '../../entity/product/product.entity';

import { stripHtmlTags } from './strip-html';

@Resolver('Product')
export class ProductPlainDescriptionResolver {
    @ResolveField('description')
    plainDescription(@Parent() product: Product): string {
        return stripHtmlTags(product.description || '');
    }
}
