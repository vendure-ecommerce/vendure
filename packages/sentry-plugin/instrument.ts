import type { ConsoleLevel } from '@sentry/core';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

const SENTRY_DSN = process.env.SENTRY_DSN;
const SENTRY_TRACES_SAMPLE_RATE = process.env.SENTRY_TRACES_SAMPLE_RATE
    ? Number(process.env.SENTRY_TRACES_SAMPLE_RATE)
    : undefined;
const SENTRY_PROFILES_SAMPLE_RATE = process.env.SENTRY_PROFILES_SAMPLE_RATE
    ? Number(process.env.SENTRY_PROFILES_SAMPLE_RATE)
    : undefined;
const SENTRY_ENABLE_LOGS = process.env.SENTRY_ENABLE_LOGS === 'true';
const SENTRY_CAPTURE_LOG_LEVELS = process.env.SENTRY_CAPTURE_LOG_LEVELS
    ? process.env.SENTRY_CAPTURE_LOG_LEVELS.split(',').map(l => l.trim())
    : ['log', 'warn', 'error'];

if (!SENTRY_DSN) {
    // eslint-disable-next-line
    console.error('SENTRY_DSN is not set');
} else {
    Sentry.init({
        dsn: SENTRY_DSN,
        integrations: [
            nodeProfilingIntegration(),
            ...(SENTRY_ENABLE_LOGS
                ? [Sentry.consoleLoggingIntegration({ levels: SENTRY_CAPTURE_LOG_LEVELS as ConsoleLevel[] })]
                : []),
        ],
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

        /**
         * @description
         * Enable logs to be sent to Sentry.
         * @default false
         */
        enableLogs: SENTRY_ENABLE_LOGS,
    });
}
