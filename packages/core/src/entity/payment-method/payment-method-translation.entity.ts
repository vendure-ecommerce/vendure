import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomPaymentMethodFieldsTranslation } from '../custom-entity-fields';

import { PaymentMethod } from './payment-method.entity';

@Entity()
export class PaymentMethodTranslation
    extends VendureEntity
    implements Translation<PaymentMethod>, HasCustomFields
{
    constructor(input?: DeepPartial<Translation<PaymentMethod>>) {
        super(input);
    }

    @Column('varchar') languageCode: LanguageCode;

    @Column() name: string;

    @Column('text', { default: '' }) description: string;

    @Index()
    @ManyToOne(type => PaymentMethod, base => base.translations, { onDelete: 'CASCADE' })
    base: PaymentMethod;

    @Column(type => CustomPaymentMethodFieldsTranslation)
    customFields: CustomPaymentMethodFieldsTranslation;
}
