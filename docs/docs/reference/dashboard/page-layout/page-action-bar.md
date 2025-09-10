---
title: "PageActionBar"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PageActionBar

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/layout-engine/page-layout.tsx" sourceLine="305" packageName="@vendure/dashboard" since="3.3.0" />

*
A component for displaying the main actions for a page. This should be used inside the <a href='/reference/dashboard/page-layout/page#page'>Page</a> component.
It should be used in conjunction with the <a href='/reference/dashboard/page-layout/page-action-bar#pageactionbarleft'>PageActionBarLeft</a> and <a href='/reference/dashboard/page-layout/page-action-bar#pageactionbarright'>PageActionBarRight</a> components
as direct children.

```ts title="Signature"
function PageActionBar(props: Readonly<{ children: React.ReactNode }>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;{ children: React.ReactNode }&#62;`} />



## PageActionBarLeft

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/layout-engine/page-layout.tsx" sourceLine="327" packageName="@vendure/dashboard" since="3.3.0" />

The PageActionBarLeft component should be used to display the left content of the action bar.

```ts title="Signature"
function PageActionBarLeft(props: Readonly<{ children: React.ReactNode }>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;{ children: React.ReactNode }&#62;`} />



## PageActionBarRight

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/layout-engine/page-layout.tsx" sourceLine="341" packageName="@vendure/dashboard" since="3.3.0" />

The PageActionBarRight component should be used to display the right content of the action bar.

```ts title="Signature"
function PageActionBarRight(props: Readonly<{
    children: React.ReactNode;
    dropdownMenuItems?: InlineDropdownItem[];
}>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;{     children: React.ReactNode;     dropdownMenuItems?: InlineDropdownItem[]; }&#62;`} />

