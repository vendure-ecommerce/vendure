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

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/layout-engine/page-layout.tsx" sourceLine="275" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

A component for displaying the main actions for a page. This should be used inside the <a href='/reference/dashboard/components/page#page'>Page</a> component.
It should be used in conjunction with the <a href='/reference/dashboard/components/page-action-bar#pageactionbarleft'>PageActionBarLeft</a> and <a href='/reference/dashboard/components/page-action-bar#pageactionbarright'>PageActionBarRight</a> components
as direct children.

```ts title="Signature"
function PageActionBar(props: Readonly<{ children: React.ReactNode }>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;{ children: React.ReactNode }&#62;`} />



## PageActionBarLeft

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/layout-engine/page-layout.tsx" sourceLine="297" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

```ts title="Signature"
function PageActionBarLeft(props: Readonly<{ children: React.ReactNode }>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;{ children: React.ReactNode }&#62;`} />



## PageActionBarRight

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/layout-engine/page-layout.tsx" sourceLine="311" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

```ts title="Signature"
function PageActionBarRight(props: Readonly<{
    children: React.ReactNode;
    dropdownMenuItems?: InlineDropdownItem[];
}>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;{     children: React.ReactNode;     dropdownMenuItems?: InlineDropdownItem[]; }&#62;`} />

