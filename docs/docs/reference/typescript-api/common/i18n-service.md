---
title: "I18nService"
isDefaultIndex: false
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
* Implements: <code>OnModuleInit</code>



<div className="members-wrapper">

### addTranslationFile

<MemberInfo kind="method" type={`(langKey: string, filePath: string) => void`}   />

Add a I18n translation by json file
### addTranslation

<MemberInfo kind="method" type={`(langKey: string, resources: <a href='/reference/typescript-api/common/i18n-service#venduretranslationresources'>VendureTranslationResources</a> | any) => void`}   />

Add a I18n translation (key-value) resource


</div>


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

<div className="members-wrapper">

### error

<MemberInfo kind="property" type={`any`}   />


### errorResult

<MemberInfo kind="property" type={`any`}   />


### message

<MemberInfo kind="property" type={`any`}   />




</div>
