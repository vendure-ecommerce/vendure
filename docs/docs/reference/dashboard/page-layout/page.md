---
title: "Page"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Page

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/layout-engine/page-layout.tsx" sourceLine="84" packageName="@vendure/dashboard" since="3.3.0" />

This component should be used to wrap _all_ pages in the dashboard. It provides
a consistent layout as well as a context for the slot-based PageBlock system.

The typical hierarchy of a page is as follows:
- `Page`
 - <a href='/reference/dashboard/page-layout/page-title#pagetitle'>PageTitle</a>
 - <a href='/reference/dashboard/page-layout/page-action-bar#pageactionbar'>PageActionBar</a>
 - <a href='/reference/dashboard/page-layout/#pagelayout'>PageLayout</a>

*Example*

```tsx
import { Page, PageTitle, PageActionBar, PageLayout, PageBlock, Button } from '@vendure/dashboard';

const pageId = 'my-page';

export function MyPage() {
 return (
   <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
     <PageTitle>My Page</PageTitle>
     <PageActionBar>
       <PageActionBarRight>
         <Button>Save</Button>
       </PageActionBarRight>
     </PageActionBar>
     <PageLayout>
       <PageBlock column="main" blockId="my-block">
         <div>My Block</div>
       </PageBlock>
     </PageLayout>
   </Page>
 )
}
```

```ts title="Signature"
function Page(props: Readonly<PageProps>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;<a href='/reference/dashboard/page-layout/page#pageprops'>PageProps</a>&#62;`} />



## PageProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/layout-engine/page-layout.tsx" sourceLine="31" packageName="@vendure/dashboard" since="3.3.0" />

The props used to configure the <a href='/reference/dashboard/page-layout/page#page'>Page</a> component.

```ts title="Signature"
interface PageProps extends ComponentProps<'div'> {
    pageId?: string;
    entity?: any;
    form?: UseFormReturn<any>;
    submitHandler?: any;
}
```
* Extends: <code>ComponentProps&#60;'div'&#62;</code>



<div className="members-wrapper">

### pageId

<MemberInfo kind="property" type={`string`}   />

A string identifier for the page, e.g. "product-list", "review-detail", etc.
### entity

<MemberInfo kind="property" type={`any`}   />


### form

<MemberInfo kind="property" type={`UseFormReturn&#60;any&#62;`}   />


### submitHandler

<MemberInfo kind="property" type={`any`}   />




</div>
