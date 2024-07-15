---
title: "ErrorResultUnion"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ErrorResultUnion

<GenerationInfo sourceFile="packages/core/src/common/error/error-result.ts" sourceLine="44" packageName="@vendure/core" />

Used to construct a TypeScript return type for a query or mutation which, in the GraphQL schema,
returns a union type composed of a success result (e.g. Order) plus one or more ErrorResult
types.

Since the TypeScript entities do not correspond 1-to-1 with their GraphQL type counterparts,
we use this type to substitute them.

*Example*

```ts
type UpdateOrderItemsResult = Order | OrderModificationError | OrderLimitError | NegativeQuantityError;
type T1 = ErrorResultUnion<UpdateOrderItemsResult, VendureEntityOrder>;
// T1 = VendureEntityOrder | OrderModificationError | OrderLimitError | NegativeQuantityError;
```

```ts title="Signature"
type ErrorResultUnion<T extends GraphQLErrorResult | U, E extends VendureEntity, U = any> = | JustErrorResults<T>
    | E
```
