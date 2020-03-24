import { LanguageCode } from '@vendure/core';
import path from 'path';

export const DEFAULT_APP_PATH = path.join(__dirname, '../admin-ui');
export const loggerCtx = 'AdminUiPlugin';
export const defaultLanguage = LanguageCode.en;
export const defaultAvailableLanguages = [LanguageCode.en, LanguageCode.es, LanguageCode.zh];
