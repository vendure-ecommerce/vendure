---
title: "DashboardActionBarItem"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardActionBarItem

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/extension-api-types.ts" sourceLine="51" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

Allows you to define custom action bar items for any page in the dashboard.

```ts title="Signature"
interface DashboardActionBarItem {
    pageId: string;
    component: React.FunctionComponent<{ context: PageContextValue }>;
    requiresPermission?: string | string[];
}
```

<div className="members-wrapper">

### pageId

<MemberInfo kind="property" type={`string`}   />

The ID of the page where the action bar item should be displayed.
### component

<MemberInfo kind="property" type={`React.FunctionComponent&#60;{ context: PageContextValue }&#62;`}   />

A React component that will be rendered in the action bar.
### requiresPermission

<MemberInfo kind="property" type={`string | string[]`}   />

Any permissions that are required to display this action bar item.


</div>
