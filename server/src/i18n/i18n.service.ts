import { Injectable } from '@nestjs/common';
import { Handler, Request } from 'express';
import { GraphQLError } from 'graphql';
import * as i18next from 'i18next';
import { TranslationFunction } from 'i18next';
import * as i18nextMiddleware from 'i18next-express-middleware';
import * as ICU from 'i18next-icu';
import * as Backend from 'i18next-node-fs-backend';
import * as path from 'path';

import { ConfigService } from '../config/config.service';

import { I18nError } from './i18n-error';

export interface I18nRequest extends Request {
    t: TranslationFunction;
}

/**
 * This service is responsible for translating messages from the server before they reach the client.
 * The `i18next-express-middleware` middleware detects the client's preferred language based on
 * the `Accept-Language` header or "lang" query param and adds language-specific translation
 * functions to the Express request / response objects.
 */
@Injectable()
export class I18nService {
    private i18n: i18next.i18n;

    constructor(private configService: ConfigService) {
        this.i18n = i18next
            .use(i18nextMiddleware.LanguageDetector)
            .use(Backend)
            .use(ICU)
            .init({
                preload: ['en', 'de'],
                fallbackLng: 'en',
                detection: {
                    lookupQuerystring: 'lang',
                },
                backend: {
                    loadPath: path.join(__dirname, 'messages/{{lng}}.json'),
                    jsonIndent: 2,
                },
            });
    }

    handle(): Handler {
        return i18nextMiddleware.handle(i18next);
    }

    /**
     * Translates the originalError if it is an instance of I18nError.
     */
    translateError(req: I18nRequest, error: GraphQLError) {
        const originalError = error.originalError;
        const t: TranslationFunction = req.t;

        if (t && originalError instanceof I18nError) {
            let translation = originalError.message;
            try {
                translation = t(originalError.message, originalError.variables);
            } catch (e) {
                translation += ` (Translation format error: ${e.message})`;
            }
            error.message = translation;
        }

        return error;
    }
}
