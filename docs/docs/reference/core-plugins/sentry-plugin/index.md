---
title: "SentryPlugin"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SentryPlugin

<GenerationInfo sourceFile="packages/sentry-plugin/src/sentry-plugin.ts" sourceLine="108" packageName="@vendure/sentry-plugin" />

This plugin integrates the [Sentry](https://sentry.io) error tracking & performance monitoring
service with your Vendure server. In addition to capturing errors, it also provides built-in
support for [tracing](https://docs.sentry.io/product/sentry-basics/concepts/tracing/) as well as
enriching your Sentry events with additional context about the request.

## Pre-requisites

This plugin depends on access to Sentry, which can be self-hosted or used as a cloud service.

If using the hosted SaaS option, you must have a Sentry account and a project set up ([sign up here](https://sentry.io/signup/)). When setting up your project,
select the "Node.js" platform and no framework.

Once set up, you will be given a [Data Source Name (DSN)](https://docs.sentry.io/product/sentry-basics/concepts/dsn-explainer/)
which you will need to provide to the plugin.

## Installation

Install this plugin as well as the `@sentry/node` package:

```sh
npm install --save @vendure/sentry-plugin @sentry/node
```

## Configuration

Before using the plugin, you must configure it with the DSN provided by Sentry:

```ts
import { VendureConfig } from '@vendure/core';
import { SentryPlugin } from '@vendure/sentry-plugin';

export const config: VendureConfig = {
    // ...
    plugins: [
        // ...
        // highlight-start
        SentryPlugin.init({
            dsn: process.env.SENTRY_DSN,
            // Optional configuration
            includeErrorTestMutation: true,
            enableTracing: true,
            // you can also pass in any of the options from @sentry/node
            // for instance:
            tracesSampleRate: 1.0,
        }),
        // highlight-end
    ],
};
```

## Tracing

This plugin includes built-in support for [tracing](https://docs.sentry.io/product/sentry-basics/concepts/tracing/), which allows you to see the performance of your
GraphQL resolvers in the Sentry dashboard. To enable tracing, set the `enableTracing` option to `true` as shown above.

## Instrumenting your own code

You may want to add your own custom spans to your code. To do so, you can use the `Sentry` object
just as you would in any Node application. For example:

```ts
import * as Sentry from "@sentry/node";

export class MyService {
    async myMethod() {
         Sentry.setContext('My Custom Context,{
             key: 'value',
         });
    }
}
```

## Error test mutation

To test whether your Sentry configuration is working correctly, you can set the `includeErrorTestMutation` option to `true`. This will add a mutation to the Admin API
which will throw an error of the type specified in the `errorType` argument. For example:

```graphql
mutation CreateTestError {
    createTestError(errorType: DATABASE_ERROR)
}
```

You should then be able to see the error in your Sentry dashboard (it may take a couple of minutes to appear).

```ts title="Signature"
class SentryPlugin implements NestModule {
    static options: SentryPluginOptions = {} as any;
    configure(consumer: MiddlewareConsumer) => any;
    init(options: SentryPluginOptions) => ;
}
```
* Implements: <code>NestModule</code>



<div className="members-wrapper">

### options

<MemberInfo kind="property" type={`<a href='/reference/core-plugins/sentry-plugin/sentry-plugin-options#sentrypluginoptions'>SentryPluginOptions</a>`}   />


### configure

<MemberInfo kind="method" type={`(consumer: MiddlewareConsumer) => any`}   />


### init

<MemberInfo kind="method" type={`(options: <a href='/reference/core-plugins/sentry-plugin/sentry-plugin-options#sentrypluginoptions'>SentryPluginOptions</a>) => `}   />




</div>
