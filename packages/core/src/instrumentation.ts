import { trace } from '@opentelemetry/api';
import { createSpanDecorator } from '@vendure/telemetry';

import { VENDURE_VERSION } from './version';

export const tracer = trace.getTracer('@vendure/core', VENDURE_VERSION);

export const Span = createSpanDecorator(tracer);
