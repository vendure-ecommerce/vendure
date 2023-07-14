---
title: "NativeAuthenticationStrategy"
weight: 10
date: 2023-07-14T16:57:49.481Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# NativeAuthenticationStrategy
<div class="symbol">


# NativeAuthenticationStrategy

{{< generation-info sourceFile="packages/core/src/config/auth/native-authentication-strategy.ts" sourceLine="28" packageName="@vendure/core">}}

This strategy implements a username/password credential-based authentication, with the credentials
being stored in the Vendure database. This is the default method of authentication, and it is advised
to keep it configured unless there is a specific reason not to.

## Signature

```TypeScript
class NativeAuthenticationStrategy implements AuthenticationStrategy<NativeAuthenticationData> {
  readonly readonly name = NATIVE_AUTH_STRATEGY_NAME;
  async init(injector: Injector) => ;
  defineInputType() => DocumentNode;
  async authenticate(ctx: RequestContext, data: NativeAuthenticationData) => Promise<User | false>;
  async verifyUserPassword(ctx: RequestContext, userId: ID, password: string) => Promise<boolean>;
}
```
## Implements

 * <a href='/typescript-api/auth/authentication-strategy#authenticationstrategy'>AuthenticationStrategy</a>&#60;NativeAuthenticationData&#62;


## Members

### name

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### init

{{< member-info kind="method" type="(injector: <a href='/typescript-api/common/injector#injector'>Injector</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### defineInputType

{{< member-info kind="method" type="() => DocumentNode"  >}}

{{< member-description >}}{{< /member-description >}}

### authenticate

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, data: NativeAuthenticationData) => Promise&#60;<a href='/typescript-api/entities/user#user'>User</a> | false&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### verifyUserPassword

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/typescript-api/common/id#id'>ID</a>, password: string) => Promise&#60;boolean&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
