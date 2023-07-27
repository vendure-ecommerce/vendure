---
title: "DurationPipe"
weight: 10
date: 2023-07-14T16:57:51.325Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DurationPipe
<div class="symbol">


# DurationPipe

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/duration.pipe.ts" sourceLine="18" packageName="@vendure/admin-ui">}}

Displays a number of milliseconds in a more human-readable format,
e.g. "12ms", "33s", "2:03m"

*Example*

```TypeScript
{{ timeInMs | duration }}
```

## Signature

```TypeScript
class DurationPipe implements PipeTransform {
  constructor(i18nService: I18nService)
  transform(value: number) => string;
}
```
## Implements

 * PipeTransform


## Members

### constructor

{{< member-info kind="method" type="(i18nService: <a href='/typescript-api/common/i18n-service#i18nservice'>I18nService</a>) => DurationPipe"  >}}

{{< member-description >}}{{< /member-description >}}

### transform

{{< member-info kind="method" type="(value: number) => string"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
