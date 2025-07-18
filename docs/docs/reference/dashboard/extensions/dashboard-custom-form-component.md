---
title: "DashboardCustomFormComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardCustomFormComponent

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/form-components.ts" sourceLine="12" packageName="@vendure/dashboard" since="3.4.0" />

Allows you to define custom form components for custom fields in the dashboard.

```ts title="Signature"
interface DashboardCustomFormComponent {
    id: string;
    component: React.FunctionComponent<CustomFormComponentInputProps>;
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />


### component

<MemberInfo kind="property" type={`React.FunctionComponent&#60;CustomFormComponentInputProps&#62;`}   />




</div>
