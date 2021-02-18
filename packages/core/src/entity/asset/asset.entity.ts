import { AssetType } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { ChannelAware, Taggable } from '../../common/types/common-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomAssetFields } from '../custom-entity-fields';
import { Tag } from '../tag/tag.entity';

/**
 * @description
 * An Asset represents a file such as an image which can be associated with certain other entities
 * such as Products.
 *
 * @docsCategory entities
 */
@Entity()
export class Asset extends VendureEntity implements Taggable, ChannelAware, HasCustomFields {
    constructor(input?: DeepPartial<Asset>) {
        super(input);
    }

    @Column() name: string;

    @Column('varchar') type: AssetType;

    @Column() mimeType: string;

    @Column({ default: 0 }) width: number;

    @Column({ default: 0 }) height: number;

    @Column() fileSize: number;

    @Column() source: string;

    @Column() preview: string;

    @Column('simple-json', { nullable: true })
    focalPoint?: { x: number; y: number };

    @ManyToMany(type => Tag)
    @JoinTable()
    tags: Tag[];

    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];

    @Column(type => CustomAssetFields)
    customFields: CustomAssetFields;
}
