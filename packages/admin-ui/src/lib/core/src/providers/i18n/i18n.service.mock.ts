import { TranslateService } from '@ngx-translate/core';

import { MockOf } from '../../../../../testing/testing-types';
import { LanguageCode } from '../../common/generated-types';

import { I18nService } from './i18n.service';

export class MockI18nService implements MockOf<I18nService> {
    setDefaultLanguage(languageCode: LanguageCode) {
        // blank
    }

    setLanguage(language: LanguageCode) {
        // blank
    }

    translate(key: string | string[], params?: any) {
        return key as string;
    }

    availableLanguages: LanguageCode[];
    setAvailableLanguages: (languages: LanguageCode[]) => void;
    _availableLanguages: LanguageCode[];
    ngxTranslate: TranslateService;
}
