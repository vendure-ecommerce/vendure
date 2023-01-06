import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity } from 'typeorm';

import { SoftDeletable } from '../../common/types/common-types';
import { VendureEntity } from '../base/base.entity';

/**
 * @description
 * An administrative user who has access to the admin ui.
 *
 * @docsCategory entities
 */
@Entity()
export class Vendor extends VendureEntity implements SoftDeletable /*, HasCustomFields*/ {
    constructor(input?: DeepPartial<Vendor>) {
        super(input);
    }

    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;

    @Column() name: string;

    // @Column(type => CustomAdministratorFields)
    // customFields: CustomAdministratorFields;
}
