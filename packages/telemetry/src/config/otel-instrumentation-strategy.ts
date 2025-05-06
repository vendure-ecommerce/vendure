import { Span as ApiSpan, SpanStatusCode, trace } from '@opentelemetry/api';
import { logs } from '@opentelemetry/api-logs';
import { InstrumentationStrategy, VENDURE_VERSION, WrappedMethodArgs } from '@vendure/core';

export const tracer = trace.getTracer('@vendure/core', VENDURE_VERSION);
export const otelLogger = logs.getLogger('@vendure/core', VENDURE_VERSION);
const recordException = (span: ApiSpan, error: any) => {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
};

export class OtelInstrumentationStrategy implements InstrumentationStrategy {
    wrapMethod({ target, methodName, args, applyOriginalFunction }: WrappedMethodArgs) {
        const spanName = `${String(target.name)}.${String(methodName)}`;

        return tracer.startActiveSpan(spanName, {}, span => {
            if (applyOriginalFunction.constructor.name === 'AsyncFunction') {
                return (
                    applyOriginalFunction()
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
                return applyOriginalFunction();
            } catch (error) {
                recordException(span, error);

                // throw for further propagation
                throw error;
            } finally {
                span.end();
            }
        });
    }
}
