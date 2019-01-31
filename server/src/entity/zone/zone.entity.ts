import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { DeepPartial } from '../../../../shared/shared-types';
import { VendureEntity } from '../base/base.entity';
import { Country } from '../country/country.entity';

/**
 * @description
 * A Zone is a grouping of one or more {@link Country} entities. It is used for
 * calculating applicable shipping and taxes.
 *
 * @docsCategory entities
 */
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
