---
title: "LocaleLanguageNamePipe"
weight: 10
date: 2023-07-14T16:57:51.339Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# LocaleLanguageNamePipe
<div class="symbol">


# LocaleLanguageNamePipe

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/locale-language-name.pipe.ts" sourceLine="18" packageName="@vendure/admin-ui">}}

Displays a human-readable name for a given ISO 639-1 language code.

*Example*

```HTML
{{ 'zh_Hant' | localeLanguageName }}
```

## Signature

```TypeScript
class LocaleLanguageNamePipe extends LocaleBasePipe implements PipeTransform {
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

{{< member-info kind="method" type="(dataService?: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>, changeDetectorRef?: ChangeDetectorRef) => LocaleLanguageNamePipe"  >}}

{{< member-description >}}{{< /member-description >}}

### transform

{{< member-info kind="method" type="(value: any, locale?: unknown) => string"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
