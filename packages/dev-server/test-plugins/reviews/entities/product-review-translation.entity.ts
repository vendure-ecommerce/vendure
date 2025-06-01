import { DeepPartial } from '@vendure/common/lib/shared-types';
import { LanguageCode, Translation, VendureEntity } from '@vendure/core';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { ProductReview } from './product-review.entity';

@Entity()
export class ProductReviewTranslation
    extends VendureEntity
    implements Translation<ProductReview>
{
    constructor(input?: DeepPartial<Translation<ProductReviewTranslation>>) {
        super(input);
    }

    @Column('varchar')
    languageCode: LanguageCode;

    @Column('varchar')
    text: string; // same name as the translatable field in the base entity

    @Index()
    @ManyToOne(() => ProductReview, base => base.translations, { onDelete: 'CASCADE' })
    base: ProductReview;
}
