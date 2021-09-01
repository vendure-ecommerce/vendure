import { LanguageCode } from '@vendure/core';
import path from 'path';

export const DEFAULT_APP_PATH = path.join(__dirname, '../admin-ui');
export const loggerCtx = 'AdminUiPlugin';
export const defaultLanguage = LanguageCode.en;

export const defaultAvailableLanguages = [
    LanguageCode.de,
    LanguageCode.en,
    LanguageCode.es,
    LanguageCode.pl,
    LanguageCode.zh_Hans,
    LanguageCode.zh_Hant,
    LanguageCode.pt_BR,
    LanguageCode.cs,
    LanguageCode.fr,
    LanguageCode.ru,
    LanguageCode.uk,
    LanguageCode.it,
];
