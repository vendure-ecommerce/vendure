import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LanguageCode } from '../../common/generated-types';

/** @dynamic */
@Injectable({
    providedIn: 'root',
})
export class I18nService {
    _availableLanguages: LanguageCode[] = [];

    get availableLanguages(): LanguageCode[] {
        return [...this._availableLanguages];
    }

    constructor(private ngxTranslate: TranslateService, @Inject(DOCUMENT) private document: Document) {}

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
        if (this.document?.documentElement) {
            this.document.documentElement.lang = language;
        }
    }

    /**
     * Set the available UI languages
     */
    setAvailableLanguages(languages: LanguageCode[]) {
        this._availableLanguages = languages;
    }

    /**
     * Translate the given key.
     */
    translate(key: string | string[], params?: any): string {
        return this.ngxTranslate.instant(key, params);
    }
}
