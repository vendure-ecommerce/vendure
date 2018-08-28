import { LanguageCode } from 'shared/generated-types';

import { DEFAULT_LANGUAGE } from '../../app.config';

export function getDefaultLanguage(): LanguageCode {
    return DEFAULT_LANGUAGE;
}
