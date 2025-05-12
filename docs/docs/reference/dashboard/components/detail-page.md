---
title: "DetailPage"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DetailPage

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/page/detail-page.tsx" sourceLine="90" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

Auto-generates a detail page with a form based on the provided query and mutation documents.

For more control over the layout, you would use the more low-level <a href='/reference/dashboard/components/page#page'>Page</a> component.

```ts title="Signature"
function DetailPage<T extends TypedDocumentNode<any, any>, C extends TypedDocumentNode<any, any>, U extends TypedDocumentNode<any, any>>(props: DetailPageProps<T, C, U>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`<a href='/reference/dashboard/components/detail-page#detailpageprops'>DetailPageProps</a>&#60;T, C, U&#62;`} />



## DetailPageProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/page/detail-page.tsx" sourceLine="34" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

```ts title="Signature"
interface DetailPageProps<T extends TypedDocumentNode<any, any>, C extends TypedDocumentNode<any, any>, U extends TypedDocumentNode<any, any>, EntityField extends keyof ResultOf<T> = DetailEntityPath<T>> {
    pageId: string;
    route: AnyRoute;
    title: (entity: ResultOf<T>[EntityField]) => string;
    queryDocument: T;
    createDocument?: C;
    updateDocument: U;
    setValuesForUpdate: (entity: ResultOf<T>[EntityField]) => VariablesOf<U>['input'];
}
```

<div className="members-wrapper">

### pageId

<MemberInfo kind="property" type={`string`}   />

A unique identifier for the page.
### route

<MemberInfo kind="property" type={`AnyRoute`}   />

The Tanstack Router route used to navigate to this page.
### title

<MemberInfo kind="property" type={`(entity: ResultOf&#60;T&#62;[EntityField]) =&#62; string`}   />

The title of the page.
### queryDocument

<MemberInfo kind="property" type={`T`}   />

The query document used to fetch the entity.
### createDocument

<MemberInfo kind="property" type={`C`}   />

The mutation document used to create the entity.
### updateDocument

<MemberInfo kind="property" type={`U`}   />

The mutation document used to update the entity.
### setValuesForUpdate

<MemberInfo kind="property" type={`(entity: ResultOf&#60;T&#62;[EntityField]) =&#62; VariablesOf&#60;U&#62;['input']`}   />

A function that sets the values for the update input type based on the entity.


</div>
