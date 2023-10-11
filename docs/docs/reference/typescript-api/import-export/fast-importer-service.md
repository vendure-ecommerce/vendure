---
title: "FastImporterService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FastImporterService

<GenerationInfo sourceFile="packages/core/src/data-import/providers/importer/fast-importer.service.ts" sourceLine="40" packageName="@vendure/core" />

A service to import entities into the database. This replaces the regular `create` methods of the service layer with faster
versions which skip much of the defensive checks and other DB calls which are not needed when running an import. It also
does not publish any events, so e.g. will not trigger search index jobs.

In testing, the use of the FastImporterService approximately doubled the speed of bulk imports.

```ts title="Signature"
class FastImporterService {
    initialize(channel?: Channel) => ;
    createProduct(input: CreateProductInput) => Promise<ID>;
    createProductOptionGroup(input: CreateProductOptionGroupInput) => Promise<ID>;
    createProductOption(input: CreateProductOptionInput) => Promise<ID>;
    addOptionGroupToProduct(productId: ID, optionGroupId: ID) => ;
    createProductVariant(input: CreateProductVariantInput) => Promise<ID>;
}
```

<div className="members-wrapper">

### initialize

<MemberInfo kind="method" type={`(channel?: <a href='/reference/typescript-api/entities/channel#channel'>Channel</a>) => `}   />

This should be called prior to any of the import methods, as it establishes the
default Channel as well as the context in which the new entities will be created.

Passing a `channel` argument means that Products and ProductVariants will be assigned
to that Channel.
### createProduct

<MemberInfo kind="method" type={`(input: CreateProductInput) => Promise&#60;<a href='/reference/typescript-api/common/id#id'>ID</a>&#62;`}   />


### createProductOptionGroup

<MemberInfo kind="method" type={`(input: CreateProductOptionGroupInput) => Promise&#60;<a href='/reference/typescript-api/common/id#id'>ID</a>&#62;`}   />


### createProductOption

<MemberInfo kind="method" type={`(input: CreateProductOptionInput) => Promise&#60;<a href='/reference/typescript-api/common/id#id'>ID</a>&#62;`}   />


### addOptionGroupToProduct

<MemberInfo kind="method" type={`(productId: <a href='/reference/typescript-api/common/id#id'>ID</a>, optionGroupId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => `}   />


### createProductVariant

<MemberInfo kind="method" type={`(input: CreateProductVariantInput) => Promise&#60;<a href='/reference/typescript-api/common/id#id'>ID</a>&#62;`}   />




</div>
