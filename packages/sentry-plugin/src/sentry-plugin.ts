import { SentryModule } from '@sentry/nestjs/setup';
import { PluginCommonModule, VendurePlugin } from '@vendure/core';

import { SentryAdminTestResolver } from './api/admin-test.resolver';
import { testApiExtensions } from './api/api-extensions';
import { ErrorTestService } from './api/error-test.service';
import { SENTRY_PLUGIN_OPTIONS } from './constants';
import { SentryErrorHandlerStrategy } from './sentry-error-handler-strategy';
import { SentryService } from './sentry.service';
import { SentryPluginOptions } from './types';

const SentryOptionsProvider = {
    provide: SENTRY_PLUGIN_OPTIONS,
    useFactory: () => SentryPlugin.options,
};

/**
 * @description
 * This plugin integrates the [Sentry](https://sentry.io) error tracking & performance monitoring
 * service with your Vendure server. In addition to capturing errors, it also provides built-in
 * support for [tracing](https://docs.sentry.io/product/sentry-basics/concepts/tracing/) as well as
 * enriching your Sentry events with additional context about the request.
 *
 * :::info
 * This documentation applies from v3.5.0 of the plugin, which works differently to previous
 * versions. Documentation for prior versions can
 * be found [here](https://github.com/vendurehq/vendure/blob/1bb9cf8ca1584bce026ccc82f33f866b766ef47d/packages/sentry-plugin/src/sentry-plugin.ts).
 * :::
 *
 * ## Pre-requisites
 *
 * This plugin depends on access to Sentry, which can be self-hosted or used as a cloud service.
 *
 * If using the hosted SaaS option, you must have a Sentry account and a project set up ([sign up here](https://sentry.io/signup/)). When setting up your project,
 * select the "Node.js" platform and no framework.
 *
 * Once set up, you will be given a [Data Source Name (DSN)](https://docs.sentry.io/product/sentry-basics/concepts/dsn-explainer/)
 * which you will need to provide to the plugin.
 *
 * ## Installation
 *
 * ```sh
 * npm install --save \@vendure/sentry-plugin
 * ```
 *
 * ## Environment Variables
 *
 * The following environment variables are used to control how the Sentry
 * integration behaves:
 *
 * - `SENTRY_DSN`: (required) Sentry Data Source Name
 * - `SENTRY_TRACES_SAMPLE_RATE`: Number between 0 and 1
 * - `SENTRY_PROFILES_SAMPLE_RATE`: Number between 0 and 1
 * - `SENTRY_ENABLE_LOGS`: Boolean. Captures calls to the console API as logs in Sentry. Default `false`
 * - `SENTRY_CAPTURE_LOG_LEVELS`: 'debug' | 'info' | 'warn' | 'error' | 'log' | 'assert' | 'trace'
 *
 * ## Configuration
 *
 * Setting up the Sentry plugin requires two steps:
 *
 * ### Step 1: Preload the Sentry instrument file
 *
 * Make sure the `SENTRY_DSN` environment variable is defined.
 *
 * The Sentry SDK must be initialized before your application starts. This is done by preloading
 * the instrument file when starting your Vendure server:
 *
 * ```sh
 * node --import \@vendure/sentry-plugin/instrument ./dist/index.js
 * ```
 *
 * Or if using TypeScript directly with tsx:
 *
 * ```sh
 * tsx --import \@vendure/sentry-plugin/instrument ./src/index.ts
 * ```
 *
 * ### Step 2: Add the SentryPlugin to your Vendure config
 *
 * ```ts
 * import { VendureConfig } from '\@vendure/core';
 * import { SentryPlugin } from '\@vendure/sentry-plugin';
 *
 * export const config: VendureConfig = {
 *     // ...
 *     plugins: [
 *         // ...
 *         // highlight-start
 *         SentryPlugin.init({
 *             // Optional configuration
 *             includeErrorTestMutation: true,
 *         }),
 *         // highlight-end
 *     ],
 * };
 *```
 *
 * ## Tracing
 *
 * This plugin includes built-in support for [tracing](https://docs.sentry.io/product/sentry-basics/concepts/tracing/), which allows you to see the performance of your.
 * To enable tracing, preload the instrument file as described in [Step 1](#step-1-preload-the-sentry-instrument-file).
 * This ensures that the Sentry SDK is initialized before any other code is executed.
 *
 * You can also set the `tracesSampleRate` and `profilesSampleRate` options to control the sample rate for
 * tracing and profiling, with the following environment variables:
 *
 * - `SENTRY_TRACES_SAMPLE_RATE`
 * - `SENTRY_PROFILES_SAMPLE_RATE`
 *
 * The sample rate for tracing should be between 0 and 1. The sample rate for profiling should be between 0 and 1.
 *
 * By default, both are set to `undefined`, which means that tracing and profiling are disabled.
 *
 * ## Instrumenting your own code
 *
 * You may want to add your own custom spans to your code. To do so, you can use the `Sentry` object
 * from the `\@sentry/node` package. For example:
 *
 * ```ts
 * import * as Sentry from "\@sentry/node";
 *
 * export class MyService {
 *     async myMethod() {
 *          Sentry.setContext('My Custom Context,{
 *              key: 'value',
 *          });
 *     }
 * }
 * ```
 *
 * ## Error test mutation
 *
 * To test whether your Sentry configuration is working correctly, you can set the `includeErrorTestMutation` option to `true`. This will add a mutation to the Admin API
 * which will throw an error of the type specified in the `errorType` argument. For example:
 *
 * ```graphql
 * mutation CreateTestError {
 *     createTestError(errorType: DATABASE_ERROR)
 * }
 * ```
 *
 * You should then be able to see the error in your Sentry dashboard (it may take a couple of minutes to appear).
 *
 * @deprecated This plugin is moving to `@vendure-community/sentry-plugin`.
 * The `@vendure/sentry-plugin` package will be removed in the next minor release.
 *
 * @docsCategory core plugins/SentryPlugin
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [SentryOptionsProvider, SentryService, ErrorTestService],
    configuration: config => {
        config.systemOptions.errorHandlers.push(new SentryErrorHandlerStrategy());
        config.plugins.push(SentryModule.forRoot());
        return config;
    },
    adminApiExtensions: {
        schema: () => (SentryPlugin.options.includeErrorTestMutation ? testApiExtensions : undefined),
        resolvers: () => (SentryPlugin.options.includeErrorTestMutation ? [SentryAdminTestResolver] : []),
    },
    exports: [SentryService],
    compatibility: '^3.0.0',
})
export class SentryPlugin {
    static options: SentryPluginOptions = {} as any;

    static init(options?: SentryPluginOptions) {
        this.options = options ?? {};
        return this;
    }
}
