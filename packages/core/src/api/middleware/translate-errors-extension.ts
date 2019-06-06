import { Response } from 'express-serve-static-core';
import { GraphQLError } from 'graphql';
import { GraphQLExtension, GraphQLResponse } from 'graphql-extensions';

import { I18nRequest, I18nService } from '../../i18n/i18n.service';

/**
 * This extension intercepts outgoing responses and translates any error messages into the
 * current request language.
 */
export class TranslateErrorExtension implements GraphQLExtension {
    constructor(private i18nService: I18nService) {}

    willSendResponse(o: {
        graphqlResponse: GraphQLResponse;
        context: { req: I18nRequest; res: Response };
    }): void | {
        graphqlResponse: GraphQLResponse;
        context: { req: I18nRequest; res: Response };
    } {
        const { graphqlResponse, context } = o;
        if (graphqlResponse.errors) {
            graphqlResponse.errors = graphqlResponse.errors.map(err => {
                return this.i18nService.translateError(context.req, err as GraphQLError) as any;
            });
        }
        return o;
    }
}
