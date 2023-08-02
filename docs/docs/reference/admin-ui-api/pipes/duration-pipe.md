---
title: "DurationPipe"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DurationPipe

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/duration.pipe.ts" sourceLine="18" packageName="@vendure/admin-ui" />

Displays a number of milliseconds in a more human-readable format,
e.g. "12ms", "33s", "2:03m"

*Example*

```ts
{{ timeInMs | duration }}
```

```ts title="Signature"
class DurationPipe implements PipeTransform {
    constructor(i18nService: I18nService)
    transform(value: number) => string;
}
```
* Implements: <code>PipeTransform</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(i18nService: <a href='/reference/typescript-api/common/i18n-service#i18nservice'>I18nService</a>) => DurationPipe`}   />


### transform

<MemberInfo kind="method" type={`(value: number) => string`}   />




</div>
