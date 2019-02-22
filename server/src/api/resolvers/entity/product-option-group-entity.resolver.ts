import { ResolveProperty, Resolver } from '@nestjs/graphql';

import { Permission } from '../../../../../shared/generated-types';
import { Translated } from '../../../common/types/locale-types';
import { ProductOptionGroup } from '../../../entity/product-option-group/product-option-group.entity';
import { ProductOption } from '../../../entity/product-option/product-option.entity';
import { ProductOptionGroupService } from '../../../service/services/product-option-group.service';
import { IdCodecService } from '../../common/id-codec.service';
import { Allow } from '../../decorators/allow.decorator';

@Resolver('ProductOptionGroup')
export class ProductOptionGroupEntityResolver {
    constructor(
        private productOptionGroupService: ProductOptionGroupService,
        private idCodecService: IdCodecService,
    ) {}

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
}
