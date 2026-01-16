---
title: "LocaleCurrencyNamePipe"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## LocaleCurrencyNamePipe

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/locale-currency-name.pipe.ts" sourceLine="18" packageName="@vendure/admin-ui" />

Displays a human-readable name for a given ISO 4217 currency code.

*Example*

```HTML
{{ order.currencyCode | localeCurrencyName }}
```

```ts title="Signature"
class LocaleCurrencyNamePipe extends LocaleBasePipe implements PipeTransform {
    constructor(dataService?: DataService, changeDetectorRef?: ChangeDetectorRef)
    transform(value: any, display: 'full' | 'symbol' | 'name' = 'full', locale?: unknown) => any;
}
```
* Extends: <code>LocaleBasePipe</code>


* Implements: <code>PipeTransform</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(dataService?: <a href='/reference/admin-ui-api/services/data-service#dataservice'>DataService</a>, changeDetectorRef?: ChangeDetectorRef) => LocaleCurrencyNamePipe`}   />


### transform

<MemberInfo kind="method" type={`(value: any, display: 'full' | 'symbol' | 'name' = 'full', locale?: unknown) => any`}   />




</div>
