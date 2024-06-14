---
title: "GlobalSettings"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## GlobalSettings

<GenerationInfo sourceFile="packages/core/src/entity/global-settings/global-settings.entity.ts" sourceLine="14" packageName="@vendure/core" />

Stores global settings for the whole application

```ts title="Signature"
class GlobalSettings extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<GlobalSettings>)
    @Column('simple-array')
    availableLanguages: LanguageCode[];
    @Column({ default: true })
    trackInventory: boolean;
    @Column({ default: 0 })
    outOfStockThreshold: number;
    @Column(type => CustomGlobalSettingsFields)
    customFields: CustomGlobalSettingsFields;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code>HasCustomFields</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/global-settings#globalsettings'>GlobalSettings</a>&#62;) => GlobalSettings`}   />


### availableLanguages

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>[]`}   />


### trackInventory

<MemberInfo kind="property" type={`boolean`}   />

Specifies the default value for inventory tracking for ProductVariants.
Can be overridden per ProductVariant, but this value determines the default
if not otherwise specified.
### outOfStockThreshold

<MemberInfo kind="property" type={`number`}   />

Specifies the value of stockOnHand at which a given ProductVariant is considered
out of stock.
### customFields

<MemberInfo kind="property" type={`CustomGlobalSettingsFields`}   />




</div>
