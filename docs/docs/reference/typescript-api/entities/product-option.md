---
title: "ProductOption"
weight: 10
date: 2023-07-14T16:57:49.945Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ProductOption
<div class="symbol">


# ProductOption

{{< generation-info sourceFile="packages/core/src/entity/product-option/product-option.entity.ts" sourceLine="20" packageName="@vendure/core">}}

A ProductOption is used to differentiate <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>s from one another.

## Signature

```TypeScript
class ProductOption extends VendureEntity implements Translatable, HasCustomFields, SoftDeletable {
  constructor(input?: DeepPartial<ProductOption>)
  @Column({ type: Date, nullable: true }) @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
  name: LocaleString;
  @Column() @Column() code: string;
  @OneToMany(type => ProductOptionTranslation, translation => translation.base, { eager: true }) @OneToMany(type => ProductOptionTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ProductOption>>;
  @Index() @ManyToOne(type => ProductOptionGroup, group => group.options) @Index()
    @ManyToOne(type => ProductOptionGroup, group => group.options)
    group: ProductOptionGroup;
  @EntityId() @EntityId()
    groupId: ID;
  @Column(type => CustomProductOptionFields) @Column(type => CustomProductOptionFields)
    customFields: CustomProductOptionFields;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * <a href='/typescript-api/entities/interfaces#translatable'>Translatable</a>
 * HasCustomFields
 * <a href='/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/product-option#productoption'>ProductOption</a>&#62;) => ProductOption"  >}}

{{< member-description >}}{{< /member-description >}}

### deletedAt

{{< member-info kind="property" type="Date | null"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="LocaleString"  >}}

{{< member-description >}}{{< /member-description >}}

### code

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### translations

{{< member-info kind="property" type="Array&#60;Translation&#60;<a href='/typescript-api/entities/product-option#productoption'>ProductOption</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### group

{{< member-info kind="property" type="<a href='/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### groupId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomProductOptionFields"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
