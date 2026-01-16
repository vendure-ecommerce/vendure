---
title: "ProductOptionGroup"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductOptionGroup

<GenerationInfo sourceFile="packages/core/src/entity/product-option-group/product-option-group.entity.ts" sourceLine="20" packageName="@vendure/core" />

A grouping of one or more <a href='/reference/typescript-api/entities/product-option#productoption'>ProductOption</a>s.

```ts title="Signature"
class ProductOptionGroup extends VendureEntity implements Translatable, HasCustomFields, SoftDeletable {
    constructor(input?: DeepPartial<ProductOptionGroup>)
    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
    name: LocaleString;
    @Column()
    code: string;
    @OneToMany(type => ProductOptionGroupTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ProductOptionGroup>>;
    @OneToMany(type => ProductOption, option => option.group)
    options: ProductOption[];
    @Index()
    @ManyToOne(type => Product, product => product.optionGroups)
    product: Product;
    @Column(type => CustomProductOptionGroupFields)
    customFields: CustomProductOptionGroupFields;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code><a href='/reference/typescript-api/entities/interfaces#translatable'>Translatable</a></code>, <code>HasCustomFields</code>, <code><a href='/reference/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62;) => ProductOptionGroup`}   />


### deletedAt

<MemberInfo kind="property" type={`Date | null`}   />


### name

<MemberInfo kind="property" type={`LocaleString`}   />


### code

<MemberInfo kind="property" type={`string`}   />


### translations

<MemberInfo kind="property" type={`Array&#60;Translation&#60;<a href='/reference/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62;&#62;`}   />


### options

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-option#productoption'>ProductOption</a>[]`}   />


### product

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product#product'>Product</a>`}   />


### customFields

<MemberInfo kind="property" type={`CustomProductOptionGroupFields`}   />




</div>
