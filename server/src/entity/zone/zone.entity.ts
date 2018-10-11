import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { Country } from '../country/country.entity';

@Entity()
export class Zone extends VendureEntity {
    constructor(input?: DeepPartial<Zone>) {
        super(input);
    }

    @Column() name: string;

    @ManyToMany(type => Country)
    @JoinTable()
    members: Country[];
}
