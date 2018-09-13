import { AssetType } from 'shared/generated-types';
import { DeepPartial } from 'shared/shared-types';
import { HasCustomFields } from 'shared/shared-types';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { Address } from '../address/address.entity';
import { VendureEntity } from '../base/base.entity';
import { CustomCustomerFields } from '../custom-entity-fields';
import { User } from '../user/user.entity';

@Entity()
export class Asset extends VendureEntity {
    constructor(input?: DeepPartial<Asset>) {
        super(input);
    }

    @Column() name: string;

    @Column({ nullable: true })
    description: string;

    @Column('varchar') type: AssetType;

    @Column() mimetype: string;

    @Column() source: string;

    @Column() preview: string;
}
