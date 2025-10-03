---
title: "Page Blocks"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardPageBlockDefinition

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/layout.ts" sourceLine="95" packageName="@vendure/dashboard" since="3.3.0" />

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

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/page-blocks#pageblocklocation'>PageBlockLocation</a>`}   />


### component

<MemberInfo kind="property" type={`React.FunctionComponent&#60;{ context: PageContextValue }&#62;`}   />


### requiresPermission

<MemberInfo kind="property" type={`string | string[]`}   />




</div>


## PageBlockPosition

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/layout.ts" sourceLine="67" packageName="@vendure/dashboard" since="3.3.0" />

The relative position of a PageBlock. This is determined by finding an existing
block, and then specifying whether your custom block should come before, after,
or completely replace that block.

```ts title="Signature"
type PageBlockPosition = {
    blockId: string;
    order: 'before' | 'after' | 'replace'
}
```

<div className="members-wrapper">

### blockId

<MemberInfo kind="property" type={`string`}   />


### order

<MemberInfo kind="property" type={`'before' | 'after' | 'replace'`}   />




</div>


## PageBlockLocation

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/layout.ts" sourceLine="79" packageName="@vendure/dashboard" since="3.3.0" />

The location of a page block in the dashboard. The location can be found by turning on
"developer mode" in the dashboard user menu (bottom left corner) and then
clicking the `< />` icon when hovering over a page block.

```ts title="Signature"
type PageBlockLocation = {
    pageId: string;
    position: PageBlockPosition;
    column: 'main' | 'side';
}
```

<div className="members-wrapper">

### pageId

<MemberInfo kind="property" type={`string`}   />


### position

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/page-blocks#pageblockposition'>PageBlockPosition</a>`}   />


### column

<MemberInfo kind="property" type={`'main' | 'side'`}   />




</div>
