---
title: "RegisterReactRouteComponentOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## RegisterReactRouteComponentOptions

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/register-react-route-component.ts" sourceLine="15" packageName="@vendure/admin-ui" />

Configuration for a React-based route component.

```ts title="Signature"
type RegisterReactRouteComponentOptions<Entity extends { id: string; updatedAt?: string }, T extends DocumentNode | TypedDocumentNode<any, { id: string }>, Field extends keyof ResultOf<T>, R extends Field> = RegisterRouteComponentOptions<ElementType, Entity, T, Field, R> & {
    props?: Record<string, any>;
}
```
