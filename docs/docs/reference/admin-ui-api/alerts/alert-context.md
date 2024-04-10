---
title: "AlertContext"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AlertContext

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/alerts/alerts.service.ts" sourceLine="28" packageName="@vendure/admin-ui" since="2.2.0" />

The context object which is passed to the `check`, `isAlert`, `label` and `action` functions of an
<a href='/reference/admin-ui-api/alerts/alert-config#alertconfig'>AlertConfig</a> object.

```ts title="Signature"
interface AlertContext {
    injector: Injector;
    dataService: DataService;
    notificationService: NotificationService;
    modalService: ModalService;
}
```

<div className="members-wrapper">

### injector

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/injector#injector'>Injector</a>`}   />

The Angular [Injector](https://angular.dev/api/core/Injector) which can be used to get instances
of services and other providers available in the application.
### dataService

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/services/data-service#dataservice'>DataService</a>`}   />

The [DataService](/reference/admin-ui-api/services/data-service), which provides methods for querying the
server-side data.
### notificationService

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/services/notification-service#notificationservice'>NotificationService</a>`}   />

The [NotificationService](/reference/admin-ui-api/services/notification-service), which provides methods for
displaying notifications to the user.
### modalService

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/services/modal-service#modalservice'>ModalService</a>`}   />

The [ModalService](/reference/admin-ui-api/services/modal-service), which provides methods for
opening modal dialogs.


</div>
