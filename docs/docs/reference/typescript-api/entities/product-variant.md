---
title: "ProductVariant"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductVariant

<GenerationInfo sourceFile="packages/core/src/entity/product-variant/product-variant.entity.ts" sourceLine="38" packageName="@vendure/core" />

A ProductVariant represents a single stock keeping unit (SKU) in the store's inventory.
Whereas a <a href='/reference/typescript-api/entities/product#product'>Product</a> is a "container" of variants, the variant itself holds the
data on price, tax category etc. When one adds items to their cart, they are adding
ProductVariants, not Products.

```ts title="Signature"
class ProductVariant extends VendureEntity implements Translatable, HasCustomFields, SoftDeletable, ChannelAware {
    constructor(input?: DeepPartial<ProductVariant>)
    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
    name: LocaleString;
    @Column({ default: true })
    enabled: boolean;
    @Column()
    sku: string;
    listPrice: number;
    listPriceIncludesTax: boolean;
    currencyCode: CurrencyCode;
    price: number
    priceWithTax: number
    taxRateApplied: TaxRate;
    @Index()
    @ManyToOne(type => Asset, asset => asset.featuredInVariants, { onDelete: 'SET NULL' })
    featuredAsset: Asset;
    @OneToMany(type => ProductVariantAsset, productVariantAsset => productVariantAsset.productVariant, {
        onDelete: 'SET NULL',
    })
    assets: ProductVariantAsset[];
    @Index()
    @ManyToOne(type => TaxCategory, taxCategory => taxCategory.productVariants)
    taxCategory: TaxCategory;
    @OneToMany(type => ProductVariantPrice, price => price.variant, { eager: true })
    productVariantPrices: ProductVariantPrice[];
    @OneToMany(type => ProductVariantTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ProductVariant>>;
    @Index()
    @ManyToOne(type => Product, product => product.variants)
    product: Product;
    @EntityId({ nullable: true })
    productId: ID;
    @Column({ default: 0 })
    outOfStockThreshold: number;
    @Column({ default: true })
    useGlobalOutOfStockThreshold: boolean;
    @Column({ type: 'varchar', default: GlobalFlag.INHERIT })
    trackInventory: GlobalFlag;
    @OneToMany(type => StockLevel, stockLevel => stockLevel.productVariant)
    stockLevels: StockLevel[];
    @OneToMany(type => StockMovement, stockMovement => stockMovement.productVariant)
    stockMovements: StockMovement[];
    @ManyToMany(type => ProductOption, productOption => productOption.productVariants)
    @JoinTable()
    options: ProductOption[];
    @ManyToMany(type => FacetValue, facetValue => facetValue.productVariants)
    @JoinTable()
    facetValues: FacetValue[];
    @Column(type => CustomProductVariantFields)
    customFields: CustomProductVariantFields;
    @ManyToMany(type => Collection, collection => collection.productVariants)
    collections: Collection[];
    @ManyToMany(type => Channel, channel => channel.productVariants)
    @JoinTable()
    channels: Channel[];
    @OneToMany(type => OrderLine, orderLine => orderLine.productVariant)
    lines: OrderLine[];
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code><a href='/reference/typescript-api/entities/interfaces#translatable'>Translatable</a></code>, <code>HasCustomFields</code>, <code><a href='/reference/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a></code>, <code><a href='/reference/typescript-api/entities/interfaces#channelaware'>ChannelAware</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;) => ProductVariant`}   />


### deletedAt

<MemberInfo kind="property" type={`Date | null`}   />


### name

<MemberInfo kind="property" type={`LocaleString`}   />


### enabled

<MemberInfo kind="property" type={`boolean`}   />


### sku

<MemberInfo kind="property" type={`string`}   />


### listPrice

<MemberInfo kind="property" type={`number`}   />


### listPriceIncludesTax

<MemberInfo kind="property" type={`boolean`}   />


### currencyCode

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>`}   />


### price

<MemberInfo kind="property" type={`number`}   />


### priceWithTax

<MemberInfo kind="property" type={`number`}   />


### taxRateApplied

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>`}   />


### featuredAsset

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>`}   />


### assets

<MemberInfo kind="property" type={`ProductVariantAsset[]`}   />


### taxCategory

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>`}   />


### productVariantPrices

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>[]`}   />


### translations

<MemberInfo kind="property" type={`Array&#60;Translation&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;`}   />


### product

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product#product'>Product</a>`}   />


### productId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### outOfStockThreshold

<MemberInfo kind="property" type={`number`}   />

Specifies the value of stockOnHand at which the ProductVariant is considered
out of stock.
### useGlobalOutOfStockThreshold

<MemberInfo kind="property" type={`boolean`}   />

When true, the `outOfStockThreshold` value will be taken from the GlobalSettings and the
value set on this ProductVariant will be ignored.
### trackInventory

<MemberInfo kind="property" type={`GlobalFlag`}   />


### stockLevels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/stock-level#stocklevel'>StockLevel</a>[]`}   />


### stockMovements

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a>[]`}   />


### options

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-option#productoption'>ProductOption</a>[]`}   />


### facetValues

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>[]`}   />


### customFields

<MemberInfo kind="property" type={`CustomProductVariantFields`}   />


### collections

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/collection#collection'>Collection</a>[]`}   />


### channels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />


### lines

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>[]`}   />




</div>
