---
title: "PasswordHashingStrategy"
weight: 10
date: 2023-07-14T16:57:49.484Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PasswordHashingStrategy
<div class="symbol">


# PasswordHashingStrategy

{{< generation-info sourceFile="packages/core/src/config/auth/password-hashing-strategy.ts" sourceLine="10" packageName="@vendure/core" since="1.3.0">}}

Defines how user passwords get hashed when using the <a href='/typescript-api/auth/native-authentication-strategy#nativeauthenticationstrategy'>NativeAuthenticationStrategy</a>.

## Signature

```TypeScript
interface PasswordHashingStrategy extends InjectableStrategy {
  hash(plaintext: string): Promise<string>;
  check(plaintext: string, hash: string): Promise<boolean>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### hash

{{< member-info kind="method" type="(plaintext: string) => Promise&#60;string&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### check

{{< member-info kind="method" type="(plaintext: string, hash: string) => Promise&#60;boolean&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
