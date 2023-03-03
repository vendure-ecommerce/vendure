import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity } from 'typeorm';

import { SoftDeletable } from '../../common/types/common-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomSellerFields } from '../custom-entity-fields';

/**
 * @description
 * An administrative user who has access to the admin ui.
 *
 * @docsCategory entities
 */
@Entity()
export class Seller extends VendureEntity implements SoftDeletable, HasCustomFields {
    constructor(input?: DeepPartial<Seller>) {
        super(input);
    }

    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;

    @Column() name: string;

    @Column(type => CustomSellerFields)
    customFields: CustomSellerFields;
}
