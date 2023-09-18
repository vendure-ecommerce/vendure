---
title: "ActionBarContext"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ActionBarContext

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder-types.ts" sourceLine="78" packageName="@vendure/admin-ui" />

Providers available to the onClick handler of an <a href='/reference/admin-ui-api/action-bar/action-bar-item#actionbaritem'>ActionBarItem</a> or <a href='/reference/admin-ui-api/nav-menu/nav-menu-item#navmenuitem'>NavMenuItem</a>.

```ts title="Signature"
interface ActionBarContext {
    route: ActivatedRoute;
    injector: Injector;
    dataService: DataService;
    notificationService: NotificationService;
}
```

<div className="members-wrapper">

### route

<MemberInfo kind="property" type={`ActivatedRoute`}   />


### injector

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/injector#injector'>Injector</a>`}   />


### dataService

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/services/data-service#dataservice'>DataService</a>`}   />


### notificationService

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/services/notification-service#notificationservice'>NotificationService</a>`}   />




</div>
