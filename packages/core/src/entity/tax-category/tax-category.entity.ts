import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity } from 'typeorm';

import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomTaxCategoryFields } from '../custom-entity-fields';

/**
 * @description
 * A TaxCategory defines what type of taxes to apply to a {@link ProductVariant}.
 *
 * @docsCategory entities
 */
@Entity()
export class TaxCategory extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<TaxCategory>) {
        super(input);
    }

    @Column() name: string;

    @Column({ default: false }) isDefault: boolean;

    @Column(type => CustomTaxCategoryFields)
    customFields: CustomTaxCategoryFields;
}
