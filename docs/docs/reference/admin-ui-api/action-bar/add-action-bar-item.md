---
title: "AddActionBarItem"
weight: 10
date: 2023-07-20T13:56:18.048Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## addActionBarItem

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder.service.ts" sourceLine="120" packageName="@vendure/admin-ui" />

Adds a button to the ActionBar at the top right of each list or detail view. The locationId can
be determined by inspecting the DOM and finding the `<vdr-action-bar>` element and its
`data-location-id` attribute.

This should be used in the NgModule `providers` array of your ui extension module.

*Example*

```TypeScript
@NgModule({
  imports: [SharedModule],
  providers: [
    addActionBarItem({
     id: 'print-invoice'
     label: 'Print Invoice',
     locationId: 'order-detail',
     routerLink: ['/extensions/invoicing'],
    }),
  ],
})
export class MyUiExtensionModule {}
```

```ts title="Signature"
function addActionBarItem(config: ActionBarItem): Provider
```
Parameters

### config

<MemberInfo kind="parameter" type="<a href='/admin-ui-api/action-bar/action-bar-item#actionbaritem'>ActionBarItem</a>" />

