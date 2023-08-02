---
title: "RegisterHistoryEntryComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## registerHistoryEntryComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/custom-history-entry-component/history-entry-component.service.ts" sourceLine="13" packageName="@vendure/admin-ui" since="1.9.0" />

Registers a <a href='/reference/admin-ui-api/custom-history-entry-components/history-entry-component#historyentrycomponent'>HistoryEntryComponent</a> for displaying history entries in the Order/Customer
history timeline.

```ts title="Signature"
function registerHistoryEntryComponent(config: HistoryEntryConfig): Provider
```
Parameters

### config

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/custom-history-entry-components/history-entry-config#historyentryconfig'>HistoryEntryConfig</a>`} />

