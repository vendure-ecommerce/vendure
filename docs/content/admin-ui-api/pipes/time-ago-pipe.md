---
title: "TimeAgoPipe"
weight: 10
date: 2023-07-14T16:57:51.344Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TimeAgoPipe
<div class="symbol">


# TimeAgoPipe

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/time-ago.pipe.ts" sourceLine="18" packageName="@vendure/admin-ui">}}

Converts a date into the format "3 minutes ago", "5 hours ago" etc.

*Example*

```HTML
{{ order.orderPlacedAt | timeAgo }}
```

## Signature

```TypeScript
class TimeAgoPipe implements PipeTransform {
  constructor(i18nService: I18nService)
  transform(value: string | Date, nowVal?: string | Date) => string;
}
```
## Implements

 * PipeTransform


## Members

### constructor

{{< member-info kind="method" type="(i18nService: <a href='/typescript-api/common/i18n-service#i18nservice'>I18nService</a>) => TimeAgoPipe"  >}}

{{< member-description >}}{{< /member-description >}}

### transform

{{< member-info kind="method" type="(value: string | Date, nowVal?: string | Date) => string"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
