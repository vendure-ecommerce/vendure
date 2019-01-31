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

import { DeepPartial, HasCustomFields } from '../../../../shared/shared-types';
import { ChannelAware } from '../../common/types/common-types';
import { LocaleString, Translatable, Translation } from '../../common/types/locale-types';
import { Asset } from '../asset/asset.entity';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomProductCategoryFields } from '../custom-entity-fields';
import { FacetValue } from '../facet-value/facet-value.entity';

import { ProductCategoryTranslation } from './product-category-translation.entity';

/**
 * @description
 * A ProductCategory is a grouping of {@link Product}s based on {@link FacetValue}s.
 *
 * @docsCategory entities
 */
@Entity()
// TODO: It would be ideal to use the TypeORM built-in tree support, but unfortunately it is incomplete
// at this time - does not support moving or deleting. See https://github.com/typeorm/typeorm/issues/2032
// Therefore we will just use an adjacency list which will have a perf impact when needing to lookup
// decendants or ancestors more than 1 level removed.
// @Tree('closure-table')
export class ProductCategory extends VendureEntity implements Translatable, HasCustomFields, ChannelAware {
    constructor(input?: DeepPartial<ProductCategory>) {
        super(input);
    }

    @Column({ default: false })
    isRoot: boolean;

    @Column()
    position: number;

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
