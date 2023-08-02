---
title: "TimeAgoPipe"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TimeAgoPipe

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/time-ago.pipe.ts" sourceLine="18" packageName="@vendure/admin-ui" />

Converts a date into the format "3 minutes ago", "5 hours ago" etc.

*Example*

```HTML
{{ order.orderPlacedAt | timeAgo }}
```

```ts title="Signature"
class TimeAgoPipe implements PipeTransform {
    constructor(i18nService: I18nService)
    transform(value: string | Date, nowVal?: string | Date) => string;
}
```
* Implements: <code>PipeTransform</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(i18nService: <a href='/reference/typescript-api/common/i18n-service#i18nservice'>I18nService</a>) => TimeAgoPipe`}   />


### transform

<MemberInfo kind="method" type={`(value: string | Date, nowVal?: string | Date) => string`}   />




</div>
