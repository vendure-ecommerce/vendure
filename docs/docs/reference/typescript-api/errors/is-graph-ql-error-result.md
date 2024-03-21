---
title: "IsGraphQlErrorResult"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## isGraphQlErrorResult

<GenerationInfo sourceFile="packages/core/src/common/error/error-result.ts" sourceLine="71" packageName="@vendure/core" />

Returns true if the <a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a> is actually an ErrorResult type. This is useful when dealing with
certain internal service method that return an ErrorResultUnion.

*Example*

```ts
import { isGraphQlErrorResult } from '@vendure/core';

// ...

const transitionResult = await this.orderService.transitionToState(ctx, order.id, newState);
if (isGraphQlErrorResult(transitionResult)) {
    // The transition failed with an ErrorResult
    throw transitionResult;
} else {
    // TypeScript will correctly infer the type of `transitionResult` to be `Order`
    return transitionResult;
}
```

```ts title="Signature"
function isGraphQlErrorResult<T extends GraphQLErrorResult | U, U = any>(input: T): input is JustErrorResults<T>
```
Parameters

### input

<MemberInfo kind="parameter" type={`T`} />

