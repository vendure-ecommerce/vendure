---
title: "DefaultVerificationTokenStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultVerificationTokenStrategy

<GenerationInfo sourceFile="packages/core/src/config/auth/default-verification-token-strategy.ts" sourceLine="20" packageName="@vendure/core" since="3.2.0" />

The default VerificationTokenStrategy which generates a token consisting of the
base64-encoded current time concatenated with a random id. The token is considered
valid if the current time is within the configured `verificationTokenDuration` of the
time encoded in the token.

```ts title="Signature"
class DefaultVerificationTokenStrategy implements VerificationTokenStrategy {
    init(injector: Injector) => ;
    generateVerificationToken(_ctx: RequestContext) => string;
    verifyVerificationToken(_ctx: RequestContext, token: string) => boolean;
}
```
* Implements: <code><a href='/reference/typescript-api/auth/verification-token-strategy#verificationtokenstrategy'>VerificationTokenStrategy</a></code>



<div className="members-wrapper">

### init

<MemberInfo kind="method" type={`(injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>) => `}   />


### generateVerificationToken

<MemberInfo kind="method" type={`(_ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => string`}   />


### verifyVerificationToken

<MemberInfo kind="method" type={`(_ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, token: string) => boolean`}   />




</div>
