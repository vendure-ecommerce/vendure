---
title: "HistoryEntryComponent"
weight: 10
date: 2023-07-14T16:57:51.092Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# HistoryEntryComponent
<div class="symbol">


# HistoryEntryComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/custom-history-entry-component/history-entry-component-types.ts" sourceLine="16" packageName="@vendure/admin-ui" since="1.9.0">}}

This interface should be implemented by components intended to display a history entry in the
Order or Customer history timeline. If the component needs access to the Order or Customer object itself,
you should implement <a href='/admin-ui-api/custom-history-entry-components/order-history-entry-component#orderhistoryentrycomponent'>OrderHistoryEntryComponent</a> or <a href='/admin-ui-api/custom-history-entry-components/customer-history-entry-component#customerhistoryentrycomponent'>CustomerHistoryEntryComponent</a> respectively.

## Signature

```TypeScript
interface HistoryEntryComponent {
  entry: TimelineHistoryEntry;
  getDisplayType: (entry: TimelineHistoryEntry) => TimelineDisplayType;
  isFeatured: (entry: TimelineHistoryEntry) => boolean;
  getName?: (entry: TimelineHistoryEntry) => string | undefined;
  getIconShape?: (entry: TimelineHistoryEntry) => string | string[] | undefined;
}
```
## Members

### entry

{{< member-info kind="property" type="TimelineHistoryEntry"  >}}

{{< member-description >}}The HistoryEntry data.{{< /member-description >}}

### getDisplayType

{{< member-info kind="property" type="(entry: TimelineHistoryEntry) =&#62; TimelineDisplayType"  >}}

{{< member-description >}}Defines whether this entry is highlighted with a "success", "error" etc. color.{{< /member-description >}}

### isFeatured

{{< member-info kind="property" type="(entry: TimelineHistoryEntry) =&#62; boolean"  >}}

{{< member-description >}}Featured entries are always expanded. Non-featured entries start of collapsed and can be clicked
to expand.{{< /member-description >}}

### getName

{{< member-info kind="property" type="(entry: TimelineHistoryEntry) =&#62; string | undefined"  >}}

{{< member-description >}}Returns the name of the person who did this action. For example, it could be the Customer's name
or "Administrator".{{< /member-description >}}

### getIconShape

{{< member-info kind="property" type="(entry: TimelineHistoryEntry) =&#62; string | string[] | undefined"  >}}

{{< member-description >}}Optional Clarity icon shape to display with the entry. Examples: `'note'`, `['success-standard', 'is-solid']`{{< /member-description >}}


</div>
