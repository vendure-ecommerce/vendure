import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomPromotionFieldsTranslation } from '../custom-entity-fields';

import { Promotion } from './promotion.entity';

@Entity()
export class PromotionTranslation extends VendureEntity implements Translation<Promotion>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<Promotion>>) {
        super(input);
    }

    @Column('varchar') languageCode: LanguageCode;

    @Column() name: string;

    @Column('text', { nullable: true }) description: string;

    @Index()
    @ManyToOne(type => Promotion, base => base.translations, { onDelete: 'CASCADE' })
    base: Promotion;

    @Column(type => CustomPromotionFieldsTranslation)
    customFields: CustomPromotionFieldsTranslation;
}
