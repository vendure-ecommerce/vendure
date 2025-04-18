import { trace } from '@opentelemetry/api';
import { createSpanDecorator } from '@vendure/telemetry';

import pkg from '../package.json';

export const tracer = trace.getTracer(pkg.name, pkg.version);

export const Span = createSpanDecorator(tracer);
