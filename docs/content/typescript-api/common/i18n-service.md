---
title: "I18nService"
weight: 10
date: 2023-07-14T16:57:50.134Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# I18nService
<div class="symbol">


# I18nService

{{< generation-info sourceFile="packages/core/src/i18n/i18n.service.ts" sourceLine="44" packageName="@vendure/core">}}



## Signature

```TypeScript
class I18nService implements OnModuleInit {
  addTranslationFile(langKey: string, filePath: string) => void;
  addTranslation(langKey: string, resources: VendureTranslationResources | any) => void;
}
```
## Implements

 * OnModuleInit


## Members

### addTranslationFile

{{< member-info kind="method" type="(langKey: string, filePath: string) => void"  >}}

{{< member-description >}}Add a I18n translation by json file{{< /member-description >}}

### addTranslation

{{< member-info kind="method" type="(langKey: string, resources: <a href='/typescript-api/common/i18n-service#venduretranslationresources'>VendureTranslationResources</a> | any) => void"  >}}

{{< member-description >}}Add a I18n translation (key-value) resource{{< /member-description >}}


</div>
<div class="symbol">


# VendureTranslationResources

{{< generation-info sourceFile="packages/core/src/i18n/i18n.service.ts" sourceLine="24" packageName="@vendure/core">}}

I18n resources used for translations

## Signature

```TypeScript
interface VendureTranslationResources {
  error: any;
  errorResult: any;
  message: any;
}
```
## Members

### error

{{< member-info kind="property" type="any"  >}}

{{< member-description >}}{{< /member-description >}}

### errorResult

{{< member-info kind="property" type="any"  >}}

{{< member-description >}}{{< /member-description >}}

### message

{{< member-info kind="property" type="any"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
