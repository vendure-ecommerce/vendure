import { getAppConfig } from '../../app.config';
import { LanguageCode } from '../generated-types';

export function getDefaultLanguage(): LanguageCode {
    return getAppConfig().defaultLanguage;
}
