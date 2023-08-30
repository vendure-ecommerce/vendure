---
title: "LocaleCurrencyPipe"
weight: 10
date: 2023-07-14T16:57:51.334Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# LocaleCurrencyPipe
<div class="symbol">


# LocaleCurrencyPipe

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/locale-currency.pipe.ts" sourceLine="19" packageName="@vendure/admin-ui">}}

Formats a Vendure monetary value (in cents) into the correct format for the configured currency and display
locale.

*Example*

```HTML
{{ variant.priceWithTax | localeCurrency }}
```

## Signature

```TypeScript
class LocaleCurrencyPipe extends LocaleBasePipe implements PipeTransform {
  constructor(dataService?: DataService, changeDetectorRef?: ChangeDetectorRef)
  transform(value: unknown, args: unknown[]) => string | unknown;
}
```
## Extends

 * LocaleBasePipe


## Implements

 * PipeTransform


## Members

### constructor

{{< member-info kind="method" type="(dataService?: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>, changeDetectorRef?: ChangeDetectorRef) => LocaleCurrencyPipe"  >}}

{{< member-description >}}{{< /member-description >}}

### transform

{{< member-info kind="method" type="(value: unknown, args: unknown[]) => string | unknown"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
