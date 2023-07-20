---
title: "ProductVariant"
weight: 10
date: 2023-07-20T13:56:15.309Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductVariant

<GenerationInfo sourceFile="packages/core/src/entity/product-variant/product-variant.entity.ts" sourceLine="37" packageName="@vendure/core" />

A ProductVariant represents a single stock keeping unit (SKU) in the store's inventory.
Whereas a <a href='/typescript-api/entities/product#product'>Product</a> is a "container" of variants, the variant itself holds the
data on price, tax category etc. When one adds items to their cart, they are adding
ProductVariants, not Products.

```ts title="Signature"
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
Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


Implements

 * <a href='/typescript-api/entities/interfaces#translatable'>Translatable</a>
 * HasCustomFields
 * <a href='/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a>
 * <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>



### constructor

<MemberInfo kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;) => ProductVariant"   />


### deletedAt

<MemberInfo kind="property" type="Date | null"   />


### name

<MemberInfo kind="property" type="LocaleString"   />


### enabled

<MemberInfo kind="property" type="boolean"   />


### sku

<MemberInfo kind="property" type="string"   />


### listPrice

<MemberInfo kind="property" type="number"   />


### listPriceIncludesTax

<MemberInfo kind="property" type="boolean"   />


### currencyCode

<MemberInfo kind="property" type="<a href='/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>"   />


### price

<MemberInfo kind="property" type="number"   />


### priceWithTax

<MemberInfo kind="property" type="number"   />


### taxRateApplied

<MemberInfo kind="property" type="<a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>"   />


### featuredAsset

<MemberInfo kind="property" type="<a href='/typescript-api/entities/asset#asset'>Asset</a>"   />


### assets

<MemberInfo kind="property" type="ProductVariantAsset[]"   />


### taxCategory

<MemberInfo kind="property" type="<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>"   />


### productVariantPrices

<MemberInfo kind="property" type="<a href='/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>[]"   />


### translations

<MemberInfo kind="property" type="Array&#60;Translation&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;"   />


### product

<MemberInfo kind="property" type="<a href='/typescript-api/entities/product#product'>Product</a>"   />


### productId

<MemberInfo kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"   />


### outOfStockThreshold

<MemberInfo kind="property" type="number"   />

Specifies the value of stockOnHand at which the ProductVariant is considered
out of stock.
### useGlobalOutOfStockThreshold

<MemberInfo kind="property" type="boolean"   />

When true, the `outOfStockThreshold` value will be taken from the GlobalSettings and the
value set on this ProductVariant will be ignored.
### trackInventory

<MemberInfo kind="property" type="GlobalFlag"   />


### stockLevels

<MemberInfo kind="property" type="<a href='/typescript-api/entities/stock-level#stocklevel'>StockLevel</a>[]"   />


### stockMovements

<MemberInfo kind="property" type="<a href='/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a>[]"   />


### options

<MemberInfo kind="property" type="<a href='/typescript-api/entities/product-option#productoption'>ProductOption</a>[]"   />


### facetValues

<MemberInfo kind="property" type="<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>[]"   />


### customFields

<MemberInfo kind="property" type="CustomProductVariantFields"   />


### collections

<MemberInfo kind="property" type="<a href='/typescript-api/entities/collection#collection'>Collection</a>[]"   />


### channels

<MemberInfo kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"   />


