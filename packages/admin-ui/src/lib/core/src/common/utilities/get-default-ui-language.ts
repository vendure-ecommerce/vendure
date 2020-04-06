import { getAppConfig } from '../../app.config';
import { LanguageCode } from '../generated-types';

export function getDefaultUiLanguage(): LanguageCode {
    return getAppConfig().defaultLanguage;
}
