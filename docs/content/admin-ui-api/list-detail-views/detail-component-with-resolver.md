---
title: "DetailComponentWithResolver"
weight: 10
date: 2023-07-14T16:57:51.046Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# detailComponentWithResolver
<div class="symbol">


# detailComponentWithResolver

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/common/base-detail.component.ts" sourceLine="243" packageName="@vendure/admin-ui">}}

A helper function for creating tabs that point to a <a href='/admin-ui-api/list-detail-views/typed-base-detail-component#typedbasedetailcomponent'>TypedBaseDetailComponent</a>. This takes
care of the route resolver parts so that the detail component automatically has access to the
correct resolved detail data.

*Example*

```TypeScript
@NgModule({
  imports: [ReviewsSharedModule],
  declarations: [/* ... *\/],
  providers: [
    registerPageTab({
      location: 'product-detail',
      tab: 'Specs',
      route: 'specs',
      component: detailComponentWithResolver({
        component: ProductSpecDetailComponent,
        query: GetProductSpecsDocument,
        entityKey: 'spec',
      }),
    }),
  ],
})
export class ProductSpecsUiExtensionModule {}
```

## Signature

```TypeScript
function detailComponentWithResolver<T extends TypedDocumentNode<any, { id: string }>, Field extends keyof ResultOf<T>, R extends Field>(config: {
    component: Type<TypedBaseDetailComponent<T, Field>>;
    query: T;
    entityKey: R;
    getBreadcrumbs?: (entity: ResultOf<T>[R]) => BreadcrumbValue;
    variables?: T extends TypedDocumentNode<any, infer V> ? Omit<V, 'id'> : never;
}): void
```
## Parameters

### config

{{< member-info kind="parameter" type="{     component: Type&#60;<a href='/admin-ui-api/list-detail-views/typed-base-detail-component#typedbasedetailcomponent'>TypedBaseDetailComponent</a>&#60;T, Field&#62;&#62;;     query: T;     entityKey: R;     getBreadcrumbs?: (entity: ResultOf&#60;T&#62;[R]) =&#62; BreadcrumbValue;     variables?: T extends TypedDocumentNode&#60;any, infer V&#62; ? Omit&#60;V, 'id'&#62; : never; }" >}}

</div>
