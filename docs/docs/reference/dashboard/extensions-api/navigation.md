---
title: "Navigation"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardNavSectionDefinition

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/navigation.ts" sourceLine="49" packageName="@vendure/dashboard" since="3.4.0" />

Defines a custom navigation section in the dashboard sidebar.

```ts title="Signature"
interface DashboardNavSectionDefinition {
    id: string;
    title: string;
    icon?: LucideIcon;
    order?: number;
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />

A unique identifier for the navigation section.
### title

<MemberInfo kind="property" type={`string`}   />

The display title for the navigation section.
### icon

<MemberInfo kind="property" type={`LucideIcon`}   />

Optional icon to display next to the section title. The icons should
be imported from `'lucide-react'`.

*Example*

```ts
import { PlusIcon } from 'lucide-react';
```
### order

<MemberInfo kind="property" type={`number`}   />

Optional order number to control the position of this section in the sidebar.


</div>
