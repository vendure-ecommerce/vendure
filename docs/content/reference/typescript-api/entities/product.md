---
title: "Product"
weight: 10
date: 2023-07-14T16:57:49.939Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Product
<div class="symbol">


# Product

{{< generation-info sourceFile="packages/core/src/entity/product/product.entity.ts" sourceLine="25" packageName="@vendure/core">}}

A Product contains one or more <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>s and serves as a container for those variants,
providing an overall name, description etc.

## Signature

```TypeScript
class Product extends VendureEntity implements Translatable, HasCustomFields, ChannelAware, SoftDeletable {
  constructor(input?: DeepPartial<Product>)
  @Column({ type: Date, nullable: true }) @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
  name: LocaleString;
  slug: LocaleString;
  description: LocaleString;
  @Column({ default: true }) @Column({ default: true })
    enabled: boolean;
  @Index() @ManyToOne(type => Asset, { onDelete: 'SET NULL' }) @Index()
    @ManyToOne(type => Asset, { onDelete: 'SET NULL' })
    featuredAsset: Asset;
  @OneToMany(type => ProductAsset, productAsset => productAsset.product) @OneToMany(type => ProductAsset, productAsset => productAsset.product)
    assets: ProductAsset[];
  @OneToMany(type => ProductTranslation, translation => translation.base, { eager: true }) @OneToMany(type => ProductTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<Product>>;
  @OneToMany(type => ProductVariant, variant => variant.product) @OneToMany(type => ProductVariant, variant => variant.product)
    variants: ProductVariant[];
  @OneToMany(type => ProductOptionGroup, optionGroup => optionGroup.product) @OneToMany(type => ProductOptionGroup, optionGroup => optionGroup.product)
    optionGroups: ProductOptionGroup[];
  @ManyToMany(type => FacetValue) @JoinTable() @ManyToMany(type => FacetValue)
    @JoinTable()
    facetValues: FacetValue[];
  @Column(type => CustomProductFields) @Column(type => CustomProductFields)
    customFields: CustomProductFields;
  @ManyToMany(type => Channel) @JoinTable() @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * <a href='/typescript-api/entities/interfaces#translatable'>Translatable</a>
 * HasCustomFields
 * <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>
 * <a href='/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/product#product'>Product</a>&#62;) => Product"  >}}

{{< member-description >}}{{< /member-description >}}

### deletedAt

{{< member-info kind="property" type="Date | null"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="LocaleString"  >}}

{{< member-description >}}{{< /member-description >}}

### slug

{{< member-info kind="property" type="LocaleString"  >}}

{{< member-description >}}{{< /member-description >}}

### description

{{< member-info kind="property" type="LocaleString"  >}}

{{< member-description >}}{{< /member-description >}}

### enabled

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### featuredAsset

{{< member-info kind="property" type="<a href='/typescript-api/entities/asset#asset'>Asset</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### assets

{{< member-info kind="property" type="ProductAsset[]"  >}}

{{< member-description >}}{{< /member-description >}}

### translations

{{< member-info kind="property" type="Array&#60;Translation&#60;<a href='/typescript-api/entities/product#product'>Product</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### variants

{{< member-info kind="property" type="<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### optionGroups

{{< member-info kind="property" type="<a href='/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### facetValues

{{< member-info kind="property" type="<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomProductFields"  >}}

{{< member-description >}}{{< /member-description >}}

### channels

{{< member-info kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
