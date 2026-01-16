---
title: "RegisterReactRouteComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## registerReactRouteComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/register-react-route-component.ts" sourceLine="30" packageName="@vendure/admin-ui" />

Registers a React component to be used as a route component.

```ts title="Signature"
function registerReactRouteComponent<Entity extends { id: string; updatedAt?: string }, T extends DocumentNode | TypedDocumentNode<any, { id: string }>, Field extends keyof ResultOf<T>, R extends Field>(options: RegisterReactRouteComponentOptions<Entity, T, Field, R>): Route
```
Parameters

### options

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/react-extensions/register-react-route-component-options#registerreactroutecomponentoptions'>RegisterReactRouteComponentOptions</a>&#60;Entity, T, Field, R&#62;`} />

