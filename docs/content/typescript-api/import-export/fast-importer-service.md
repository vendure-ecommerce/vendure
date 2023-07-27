---
title: "FastImporterService"
weight: 10
date: 2023-07-14T16:57:49.812Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# FastImporterService
<div class="symbol">


# FastImporterService

{{< generation-info sourceFile="packages/core/src/data-import/providers/importer/fast-importer.service.ts" sourceLine="40" packageName="@vendure/core">}}

A service to import entities into the database. This replaces the regular `create` methods of the service layer with faster
versions which skip much of the defensive checks and other DB calls which are not needed when running an import. It also
does not publish any events, so e.g. will not trigger search index jobs.

In testing, the use of the FastImporterService approximately doubled the speed of bulk imports.

## Signature

```TypeScript
class FastImporterService {
  async initialize(channel?: Channel) => ;
  async createProduct(input: CreateProductInput) => Promise<ID>;
  async createProductOptionGroup(input: CreateProductOptionGroupInput) => Promise<ID>;
  async createProductOption(input: CreateProductOptionInput) => Promise<ID>;
  async addOptionGroupToProduct(productId: ID, optionGroupId: ID) => ;
  async createProductVariant(input: CreateProductVariantInput) => Promise<ID>;
}
```
## Members

### initialize

{{< member-info kind="method" type="(channel?: <a href='/typescript-api/entities/channel#channel'>Channel</a>) => "  >}}

{{< member-description >}}This should be called prior to any of the import methods, as it establishes the
default Channel as well as the context in which the new entities will be created.

Passing a `channel` argument means that Products and ProductVariants will be assigned
to that Channel.{{< /member-description >}}

### createProduct

{{< member-info kind="method" type="(input: CreateProductInput) => Promise&#60;<a href='/typescript-api/common/id#id'>ID</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### createProductOptionGroup

{{< member-info kind="method" type="(input: CreateProductOptionGroupInput) => Promise&#60;<a href='/typescript-api/common/id#id'>ID</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### createProductOption

{{< member-info kind="method" type="(input: CreateProductOptionInput) => Promise&#60;<a href='/typescript-api/common/id#id'>ID</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### addOptionGroupToProduct

{{< member-info kind="method" type="(productId: <a href='/typescript-api/common/id#id'>ID</a>, optionGroupId: <a href='/typescript-api/common/id#id'>ID</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### createProductVariant

{{< member-info kind="method" type="(input: CreateProductVariantInput) => Promise&#60;<a href='/typescript-api/common/id#id'>ID</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
