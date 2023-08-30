---
title: "BcryptPasswordHashingStrategy"
weight: 10
date: 2023-07-14T16:57:49.477Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# BcryptPasswordHashingStrategy
<div class="symbol">


# BcryptPasswordHashingStrategy

{{< generation-info sourceFile="packages/core/src/config/auth/bcrypt-password-hashing-strategy.ts" sourceLine="12" packageName="@vendure/core" since="1.3.0">}}

A hashing strategy which uses bcrypt (https://en.wikipedia.org/wiki/Bcrypt) to hash plaintext password strings.

## Signature

```TypeScript
class BcryptPasswordHashingStrategy implements PasswordHashingStrategy {
  hash(plaintext: string) => Promise<string>;
  check(plaintext: string, hash: string) => Promise<boolean>;
}
```
## Implements

 * <a href='/typescript-api/auth/password-hashing-strategy#passwordhashingstrategy'>PasswordHashingStrategy</a>


## Members

### hash

{{< member-info kind="method" type="(plaintext: string) => Promise&#60;string&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### check

{{< member-info kind="method" type="(plaintext: string, hash: string) => Promise&#60;boolean&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
