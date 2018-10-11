import { DeepPartial } from 'shared/shared-types';
import { Column, Entity } from 'typeorm';

import { VendureEntity } from '../base/base.entity';

@Entity()
export class Country extends VendureEntity {
    constructor(input?: DeepPartial<Country>) {
        super(input);
    }

    @Column() code: string;

    @Column() name: string;

    @Column() enabled: boolean;
}
