---
title: "DetailForms"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardDetailFormInputComponent

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/detail-forms.ts" sourceLine="13" packageName="@vendure/dashboard" since="3.4.0" />

Allows you to define custom input components for specific fields in detail forms.
The pageId is already defined in the detail form extension, so only the blockId and field are needed.

```ts title="Signature"
interface DashboardDetailFormInputComponent {
    blockId: string;
    field: string;
    component: DashboardFormComponent;
}
```

<div className="members-wrapper">

### blockId

<MemberInfo kind="property" type={`string`}   />

The ID of the block where this input component should be used.
### field

<MemberInfo kind="property" type={`string`}   />

The name of the field where this input component should be used.
### component

<MemberInfo kind="property" type={`<a href='/reference/dashboard/forms/dashboard-form-component#dashboardformcomponent'>DashboardFormComponent</a>`}   />

The React component that will be rendered as the input.
It should accept `value`, `onChange`, and other standard input props.


</div>


## DashboardDetailFormExtensionDefinition

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/detail-forms.ts" sourceLine="41" packageName="@vendure/dashboard" since="3.4.0" />

Allows you to extend existing detail forms (e.g. on the product detail or customer detail pages)
with custom GraphQL queries, input components, and display components.

```ts title="Signature"
interface DashboardDetailFormExtensionDefinition {
    pageId: string;
    extendDetailDocument?: string | DocumentNode | (() => DocumentNode | string);
    inputs?: DashboardDetailFormInputComponent[];
}
```

<div className="members-wrapper">

### pageId

<MemberInfo kind="property" type={`string`}   />

The ID of the page where the detail form is located, e.g. `'product-detail'`, `'order-detail'`.
### extendDetailDocument

<MemberInfo kind="property" type={`string | DocumentNode | (() =&#62; DocumentNode | string)`}   />

Extends the GraphQL query used to fetch data for the detail page, allowing you to add additional
fields that can be used by custom input or display components.
### inputs

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions/detail-forms#dashboarddetailforminputcomponent'>DashboardDetailFormInputComponent</a>[]`}   />

Custom input components for specific fields in the detail form.


</div>
