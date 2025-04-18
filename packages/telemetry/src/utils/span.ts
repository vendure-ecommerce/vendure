import { context, Span, trace } from '@opentelemetry/api';

export function getActiveSpan(): Span | undefined {
    return trace.getSpan(context.active());
}
