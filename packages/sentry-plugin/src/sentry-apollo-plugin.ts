/* eslint-disable @typescript-eslint/require-await */
import { ApolloServerPlugin, GraphQLRequestListener, GraphQLRequestContext } from '@apollo/server';
import { Span } from '@sentry/node';

import { SENTRY_START_SPAN_INACTIVE_KEY } from './constants';
import { StartInactiveSpanFunction } from './types';

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
        const startInactiveSpan: StartInactiveSpanFunction | undefined =
            contextValue.req[SENTRY_START_SPAN_INACTIVE_KEY];
        let span: Span | undefined;
        if (enableTracing && startInactiveSpan) {
            let name = 'GraphQLSpan';
            if (request.operationName) {
                // update the span name if we have named queries
                name = request.operationName;
            }
            span = startInactiveSpan({ name, op: 'resolver' });
            span?.setAttribute('operation_name', request.operationName);
            for (const key in request.variables) {
                if (Object.prototype.hasOwnProperty.call(request.variables, key)) {
                    span?.setAttribute(key, request.variables[key]);
                }
            }
        }

        return {
            // hook for span finished
            async willSendResponse(context) {
                span?.end();
            },
            async executionDidStart() {
                return {
                    // hook for each new resolver
                    willResolveField({ info }) {
                        if (enableTracing && startInactiveSpan) {
                            span = startInactiveSpan({
                                name: 'GraphQLResolver',
                                op: 'resolver',
                            });
                            span?.setAttribute('description', `${info.parentType.name}.${info.fieldName}`);
                            return () => {
                                span?.end();
                            };
                        }
                    },
                };
            },
        };
    }
}
