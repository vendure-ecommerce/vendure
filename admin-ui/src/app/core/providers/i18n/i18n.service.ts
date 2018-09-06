import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageCode } from 'shared/generated-types';

import { getDefaultLanguage } from '../../../common/utilities/get-default-language';

@Injectable()
export class I18nService {
    constructor(private ngxTranslate: TranslateService) {}

    /**
     * Set the default language
     */
    setDefaultLanguage(languageCode: LanguageCode) {
        this.ngxTranslate.setDefaultLang(languageCode);
    }

    /**
     * Set the UI language
     */
    setLanguage(language: LanguageCode): void {
        this.ngxTranslate.use(language);
    }

    /**
     * Translate the given key.
     */
    translate(key: string | string[], params?: any): string {
        return this.ngxTranslate.instant(key, params);
    }
}
