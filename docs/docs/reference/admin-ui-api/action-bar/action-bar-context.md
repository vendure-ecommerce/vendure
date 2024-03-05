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

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder-types.ts" sourceLine="90" packageName="@vendure/admin-ui" />

Providers & data available to the `onClick` & `buttonState` functions of an <a href='/reference/admin-ui-api/action-bar/action-bar-item#actionbaritem'>ActionBarItem</a>,
<a href='/reference/admin-ui-api/action-bar/action-bar-dropdown-menu-item#actionbardropdownmenuitem'>ActionBarDropdownMenuItem</a> or <a href='/reference/admin-ui-api/nav-menu/nav-menu-item#navmenuitem'>NavMenuItem</a>.

```ts title="Signature"
interface ActionBarContext {
    route: ActivatedRoute;
    injector: Injector;
    dataService: DataService;
    notificationService: NotificationService;
    entity$: Observable<Record<string, any> | undefined>;
}
```

<div className="members-wrapper">

### route

<MemberInfo kind="property" type={`ActivatedRoute`}   />

The router's [ActivatedRoute](https://angular.dev/guide/routing/router-reference#activated-route) object for
the current route. This object contains information about the route, its parameters, and additional data
associated with the route.
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
### entity$

<MemberInfo kind="property" type={`Observable&#60;Record&#60;string, any&#62; | undefined&#62;`}  since="2.2.0"  />

An observable of the current entity in a detail view. In a list view the observable will not emit any values.

*Example*

```ts
addActionBarDropdownMenuItem({
    id: 'print-invoice',
    locationId: 'order-detail',
    label: 'Print Invoice',
    icon: 'printer',
    buttonState: context => {
        // highlight-start
        return context.entity$.pipe(
            map((order) => {
                return order?.state === 'PaymentSettled'
                    ? { disabled: false, visible: true }
                    : { disabled: true, visible: true };
            }),
        );
        // highlight-end
    },
    requiresPermission: ['UpdateOrder'],
}),
```


</div>
