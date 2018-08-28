import { LanguageCode } from 'shared/generated-types';

import { API_PORT } from '../../../shared/shared-constants';

export const API_URL = `http://localhost:${API_PORT}`;
export const DEFAULT_LANGUAGE: LanguageCode = LanguageCode.en;
export const DEFAULT_CURRENCY = '£';
