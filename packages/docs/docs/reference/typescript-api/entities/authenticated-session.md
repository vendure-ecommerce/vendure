---
title: "AuthenticatedSession"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AuthenticatedSession

<GenerationInfo sourceFile="packages/core/src/entity/session/authenticated-session.entity.ts" sourceLine="14" packageName="@vendure/core" />

An AuthenticatedSession is created upon successful authentication.

```ts title="Signature"
class AuthenticatedSession extends Session {
    constructor(input: DeepPartial<AuthenticatedSession>)
    @Index()
    @ManyToOne(type => User, user => user.sessions)
    user: User;
    @Column()
    authenticationStrategy: string;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/session#session'>Session</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input: DeepPartial&#60;<a href='/reference/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a>&#62;) => AuthenticatedSession`}   />


### user

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/user#user'>User</a>`}   />

The <a href='/reference/typescript-api/entities/user#user'>User</a> who has authenticated to create this session.
### authenticationStrategy

<MemberInfo kind="property" type={`string`}   />

The name of the <a href='/reference/typescript-api/auth/authentication-strategy#authenticationstrategy'>AuthenticationStrategy</a> used when authenticating
to create this session.


</div>
