import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of as observableOf } from 'rxjs';

declare function require(path: string): any;

const translations = [
    'common',
    // 'error',
    // 'notification',
].reduce((hash, name) => {
    hash[name] = require(`../../../../i18n-messages/${name}.messages.ts`).default;
    return hash;
}, {} as { [name: string]: any; });

/**
 * A custom language loader which splits apart a translations object in the format:
 * {
 *   SECTION: {
 *     TOKEN: {
 *       lang1: "...",
 *       lang2: "....
 *     }
 *   }
 * }
 */
export class CustomLoader implements TranslateLoader {

    getTranslation(lang: string): Observable<any> {
        const output: any = {};
        for (const section in translations) {
            if (translations.hasOwnProperty(section)) {
                output[section] = {};

                for (const token in translations[section]) {
                    if (translations[section].hasOwnProperty(token)) {
                        output[section][token] = translations[section][token][lang];
                    }
                }
            }
        }
        return observableOf(output);
    }
}
