---
title: "AuthenticationStrategy"
weight: 10
date: 2023-07-04T11:02:11.705Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AuthenticationStrategy
<div class="symbol">


# AuthenticationStrategy

{{< generation-info sourceFile="packages/core/src/config/auth/authentication-strategy.ts" sourceLine="16" packageName="@vendure/core">}}

An AuthenticationStrategy defines how a User (which can be a Customer in the Shop API or
and Administrator in the Admin API) may be authenticated.

Real-world examples can be found in the [Authentication guide](/docs/developer-guide/authentication/).

## Signature

```TypeScript
interface AuthenticationStrategy<Data = unknown> extends InjectableStrategy {
  readonly name: string;
  defineInputType(): DocumentNode;
  authenticate(ctx: RequestContext, data: Data): Promise<User | false | string>;
  onLogOut?(ctx: RequestContext, user: User): Promise<void>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### name

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The name of the strategy, for example `'facebook'`, `'google'`, `'keycloak'`.{{< /member-description >}}

### defineInputType

{{< member-info kind="method" type="() => DocumentNode"  >}}

{{< member-description >}}Defines the type of the GraphQL Input object expected by the `authenticate`
mutation. The final input object will be a map, with the key being the name
of the strategy. The shape of the input object should match the generic `Data`
type argument.

*Example*

For example, given the following:

```TypeScript
defineInputType() {
  return gql`
     input MyAuthInput {
       token: String!
     }
  `;
}
```

assuming the strategy name is "my_auth", then the resulting call to `authenticate`
would look like:

```GraphQL
authenticate(input: {
  my_auth: {
    token: "foo"
  }
}) {
  # ...
}
```

**Note:** if more than one graphql `input` type is being defined (as in a nested input type), then
the _first_ input will be assumed to be the top-level input.{{< /member-description >}}

### authenticate

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, data: Data) => Promise&#60;<a href='/typescript-api/entities/user#user'>User</a> | false | string&#62;"  >}}

{{< member-description >}}Used to authenticate a user with the authentication provider. This method
will implement the provider-specific authentication logic, and should resolve to either a
<a href='/typescript-api/entities/user#user'>User</a> object on success, or `false | string` on failure.
A `string` return could be used to describe what error happened, otherwise `false` to an unknown error.{{< /member-description >}}

### onLogOut

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/typescript-api/entities/user#user'>User</a>) => Promise&#60;void&#62;"  >}}

{{< member-description >}}Called when a user logs out, and may perform any required tasks
related to the user logging out with the external provider.{{< /member-description >}}


</div>
