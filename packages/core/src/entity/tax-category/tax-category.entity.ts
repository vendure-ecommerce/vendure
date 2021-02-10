import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity } from 'typeorm';

import { VendureEntity } from '../base/base.entity';

/**
 * @description
 * A TaxCategory defines what type of taxes to apply to a {@link ProductVariant}.
 *
 * @docsCategory entities
 */
@Entity()
export class TaxCategory extends VendureEntity {
    constructor(input?: DeepPartial<TaxCategory>) {
        super(input);
    }

    @Column() name: string;

    @Column({ default: false }) isDefault: boolean;
}
