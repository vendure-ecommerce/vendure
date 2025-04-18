// packages/tracing-utils/createSpanDecorator.ts
import { context, SpanStatusCode, trace, Tracer } from '@opentelemetry/api';

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
    return function Span(name?: string): MethodDecorator {
        return (target, propertyKey, descriptor: PropertyDescriptor) => {
            // Original method or handler
            const original = descriptor.value;

            // Default to the method name if none supplied
            const spanName = name ?? String(propertyKey);

            descriptor.value = function (...args: unknown[]) {
                const span = tracer.startSpan(spanName);

                // Make the new span the *active* span for anything called inside
                return context.with(trace.setSpan(context.active(), span), async () => {
                    try {
                        // Support sync & async transparently
                        const result = await original.apply(this, args);
                        span.setStatus({ code: SpanStatusCode.OK });
                        return result;
                    } catch (err) {
                        span.recordException(err as Error);
                        span.setStatus({ code: SpanStatusCode.ERROR, message: String(err) });
                        throw err;
                    } finally {
                        span.end();
                    }
                });
            };
        };
    };
}
