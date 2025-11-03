---
title: "UseAlerts"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## useAlerts

<GenerationInfo sourceFile="packages/dashboard/src/lib/hooks/use-alerts.ts" sourceLine="31" packageName="@vendure/dashboard" since="3.5.0" />

Returns information about all registered Alerts, including how many are
active and at what severity.

```ts title="Signature"
function useAlerts(): { alerts: AlertEntry[]; activeCount: number; highestSeverity: AlertSeverity }
```


## AlertEntry

<GenerationInfo sourceFile="packages/dashboard/src/lib/hooks/use-alerts.ts" sourceLine="13" packageName="@vendure/dashboard" since="3.5.0" />

An individual Alert item.

```ts title="Signature"
interface AlertEntry {
    definition: DashboardAlertDefinition;
    active: boolean;
    currentSeverity?: AlertSeverity;
    lastData: any;
    dismiss: () => void;
}
```

<div className="members-wrapper">

### definition

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/alerts#dashboardalertdefinition'>DashboardAlertDefinition</a>`}   />


### active

<MemberInfo kind="property" type={`boolean`}   />


### currentSeverity

<MemberInfo kind="property" type={`AlertSeverity`}   />


### lastData

<MemberInfo kind="property" type={`any`}   />


### dismiss

<MemberInfo kind="property" type={`() =&#62; void`}   />




</div>
