---
title: "ProductOptionGroup"
weight: 10
date: 2023-07-14T16:57:49.949Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ProductOptionGroup
<div class="symbol">


# ProductOptionGroup

{{< generation-info sourceFile="packages/core/src/entity/product-option-group/product-option-group.entity.ts" sourceLine="20" packageName="@vendure/core">}}

A grouping of one or more <a href='/typescript-api/entities/product-option#productoption'>ProductOption</a>s.

## Signature

```TypeScript
class ProductOptionGroup extends VendureEntity implements Translatable, HasCustomFields, SoftDeletable {
  constructor(input?: DeepPartial<ProductOptionGroup>)
  @Column({ type: Date, nullable: true }) @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
  name: LocaleString;
  @Column() @Column()
    code: string;
  @OneToMany(type => ProductOptionGroupTranslation, translation => translation.base, { eager: true }) @OneToMany(type => ProductOptionGroupTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ProductOptionGroup>>;
  @OneToMany(type => ProductOption, option => option.group) @OneToMany(type => ProductOption, option => option.group)
    options: ProductOption[];
  @Index() @ManyToOne(type => Product) @Index()
    @ManyToOne(type => Product)
    product: Product;
  @Column(type => CustomProductOptionGroupFields) @Column(type => CustomProductOptionGroupFields)
    customFields: CustomProductOptionGroupFields;
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

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62;) => ProductOptionGroup"  >}}

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

{{< member-info kind="property" type="Array&#60;Translation&#60;<a href='/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### options

{{< member-info kind="property" type="<a href='/typescript-api/entities/product-option#productoption'>ProductOption</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### product

{{< member-info kind="property" type="<a href='/typescript-api/entities/product#product'>Product</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomProductOptionGroupFields"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
