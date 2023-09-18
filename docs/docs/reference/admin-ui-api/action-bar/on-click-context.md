---
title: "OnClickContext"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OnClickContext

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder-types.ts" sourceLine="77" packageName="@vendure/admin-ui" />

Utilities available to the onClick handler of an ActionBarItem.

```ts title="Signature"
interface OnClickContext {
    route: ActivatedRoute;
    dataService: DataService;
    notificationService: NotificationService;
}
```

<div className="members-wrapper">

### route

<MemberInfo kind="property" type={`ActivatedRoute`}   />


### dataService

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/providers/data-service#dataservice'>DataService</a>`}   />


### notificationService

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/providers/notification-service#notificationservice'>NotificationService</a>`}   />




</div>
