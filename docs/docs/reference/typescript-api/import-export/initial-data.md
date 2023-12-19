---
title: "InitialData"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## InitialData

<GenerationInfo sourceFile="packages/core/src/data-import/types.ts" sourceLine="47" packageName="@vendure/core" />

An object defining initial settings for a new Vendure installation.

```ts title="Signature"
interface InitialData {
    defaultLanguage: LanguageCode;
    defaultZone: string;
    roles?: RoleDefinition[];
    countries: CountryDefinition[];
    taxRates: Array<{ name: string; percentage: number }>;
    shippingMethods: Array<{ name: string; price: number }>;
    paymentMethods: Array<{ name: string; handler: ConfigurableOperationInput }>;
    collections: CollectionDefinition[];
}
```

<div className="members-wrapper">

### defaultLanguage

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>`}   />


### defaultZone

<MemberInfo kind="property" type={`string`}   />


### roles

<MemberInfo kind="property" type={`RoleDefinition[]`}   />


### countries

<MemberInfo kind="property" type={`CountryDefinition[]`}   />


### taxRates

<MemberInfo kind="property" type={`Array&#60;{ name: string; percentage: number }&#62;`}   />


### shippingMethods

<MemberInfo kind="property" type={`Array&#60;{ name: string; price: number }&#62;`}   />


### paymentMethods

<MemberInfo kind="property" type={`Array&#60;{ name: string; handler: ConfigurableOperationInput }&#62;`}   />


### collections

<MemberInfo kind="property" type={`CollectionDefinition[]`}   />




</div>
