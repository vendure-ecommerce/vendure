import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type UILanguage = 'en' | 'de';

@Injectable()
export class I18nService {
    constructor(private ngxTranslate: TranslateService) {
        // ngxTranslate.setDefaultLang(config.FALLBACK_LANGUAGE);
    }

    /**
     * Set the UI language
     */
    setLanguage(language: UILanguage): void {
        this.ngxTranslate.use(language);
    }

    /**
     * Translate the given key.
     */
    translate(key: string | string[], params?: any): string {
        return this.ngxTranslate.instant(key, params);
    }

    /**
     * Attempt to infer the user language from the browser's navigator object. If the result is not
     * amongst the valid UI languages, default to the fallback language instead.
     */
    /*inferUserLanguage(): UILanguage {
        const browserLanguage = navigator.language.split('-')[0];
        if (this.config.UI_LANGUAGES.indexOf(browserLanguage) >= 0) {
            return browserLanguage as any;
        }

        if ((navigator as any).languages) {
            const languages: string[] = (navigator as any).languages;
            for (const lang of languages.map(l => l.split('-')[0])) {
                if (this.config.UI_LANGUAGES.indexOf(lang) >= 0) {
                    return lang as any;
                }
            }
        }

        return this.config.FALLBACK_LANGUAGE as any;
    }*/
}
