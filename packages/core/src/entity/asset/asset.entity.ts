import { AssetType } from '@vendure/common/generated-types';
import { DeepPartial } from '@vendure/common/shared-types';
import { HasCustomFields } from '@vendure/common/shared-types';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { Address } from '../address/address.entity';
import { VendureEntity } from '../base/base.entity';
import { CustomCustomerFields } from '../custom-entity-fields';
import { User } from '../user/user.entity';

/**
 * @description
 * An Asset represents a file such as an image which can be associated with certain other entities
 * such as Products.
 *
 * @docsCategory entities
 */
@Entity()
export class Asset extends VendureEntity {
    constructor(input?: DeepPartial<Asset>) {
        super(input);
    }

    @Column() name: string;

    @Column('varchar') type: AssetType;

    @Column() mimeType: string;

    @Column() fileSize: number;

    @Column() source: string;

    @Column() preview: string;
}
