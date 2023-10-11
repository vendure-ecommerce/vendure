---
title: "RegisterRouteComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## registerRouteComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/extension/register-route-component.ts" sourceLine="77" packageName="@vendure/admin-ui" />

Registers an Angular standalone component to be rendered in a route.

*Example*

```ts title="routes.ts"
import { registerRouteComponent } from '@vendure/admin-ui/core';
import { registerReactRouteComponent } from '@vendure/admin-ui/react';

import { ProductReviewDetailComponent } from './components/product-review-detail/product-review-detail.component';
import { AllProductReviewsList } from './components/all-product-reviews-list/all-product-reviews-list.component';
import { GetReviewDetailDocument } from './generated-types';

export default [
    registerRouteComponent({
        path: '',
        component: AllProductReviewsList,
        breadcrumb: 'Product reviews',
    }),
    registerRouteComponent({
        path: ':id',
        component: ProductReviewDetailComponent,
        query: GetReviewDetailDocument,
        entityKey: 'productReview',
        getBreadcrumbs: entity => [
            {
                label: 'Product reviews',
                link: ['/extensions', 'product-reviews'],
            },
            {
                label: `#${entity?.id} (${entity?.product.name})`,
                link: [],
            },
        ],
    }),
];
```

```ts title="Signature"
function registerRouteComponent<Component extends any | BaseDetailComponent<Entity>, Entity extends { id: string; updatedAt?: string }, T extends DocumentNode | TypedDocumentNode<any, { id: string }>, Field extends keyof ResultOf<T>, R extends Field>(options: RegisterRouteComponentOptions<Component, Entity, T, Field, R>): void
```
Parameters

### options

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/routes/register-route-component-options#registerroutecomponentoptions'>RegisterRouteComponentOptions</a>&#60;Component, Entity, T, Field, R&#62;`} />

