import { Span as ApiSpan, SpanStatusCode, trace } from '@opentelemetry/api';
import { logs } from '@opentelemetry/api-logs';
import { Injector, InstrumentationStrategy, VENDURE_VERSION, WrappedMethodArgs } from '@vendure/core';

import { SetAttributeFn, SpanAttributeService } from '../service/span-attribute.service';

export const tracer = trace.getTracer('@vendure/core', VENDURE_VERSION);
export const otelLogger = logs.getLogger('@vendure/core', VENDURE_VERSION);
const recordException = (span: ApiSpan, error: any) => {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
};

export class OtelInstrumentationStrategy implements InstrumentationStrategy {
    private spanAttributeService: SpanAttributeService;

    init(injector: Injector) {
        this.spanAttributeService = injector.get(SpanAttributeService);
    }

    wrapMethod({ target, methodName, args, applyOriginalFunction }: WrappedMethodArgs) {
        const spanName = `${String(target.name)}.${String(methodName)}`;

        return tracer.startActiveSpan(spanName, {}, span => {
            const hooks = this.spanAttributeService.getHooks(target, methodName);
            const setAttribute: SetAttributeFn = (key, value) => span.setAttribute(key, value);
            hooks?.pre?.(args, setAttribute);
            if (applyOriginalFunction.constructor.name === 'AsyncFunction') {
                return (
                    applyOriginalFunction()
                        .then((result: any) => {
                            if (hooks?.post) {
                                hooks.post(result, setAttribute);
                            }
                            return result;
                        })
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
                const result = applyOriginalFunction();
                if (hooks?.post) {
                    hooks.post(result, setAttribute);
                }
                return result;
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
