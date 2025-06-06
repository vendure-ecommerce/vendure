---
title: "DashboardPageBlockDefinition"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardPageBlockDefinition

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/extension-api-types.ts" sourceLine="83" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

This allows you to insert a custom component into a specific location
on any page in the dashboard.

```ts title="Signature"
interface DashboardPageBlockDefinition {
    id: string;
    title?: React.ReactNode;
    location: PageBlockLocation;
    component: React.FunctionComponent<{ context: PageContextValue }>;
    requiresPermission?: string | string[];
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />


### title

<MemberInfo kind="property" type={`React.ReactNode`}   />


### location

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions/page-block-location#pageblocklocation'>PageBlockLocation</a>`}   />


### component

<MemberInfo kind="property" type={`React.FunctionComponent&#60;{ context: PageContextValue }&#62;`}   />


### requiresPermission

<MemberInfo kind="property" type={`string | string[]`}   />




</div>
