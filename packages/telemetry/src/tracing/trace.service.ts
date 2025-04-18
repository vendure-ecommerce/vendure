import { Injectable } from '@nestjs/common';
import { context, Span, trace, Tracer } from '@opentelemetry/api';

@Injectable()
export class TraceService {
    public getSpan(): Span | undefined {
        return trace.getSpan(context.active());
    }

    public startSpan(tracer: Tracer, name: string): Span {
        return tracer.startSpan(name);
    }
}
