import { Injectable, OnModuleInit } from '@nestjs/common';
import { Handler, Request } from 'express';
import { GraphQLError } from 'graphql';
import i18next, { TFunction } from 'i18next';
import i18nextMiddleware from 'i18next-express-middleware';
import ICU from 'i18next-icu';
import Backend from 'i18next-node-fs-backend';
import path from 'path';

import { ConfigService } from '../config/config.service';

import { I18nError } from './i18n-error';

export interface I18nRequest extends Request {
    t: TFunction;
}

/**
 * This service is responsible for translating messages from the server before they reach the client.
 * The `i18next-express-middleware` middleware detects the client's preferred language based on
 * the `Accept-Language` header or "lang" query param and adds language-specific translation
 * functions to the Express request / response objects.
 */
@Injectable()
export class I18nService implements OnModuleInit {
    constructor(private configService: ConfigService) {}

    onModuleInit() {
        return i18next
            .use(i18nextMiddleware.LanguageDetector)
            .use(Backend as any)
            .use(ICU as any)
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
        const t: TFunction = req.t;

        if (t && originalError instanceof I18nError) {
            let translation = originalError.message;
            try {
                translation = t(originalError.message, originalError.variables);
            } catch (e) {
                translation += ` (Translation format error: ${e.message})`;
            }
            error.message = translation;
            // We can now safely remove the variables object so that they do not appear in
            // the error returned by the GraphQL API
            delete originalError.variables;
        }

        return error;
    }
}
