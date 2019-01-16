import { Column, Entity } from 'typeorm';

import { VendureEntity } from '..';
import { LanguageCode } from '../../../../shared/generated-types';
import { DeepPartial, HasCustomFields } from '../../../../shared/shared-types';
import { CustomGlobalSettingsFields } from '../custom-entity-fields';

@Entity()
export class GlobalSettings extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<GlobalSettings>) {
        super(input);
    }

    @Column('simple-array')
    availableLanguages: LanguageCode[];

    @Column(type => CustomGlobalSettingsFields)
    customFields: CustomGlobalSettingsFields;
}
