import { Column, Entity, ManyToOne } from 'typeorm';

import { LanguageCode } from '../../../../shared/generated-types';
import { DeepPartial, HasCustomFields } from '../../../../shared/shared-types';
import { Translation } from '../../common/types/locale-types';
import { VendureEntity } from '../base/base.entity';
import { CustomCollectionFieldsTranslation } from '../custom-entity-fields';

import { Collection } from './collection.entity';

@Entity()
export class CollectionTranslation extends VendureEntity implements Translation<Collection>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<Collection>>) {
        super(input);
    }

    @Column('varchar') languageCode: LanguageCode;

    @Column() name: string;

    @Column() description: string;

    @ManyToOne(type => Collection, base => base.translations)
    base: Collection;

    @Column(type => CustomCollectionFieldsTranslation)
    customFields: CustomCollectionFieldsTranslation;
}
