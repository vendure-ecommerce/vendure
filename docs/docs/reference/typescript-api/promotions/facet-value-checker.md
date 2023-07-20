---
title: "FacetValueChecker"
weight: 10
date: 2023-07-20T13:56:14.714Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FacetValueChecker

<GenerationInfo sourceFile="packages/core/src/config/promotion/utils/facet-value-checker.ts" sourceLine="48" packageName="@vendure/core" />

The FacetValueChecker is a helper class used to determine whether a given OrderLine consists
of ProductVariants containing the given FacetValues.

*Example*

```TypeScript
import { FacetValueChecker, LanguageCode, PromotionCondition, TransactionalConnection } from '@vendure/core';

let facetValueChecker: FacetValueChecker;

export const hasFacetValues = new PromotionCondition({
  code: 'at_least_n_with_facets',
  description: [
    { languageCode: LanguageCode.en, value: 'Buy at least { minimum } products with the given facets' },
  ],
  args: {
    minimum: { type: 'int' },
    facets: { type: 'ID', list: true, ui: { component: 'facet-value-form-input' } },
  },
  init(injector) {
    facetValueChecker = new FacetValueChecker(injector.get(TransactionalConnection));
  },
  async check(ctx, order, args) {
    let matches = 0;
    for (const line of order.lines) {
      if (await facetValueChecker.hasFacetValues(line, args.facets)) {
          matches += line.quantity;
      }
    }
    return args.minimum <= matches;
  },
});
```

```ts title="Signature"
class FacetValueChecker {
  constructor(connection: TransactionalConnection)
  async hasFacetValues(orderLine: OrderLine, facetValueIds: ID[], ctx?: RequestContext) => Promise<boolean>;
}
```

### constructor

<MemberInfo kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>) => FacetValueChecker"   />


### hasFacetValues

<MemberInfo kind="method" type="(orderLine: <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>, facetValueIds: <a href='/typescript-api/common/id#id'>ID</a>[], ctx?: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;boolean&#62;"   />

Checks a given <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a> against the facetValueIds and returns
`true` if the associated <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> & <a href='/typescript-api/entities/product#product'>Product</a> together
have *all* the specified <a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>s.
