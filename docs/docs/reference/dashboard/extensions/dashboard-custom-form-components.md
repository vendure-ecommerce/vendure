---
title: "DashboardCustomFormComponents"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardCustomFormComponents

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/form-components.ts" sourceLine="25" packageName="@vendure/dashboard" since="3.4.0" />

Interface for registering custom field components in the dashboard.
For input and display components, use the co-located approach with detailForms.

```ts title="Signature"
interface DashboardCustomFormComponents {
    customFields?: DashboardCustomFormComponent[];
}
```

<div className="members-wrapper">

### customFields

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions/dashboard-custom-form-component#dashboardcustomformcomponent'>DashboardCustomFormComponent</a>[]`}   />

Custom form components for custom fields. These are used when rendering
custom fields in forms.


</div>
