import { LanguageCode } from '@bb-vendure/common/lib/generated-types';
import { DeepPartial } from '@bb-vendure/common/lib/shared-types';
import { HasCustomFields, Translation, VendureEntity } from '@bb-vendure/core';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { ScaffoldEntity } from './entity.template';

export class ScaffoldEntityCustomFieldsTranslation {}

@Entity()
export class ScaffoldTranslation
    extends VendureEntity
    implements Translation<ScaffoldEntity>, HasCustomFields
{
    constructor(input?: DeepPartial<Translation<ScaffoldTranslation>>) {
        super(input);
    }

    @Column('varchar') languageCode: LanguageCode;

    @Column() localizedName: string;

    @Index()
    @ManyToOne(type => ScaffoldEntity, base => base.translations, { onDelete: 'CASCADE' })
    base: ScaffoldEntity;

    @Column(type => ScaffoldEntityCustomFieldsTranslation)
    customFields: ScaffoldEntityCustomFieldsTranslation;
}
