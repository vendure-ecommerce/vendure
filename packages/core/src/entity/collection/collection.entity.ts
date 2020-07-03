import { ConfigurableOperation } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    TreeChildren,
    TreeParent,
} from 'typeorm';

import { ChannelAware, Orderable } from '../../common/types/common-types';
import { LocaleString, Translatable, Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { Asset } from '../asset/asset.entity';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomCollectionFields } from '../custom-entity-fields';
import { ProductVariant } from '../product-variant/product-variant.entity';

import { CollectionAsset } from './collection-asset.entity';
import { CollectionTranslation } from './collection-translation.entity';

/**
 * @description
 * A Collection is a grouping of {@link Product}s based on various configurable criteria.
 *
 * @docsCategory entities
 */
@Entity()
// TODO: It would be ideal to use the TypeORM built-in tree support, but unfortunately it is incomplete
// at this time - does not support moving or deleting. See https://github.com/typeorm/typeorm/issues/2032
// Therefore we will just use an adjacency list which will have a perf impact when needing to lookup
// decendants or ancestors more than 1 level removed.
// @Tree('closure-table')
export class Collection extends VendureEntity
    implements Translatable, HasCustomFields, ChannelAware, Orderable {
    constructor(input?: DeepPartial<Collection>) {
        super(input);
    }

    @Column({ default: false })
    isRoot: boolean;

    @Column()
    position: number;

    @Column({ default: false })
    isPrivate: boolean;

    name: LocaleString;

    description: LocaleString;

    slug: LocaleString;

    @OneToMany((type) => CollectionTranslation, (translation) => translation.base, { eager: true })
    translations: Array<Translation<Collection>>;

    @ManyToOne((type) => Asset, { onDelete: 'SET NULL' })
    featuredAsset: Asset;

    @OneToMany((type) => CollectionAsset, (collectionAsset) => collectionAsset.collection)
    assets: CollectionAsset[];

    @Column('simple-json') filters: ConfigurableOperation[];

    @ManyToMany((type) => ProductVariant, (productVariant) => productVariant.collections)
    @JoinTable()
    productVariants: ProductVariant[];

    @Column((type) => CustomCollectionFields)
    customFields: CustomCollectionFields;

    @TreeChildren()
    children: Collection[];

    @TreeParent()
    parent: Collection;

    @ManyToMany((type) => Channel)
    @JoinTable()
    channels: Channel[];
}
