---
title: "PasswordValidationStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PasswordValidationStrategy

<GenerationInfo sourceFile="packages/core/src/config/auth/password-validation-strategy.ts" sourceLine="19" packageName="@vendure/core" since="1.5.0" />

Defines validation to apply to new password (when creating an account or updating an existing account's
password when using the <a href='/reference/typescript-api/auth/native-authentication-strategy#nativeauthenticationstrategy'>NativeAuthenticationStrategy</a>.

:::info

This is configured via the `authOptions.passwordValidationStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface PasswordValidationStrategy extends InjectableStrategy {
    validate(ctx: RequestContext, password: string): Promise<boolean | string> | boolean | string;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### validate

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, password: string) => Promise&#60;boolean | string&#62; | boolean | string`}  since="1.5.0"  />

Validates a password submitted during account registration or when a customer updates their password.
The method should resolve to `true` if the password is acceptable. If not, it should return `false` or
optionally a string which will be passed to the returned ErrorResult, which can e.g. advise on why
exactly the proposed password is not valid.


</div>
