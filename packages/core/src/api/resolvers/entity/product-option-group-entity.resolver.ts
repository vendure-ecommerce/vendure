import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Permission } from '@vendure/common/lib/generated-types';

import { Translated } from '../../../common/types/locale-types';
import { ProductOptionGroup } from '../../../entity/product-option-group/product-option-group.entity';
import { ProductOption } from '../../../entity/product-option/product-option.entity';
import { LocaleStringHydrator } from '../../../service/helpers/locale-string-hydrator/locale-string-hydrator';
import { ProductOptionGroupService } from '../../../service/services/product-option-group.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('ProductOptionGroup')
export class ProductOptionGroupEntityResolver {
    constructor(
        private productOptionGroupService: ProductOptionGroupService,
        private localeStringHydrator: LocaleStringHydrator,
    ) {}

    @ResolveField()
    name(@Ctx() ctx: RequestContext, @Parent() optionGroup: ProductOptionGroup): Promise<string> {
        return this.localeStringHydrator.hydrateLocaleStringField(ctx, optionGroup, 'name');
    }

    @ResolveField()
    @Allow(Permission.ReadCatalog, Permission.Public, Permission.ReadProduct)
    async options(
        @Ctx() ctx: RequestContext,
        @Parent() optionGroup: Translated<ProductOptionGroup>,
    ): Promise<Array<Translated<ProductOption>>> {
        if (optionGroup.options) {
            return Promise.resolve(optionGroup.options);
        }
        const group = await this.productOptionGroupService.findOne(ctx, optionGroup.id);
        return group ? group.options : [];
    }
}
