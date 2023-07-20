---
title: "PasswordValidationStrategy"
weight: 10
date: 2023-07-14T16:57:49.487Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PasswordValidationStrategy
<div class="symbol">


# PasswordValidationStrategy

{{< generation-info sourceFile="packages/core/src/config/auth/password-validation-strategy.ts" sourceLine="12" packageName="@vendure/core" since="1.5.0">}}

Defines validation to apply to new password (when creating an account or updating an existing account's
password when using the <a href='/typescript-api/auth/native-authentication-strategy#nativeauthenticationstrategy'>NativeAuthenticationStrategy</a>.

## Signature

```TypeScript
interface PasswordValidationStrategy extends InjectableStrategy {
  validate(ctx: RequestContext, password: string): Promise<boolean | string> | boolean | string;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### validate

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, password: string) => Promise&#60;boolean | string&#62; | boolean | string"  since="1.5.0" >}}

{{< member-description >}}Validates a password submitted during account registration or when a customer updates their password.
The method should resolve to `true` if the password is acceptable. If not, it should return `false` or
optionally a string which will be passed to the returned ErrorResult, which can e.g. advise on why
exactly the proposed password is not valid.{{< /member-description >}}


</div>
