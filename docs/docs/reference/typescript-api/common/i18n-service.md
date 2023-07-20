---
title: "I18nService"
weight: 10
date: 2023-07-20T13:56:15.647Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## I18nService

<GenerationInfo sourceFile="packages/core/src/i18n/i18n.service.ts" sourceLine="44" packageName="@vendure/core" />



```ts title="Signature"
class I18nService implements OnModuleInit {
  addTranslationFile(langKey: string, filePath: string) => void;
  addTranslation(langKey: string, resources: VendureTranslationResources | any) => void;
}
```
Implements

 * OnModuleInit



### addTranslationFile

<MemberInfo kind="method" type="(langKey: string, filePath: string) => void"   />

Add a I18n translation by json file
### addTranslation

<MemberInfo kind="method" type="(langKey: string, resources: <a href='/typescript-api/common/i18n-service#venduretranslationresources'>VendureTranslationResources</a> | any) => void"   />

Add a I18n translation (key-value) resource


## VendureTranslationResources

<GenerationInfo sourceFile="packages/core/src/i18n/i18n.service.ts" sourceLine="24" packageName="@vendure/core" />

I18n resources used for translations

```ts title="Signature"
interface VendureTranslationResources {
  error: any;
  errorResult: any;
  message: any;
}
```

### error

<MemberInfo kind="property" type="any"   />


### errorResult

<MemberInfo kind="property" type="any"   />


### message

<MemberInfo kind="property" type="any"   />


