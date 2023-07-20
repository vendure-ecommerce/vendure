---
title: "AuthenticatedSession"
weight: 10
date: 2023-07-14T16:57:49.991Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AuthenticatedSession
<div class="symbol">


# AuthenticatedSession

{{< generation-info sourceFile="packages/core/src/entity/session/authenticated-session.entity.ts" sourceLine="14" packageName="@vendure/core">}}

An AuthenticatedSession is created upon successful authentication.

## Signature

```TypeScript
class AuthenticatedSession extends Session {
  constructor(input: DeepPartial<AuthenticatedSession>)
  @Index() @ManyToOne(type => User) @Index()
    @ManyToOne(type => User)
    user: User;
  @Column() @Column()
    authenticationStrategy: string;
}
```
## Extends

 * <a href='/typescript-api/entities/session#session'>Session</a>


## Members

### constructor

{{< member-info kind="method" type="(input: DeepPartial&#60;<a href='/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a>&#62;) => AuthenticatedSession"  >}}

{{< member-description >}}{{< /member-description >}}

### user

{{< member-info kind="property" type="<a href='/typescript-api/entities/user#user'>User</a>"  >}}

{{< member-description >}}The <a href='/typescript-api/entities/user#user'>User</a> who has authenticated to create this session.{{< /member-description >}}

### authenticationStrategy

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The name of the <a href='/typescript-api/auth/authentication-strategy#authenticationstrategy'>AuthenticationStrategy</a> used when authenticating
to create this session.{{< /member-description >}}


</div>
