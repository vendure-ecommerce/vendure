---
title: "DetailComponentWithResolver"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## detailComponentWithResolver

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/common/base-detail.component.ts" sourceLine="256" packageName="@vendure/admin-ui" />

A helper function for creating tabs that point to a <a href='/reference/admin-ui-api/list-detail-views/typed-base-detail-component#typedbasedetailcomponent'>TypedBaseDetailComponent</a>. This takes
care of the route resolver parts so that the detail component automatically has access to the
correct resolved detail data.

*Example*

```ts
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

```ts title="Signature"
function detailComponentWithResolver<T extends TypedDocumentNode<any, { id: string }>, Field extends keyof ResultOf<T>, R extends Field>(config: {
    component: Type<TypedBaseDetailComponent<T, Field>>;
    query: T;
    entityKey: R;
    getBreadcrumbs?: (entity: ResultOf<T>[R]) => BreadcrumbValue;
    variables?: T extends TypedDocumentNode<any, infer V> ? Omit<V, 'id'> : never;
}): void
```
Parameters

### config

<MemberInfo kind="parameter" type={`{     component: Type&#60;<a href='/reference/admin-ui-api/list-detail-views/typed-base-detail-component#typedbasedetailcomponent'>TypedBaseDetailComponent</a>&#60;T, Field&#62;&#62;;     query: T;     entityKey: R;     getBreadcrumbs?: (entity: ResultOf&#60;T&#62;[R]) =&#62; BreadcrumbValue;     variables?: T extends TypedDocumentNode&#60;any, infer V&#62; ? Omit&#60;V, 'id'&#62; : never; }`} />

