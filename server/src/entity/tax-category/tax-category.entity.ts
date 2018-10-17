import { DeepPartial } from 'shared/shared-types';
import { Column, Entity } from 'typeorm';

import { VendureEntity } from '../base/base.entity';

@Entity()
export class TaxCategory extends VendureEntity {
    constructor(input?: DeepPartial<TaxCategory>) {
        super(input);
    }

    @Column() name: string;
}
