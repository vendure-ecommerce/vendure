import { AssetType } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';

import { Taggable } from '../../common/types/common-types';
import { Address } from '../address/address.entity';
import { VendureEntity } from '../base/base.entity';
import { CustomCustomerFields } from '../custom-entity-fields';
import { Tag } from '../tag/tag.entity';
import { User } from '../user/user.entity';

/**
 * @description
 * An Asset represents a file such as an image which can be associated with certain other entities
 * such as Products.
 *
 * @docsCategory entities
 */
@Entity()
export class Asset extends VendureEntity implements Taggable {
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
}
