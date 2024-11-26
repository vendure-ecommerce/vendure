---
title: "ImportParser"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ImportParser

<GenerationInfo sourceFile="packages/core/src/data-import/providers/import-parser/import-parser.ts" sourceLine="152" packageName="@vendure/core" />

Validates and parses CSV files into a data structure which can then be used to created new entities.
This is used internally by the <a href='/reference/typescript-api/import-export/importer#importer'>Importer</a>.

```ts title="Signature"
class ImportParser {
    parseProducts(input: string | Stream, mainLanguage: LanguageCode = this.configService.defaultLanguageCode) => Promise<ParseResult<ParsedProductWithVariants>>;
}
```

<div className="members-wrapper">

### parseProducts

<MemberInfo kind="method" type={`(input: string | Stream, mainLanguage: <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a> = this.configService.defaultLanguageCode) => Promise&#60;<a href='/reference/typescript-api/import-export/import-parser#parseresult'>ParseResult</a>&#60;<a href='/reference/typescript-api/import-export/import-parser#parsedproductwithvariants'>ParsedProductWithVariants</a>&#62;&#62;`}   />

Parses the contents of the [product import CSV file](/guides/developer-guide/importing-data/#product-import-format) and
returns a data structure which can then be used to populate Vendure using the <a href='/reference/typescript-api/import-export/fast-importer-service#fastimporterservice'>FastImporterService</a>.


</div>


## ParsedOptionGroup

<GenerationInfo sourceFile="packages/core/src/data-import/providers/import-parser/import-parser.ts" sourceLine="45" packageName="@vendure/core" />

The intermediate representation of an OptionGroup after it has been parsed
by the <a href='/reference/typescript-api/import-export/import-parser#importparser'>ImportParser</a>.

```ts title="Signature"
interface ParsedOptionGroup {
    translations: Array<{
        languageCode: LanguageCode;
        name: string;
        values: string[];
    }>;
}
```

<div className="members-wrapper">

### translations

<MemberInfo kind="property" type={`Array&#60;{         languageCode: <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>;         name: string;         values: string[];     }&#62;`}   />




</div>


## ParsedFacet

<GenerationInfo sourceFile="packages/core/src/data-import/providers/import-parser/import-parser.ts" sourceLine="61" packageName="@vendure/core" />

The intermediate representation of a Facet after it has been parsed
by the <a href='/reference/typescript-api/import-export/import-parser#importparser'>ImportParser</a>.

```ts title="Signature"
interface ParsedFacet {
    translations: Array<{
        languageCode: LanguageCode;
        facet: string;
        value: string;
    }>;
}
```

<div className="members-wrapper">

### translations

<MemberInfo kind="property" type={`Array&#60;{         languageCode: <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>;         facet: string;         value: string;     }&#62;`}   />




</div>


## ParsedProductVariant

<GenerationInfo sourceFile="packages/core/src/data-import/providers/import-parser/import-parser.ts" sourceLine="77" packageName="@vendure/core" />

The intermediate representation of a ProductVariant after it has been parsed
by the <a href='/reference/typescript-api/import-export/import-parser#importparser'>ImportParser</a>.

```ts title="Signature"
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

<div className="members-wrapper">

### sku

<MemberInfo kind="property" type={`string`}   />


### price

<MemberInfo kind="property" type={`number`}   />


### taxCategory

<MemberInfo kind="property" type={`string`}   />


### stockOnHand

<MemberInfo kind="property" type={`number`}   />


### trackInventory

<MemberInfo kind="property" type={`GlobalFlag`}   />


### assetPaths

<MemberInfo kind="property" type={`string[]`}   />


### facets

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/import-export/import-parser#parsedfacet'>ParsedFacet</a>[]`}   />


### translations

<MemberInfo kind="property" type={`Array&#60;{         languageCode: <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>;         optionValues: string[];         customFields: {             [name: string]: string;         };     }&#62;`}   />




</div>


## ParsedProduct

<GenerationInfo sourceFile="packages/core/src/data-import/providers/import-parser/import-parser.ts" sourceLine="102" packageName="@vendure/core" />

The intermediate representation of a Product after it has been parsed
by the <a href='/reference/typescript-api/import-export/import-parser#importparser'>ImportParser</a>.

```ts title="Signature"
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

<div className="members-wrapper">

### assetPaths

<MemberInfo kind="property" type={`string[]`}   />


### optionGroups

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/import-export/import-parser#parsedoptiongroup'>ParsedOptionGroup</a>[]`}   />


### facets

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/import-export/import-parser#parsedfacet'>ParsedFacet</a>[]`}   />


### translations

<MemberInfo kind="property" type={`Array&#60;{         languageCode: <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>;         name: string;         slug: string;         description: string;         customFields: {             [name: string]: string;         };     }&#62;`}   />




</div>


## ParsedProductWithVariants

<GenerationInfo sourceFile="packages/core/src/data-import/providers/import-parser/import-parser.ts" sourceLine="125" packageName="@vendure/core" />

The data structure into which an import CSV file is parsed by the
<a href='/reference/typescript-api/import-export/import-parser#importparser'>ImportParser</a> `parseProducts()` method.

```ts title="Signature"
interface ParsedProductWithVariants {
    product: ParsedProduct;
    variants: ParsedProductVariant[];
}
```

<div className="members-wrapper">

### product

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/import-export/import-parser#parsedproduct'>ParsedProduct</a>`}   />


### variants

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/import-export/import-parser#parsedproductvariant'>ParsedProductVariant</a>[]`}   />




</div>


## ParseResult

<GenerationInfo sourceFile="packages/core/src/data-import/providers/import-parser/import-parser.ts" sourceLine="137" packageName="@vendure/core" />

The result returned by the <a href='/reference/typescript-api/import-export/import-parser#importparser'>ImportParser</a> `parseProducts()` method.

```ts title="Signature"
interface ParseResult<T> {
    results: T[];
    errors: string[];
    processed: number;
}
```

<div className="members-wrapper">

### results

<MemberInfo kind="property" type={`T[]`}   />


### errors

<MemberInfo kind="property" type={`string[]`}   />


### processed

<MemberInfo kind="property" type={`number`}   />




</div>
