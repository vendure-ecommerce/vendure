---
title: "Importing Product Data"
showtoc: true
---

# Importing Product Data

If you have hundreds, thousands or more products, inputting all the data by hand via the Admin UI can be too inefficient. To solve this, Vendure supports bulk-importing product and other data.

Data import is also useful for setting up test or demo environments, and is also used by the `@vendure/testing` package for end-to-end tests.

## Product Import Format

Vendure uses a flat **.csv** format for importing product data. The format encodes data about:

* products
* product variants
* product & variant assets
* product & variant facets
* product & variant custom fields

Here's an example which defines 2 products, "Laptop" and "Clacky Keyboard". The laptop has 4 variants, and the keyboard only a single variant. 

```csv
name            , slug            , description               , assets                      , facets                              , optionGroups    , optionValues , sku         , price   , taxCategory , stockOnHand , trackInventory , variantAssets , variantFacets
Laptop          , laptop          , "Description of laptop"   , laptop_01.jpg|laptop_02.jpg , category:electronics|brand:Apple    , screen size|RAM , 13 inch|8GB  , L2201308    , 1299.00 , standard    , 100         , false          ,               , 
                ,                 ,                           ,                             ,                                     ,                 , 15 inch|8GB  , L2201508    , 1399.00 , standard    , 100         , false          ,               , 
                ,                 ,                           ,                             ,                                     ,                 , 13 inch|16GB , L2201316    , 2199.00 , standard    , 100         , false          ,               , 
                ,                 ,                           ,                             ,                                     ,                 , 15 inch|16GB , L2201516    , 2299.00 , standard    , 100         , false          ,               , 
Clacky Keyboard , clacky-keyboard , "Description of keyboard" , keyboard_01.jpg             , category:electronics|brand:Logitech ,                 ,              , A4TKLA45535 , 74.89   , standard    , 100         , false          ,               ,
```

Here's an explanation of each column:

* `name`: The name of the product. Rows with an empty "name" are interpreted as variants of the preceeding product row.
* `slug`: The product's slug. Can be omitted, in which case will be generated from the name.
* `description`: The product description.
* `assets`: One or more asset file names separated by the pipe (`|`) character. The files must be located on the local file system, and the path is interpreted as being relative to the [`importAssetsDir`]({{< relref "/docs/typescript-api/import-export/import-export-options" >}}#importassetsdir) as defined in the VendureConfig. The first asset will be set as the featuredAsset.
* `facets`: One or more facets to apply to the product separated by the pipe (`|`) character. A facet has the format `<facet-name>:<facet-value>`.
* `optionGroups`: OptionGroups define what variants make up the product. Applies only to products with more than one variant. 
* `optionValues`: For each optionGroup defined, a corresponding value must be specified for each variant. Applies only to products with more than one variant.
* `sku`: The Stock Keeping Unit (unique product code) for this product variant.
* `price`: The price can be either with or without taxes, depending on your channel settings (can be set later).
* `taxCategory`: The name of an existing tax category. Tax categories can be also be imported using the InitialData object.
* `stockOnHand`: The number of units in stock.
* `trackInventory`: Whether this variant should have its stock level tracked, i.e. the stock level is automatically decreased for each unit ordered.
* `variantAssets`: Same as `assets` but applied to the product variant.
* `variantFacets`: Same as `facets` but applied to the product variant.

### Importing Custom Field Data

If you have [CustomFields]({{< relref "customizing-models" >}}) defined on your Product or ProductVariant entities, this data can also be encoded in the import csv:

* `product:<customFieldName>`: The value of this column will populate `Product.customFields[customFieldName]`. 
* `variant:<customFieldName>`: The value of this column will populate `ProductVariant.customFields[customFieldName]`. 

{{< alert "primary" >}}
  For a real example, see the [products.csv file used to populate the Vendure demo data](https://github.com/vendure-ecommerce/vendure/blob/master/packages/core/mock-data/data-sources/products.csv)
{{< /alert >}}

#### Importing `relation` custom fields

To import custom fields with the type `relation`, the value in the CSV must be a stringified object with an `id` property:

```csv
... ,product:featuredReview
... ,"{ ""id"": 123 }"
```

#### Importing `list` custom fields

To import custom fields with `list` set to `true`, the data should be separated with a pipe (`|`) character:

```csv
... ,product:keywords
... ,tablet|pad|android
```

## Initial Data

As well as product data, other initialization data can be populated using the [`InitialData` object]({{< relref "initial-data" >}}). **This format is intentionally limited**; more advanced requirements (e.g. setting up ShippingMethods that use custom checkers & calculators) should be carried out via scripts which interact with the [Admin GraphQL API]({{< relref "/docs/graphql-api/admin" >}}).

```TypeScript
import { InitialData, LanguageCode } from '@vendure/core';

export const initialData: InitialData = {
    defaultLanguage: LanguageCode.en,
    countries: [
        { name: 'Austria', code: 'AT', zone: 'Europe' },
        { name: 'Malaysia', code: 'MY', zone: 'Asia' },
        { name: 'United Kingdom', code: 'GB', zone: 'Europe' },
    ],
    defaultZone: 'Europe',
    taxRates: [
        { name: 'Standard Tax', percentage: 20 },
        { name: 'Reduced Tax', percentage: 10 },
        { name: 'Zero Tax', percentage: 0 },
    ],
    shippingMethods: [{ name: 'Standard Shipping', price: 500 }, { name: 'Express Shipping', price: 1000 }],
    collections: [
        {
            name: 'Electronics',
            filters: [
                {
                    code: 'facet-value-filter',
                    args: { facetValueNames: ['Electronics'], containsAny: false },
                },
            ],
            assetPaths: ['jakob-owens-274337-unsplash.jpg'],
        },
    ],
};
```

* `defaultLanguage`: Sets the language which will be used for all translatable entities created by the initial data e.g. Products, ProductVariants, Collections etc. Should correspond to the language used in your product csv file.
* `countries`: Defines which countries are available.
  * `name`: The name of the country in the language specified by `defaultLanguage`
  * `code`: A standardized code for the country, e.g. [ISO 3166-1](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes)
  * `zone`: A [Zone]({{< relref "zone" >}}) to which this country belongs.
* `defaultZone`: Sets the default shipping & tax zone for the default Channel. The zone must correspond to a value of `zone` set in the `countries` array. 
* `taxRates`: For each item, a new [TaxCategory]({{< relref "tax-category" >}}) is created, and then a [TaxRate]({{< relref "tax-rate" >}}) is created for each unique zone defined in the `countries` array. 
* `shippingMethods`: Allows simple flat-rate [ShippingMethods]({{< relref "shipping-method" >}}) to be defined.
* `collections`: Allows Collections to be created. Currently, only collections based on facet values can be created (`code: 'facet-value-filter'`). The `assetPaths` and `facetValueNames` value must correspond to a values specified in the products csv file. The name should match the value specified in the product csv file (or can be a normalized - lower-case & hyphenated - version thereof). If there are FacetValues in multiple Facets with the same name, the facet may be specified with a colon delimiter, e.g. `brand:apple`, `flavour: apple`.

## Populating The Server

The `@vendure/core` package exposes a [`populate()` function]({{< relref "populate" >}}) which can be used along with the data formats described above to populate your Vendure server:

```TypeScript
// populate-server.ts
import { bootstrap } from '@vendure/core';
import { populate } from '@vendure/core/cli';

import { config } from './vendure-config.ts';
import { initialData } from './my-initial-data.ts';

const productsCsvFile = path.join(__dirname, 'path/to/products.csv')

populate(
  () => bootstrap(config),
  initialData,
  productsCsvFile,
)
.then(app => {
  return app.close();
})
.then(
  () => process.exit(0),
  err => {
    console.log(err);
    process.exit(1);
  },
);
```
