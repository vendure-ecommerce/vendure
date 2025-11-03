---
title: "VerificationTokenStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## VerificationTokenStrategy

<GenerationInfo sourceFile="packages/core/src/config/auth/verification-token-strategy.ts" sourceLine="18" packageName="@vendure/core" since="3.2.0" />

Defines a custom strategy for creating and validating verification tokens.

:::info

This is configured via the `authOptions.verificationTokenStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface VerificationTokenStrategy extends InjectableStrategy {
    generateVerificationToken(ctx: RequestContext): Promise<string> | string;
    verifyVerificationToken(ctx: RequestContext, token: string): Promise<boolean> | boolean;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### generateVerificationToken

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;string&#62; | string`}  since="3.2.0"  />

Generates a verification token.
### verifyVerificationToken

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, token: string) => Promise&#60;boolean&#62; | boolean`}  since="3.2.0"  />

Checks the validity of a verification token.


</div>
