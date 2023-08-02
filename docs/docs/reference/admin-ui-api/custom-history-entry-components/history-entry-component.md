---
title: "HistoryEntryComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## HistoryEntryComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/custom-history-entry-component/history-entry-component-types.ts" sourceLine="16" packageName="@vendure/admin-ui" since="1.9.0" />

This interface should be implemented by components intended to display a history entry in the
Order or Customer history timeline. If the component needs access to the Order or Customer object itself,
you should implement <a href='/reference/admin-ui-api/custom-history-entry-components/order-history-entry-component#orderhistoryentrycomponent'>OrderHistoryEntryComponent</a> or <a href='/reference/admin-ui-api/custom-history-entry-components/customer-history-entry-component#customerhistoryentrycomponent'>CustomerHistoryEntryComponent</a> respectively.

```ts title="Signature"
interface HistoryEntryComponent {
    entry: TimelineHistoryEntry;
    getDisplayType: (entry: TimelineHistoryEntry) => TimelineDisplayType;
    isFeatured: (entry: TimelineHistoryEntry) => boolean;
    getName?: (entry: TimelineHistoryEntry) => string | undefined;
    getIconShape?: (entry: TimelineHistoryEntry) => string | string[] | undefined;
}
```

<div className="members-wrapper">

### entry

<MemberInfo kind="property" type={`TimelineHistoryEntry`}   />

The HistoryEntry data.
### getDisplayType

<MemberInfo kind="property" type={`(entry: TimelineHistoryEntry) =&#62; TimelineDisplayType`}   />

Defines whether this entry is highlighted with a "success", "error" etc. color.
### isFeatured

<MemberInfo kind="property" type={`(entry: TimelineHistoryEntry) =&#62; boolean`}   />

Featured entries are always expanded. Non-featured entries start of collapsed and can be clicked
to expand.
### getName

<MemberInfo kind="property" type={`(entry: TimelineHistoryEntry) =&#62; string | undefined`}   />

Returns the name of the person who did this action. For example, it could be the Customer's name
or "Administrator".
### getIconShape

<MemberInfo kind="property" type={`(entry: TimelineHistoryEntry) =&#62; string | string[] | undefined`}   />

Optional Clarity icon shape to display with the entry. Examples: `'note'`, `['success-standard', 'is-solid']`


</div>
