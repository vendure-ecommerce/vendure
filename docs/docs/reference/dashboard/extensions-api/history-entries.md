---
title: "HistoryEntries"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardHistoryEntryComponent

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/history-entries.ts" sourceLine="96" packageName="@vendure/dashboard" since="3.4.3" />

A definition of a custom component that will be used to render the given
type of history entry.

*Example*

```tsx
import { defineDashboardExtension, HistoryEntry } from '@vendure/dashboard';
import { IdCard } from 'lucide-react';

defineDashboardExtension({
    historyEntries: [
        {
            type: 'CUSTOMER_TAX_ID_APPROVAL',
            component: ({ entry, entity }) => {
                return (
                    <HistoryEntry
                        entry={entry}
                        title={'Tax ID verified'}
                        timelineIconClassName={'bg-success text-success-foreground'}
                        timelineIcon={<IdCard />}
                    >
                        <div className="text-xs">Approval reference: {entry.data.ref}</div>
                    </HistoryEntry>
                );
            },
        },
    ],
 });
 ```

```ts title="Signature"
interface DashboardHistoryEntryComponent {
    type: string;
    component: React.ComponentType<{
        entry: HistoryEntryItem;
        entity: OrderHistoryOrderDetail | CustomerHistoryCustomerDetail;
    }>;
}
```

<div className="members-wrapper">

### type

<MemberInfo kind="property" type={`string`}   />

The `type` should correspond to a valid `HistoryEntryType`, such as

- `CUSTOMER_REGISTERED`
- `ORDER_STATE_TRANSITION`
- some custom type - see the <a href='/reference/typescript-api/services/history-service#historyservice'>HistoryService</a> docs for a guide on
  how to define custom history entry types.
### component

<MemberInfo kind="property" type={`React.ComponentType&#60;{         entry: <a href='/reference/dashboard/extensions-api/history-entries#historyentryitem'>HistoryEntryItem</a>;         entity: OrderHistoryOrderDetail | CustomerHistoryCustomerDetail;     }&#62;`}   />

The component which is used to render the timeline entry. It should use the
<a href='/reference/dashboard/extensions-api/history-entries#historyentry'>HistoryEntry</a> component and pass the appropriate props to configure
how it will be displayed.

The `entity` prop will be a subset of the Order object for Order history entries,
or a subset of the Customer object for customer history entries.


</div>


## HistoryEntryItem

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/history-entries.ts" sourceLine="14" packageName="@vendure/dashboard" since="3.4.3" />

This object contains the information about the history entry.

```ts title="Signature"
interface HistoryEntryItem {
    id: string;
    type: string;
    createdAt: string;
    isPublic: boolean;
    administrator?: {
        id: string;
        firstName: string;
        lastName: string;
    } | null;
    data: any;
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />


### type

<MemberInfo kind="property" type={`string`}   />

The `HistoryEntryType`, such as `ORDER_STATE_TRANSITION`.
### createdAt

<MemberInfo kind="property" type={`string`}   />


### isPublic

<MemberInfo kind="property" type={`boolean`}   />

Whether this entry is visible to customers via the Shop API
### administrator

<MemberInfo kind="property" type={`{         id: string;         firstName: string;         lastName: string;     } | null`}   />

If an Administrator created this entry, their details will
be available here.
### data

<MemberInfo kind="property" type={`any`}   />

The entry payload data. This will be an object, which is different
for each type of history entry.

For example, the `CUSTOMER_ADDED_TO_GROUP` data looks like this:
```json
{
  groupName: 'Some Group',
}
```

and the `ORDER_STATE_TRANSITION` data looks like this:
```json
{
  from: 'ArrangingPayment',
  to: 'PaymentSettled',
}
```


</div>


## HistoryEntryProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/history-entry/history-entry.tsx" sourceLine="14" packageName="@vendure/dashboard" since="3.4.3" />

The props for the <a href='/reference/dashboard/extensions-api/history-entries#historyentry'>HistoryEntry</a> component.

```ts title="Signature"
interface HistoryEntryProps {
    entry: HistoryEntryItem;
    title: string | React.ReactNode;
    timelineIcon?: React.ReactNode;
    timelineIconClassName?: string;
    actorName?: string;
    children: React.ReactNode;
    isPrimary?: boolean;
}
```

<div className="members-wrapper">

### entry

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/history-entries#historyentryitem'>HistoryEntryItem</a>`}   />

The entry itself, which will get passed down to your custom component
### title

<MemberInfo kind="property" type={`string | React.ReactNode`}   />

The title of the entry
### timelineIcon

<MemberInfo kind="property" type={`React.ReactNode`}   />

An icon which is used to represent the entry. Note that this will only
display if `isPrimary` is `true`.
### timelineIconClassName

<MemberInfo kind="property" type={`string`}   />

Optional tailwind classes to apply to the icon. For instance

```ts
const success = 'bg-success text-success-foreground';
const destructive = 'bg-danger text-danger-foreground';
```
### actorName

<MemberInfo kind="property" type={`string`}   />

The name to display of "who did the action". For instance:

```ts
const getActorName = (entry: HistoryEntryItem) => {
    if (entry.administrator) {
        return `${entry.administrator.firstName} ${entry.administrator.lastName}`;
    } else if (entity?.customer) {
        return `${entity.customer.firstName} ${entity.customer.lastName}`;
    }
    return '';
};
```
### children

<MemberInfo kind="property" type={`React.ReactNode`}   />


### isPrimary

<MemberInfo kind="property" type={`boolean`}   />

When set to `true`, the timeline entry will feature the specified icon and will not
be collapsible.


</div>


## HistoryEntry

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/history-entry/history-entry.tsx" sourceLine="74" packageName="@vendure/dashboard" since="3.4.3" />

A component which is used to display a history entry in the order/customer history timeline.

```ts title="Signature"
function HistoryEntry(props: Readonly<HistoryEntryProps>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;<a href='/reference/dashboard/extensions-api/history-entries#historyentryprops'>HistoryEntryProps</a>&#62;`} />

