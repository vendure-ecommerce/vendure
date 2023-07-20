---
title: "CustomerHistoryEntryComponent"
weight: 10
date: 2023-07-20T13:56:17.948Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CustomerHistoryEntryComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/custom-history-entry-component/history-entry-component-types.ts" sourceLine="64" packageName="@vendure/admin-ui" since="1.9.0" />

Used to implement a <a href='/admin-ui-api/custom-history-entry-components/history-entry-component#historyentrycomponent'>HistoryEntryComponent</a> which requires access to the Customer object.

```ts title="Signature"
interface CustomerHistoryEntryComponent extends HistoryEntryComponent {
  customer: CustomerFragment;
}
```
Extends

 * <a href='/admin-ui-api/custom-history-entry-components/history-entry-component#historyentrycomponent'>HistoryEntryComponent</a>



### customer

<MemberInfo kind="property" type="CustomerFragment"   />


