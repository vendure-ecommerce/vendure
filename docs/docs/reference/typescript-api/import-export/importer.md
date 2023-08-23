---
title: "Importer"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Importer

<GenerationInfo sourceFile="packages/core/src/data-import/providers/importer/importer.ts" sourceLine="41" packageName="@vendure/core" />

Parses and imports Products using the CSV import format.

Internally it is using the <a href='/reference/typescript-api/import-export/import-parser#importparser'>ImportParser</a> to parse the CSV file, and then the
<a href='/reference/typescript-api/import-export/fast-importer-service#fastimporterservice'>FastImporterService</a> and the <a href='/reference/typescript-api/import-export/asset-importer#assetimporter'>AssetImporter</a> to actually create the resulting
entities in the Vendure database.

```ts title="Signature"
class Importer {
    parseAndImport(input: string | Stream, ctxOrLanguageCode: RequestContext | LanguageCode, reportProgress: boolean = false) => Observable<ImportProgress>;
    importProducts(ctx: RequestContext, rows: ParsedProductWithVariants[], onProgress: OnProgressFn) => Promise<string[]>;
}
```

<div className="members-wrapper">

### parseAndImport

<MemberInfo kind="method" type={`(input: string | Stream, ctxOrLanguageCode: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> | <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>, reportProgress: boolean = false) => Observable&#60;ImportProgress&#62;`}   />

Parses the contents of the [product import CSV file](/guides/developer-guide/importing-data/#product-import-format) and imports
the resulting Product & ProductVariants, as well as any associated Assets, Facets & FacetValues.

The `ctxOrLanguageCode` argument is used to specify the languageCode to be used when creating the Products.
### importProducts

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, rows: <a href='/reference/typescript-api/import-export/import-parser#parsedproductwithvariants'>ParsedProductWithVariants</a>[], onProgress: OnProgressFn) => Promise&#60;string[]&#62;`}   />

Imports the products specified in the rows object. Return an array of error messages.


</div>
