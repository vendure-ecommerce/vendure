---
title: "HistoryEntryConfig"
weight: 10
date: 2023-07-14T16:57:51.098Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# HistoryEntryConfig
<div class="symbol">


# HistoryEntryConfig

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/custom-history-entry-component/history-entry-component-types.ts" sourceLine="75" packageName="@vendure/admin-ui" since="1.9.0">}}

Configuration for registering a custom <a href='/admin-ui-api/custom-history-entry-components/history-entry-component#historyentrycomponent'>HistoryEntryComponent</a>.

## Signature

```TypeScript
interface HistoryEntryConfig {
  type: string;
  component: Type<HistoryEntryComponent>;
}
```
## Members

### type

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The type should correspond to the custom HistoryEntryType string.{{< /member-description >}}

### component

{{< member-info kind="property" type="Type&#60;<a href='/admin-ui-api/custom-history-entry-components/history-entry-component#historyentrycomponent'>HistoryEntryComponent</a>&#62;"  >}}

{{< member-description >}}The component to be rendered for this history entry type.{{< /member-description >}}


</div>
