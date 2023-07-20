---
title: "PasswordHashingStrategy"
weight: 10
date: 2023-07-20T13:56:14.308Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PasswordHashingStrategy

<GenerationInfo sourceFile="packages/core/src/config/auth/password-hashing-strategy.ts" sourceLine="10" packageName="@vendure/core" since="1.3.0" />

Defines how user passwords get hashed when using the <a href='/typescript-api/auth/native-authentication-strategy#nativeauthenticationstrategy'>NativeAuthenticationStrategy</a>.

```ts title="Signature"
interface PasswordHashingStrategy extends InjectableStrategy {
  hash(plaintext: string): Promise<string>;
  check(plaintext: string, hash: string): Promise<boolean>;
}
```
Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>



### hash

<MemberInfo kind="method" type="(plaintext: string) => Promise&#60;string&#62;"   />


### check

<MemberInfo kind="method" type="(plaintext: string, hash: string) => Promise&#60;boolean&#62;"   />


