---
title: "Error Handling"
showtoc: true
---

# Error Handling

Errors in Vendure can be divided into two categories:

* Unexpected errors
* Expected errors

These two types have different meanings and are handled differently to one another.

## Unexpected Errors

This type of error occurs when something goes unexpectedly wrong during the processing of a request. Examples include internal server errors, database connectivity issues, lacking permissions for a resource, etc. In short, these are errors that are *not supposed to happen*.

Internally, these situations are handled by throwing an Error:

```TypeScript
const customer = await this.findOneByUserId(ctx, user.id);
// in this case, the customer *should always* be found, and if
// not then something unknown has gone wrong...
if (!customer) {
    throw new InternalServerError('error.cannot-locate-customer-for-user');
}
```

In the GraphQL APIs, these errors are returned in the standard `errors` array:

```JSON
{
  "errors": [
    {
      "message": "You are not currently authorized to perform this action",
      "locations": [
        {
          "line": 2,
          "column": 2
        }
      ],
      "path": [
        "me"
      ],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": {
    "me": null
  }
}
```
So your client applications need a generic way of detecting and handling this kind of error. For example, many http client libraries support "response interceptors" which can be used to intercept all API responses and check the `errors` array. 

## Expected errors (ErrorResults)

This type of error represents a well-defined result of (typically) a GraphQL mutation which is not considered "successful". For example, when using the `applyCouponCode` mutation, the code may be invalid, or it may have expired. These are examples of "expected" errors and are named in Vendure "ErrorResults". These ErrorResults are encoded into the GraphQL schema itself.

ErrorResults all implement the `ErrorResult` interface:

```GraphQL
interface ErrorResult {
  errorCode: ErrorCode!
  message: String!
}
```

Some ErrorResults add other relevant fields to the type:

```GraphQL
"Returned if there is an error in transitioning the Order state"
type OrderStateTransitionError implements ErrorResult {
  errorCode: ErrorCode!
  message: String!
  transitionError: String!
  fromState: String!
  toState: String!
}
```

Operations which may return ErrorResults use a GraphQL `union` as their return type:

```GraphQL
type Mutation {
  "Applies the given coupon code to the active Order"
  applyCouponCode(couponCode: String!): ApplyCouponCodeResult!
}

union ApplyCouponCodeResult = Order 
  | CouponCodeExpiredError 
  | CouponCodeInvalidError 
  | CouponCodeLimitError
``` 

### Querying an ErrorResult union

When performing an operation of a query or mutation which returns a union, you will need to use the [GraphQL conditional fragment](https://graphql.org/learn/schema/#union-types) to select the desired fields:

```GraphQL
mutation ApplyCoupon($code: String!) {
  applyCouponCode(couponCode: $code) {
    ...on Order {
      id
      couponCodes
      total
    }
    # querying the ErrorResult fields
    # "catches" all possible errors
    ...on ErrorResult {
      errorCode
      message
    }
    # you can also specify particular fields
    # if your client app needs that specific data
    # as part of handling the error.
    ...on CouponCodeLimitError {
      limit
    }
  }
}
```

This ensures that your client code is aware of and handles all the usual error cases.

You can see all the ErrorResult types returned by the Shop API mutations in the [Shop API Mutations docs]({{< relref "/docs/graphql-api/shop/mutations" >}}). 
