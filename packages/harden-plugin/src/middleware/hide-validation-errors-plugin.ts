import { ValidationError } from 'apollo-server-core';
import { ApolloServerPlugin, GraphQLRequestListener, GraphQLServiceContext } from 'apollo-server-plugin-base';

/**
 * @description
 * Hides graphql-js suggestions when invalid field names are given.
 * Based on ideas discussed in https://github.com/apollographql/apollo-server/issues/3919
 */
export class HideValidationErrorsPlugin implements ApolloServerPlugin {
    async requestDidStart(): Promise<GraphQLRequestListener> {
        return {
            willSendResponse: async requestContext => {
                const { errors, context } = requestContext;
                if (errors) {
                    (requestContext.response as any).errors = errors.map(err => {
                        if (err.message.includes('Did you mean')) {
                            return new ValidationError('Invalid request');
                        } else {
                            return err;
                        }
                    });
                }
            },
        };
    }
}
