---
title: "LocaleCurrencyPipe"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## LocaleCurrencyPipe

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/locale-currency.pipe.ts" sourceLine="20" packageName="@vendure/admin-ui" />

Formats a Vendure monetary value (in cents) into the correct format for the configured currency and display
locale.

*Example*

```HTML
{{ variant.priceWithTax | localeCurrency }}
```

```ts title="Signature"
class LocaleCurrencyPipe extends LocaleBasePipe implements PipeTransform {
    readonly precisionFactor: number;
    constructor(currencyService: CurrencyService, dataService?: DataService, changeDetectorRef?: ChangeDetectorRef)
    transform(value: unknown, args: unknown[]) => string | unknown;
}
```
* Extends: <code>LocaleBasePipe</code>


* Implements: <code>PipeTransform</code>



<div className="members-wrapper">

### precisionFactor

<MemberInfo kind="property" type={`number`}   />


### constructor

<MemberInfo kind="method" type={`(currencyService: CurrencyService, dataService?: <a href='/reference/admin-ui-api/services/data-service#dataservice'>DataService</a>, changeDetectorRef?: ChangeDetectorRef) => LocaleCurrencyPipe`}   />


### transform

<MemberInfo kind="method" type={`(value: unknown, args: unknown[]) => string | unknown`}   />




</div>
