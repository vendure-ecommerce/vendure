---
title: "Alerts"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardAlertDefinition

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/alerts.ts" sourceLine="11" packageName="@vendure/dashboard" since="3.3.0" />

Allows you to define custom alerts that can be displayed in the dashboard.

```ts title="Signature"
interface DashboardAlertDefinition<TResponse = any> {
    id: string;
    title: string | ((data: TResponse) => string);
    description?: string | ((data: TResponse) => string);
    severity: AlertSeverity | ((data: TResponse) => AlertSeverity);
    check: () => Promise<TResponse> | TResponse;
    shouldShow: (data: TResponse) => boolean;
    recheckInterval?: number;
    actions?: Array<{
        label: string;
        onClick: (args: { data: TResponse; dismiss: () => void }) => void | Promise<any>;
    }>;
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />

A unique identifier for the alert.
### title

<MemberInfo kind="property" type={`string | ((data: TResponse) =&#62; string)`}   />

The title of the alert. Can be a string or a function that returns a string based on the response data.
### description

<MemberInfo kind="property" type={`string | ((data: TResponse) =&#62; string)`}   />

The description of the alert. Can be a string or a function that returns a string based on the response data.
### severity

<MemberInfo kind="property" type={`AlertSeverity | ((data: TResponse) =&#62; AlertSeverity)`}   />

The severity level of the alert.
### check

<MemberInfo kind="property" type={`() =&#62; Promise&#60;TResponse&#62; | TResponse`}   />

A function that checks the condition and returns the response data.
### shouldShow

<MemberInfo kind="property" type={`(data: TResponse) =&#62; boolean`}   />

A function that determines whether the alert should be rendered based on the response data.
### recheckInterval

<MemberInfo kind="property" type={`number`}   />

The interval in milliseconds to recheck the condition.
### actions

<MemberInfo kind="property" type={`Array&#60;{         label: string;         onClick: (args: { data: TResponse; dismiss: () =&#62; void }) =&#62; void | Promise&#60;any&#62;;     }&#62;`}   />

Optional actions that can be performed when the alert is shown.

The `onClick()` handler will receive the data returned by the `check` function,
as well as a `dismiss()` function that can be used to immediately dismiss the
current alert.


</div>
