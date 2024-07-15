---
title: "ProductOption"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductOption

<GenerationInfo sourceFile="packages/core/src/entity/product-option/product-option.entity.ts" sourceLine="21" packageName="@vendure/core" />

A ProductOption is used to differentiate <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>s from one another.

```ts title="Signature"
class ProductOption extends VendureEntity implements Translatable, HasCustomFields, SoftDeletable {
    constructor(input?: DeepPartial<ProductOption>)
    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
    name: LocaleString;
    @Column() code: string;
    @OneToMany(type => ProductOptionTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ProductOption>>;
    @Index()
    @ManyToOne(type => ProductOptionGroup, group => group.options)
    group: ProductOptionGroup;
    @EntityId()
    groupId: ID;
    @ManyToMany(type => ProductVariant, variant => variant.options)
    productVariants: ProductVariant[];
    @Column(type => CustomProductOptionFields)
    customFields: CustomProductOptionFields;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code><a href='/reference/typescript-api/entities/interfaces#translatable'>Translatable</a></code>, <code>HasCustomFields</code>, <code><a href='/reference/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/product-option#productoption'>ProductOption</a>&#62;) => ProductOption`}   />


### deletedAt

<MemberInfo kind="property" type={`Date | null`}   />


### name

<MemberInfo kind="property" type={`LocaleString`}   />


### code

<MemberInfo kind="property" type={`string`}   />


### translations

<MemberInfo kind="property" type={`Array&#60;Translation&#60;<a href='/reference/typescript-api/entities/product-option#productoption'>ProductOption</a>&#62;&#62;`}   />


### group

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>`}   />


### groupId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### productVariants

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[]`}   />


### customFields

<MemberInfo kind="property" type={`CustomProductOptionFields`}   />




</div>
