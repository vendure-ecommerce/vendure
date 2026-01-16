---
title: "BcryptPasswordHashingStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## BcryptPasswordHashingStrategy

<GenerationInfo sourceFile="packages/core/src/config/auth/bcrypt-password-hashing-strategy.ts" sourceLine="12" packageName="@vendure/core" since="1.3.0" />

A hashing strategy which uses bcrypt (https://en.wikipedia.org/wiki/Bcrypt) to hash plaintext password strings.

```ts title="Signature"
class BcryptPasswordHashingStrategy implements PasswordHashingStrategy {
    hash(plaintext: string) => Promise<string>;
    check(plaintext: string, hash: string) => Promise<boolean>;
}
```
* Implements: <code><a href='/reference/typescript-api/auth/password-hashing-strategy#passwordhashingstrategy'>PasswordHashingStrategy</a></code>



<div className="members-wrapper">

### hash

<MemberInfo kind="method" type={`(plaintext: string) => Promise&#60;string&#62;`}   />


### check

<MemberInfo kind="method" type={`(plaintext: string, hash: string) => Promise&#60;boolean&#62;`}   />




</div>
