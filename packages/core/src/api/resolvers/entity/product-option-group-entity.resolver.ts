import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Permission, ProductOptionListOptions } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { Translated } from '../../../common/types/locale-types';
import { ProductOptionGroup } from '../../../entity/product-option-group/product-option-group.entity';
import { ProductOption } from '../../../entity/product-option/product-option.entity';
import { LocaleStringHydrator } from '../../../service/helpers/locale-string-hydrator/locale-string-hydrator';
import { ProductOptionGroupService } from '../../../service/services/product-option-group.service';
import { ProductOptionService } from '../../../service/services/product-option.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { RelationPaths, Relations } from '../../decorators/relations.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('ProductOptionGroup')
export class ProductOptionGroupEntityResolver {
    constructor(
        private productOptionGroupService: ProductOptionGroupService,
        private productOptionService: ProductOptionService,
        private localeStringHydrator: LocaleStringHydrator,
    ) {}

    @ResolveField()
    name(@Ctx() ctx: RequestContext, @Parent() optionGroup: ProductOptionGroup): Promise<string> {
        return this.localeStringHydrator.hydrateLocaleStringField(ctx, optionGroup, 'name');
    }

    @ResolveField()
    languageCode(@Ctx() ctx: RequestContext, @Parent() optionGroup: ProductOptionGroup): Promise<string> {
        return this.localeStringHydrator.hydrateLocaleStringField(ctx, optionGroup, 'languageCode');
    }

    @ResolveField()
    @Allow(Permission.ReadCatalog, Permission.Public, Permission.ReadProduct)
    async options(
        @Ctx() ctx: RequestContext,
        @Parent() optionGroup: Translated<ProductOptionGroup>,
    ): Promise<Array<Translated<ProductOption>>> {
        let options: Array<Translated<ProductOption>>;
        if (optionGroup.options) {
            options = optionGroup.options;
        } else {
            const group = await this.productOptionGroupService.findOne(ctx, optionGroup.id, undefined, {
                includeSoftDeleted: true,
            });
            options = group?.options ?? [];
        }
        return options.filter(o => !o.deletedAt);
    }

    @ResolveField()
    async optionList(
        @Ctx() ctx: RequestContext,
        @Parent() optionGroup: ProductOptionGroup,
        @Args() args: { options: ProductOptionListOptions },
        @Relations({ entity: ProductOption }) relations: RelationPaths<ProductOption>,
    ): Promise<PaginatedList<ProductOption>> {
        return this.productOptionService.findByGroupIdList(ctx, optionGroup.id, args.options, relations);
    }
}
