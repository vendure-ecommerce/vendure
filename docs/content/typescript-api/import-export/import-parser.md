---
title: "ImportParser"
weight: 10
date: 2023-07-14T16:57:49.802Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ImportParser
<div class="symbol">


# ImportParser

{{< generation-info sourceFile="packages/core/src/data-import/providers/import-parser/import-parser.ts" sourceLine="152" packageName="@vendure/core">}}

Validates and parses CSV files into a data structure which can then be used to created new entities.
This is used internally by the <a href='/typescript-api/import-export/importer#importer'>Importer</a>.

## Signature

```TypeScript
class ImportParser {
  async parseProducts(input: string | Stream, mainLanguage: LanguageCode = this.configService.defaultLanguageCode) => Promise<ParseResult<ParsedProductWithVariants>>;
}
```
## Members

### parseProducts

{{< member-info kind="method" type="(input: string | Stream, mainLanguage: <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a> = this.configService.defaultLanguageCode) => Promise&#60;<a href='/typescript-api/import-export/import-parser#parseresult'>ParseResult</a>&#60;<a href='/typescript-api/import-export/import-parser#parsedproductwithvariants'>ParsedProductWithVariants</a>&#62;&#62;"  >}}

{{< member-description >}}Parses the contents of the [product import CSV file](/docs/developer-guide/importing-product-data/#product-import-format) and
returns a data structure which can then be used to populate Vendure using the <a href='/typescript-api/import-export/fast-importer-service#fastimporterservice'>FastImporterService</a>.{{< /member-description >}}


</div>
<div class="symbol">


# ParsedOptionGroup

{{< generation-info sourceFile="packages/core/src/data-import/providers/import-parser/import-parser.ts" sourceLine="45" packageName="@vendure/core">}}

The intermediate representation of an OptionGroup after it has been parsed
by the <a href='/typescript-api/import-export/import-parser#importparser'>ImportParser</a>.

## Signature

```TypeScript
interface ParsedOptionGroup {
  translations: Array<{
        languageCode: LanguageCode;
        name: string;
        values: string[];
    }>;
}
```
## Members

### translations

{{< member-info kind="property" type="Array&#60;{         languageCode: <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>;         name: string;         values: string[];     }&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ParsedFacet

{{< generation-info sourceFile="packages/core/src/data-import/providers/import-parser/import-parser.ts" sourceLine="61" packageName="@vendure/core">}}

The intermediate representation of a Facet after it has been parsed
by the <a href='/typescript-api/import-export/import-parser#importparser'>ImportParser</a>.

## Signature

```TypeScript
interface ParsedFacet {
  translations: Array<{
        languageCode: LanguageCode;
        facet: string;
        value: string;
    }>;
}
```
## Members

### translations

{{< member-info kind="property" type="Array&#60;{         languageCode: <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>;         facet: string;         value: string;     }&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ParsedProductVariant

{{< generation-info sourceFile="packages/core/src/data-import/providers/import-parser/import-parser.ts" sourceLine="77" packageName="@vendure/core">}}

The intermediate representation of a ProductVariant after it has been parsed
by the <a href='/typescript-api/import-export/import-parser#importparser'>ImportParser</a>.

## Signature

```TypeScript
interface ParsedProductVariant {
  sku: string;
  price: number;
  taxCategory: string;
  stockOnHand: number;
  trackInventory: GlobalFlag;
  assetPaths: string[];
  facets: ParsedFacet[];
  translations: Array<{
        languageCode: LanguageCode;
        optionValues: string[];
        customFields: {
            [name: string]: string;
        };
    }>;
}
```
## Members

### sku

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### price

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### taxCategory

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### stockOnHand

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### trackInventory

{{< member-info kind="property" type="GlobalFlag"  >}}

{{< member-description >}}{{< /member-description >}}

### assetPaths

{{< member-info kind="property" type="string[]"  >}}

{{< member-description >}}{{< /member-description >}}

### facets

{{< member-info kind="property" type="<a href='/typescript-api/import-export/import-parser#parsedfacet'>ParsedFacet</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### translations

{{< member-info kind="property" type="Array&#60;{         languageCode: <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>;         optionValues: string[];         customFields: {             [name: string]: string;         };     }&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ParsedProduct

{{< generation-info sourceFile="packages/core/src/data-import/providers/import-parser/import-parser.ts" sourceLine="102" packageName="@vendure/core">}}

The intermediate representation of a Product after it has been parsed
by the <a href='/typescript-api/import-export/import-parser#importparser'>ImportParser</a>.

## Signature

```TypeScript
interface ParsedProduct {
  assetPaths: string[];
  optionGroups: ParsedOptionGroup[];
  facets: ParsedFacet[];
  translations: Array<{
        languageCode: LanguageCode;
        name: string;
        slug: string;
        description: string;
        customFields: {
            [name: string]: string;
        };
    }>;
}
```
## Members

### assetPaths

{{< member-info kind="property" type="string[]"  >}}

{{< member-description >}}{{< /member-description >}}

### optionGroups

{{< member-info kind="property" type="<a href='/typescript-api/import-export/import-parser#parsedoptiongroup'>ParsedOptionGroup</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### facets

{{< member-info kind="property" type="<a href='/typescript-api/import-export/import-parser#parsedfacet'>ParsedFacet</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### translations

{{< member-info kind="property" type="Array&#60;{         languageCode: <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>;         name: string;         slug: string;         description: string;         customFields: {             [name: string]: string;         };     }&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ParsedProductWithVariants

{{< generation-info sourceFile="packages/core/src/data-import/providers/import-parser/import-parser.ts" sourceLine="125" packageName="@vendure/core">}}

The data structure into which an import CSV file is parsed by the
<a href='/typescript-api/import-export/import-parser#importparser'>ImportParser</a> `parseProducts()` method.

## Signature

```TypeScript
interface ParsedProductWithVariants {
  product: ParsedProduct;
  variants: ParsedProductVariant[];
}
```
## Members

### product

{{< member-info kind="property" type="<a href='/typescript-api/import-export/import-parser#parsedproduct'>ParsedProduct</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### variants

{{< member-info kind="property" type="<a href='/typescript-api/import-export/import-parser#parsedproductvariant'>ParsedProductVariant</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ParseResult

{{< generation-info sourceFile="packages/core/src/data-import/providers/import-parser/import-parser.ts" sourceLine="137" packageName="@vendure/core">}}

The result returned by the <a href='/typescript-api/import-export/import-parser#importparser'>ImportParser</a> `parseProducts()` method.

## Signature

```TypeScript
interface ParseResult<T> {
  results: T[];
  errors: string[];
  processed: number;
}
```
## Members

### results

{{< member-info kind="property" type="T[]"  >}}

{{< member-description >}}{{< /member-description >}}

### errors

{{< member-info kind="property" type="string[]"  >}}

{{< member-description >}}{{< /member-description >}}

### processed

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
