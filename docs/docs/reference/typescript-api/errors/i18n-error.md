---
title: "I18nError"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## I18nError

<GenerationInfo sourceFile="packages/core/src/i18n/i18n-error.ts" sourceLine="18" packageName="@vendure/core" />

All errors thrown in the Vendure server must use or extend this error class. This allows the
error message to be translated before being served to the client.

The error messages should be provided in the form of a string key which corresponds to
a key defined in the `i18n/messages/<languageCode>.json` files.

Note that this class should not be directly used in code, but should be extended by
a more specific Error class.

```ts title="Signature"
class I18nError extends GraphQLError {
    constructor(message: string, variables: { [key: string]: string | number } = {}, code?: string, logLevel: LogLevel = LogLevel.Warn)
}
```
* Extends: <code>GraphQLError</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(message: string, variables: { [key: string]: string | number } = {}, code?: string, logLevel: <a href='/reference/typescript-api/logger/log-level#loglevel'>LogLevel</a> = LogLevel.Warn) => I18nError`}   />




</div>
