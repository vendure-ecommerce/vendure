import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

const SENTRY_DSN = process.env.SENTRY_DSN;
const SENTRY_TRACES_SAMPLE_RATE = Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 1.0);
const SENTRY_PROFILES_SAMPLE_RATE = Number(process.env.SENTRY_PROFILES_SAMPLE_RATE ?? 1.0);

if (!SENTRY_DSN) {
    throw new Error('SENTRY_DSN is not set');
}

Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    /**
     * @description
     * The sample rate for tracing. Value should be between 0 and 1.
     * Please change in production!
     * @default 1.0
     */
    tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
    /**
     * @description
     * The sample rate for profiling. Value should be between 0 and 1.
     * Please change in production!
     * @default 1.0
     */
    profilesSampleRate: SENTRY_PROFILES_SAMPLE_RATE,
});
