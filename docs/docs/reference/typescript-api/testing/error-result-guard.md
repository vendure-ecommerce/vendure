---
title: "ErrorResultGuard"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ErrorResultGuard

<GenerationInfo sourceFile="packages/testing/src/error-result-guard.ts" sourceLine="50" packageName="@vendure/testing" />

A utility class which is used to assert the success of an operation
which returns a union type of `SuccessType | ErrorResponse [ | ErrorResponse ]`.
The methods of this class are used to:
1. assert that the result is a success or error case
2. narrow the type so that TypeScript can correctly infer the properties of the result.

*Example*

```ts
const orderResultGuard: ErrorResultGuard<AddItemToOrderResult>
  = createErrorResultGuard(order => !!order.lines);

it('errors when quantity is negative', async () => {
   const { addItemToOrder } = await shopClient.query<AddItemToOrder.Query, AddItemToOrder.Mutation>(ADD_ITEM_TO_ORDER, {
     productVariantId: 42, quantity: -1,
   });

   // The test will fail
   orderResultGuard.assertErrorResult(addItemToOrder);

   // the type of `addItemToOrder` has now been
   // narrowed to only include the ErrorResult types.
   expect(addItemToOrder.errorCode).toBe(ErrorCode.NegativeQuantityError);
}
```

```ts title="Signature"
class ErrorResultGuard<T> {
    constructor(testFn: (input: T) => boolean)
    isSuccess(input: T | any) => input is T;
    assertSuccess(input: T | R) => asserts input is T;
    assertErrorResult(input: T | R) => asserts input is R;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(testFn: (input: T) =&#62; boolean) => ErrorResultGuard`}   />


### isSuccess

<MemberInfo kind="method" type={`(input: T | any) => input is T`}   />

A type guard which returns `true` if the input passes the `testFn` predicate.
### assertSuccess

<MemberInfo kind="method" type={`(input: T | R) => asserts input is T`}   />

Asserts (using the testing library's `fail()` function) that the input is
successful, i.e. it passes the `testFn`.
### assertErrorResult

<MemberInfo kind="method" type={`(input: T | R) => asserts input is R`}   />

Asserts (using the testing library's `fail()` function) that the input is
not successful, i.e. it does not pass the `testFn`.


</div>
