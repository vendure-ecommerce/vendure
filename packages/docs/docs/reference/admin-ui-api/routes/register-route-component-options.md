---
title: "RegisterRouteComponentOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## RegisterRouteComponentOptions

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/extension/register-route-component.ts" sourceLine="19" packageName="@vendure/admin-ui" />

Configuration for a route component.

```ts title="Signature"
type RegisterRouteComponentOptions<Component extends any | BaseDetailComponent<Entity>, Entity extends { id: string; updatedAt?: string }, T extends DocumentNode | TypedDocumentNode<any, { id: string }>, Field extends keyof ResultOf<T>, R extends Field> = {
    component: Type<Component> | Component;
    title?: string;
    locationId?: string;
    description?: string;
    breadcrumb?: BreadcrumbValue;
    path?: string;
    query?: T;
    getBreadcrumbs?: (entity: Exclude<ResultOf<T>[R], 'Query'>) => BreadcrumbValue;
    entityKey?: Component extends BaseDetailComponent<any> ? R : string;
    variables?: T extends TypedDocumentNode<any, infer V> ? Omit<V, 'id'> : never;
    routeConfig?: Route;
} & (Component extends BaseDetailComponent<any> ? { entityKey: R } : unknown)
```
