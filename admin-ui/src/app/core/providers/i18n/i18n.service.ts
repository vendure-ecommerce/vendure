import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageCode } from '../../../data/types/gql-generated-types';

@Injectable()
export class I18nService {
    constructor(private ngxTranslate: TranslateService) {
        ngxTranslate.setDefaultLang(LanguageCode.en);
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
