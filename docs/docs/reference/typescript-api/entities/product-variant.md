---
title: "ProductVariant"
weight: 10
date: 2023-07-14T16:57:49.956Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ProductVariant
<div class="symbol">


# ProductVariant

{{< generation-info sourceFile="packages/core/src/entity/product-variant/product-variant.entity.ts" sourceLine="37" packageName="@vendure/core">}}

A ProductVariant represents a single stock keeping unit (SKU) in the store's inventory.
Whereas a <a href='/typescript-api/entities/product#product'>Product</a> is a "container" of variants, the variant itself holds the
data on price, tax category etc. When one adds items to their cart, they are adding
ProductVariants, not Products.

## Signature

```TypeScript
class ProductVariant extends VendureEntity implements Translatable, HasCustomFields, SoftDeletable, ChannelAware {
  constructor(input?: DeepPartial<ProductVariant>)
  @Column({ type: Date, nullable: true }) @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
  name: LocaleString;
  @Column({ default: true }) @Column({ default: true })
    enabled: boolean;
  @Column() @Column()
    sku: string;
  listPrice: number;
  listPriceIncludesTax: boolean;
  currencyCode: CurrencyCode;
  @Calculated({
        expression: 'productvariant_productVariantPrices.price',
    }) price: number
  @Calculated({
        // Note: this works fine for sorting by priceWithTax, but filtering will return inaccurate
        // results due to this expression not taking taxes into account. This is because the tax
        // rate is calculated at run-time in the application layer based on the current context,
        // and is unknown to the database.
        expression: 'productvariant_productVariantPrices.price',
    }) priceWithTax: number
  taxRateApplied: TaxRate;
  @Index() @ManyToOne(type => Asset, { onDelete: 'SET NULL' }) @Index()
    @ManyToOne(type => Asset, { onDelete: 'SET NULL' })
    featuredAsset: Asset;
  @OneToMany(type => ProductVariantAsset, productVariantAsset => productVariantAsset.productVariant, {
        onDelete: 'SET NULL',
    }) @OneToMany(type => ProductVariantAsset, productVariantAsset => productVariantAsset.productVariant, {
        onDelete: 'SET NULL',
    })
    assets: ProductVariantAsset[];
  @Index() @ManyToOne(type => TaxCategory) @Index()
    @ManyToOne(type => TaxCategory)
    taxCategory: TaxCategory;
  @OneToMany(type => ProductVariantPrice, price => price.variant, { eager: true }) @OneToMany(type => ProductVariantPrice, price => price.variant, { eager: true })
    productVariantPrices: ProductVariantPrice[];
  @OneToMany(type => ProductVariantTranslation, translation => translation.base, { eager: true }) @OneToMany(type => ProductVariantTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ProductVariant>>;
  @Index() @ManyToOne(type => Product, product => product.variants) @Index()
    @ManyToOne(type => Product, product => product.variants)
    product: Product;
  @EntityId({ nullable: true }) @EntityId({ nullable: true })
    productId: ID;
  @Column({ default: 0 }) @Column({ default: 0 })
    outOfStockThreshold: number;
  @Column({ default: true }) @Column({ default: true })
    useGlobalOutOfStockThreshold: boolean;
  @Column({ type: 'varchar', default: GlobalFlag.INHERIT }) @Column({ type: 'varchar', default: GlobalFlag.INHERIT })
    trackInventory: GlobalFlag;
  @OneToMany(type => StockLevel, stockLevel => stockLevel.productVariant) @OneToMany(type => StockLevel, stockLevel => stockLevel.productVariant)
    stockLevels: StockLevel[];
  @OneToMany(type => StockMovement, stockMovement => stockMovement.productVariant) @OneToMany(type => StockMovement, stockMovement => stockMovement.productVariant)
    stockMovements: StockMovement[];
  @ManyToMany(type => ProductOption) @JoinTable() @ManyToMany(type => ProductOption)
    @JoinTable()
    options: ProductOption[];
  @ManyToMany(type => FacetValue) @JoinTable() @ManyToMany(type => FacetValue)
    @JoinTable()
    facetValues: FacetValue[];
  @Column(type => CustomProductVariantFields) @Column(type => CustomProductVariantFields)
    customFields: CustomProductVariantFields;
  @ManyToMany(type => Collection, collection => collection.productVariants) @ManyToMany(type => Collection, collection => collection.productVariants)
    collections: Collection[];
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
 * <a href='/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a>
 * <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;) => ProductVariant"  >}}

{{< member-description >}}{{< /member-description >}}

### deletedAt

{{< member-info kind="property" type="Date | null"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="LocaleString"  >}}

{{< member-description >}}{{< /member-description >}}

### enabled

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### sku

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### listPrice

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### listPriceIncludesTax

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### currencyCode

{{< member-info kind="property" type="<a href='/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### price

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### priceWithTax

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### taxRateApplied

{{< member-info kind="property" type="<a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### featuredAsset

{{< member-info kind="property" type="<a href='/typescript-api/entities/asset#asset'>Asset</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### assets

{{< member-info kind="property" type="ProductVariantAsset[]"  >}}

{{< member-description >}}{{< /member-description >}}

### taxCategory

{{< member-info kind="property" type="<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### productVariantPrices

{{< member-info kind="property" type="<a href='/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### translations

{{< member-info kind="property" type="Array&#60;Translation&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### product

{{< member-info kind="property" type="<a href='/typescript-api/entities/product#product'>Product</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### productId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### outOfStockThreshold

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}Specifies the value of stockOnHand at which the ProductVariant is considered
out of stock.{{< /member-description >}}

### useGlobalOutOfStockThreshold

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}When true, the `outOfStockThreshold` value will be taken from the GlobalSettings and the
value set on this ProductVariant will be ignored.{{< /member-description >}}

### trackInventory

{{< member-info kind="property" type="GlobalFlag"  >}}

{{< member-description >}}{{< /member-description >}}

### stockLevels

{{< member-info kind="property" type="<a href='/typescript-api/entities/stock-level#stocklevel'>StockLevel</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### stockMovements

{{< member-info kind="property" type="<a href='/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### options

{{< member-info kind="property" type="<a href='/typescript-api/entities/product-option#productoption'>ProductOption</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### facetValues

{{< member-info kind="property" type="<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomProductVariantFields"  >}}

{{< member-description >}}{{< /member-description >}}

### collections

{{< member-info kind="property" type="<a href='/typescript-api/entities/collection#collection'>Collection</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### channels

{{< member-info kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
