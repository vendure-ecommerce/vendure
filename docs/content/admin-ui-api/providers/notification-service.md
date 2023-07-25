---
title: "NotificationService"
weight: 10
date: 2023-07-14T16:57:51.126Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# NotificationService
<div class="symbol">


# NotificationService

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/notification/notification.service.ts" sourceLine="54" packageName="@vendure/admin-ui">}}

Provides toast notification functionality.

*Example*

```TypeScript
class MyComponent {
  constructor(private notificationService: NotificationService) {}

  save() {
    this.notificationService
        .success(_('asset.notify-create-assets-success'), {
          count: successCount,
        });
  }
}

## Signature

```TypeScript
class NotificationService {
  constructor(i18nService: I18nService, resolver: ComponentFactoryResolver, overlayHostService: OverlayHostService)
  success(message: string, translationVars?: { [key: string]: string | number }) => void;
  info(message: string, translationVars?: { [key: string]: string | number }) => void;
  warning(message: string, translationVars?: { [key: string]: string | number }) => void;
  error(message: string, translationVars?: { [key: string]: string | number }) => void;
  notify(config: ToastConfig) => void;
}
```
## Members

### constructor

{{< member-info kind="method" type="(i18nService: <a href='/typescript-api/common/i18n-service#i18nservice'>I18nService</a>, resolver: ComponentFactoryResolver, overlayHostService: OverlayHostService) => NotificationService"  >}}

{{< member-description >}}{{< /member-description >}}

### success

{{< member-info kind="method" type="(message: string, translationVars?: { [key: string]: string | number }) => void"  >}}

{{< member-description >}}Display a success toast notification{{< /member-description >}}

### info

{{< member-info kind="method" type="(message: string, translationVars?: { [key: string]: string | number }) => void"  >}}

{{< member-description >}}Display an info toast notification{{< /member-description >}}

### warning

{{< member-info kind="method" type="(message: string, translationVars?: { [key: string]: string | number }) => void"  >}}

{{< member-description >}}Display a warning toast notification{{< /member-description >}}

### error

{{< member-info kind="method" type="(message: string, translationVars?: { [key: string]: string | number }) => void"  >}}

{{< member-description >}}Display an error toast notification{{< /member-description >}}

### notify

{{< member-info kind="method" type="(config: <a href='/admin-ui-api/providers/notification-service#toastconfig'>ToastConfig</a>) => void"  >}}

{{< member-description >}}Display a toast notification.{{< /member-description >}}


</div>
<div class="symbol">


# NotificationType

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/notification/notification.service.ts" sourceLine="14" packageName="@vendure/admin-ui">}}

The types of notification available.

## Signature

```TypeScript
type NotificationType = 'info' | 'success' | 'error' | 'warning'
```
</div>
<div class="symbol">


# ToastConfig

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/notification/notification.service.ts" sourceLine="23" packageName="@vendure/admin-ui">}}

Configuration for a toast notification.

## Signature

```TypeScript
interface ToastConfig {
  message: string;
  translationVars?: { [key: string]: string | number };
  type?: NotificationType;
  duration?: number;
}
```
## Members

### message

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### translationVars

{{< member-info kind="property" type="{ [key: string]: string | number }"  >}}

{{< member-description >}}{{< /member-description >}}

### type

{{< member-info kind="property" type="<a href='/admin-ui-api/providers/notification-service#notificationtype'>NotificationType</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### duration

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
