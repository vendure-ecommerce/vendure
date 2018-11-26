import { DeepPartial, HasCustomFields } from 'shared/shared-types';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';

import { ChannelAware } from '../../common/types/common-types';
import { LocaleString, Translatable, Translation } from '../../common/types/locale-types';
import { Asset } from '../asset/asset.entity';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomProductCategoryFields } from '../custom-entity-fields';
import { FacetValue } from '../facet-value/facet-value.entity';

import { ProductCategoryTranslation } from './product-category-translation.entity';

@Entity()
@Tree('closure-table')
export class ProductCategory extends VendureEntity implements Translatable, HasCustomFields, ChannelAware {
    constructor(input?: DeepPartial<ProductCategory>) {
        super(input);
    }

    @Column()
    isRoot: boolean;

    name: LocaleString;

    description: LocaleString;

    @OneToMany(type => ProductCategoryTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ProductCategory>>;

    @ManyToOne(type => Asset)
    featuredAsset: Asset;

    @ManyToMany(type => Asset)
    @JoinTable()
    assets: Asset[];

    @ManyToMany(type => FacetValue)
    @JoinTable()
    facetValues: FacetValue[];

    @Column(type => CustomProductCategoryFields)
    customFields: CustomProductCategoryFields;

    @TreeChildren()
    children: ProductCategory[];

    @TreeParent()
    parent: ProductCategory;

    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
}
