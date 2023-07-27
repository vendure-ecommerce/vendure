---
title: "I18nError"
weight: 10
date: 2023-07-14T16:57:50.132Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# I18nError
<div class="symbol">


# I18nError

{{< generation-info sourceFile="packages/core/src/i18n/i18n-error.ts" sourceLine="18" packageName="@vendure/core">}}

All errors thrown in the Vendure server must use or extend this error class. This allows the
error message to be translated before being served to the client.

The error messages should be provided in the form of a string key which corresponds to
a key defined in the `i18n/messages/<languageCode>.json` files.

Note that this class should not be directly used in code, but should be extended by
a more specific Error class.

## Signature

```TypeScript
class I18nError extends ApolloError {
  constructor(message: string, variables: { [key: string]: string | number } = {}, code?: string, logLevel: LogLevel = LogLevel.Warn)
}
```
## Extends

 * ApolloError


## Members

### constructor

{{< member-info kind="method" type="(message: string, variables: { [key: string]: string | number } = {}, code?: string, logLevel: <a href='/typescript-api/logger/log-level#loglevel'>LogLevel</a> = LogLevel.Warn) => I18nError"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
