---
title: "LocaleCurrencyNamePipe"
weight: 10
date: 2023-07-14T16:57:51.331Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# LocaleCurrencyNamePipe
<div class="symbol">


# LocaleCurrencyNamePipe

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/locale-currency-name.pipe.ts" sourceLine="18" packageName="@vendure/admin-ui">}}

Displays a human-readable name for a given ISO 4217 currency code.

*Example*

```HTML
{{ order.currencyCode | localeCurrencyName }}
```

## Signature

```TypeScript
class LocaleCurrencyNamePipe extends LocaleBasePipe implements PipeTransform {
  constructor(dataService?: DataService, changeDetectorRef?: ChangeDetectorRef)
  transform(value: any, display: 'full' | 'symbol' | 'name' = 'full', locale?: unknown) => any;
}
```
## Extends

 * LocaleBasePipe


## Implements

 * PipeTransform


## Members

### constructor

{{< member-info kind="method" type="(dataService?: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>, changeDetectorRef?: ChangeDetectorRef) => LocaleCurrencyNamePipe"  >}}

{{< member-description >}}{{< /member-description >}}

### transform

{{< member-info kind="method" type="(value: any, display: 'full' | 'symbol' | 'name' = 'full', locale?: unknown) => any"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
