---
title: "LocaleDatePipe"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## LocaleDatePipe

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/locale-date.pipe.ts" sourceLine="19" packageName="@vendure/admin-ui" />

A replacement of the Angular DatePipe which makes use of the Intl API
to format dates according to the selected UI language.

*Example*

```HTML
{{ order.orderPlacedAt | localeDate }}
```

```ts title="Signature"
class LocaleDatePipe extends LocaleBasePipe implements PipeTransform {
    constructor(dataService?: DataService, changeDetectorRef?: ChangeDetectorRef)
    transform(value: unknown, args: unknown[]) => unknown;
}
```
* Extends: <code>LocaleBasePipe</code>


* Implements: <code>PipeTransform</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(dataService?: <a href='/reference/admin-ui-api/services/data-service#dataservice'>DataService</a>, changeDetectorRef?: ChangeDetectorRef) => LocaleDatePipe`}   />


### transform

<MemberInfo kind="method" type={`(value: unknown, args: unknown[]) => unknown`}   />




</div>
