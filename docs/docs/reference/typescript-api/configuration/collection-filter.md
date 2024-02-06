---
title: "CollectionFilter"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CollectionFilter

<GenerationInfo sourceFile="packages/core/src/config/catalog/collection-filter.ts" sourceLine="64" packageName="@vendure/core" />

A CollectionFilter defines a rule which can be used to associate ProductVariants with a Collection.
The filtering is done by defining the `apply()` function, which receives a TypeORM
[`QueryBuilder`](https://typeorm.io/#/select-query-builder) object to which clauses may be added.

Creating a CollectionFilter is considered an advanced Vendure topic. For more insight into how
they work, study the [default collection filters](https://github.com/vendure-ecommerce/vendure/blob/master/packages/core/src/config/catalog/default-collection-filters.ts)

Here's a simple example of a custom CollectionFilter:

*Example*

```ts
import { CollectionFilter, LanguageCode } from '@vendure/core';

export const skuCollectionFilter = new CollectionFilter({
  args: {
    // The `args` object defines the user-configurable arguments
    // which will get passed to the filter's `apply()` function.
    sku: {
      type: 'string',
      label: [{ languageCode: LanguageCode.en, value: 'SKU' }],
      description: [
        {
          languageCode: LanguageCode.en,
          value: 'Matches any product variants with SKUs containing this value',
        },
      ],
    },
  },
  code: 'variant-sku-filter',
  description: [{ languageCode: LanguageCode.en, value: 'Filter by matching SKU' }],

  // This is the function that defines the logic of the filter.
  apply: (qb, args) => {
    const LIKE = qb.connection.options.type === 'postgres' ? 'ILIKE' : 'LIKE';
    return qb.andWhere(`productVariant.sku ${LIKE} :sku`, { sku: `%${args.sku}%` });
  },
});
```

```ts title="Signature"
class CollectionFilter<T extends ConfigArgs = ConfigArgs> extends ConfigurableOperationDef<T> {
    constructor(config: CollectionFilterConfig<T>)
    apply(qb: SelectQueryBuilder<ProductVariant>, args: ConfigArg[]) => SelectQueryBuilder<ProductVariant>;
}
```
* Extends: <code><a href='/reference/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>&#60;T&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(config: CollectionFilterConfig&#60;T&#62;) => CollectionFilter`}   />


### apply

<MemberInfo kind="method" type={`(qb: SelectQueryBuilder&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;, args: ConfigArg[]) => SelectQueryBuilder&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;`}   />




</div>
