---
title: "OrderHistoryEntryComponent"
weight: 10
date: 2023-07-14T16:57:51.096Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# OrderHistoryEntryComponent
<div class="symbol">


# OrderHistoryEntryComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/custom-history-entry-component/history-entry-component-types.ts" sourceLine="53" packageName="@vendure/admin-ui" since="1.9.0">}}

Used to implement a <a href='/admin-ui-api/custom-history-entry-components/history-entry-component#historyentrycomponent'>HistoryEntryComponent</a> which requires access to the Order object.

## Signature

```TypeScript
interface OrderHistoryEntryComponent extends HistoryEntryComponent {
  order: OrderDetailFragment;
}
```
## Extends

 * <a href='/admin-ui-api/custom-history-entry-components/history-entry-component#historyentrycomponent'>HistoryEntryComponent</a>


## Members

### order

{{< member-info kind="property" type="OrderDetailFragment"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
