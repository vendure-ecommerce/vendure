import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

const SENTRY_DSN = process.env.SENTRY_DSN;
const SENTRY_TRACES_SAMPLE_RATE = process.env.SENTRY_TRACES_SAMPLE_RATE
    ? Number(process.env.SENTRY_TRACES_SAMPLE_RATE)
    : undefined;
const SENTRY_PROFILES_SAMPLE_RATE = process.env.SENTRY_PROFILES_SAMPLE_RATE
    ? Number(process.env.SENTRY_PROFILES_SAMPLE_RATE)
    : undefined;

if (!SENTRY_DSN) {
    throw new Error('SENTRY_DSN is not set');
}

Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    /**
     * @description
     * The sample rate for tracing. Value should be between 0 and 1.
     * By default, tracing is disabled.
     * @default undefined
     */
    tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
    /**
     * @description
     * The sample rate for profiling. Value should be between 0 and 1.
     * By default, profiling is disabled.
     * @default undefined
     */
    profilesSampleRate: SENTRY_PROFILES_SAMPLE_RATE,
});
