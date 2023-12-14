/* eslint-disable @typescript-eslint/require-await */
import {
    ApolloServerPlugin,
    GraphQLRequestListener,
    GraphQLRequestContext,
    GraphQLRequestContextDidEncounterErrors,
} from '@apollo/server';
import { Transaction, setContext } from '@sentry/node';

import { SENTRY_TRANSACTION_KEY } from './constants';

/**
 * Based on https://github.com/ntegral/nestjs-sentry/issues/97#issuecomment-1252446807
 */
export class SentryApolloPlugin implements ApolloServerPlugin {
    constructor(private options: { enableTracing: boolean }) {}

    async requestDidStart({
        request,
        contextValue,
    }: GraphQLRequestContext<any>): Promise<GraphQLRequestListener<any>> {
        const { enableTracing } = this.options;
        const transaction: Transaction | undefined = contextValue.req[SENTRY_TRANSACTION_KEY];
        if (request.operationName) {
            if (enableTracing) {
                // set the transaction Name if we have named queries
                transaction?.setName(request.operationName);
            }
            setContext('Graphql Request', {
                operation_name: request.operationName,
                variables: request.variables,
            });
        }

        return {
            // hook for transaction finished
            async willSendResponse(context) {
                transaction?.finish();
            },
            async executionDidStart() {
                return {
                    // hook for each new resolver
                    willResolveField({ info }) {
                        if (enableTracing) {
                            const span = transaction?.startChild({
                                op: 'resolver',
                                description: `${info.parentType.name}.${info.fieldName}`,
                            });
                            return () => {
                                span?.finish();
                            };
                        }
                    },
                };
            },
        };
    }
}
