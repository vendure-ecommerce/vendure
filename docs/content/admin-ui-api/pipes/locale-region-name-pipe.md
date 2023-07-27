---
title: "LocaleRegionNamePipe"
weight: 10
date: 2023-07-14T16:57:51.341Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# LocaleRegionNamePipe
<div class="symbol">


# LocaleRegionNamePipe

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/locale-region-name.pipe.ts" sourceLine="18" packageName="@vendure/admin-ui">}}

Displays a human-readable name for a given region.

*Example*

```HTML
{{ 'GB' | localeRegionName }}
```

## Signature

```TypeScript
class LocaleRegionNamePipe extends LocaleBasePipe implements PipeTransform {
  constructor(dataService?: DataService, changeDetectorRef?: ChangeDetectorRef)
  transform(value: any, locale?: unknown) => string;
}
```
## Extends

 * LocaleBasePipe


## Implements

 * PipeTransform


## Members

### constructor

{{< member-info kind="method" type="(dataService?: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>, changeDetectorRef?: ChangeDetectorRef) => LocaleRegionNamePipe"  >}}

{{< member-description >}}{{< /member-description >}}

### transform

{{< member-info kind="method" type="(value: any, locale?: unknown) => string"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
