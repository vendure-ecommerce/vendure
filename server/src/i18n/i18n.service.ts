import { Injectable } from '@nestjs/common';
import { Handler, Request } from 'express';
import { GraphQLError } from 'graphql-request/dist/src/types';
import * as i18next from 'i18next';
import { TranslationFunction } from 'i18next';
import * as i18nextMiddleware from 'i18next-express-middleware';
import * as Backend from 'i18next-node-fs-backend';
import * as path from 'path';
import { I18nError } from './i18n-error';

export interface I18nRequest extends Request {
    t: TranslationFunction;
}

export interface WrappedGraphQLError extends GraphQLError {
    originalError: Error;
}

/**
 * This service is responsible for translating messages from the server before they reach the client.
 * The `i18next-express-middleware` middleware detects the client's preferred language based on
 * the `Accept-Language` header or "lang" query param and adds language-specific translation
 * functions to the Express request / response objects.
 */
@Injectable()
export class I18nService {
    constructor() {
        i18next
            .use(i18nextMiddleware.LanguageDetector)
            .use(Backend)
            .init({
                preload: ['en', 'de'],
                detection: {
                    lookupQuerystring: 'lang',
                },
                backend: {
                    loadPath: path.join(__dirname, 'translations/{{lng}}.json'),
                    jsonIndent: 2,
                },
            });
    }

    handle(): Handler {
        return i18nextMiddleware.handle(i18next);
    }

    translateError(req?: any) {
        return (error: WrappedGraphQLError) => {
            const originalError = error.originalError;
            if (req && req.t && originalError instanceof I18nError) {
                const t: TranslationFunction = req.t;
                error.message = t(originalError.message, originalError.variables);
            }

            return error;
        };
    }
}
