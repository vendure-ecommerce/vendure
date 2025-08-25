---
title: "FormComponents"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardCustomFormComponent

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/form-components.ts" sourceLine="11" packageName="@vendure/dashboard" since="3.4.0" />

Allows you to define custom form components for custom fields in the dashboard.

```ts title="Signature"
interface DashboardCustomFormComponent {
    id: string;
    component: DashboardFormComponent;
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />

A unique identifier for the custom form component. It is a good practice to namespace
these IDs to avoid naming collisions, for example `"my-plugin.markdown-editor"`.
### component

<MemberInfo kind="property" type={`<a href='/reference/dashboard/forms/dashboard-form-component#dashboardformcomponent'>DashboardFormComponent</a>`}   />

The React component that will be rendered as the custom form input.


</div>


## DashboardCustomFormComponents

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/form-components.ts" sourceLine="34" packageName="@vendure/dashboard" since="3.4.0" />

Interface for registering custom field components in the dashboard.
For input and display components, use the co-located approach with detailForms.

```ts title="Signature"
interface DashboardCustomFormComponents {
    customFields?: DashboardCustomFormComponent[];
}
```

<div className="members-wrapper">

### customFields

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions/form-components#dashboardcustomformcomponent'>DashboardCustomFormComponent</a>[]`}   />

Custom form components for custom fields. These are used when rendering
custom fields in forms.


</div>
