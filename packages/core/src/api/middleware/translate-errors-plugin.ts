import { ApolloServerPlugin, GraphQLRequestListener } from 'apollo-server-plugin-base';
import { GraphQLError } from 'graphql';

import { I18nService } from '../../i18n/i18n.service';

/**
 * This plugin intercepts outgoing responses and translates any error messages into the
 * current request language.
 */
export class TranslateErrorsPlugin implements ApolloServerPlugin {
    constructor(private i18nService: I18nService) {}

    async requestDidStart(): Promise<GraphQLRequestListener> {
        return {
            willSendResponse: async requestContext => {
                const { errors, context } = requestContext;
                if (errors) {
                    (requestContext.response as any).errors = errors.map(err => {
                        return this.i18nService.translateError(context.req, err) as any;
                    });
                }
            },
        };
    }
}
