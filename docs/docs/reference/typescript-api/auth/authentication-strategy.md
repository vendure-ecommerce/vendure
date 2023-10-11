---
title: "AuthenticationStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AuthenticationStrategy

<GenerationInfo sourceFile="packages/core/src/config/auth/authentication-strategy.ts" sourceLine="23" packageName="@vendure/core" />

An AuthenticationStrategy defines how a User (which can be a Customer in the Shop API or
and Administrator in the Admin API) may be authenticated.

Real-world examples can be found in the [Authentication guide](/guides/core-concepts/auth/).

:::info

This is configured via the `authOptions.shopAuthenticationStrategy` and `authOptions.adminAuthenticationStrategy`
properties of your VendureConfig.

:::

```ts title="Signature"
interface AuthenticationStrategy<Data = unknown> extends InjectableStrategy {
    readonly name: string;
    defineInputType(): DocumentNode;
    authenticate(ctx: RequestContext, data: Data): Promise<User | false | string>;
    onLogOut?(ctx: RequestContext, user: User): Promise<void>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### name

<MemberInfo kind="property" type={`string`}   />

The name of the strategy, for example `'facebook'`, `'google'`, `'keycloak'`.
### defineInputType

<MemberInfo kind="method" type={`() => DocumentNode`}   />

Defines the type of the GraphQL Input object expected by the `authenticate`
mutation. The final input object will be a map, with the key being the name
of the strategy. The shape of the input object should match the generic `Data`
type argument.

*Example*

For example, given the following:

```ts
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
the _first_ input will be assumed to be the top-level input.
### authenticate

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, data: Data) => Promise&#60;<a href='/reference/typescript-api/entities/user#user'>User</a> | false | string&#62;`}   />

Used to authenticate a user with the authentication provider. This method
will implement the provider-specific authentication logic, and should resolve to either a
<a href='/reference/typescript-api/entities/user#user'>User</a> object on success, or `false | string` on failure.
A `string` return could be used to describe what error happened, otherwise `false` to an unknown error.
### onLogOut

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/reference/typescript-api/entities/user#user'>User</a>) => Promise&#60;void&#62;`}   />

Called when a user logs out, and may perform any required tasks
related to the user logging out with the external provider.


</div>
