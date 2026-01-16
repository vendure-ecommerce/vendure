---
title: "PasswordHashingStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PasswordHashingStrategy

<GenerationInfo sourceFile="packages/core/src/config/auth/password-hashing-strategy.ts" sourceLine="17" packageName="@vendure/core" since="1.3.0" />

Defines how user passwords get hashed when using the <a href='/reference/typescript-api/auth/native-authentication-strategy#nativeauthenticationstrategy'>NativeAuthenticationStrategy</a>.

:::info

This is configured via the `authOptions.passwordHashingStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface PasswordHashingStrategy extends InjectableStrategy {
    hash(plaintext: string): Promise<string>;
    check(plaintext: string, hash: string): Promise<boolean>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### hash

<MemberInfo kind="method" type={`(plaintext: string) => Promise&#60;string&#62;`}   />


### check

<MemberInfo kind="method" type={`(plaintext: string, hash: string) => Promise&#60;boolean&#62;`}   />




</div>
