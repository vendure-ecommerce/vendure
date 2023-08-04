---
title: "LocaleDatePipe"
weight: 10
date: 2023-07-14T16:57:51.336Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# LocaleDatePipe
<div class="symbol">


# LocaleDatePipe

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/locale-date.pipe.ts" sourceLine="19" packageName="@vendure/admin-ui">}}

A replacement of the Angular DatePipe which makes use of the Intl API
to format dates according to the selected UI language.

*Example*

```HTML
{{ order.orderPlacedAt | localeDate }}
```

## Signature

```TypeScript
class LocaleDatePipe extends LocaleBasePipe implements PipeTransform {
  constructor(dataService?: DataService, changeDetectorRef?: ChangeDetectorRef)
  transform(value: unknown, args: unknown[]) => unknown;
}
```
## Extends

 * LocaleBasePipe


## Implements

 * PipeTransform


## Members

### constructor

{{< member-info kind="method" type="(dataService?: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>, changeDetectorRef?: ChangeDetectorRef) => LocaleDatePipe"  >}}

{{< member-description >}}{{< /member-description >}}

### transform

{{< member-info kind="method" type="(value: unknown, args: unknown[]) => unknown"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
