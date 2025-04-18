// packages/tracing-utils/createSpanDecorator.ts
import { Span as ApiSpan, SpanOptions, SpanStatusCode, Tracer } from '@opentelemetry/api';

import { copyMetadata } from '../utils/metadata';

const recordException = (span: ApiSpan, error: any) => {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
};

/**
 * @description
 * Returns a `@Span()` method decorator bound to the given tracer.
 *
 * Usage in each package:
 *   export const Span = createSpanDecorator(tracer);
 *
 * @since 3.3.0
 */
export function createSpanDecorator(tracer: Tracer) {
    return function Span(name?: string, options: SpanOptions = {}): MethodDecorator {
        return (target: any, propertyKey: PropertyKey, propertyDescriptor: PropertyDescriptor) => {
            const originalFunction = propertyDescriptor.value;
            const wrappedFunction = function PropertyDescriptor(...args: any[]) {
                const spanName = name || `${String(target.constructor.name)}.${String(propertyKey)}`;

                return tracer.startActiveSpan(spanName, options, span => {
                    if (originalFunction.constructor.name === 'AsyncFunction') {
                        return (
                            originalFunction
                                // @ts-expect-error
                                .apply(this, args)
                                // @ts-expect-error
                                .catch(error => {
                                    recordException(span, error);
                                    // Throw error to propagate it further
                                    throw error;
                                })
                                .finally(() => {
                                    span.end();
                                })
                        );
                    }

                    try {
                        // @ts-expect-error
                        return originalFunction.apply(this, args);
                    } catch (error) {
                        recordException(span, error);

                        // throw for further propagation
                        throw error;
                    } finally {
                        span.end();
                    }
                });
            };

            propertyDescriptor.value = wrappedFunction;

            copyMetadata(originalFunction, wrappedFunction);
        };
    };
}
