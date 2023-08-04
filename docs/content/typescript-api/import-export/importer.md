---
title: "Importer"
weight: 10
date: 2023-07-14T16:57:49.816Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Importer
<div class="symbol">


# Importer

{{< generation-info sourceFile="packages/core/src/data-import/providers/importer/importer.ts" sourceLine="41" packageName="@vendure/core">}}

Parses and imports Products using the CSV import format.

Internally it is using the <a href='/typescript-api/import-export/import-parser#importparser'>ImportParser</a> to parse the CSV file, and then the
<a href='/typescript-api/import-export/fast-importer-service#fastimporterservice'>FastImporterService</a> and the <a href='/typescript-api/import-export/asset-importer#assetimporter'>AssetImporter</a> to actually create the resulting
entities in the Vendure database.

## Signature

```TypeScript
class Importer {
  parseAndImport(input: string | Stream, ctxOrLanguageCode: RequestContext | LanguageCode, reportProgress: boolean = false) => Observable<ImportProgress>;
  async importProducts(ctx: RequestContext, rows: ParsedProductWithVariants[], onProgress: OnProgressFn) => Promise<string[]>;
}
```
## Members

### parseAndImport

{{< member-info kind="method" type="(input: string | Stream, ctxOrLanguageCode: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a> | <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>, reportProgress: boolean = false) => Observable&#60;ImportProgress&#62;"  >}}

{{< member-description >}}Parses the contents of the [product import CSV file](/docs/developer-guide/importing-product-data/#product-import-format) and imports
the resulting Product & ProductVariants, as well as any associated Assets, Facets & FacetValues.

The `ctxOrLanguageCode` argument is used to specify the languageCode to be used when creating the Products.{{< /member-description >}}

### importProducts

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, rows: <a href='/typescript-api/import-export/import-parser#parsedproductwithvariants'>ParsedProductWithVariants</a>[], onProgress: OnProgressFn) => Promise&#60;string[]&#62;"  >}}

{{< member-description >}}Imports the products specified in the rows object. Return an array of error messages.{{< /member-description >}}


</div>
