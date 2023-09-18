---
title: "AnonymousSession"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AnonymousSession

<GenerationInfo sourceFile="packages/core/src/entity/session/anonymous-session.entity.ts" sourceLine="16" packageName="@vendure/core" />

An anonymous session is created when a unauthenticated user interacts with restricted operations,
such as calling the `activeOrder` query in the Shop API. Anonymous sessions allow a guest Customer
to maintain an order without requiring authentication and a registered account beforehand.

```ts title="Signature"
class AnonymousSession extends Session {
    constructor(input: DeepPartial<AnonymousSession>)
}
```
* Extends: <code><a href='/reference/typescript-api/entities/session#session'>Session</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input: DeepPartial&#60;<a href='/reference/typescript-api/entities/anonymous-session#anonymoussession'>AnonymousSession</a>&#62;) => AnonymousSession`}   />




</div>
