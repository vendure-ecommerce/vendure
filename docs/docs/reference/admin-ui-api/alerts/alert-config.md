---
title: "AlertConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AlertConfig

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/alerts/alerts.service.ts" sourceLine="62" packageName="@vendure/admin-ui" since="2.2.0" />

A configuration object for an Admin UI alert.

```ts title="Signature"
interface AlertConfig<T = any> {
    id: string;
    check: (context: AlertContext) => T | Promise<T> | Observable<T>;
    recheck?: (context: AlertContext) => Observable<any>;
    isAlert: (data: T, context: AlertContext) => boolean;
    action: (data: T, context: AlertContext) => void;
    label: (
        data: T,
        context: AlertContext,
    ) => { text: string; translationVars?: { [key: string]: string | number } };
    requiredPermissions?: Permission[];
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />

A unique identifier for the alert.
### check

<MemberInfo kind="property" type={`(context: <a href='/reference/admin-ui-api/alerts/alert-context#alertcontext'>AlertContext</a>) =&#62; T | Promise&#60;T&#62; | Observable&#60;T&#62;`}   />

A function which is gets the data used to determine whether the alert should be shown.
Typically, this function will query the server or some other remote data source.

This function will be called once when the Admin UI app bootstraps, and can be also
set to run at regular intervals by setting the `recheckIntervalMs` property.
### recheck

<MemberInfo kind="property" type={`(context: <a href='/reference/admin-ui-api/alerts/alert-context#alertcontext'>AlertContext</a>) =&#62; Observable&#60;any&#62;`} default={`undefined`}   />

A function which returns an Observable which is used to determine when to re-run the `check`
function. Whenever the observable emits, the `check` function will be called again.

A basic time-interval-based recheck can be achieved by using the `interval` function from RxJS.

*Example*

```ts
import { interval } from 'rxjs';

// ...
recheck: () => interval(60_000)
```

If this is not set, the `check` function will only be called once when the Admin UI app bootstraps.
### isAlert

<MemberInfo kind="property" type={`(data: T, context: <a href='/reference/admin-ui-api/alerts/alert-context#alertcontext'>AlertContext</a>) =&#62; boolean`}   />

A function which determines whether the alert should be shown based on the data returned by the `check`
function.
### action

<MemberInfo kind="property" type={`(data: T, context: <a href='/reference/admin-ui-api/alerts/alert-context#alertcontext'>AlertContext</a>) =&#62; void`}   />

A function which is called when the alert is clicked in the Admin UI.
### label

<MemberInfo kind="property" type={`(         data: T,         context: <a href='/reference/admin-ui-api/alerts/alert-context#alertcontext'>AlertContext</a>,     ) =&#62; { text: string; translationVars?: { [key: string]: string | number } }`}   />

A function which returns the text used in the UI to describe the alert.
### requiredPermissions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/permission#permission'>Permission</a>[]`}   />

A list of permissions which the current Administrator must have in order. If the current
Administrator does not have these permissions, none of the other alert functions will be called.


</div>
