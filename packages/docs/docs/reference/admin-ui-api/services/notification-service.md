---
title: "NotificationService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## NotificationService

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/notification/notification.service.ts" sourceLine="54" packageName="@vendure/admin-ui" />

Provides toast notification functionality.

*Example*

```ts
class MyComponent {
  constructor(private notificationService: NotificationService) {}

  save() {
    this.notificationService
        .success(_('asset.notify-create-assets-success'), {
          count: successCount,
        });
  }
}

```ts title="Signature"
class NotificationService {
    constructor(i18nService: I18nService, resolver: ComponentFactoryResolver, overlayHostService: OverlayHostService)
    success(message: string, translationVars?: { [key: string]: string | number }) => void;
    info(message: string, translationVars?: { [key: string]: string | number }) => void;
    warning(message: string, translationVars?: { [key: string]: string | number }) => void;
    error(message: string, translationVars?: { [key: string]: string | number }) => void;
    notify(config: ToastConfig) => void;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(i18nService: <a href='/reference/typescript-api/common/i18n-service#i18nservice'>I18nService</a>, resolver: ComponentFactoryResolver, overlayHostService: OverlayHostService) => NotificationService`}   />


### success

<MemberInfo kind="method" type={`(message: string, translationVars?: { [key: string]: string | number }) => void`}   />

Display a success toast notification
### info

<MemberInfo kind="method" type={`(message: string, translationVars?: { [key: string]: string | number }) => void`}   />

Display an info toast notification
### warning

<MemberInfo kind="method" type={`(message: string, translationVars?: { [key: string]: string | number }) => void`}   />

Display a warning toast notification
### error

<MemberInfo kind="method" type={`(message: string, translationVars?: { [key: string]: string | number }) => void`}   />

Display an error toast notification
### notify

<MemberInfo kind="method" type={`(config: <a href='/reference/admin-ui-api/services/notification-service#toastconfig'>ToastConfig</a>) => void`}   />

Display a toast notification.


</div>


## NotificationType

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/notification/notification.service.ts" sourceLine="14" packageName="@vendure/admin-ui" />

The types of notification available.

```ts title="Signature"
type NotificationType = 'info' | 'success' | 'error' | 'warning'
```


## ToastConfig

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/notification/notification.service.ts" sourceLine="23" packageName="@vendure/admin-ui" />

Configuration for a toast notification.

```ts title="Signature"
interface ToastConfig {
    message: string;
    translationVars?: { [key: string]: string | number };
    type?: NotificationType;
    duration?: number;
}
```

<div className="members-wrapper">

### message

<MemberInfo kind="property" type={`string`}   />


### translationVars

<MemberInfo kind="property" type={`{ [key: string]: string | number }`}   />


### type

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/services/notification-service#notificationtype'>NotificationType</a>`}   />


### duration

<MemberInfo kind="property" type={`number`}   />




</div>
