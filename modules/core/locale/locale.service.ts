import { Injectable } from '@nestjs/common';
import { Translatable } from './locale-types';

@Injectable()
export class LocaleService {
    translate<T>(translatable: Translatable<T>): T {
        return translate(translatable);
    }
}

/**
 * Converts a Translatable entity into the public-facing entity by unwrapping
 * the translated strings from the first of the Translation entities.
 */
export function translate<T>(translatable: Translatable<T>): T {
    const translation = translatable.translations[0];

    const translated = { ...(translatable as any) };
    delete translated.translations;

    for (const [key, value] of Object.entries(translation)) {
        if (key !== 'languageCode' && key !== 'id') {
            translated[key] = value;
        }
    }
    return translated;
}
