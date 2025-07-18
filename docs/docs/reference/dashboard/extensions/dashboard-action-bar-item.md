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

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/layout.ts" sourceLine="19" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

Allows you to define custom action bar items for any page in the dashboard.

```ts title="Signature"
interface DashboardActionBarItem {
    pageId: string;
    component: React.FunctionComponent<{ context: PageContextValue }>;
    type?: 'button' | 'dropdown';
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
### type

<MemberInfo kind="property" type={`'button' | 'dropdown'`} default={`'button'`}   />

The type of action bar item to display. Defaults to `button`.
The 'dropdown' type is used to display the action bar item as a dropdown menu item.

When using the dropdown type, use a suitable [dropdown item](https://ui.shadcn.com/docs/components/dropdown-menu)
component, such as:

```tsx
import { DropdownMenuItem } from '@vendure/dashboard';

// ...

{
  component: () => <DropdownMenuItem>My Item</DropdownMenuItem>
}
```
### requiresPermission

<MemberInfo kind="property" type={`string | string[]`}   />

Any permissions that are required to display this action bar item.


</div>
