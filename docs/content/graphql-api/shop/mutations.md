---
title: "Mutations"
weight: 2
date: 2023-06-07T09:42:13.591Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->


# Mutations

## addItemToOrder
Adds an item to the order. If custom fields are defined on the OrderLine entity, a third argument 'customFields' will be available.

{{% gql-fields %}}
 * addItemToOrder(productVariantId: [ID](/docs/graphql-api/shop/object-types#id)!, quantity: [Int](/docs/graphql-api/shop/object-types#int)!): [UpdateOrderItemsResult](/docs/graphql-api/shop/object-types#updateorderitemsresult)!
{{% /gql-fields %}}



## addPaymentToOrder
Add a Payment to the Order

{{% gql-fields %}}
 * addPaymentToOrder(input: [PaymentInput](/docs/graphql-api/shop/input-types#paymentinput)!): [AddPaymentToOrderResult](/docs/graphql-api/shop/object-types#addpaymenttoorderresult)!
{{% /gql-fields %}}



## adjustOrderLine
Adjusts an OrderLine. If custom fields are defined on the OrderLine entity, a third argument 'customFields' of type `OrderLineCustomFieldsInput` will be available.

{{% gql-fields %}}
 * adjustOrderLine(orderLineId: [ID](/docs/graphql-api/shop/object-types#id)!, quantity: [Int](/docs/graphql-api/shop/object-types#int)!): [UpdateOrderItemsResult](/docs/graphql-api/shop/object-types#updateorderitemsresult)!
{{% /gql-fields %}}



## applyCouponCode
Applies the given coupon code to the active Order

{{% gql-fields %}}
 * applyCouponCode(couponCode: [String](/docs/graphql-api/shop/object-types#string)!): [ApplyCouponCodeResult](/docs/graphql-api/shop/object-types#applycouponcoderesult)!
{{% /gql-fields %}}



## authenticate
Authenticates the user using a named authentication strategy

{{% gql-fields %}}
 * authenticate(input: [AuthenticationInput](/docs/graphql-api/shop/input-types#authenticationinput)!, rememberMe: [Boolean](/docs/graphql-api/shop/object-types#boolean)): [AuthenticationResult](/docs/graphql-api/shop/object-types#authenticationresult)!
{{% /gql-fields %}}



## createCustomerAddress
Create a new Customer Address

{{% gql-fields %}}
 * createCustomerAddress(input: [CreateAddressInput](/docs/graphql-api/shop/input-types#createaddressinput)!): [Address](/docs/graphql-api/shop/object-types#address)!
{{% /gql-fields %}}



## deleteCustomerAddress
Delete an existing Address

{{% gql-fields %}}
 * deleteCustomerAddress(id: [ID](/docs/graphql-api/shop/object-types#id)!): [Success](/docs/graphql-api/shop/object-types#success)!
{{% /gql-fields %}}



## login
Authenticates the user using the native authentication strategy. This mutation is an alias for `authenticate({ native: { ... }})`

{{% gql-fields %}}
 * login(username: [String](/docs/graphql-api/shop/object-types#string)!, password: [String](/docs/graphql-api/shop/object-types#string)!, rememberMe: [Boolean](/docs/graphql-api/shop/object-types#boolean)): [NativeAuthenticationResult](/docs/graphql-api/shop/object-types#nativeauthenticationresult)!
{{% /gql-fields %}}



## logout
End the current authenticated session

{{% gql-fields %}}
 * logout: [Success](/docs/graphql-api/shop/object-types#success)!
{{% /gql-fields %}}



## refreshCustomerVerification
Regenerate and send a verification token for a new Customer registration. Only applicable if `authOptions.requireVerification` is set to true.

{{% gql-fields %}}
 * refreshCustomerVerification(emailAddress: [String](/docs/graphql-api/shop/object-types#string)!): [RefreshCustomerVerificationResult](/docs/graphql-api/shop/object-types#refreshcustomerverificationresult)!
{{% /gql-fields %}}



## registerCustomerAccount
Register a Customer account with the given credentials. There are three possible registration flows:

_If `authOptions.requireVerification` is set to `true`:_

1. **The Customer is registered _with_ a password**. A verificationToken will be created (and typically emailed to the Customer). That
   verificationToken would then be passed to the `verifyCustomerAccount` mutation _without_ a password. The Customer is then
   verified and authenticated in one step.
2. **The Customer is registered _without_ a password**. A verificationToken will be created (and typically emailed to the Customer). That
   verificationToken would then be passed to the `verifyCustomerAccount` mutation _with_ the chosen password of the Customer. The Customer is then
   verified and authenticated in one step.

_If `authOptions.requireVerification` is set to `false`:_

3. The Customer _must_ be registered _with_ a password. No further action is needed - the Customer is able to authenticate immediately.

{{% gql-fields %}}
 * registerCustomerAccount(input: [RegisterCustomerInput](/docs/graphql-api/shop/input-types#registercustomerinput)!): [RegisterCustomerAccountResult](/docs/graphql-api/shop/object-types#registercustomeraccountresult)!
{{% /gql-fields %}}



## removeAllOrderLines
Remove all OrderLine from the Order

{{% gql-fields %}}
 * removeAllOrderLines: [RemoveOrderItemsResult](/docs/graphql-api/shop/object-types#removeorderitemsresult)!
{{% /gql-fields %}}



## removeCouponCode
Removes the given coupon code from the active Order

{{% gql-fields %}}
 * removeCouponCode(couponCode: [String](/docs/graphql-api/shop/object-types#string)!): [Order](/docs/graphql-api/shop/object-types#order)
{{% /gql-fields %}}



## removeOrderLine
Remove an OrderLine from the Order

{{% gql-fields %}}
 * removeOrderLine(orderLineId: [ID](/docs/graphql-api/shop/object-types#id)!): [RemoveOrderItemsResult](/docs/graphql-api/shop/object-types#removeorderitemsresult)!
{{% /gql-fields %}}



## requestPasswordReset
Requests a password reset email to be sent

{{% gql-fields %}}
 * requestPasswordReset(emailAddress: [String](/docs/graphql-api/shop/object-types#string)!): [RequestPasswordResetResult](/docs/graphql-api/shop/object-types#requestpasswordresetresult)
{{% /gql-fields %}}



## requestUpdateCustomerEmailAddress
Request to update the emailAddress of the active Customer. If `authOptions.requireVerification` is enabled
(as is the default), then the `identifierChangeToken` will be assigned to the current User and
a IdentifierChangeRequestEvent will be raised. This can then be used e.g. by the EmailPlugin to email
that verification token to the Customer, which is then used to verify the change of email address.

{{% gql-fields %}}
 * requestUpdateCustomerEmailAddress(password: [String](/docs/graphql-api/shop/object-types#string)!, newEmailAddress: [String](/docs/graphql-api/shop/object-types#string)!): [RequestUpdateCustomerEmailAddressResult](/docs/graphql-api/shop/object-types#requestupdatecustomeremailaddressresult)!
{{% /gql-fields %}}



## resetPassword
Resets a Customer's password based on the provided token

{{% gql-fields %}}
 * resetPassword(token: [String](/docs/graphql-api/shop/object-types#string)!, password: [String](/docs/graphql-api/shop/object-types#string)!): [ResetPasswordResult](/docs/graphql-api/shop/object-types#resetpasswordresult)!
{{% /gql-fields %}}



## setCustomerForOrder
Set the Customer for the Order. Required only if the Customer is not currently logged in

{{% gql-fields %}}
 * setCustomerForOrder(input: [CreateCustomerInput](/docs/graphql-api/shop/input-types#createcustomerinput)!): [SetCustomerForOrderResult](/docs/graphql-api/shop/object-types#setcustomerfororderresult)!
{{% /gql-fields %}}



## setOrderBillingAddress
Sets the billing address for this order

{{% gql-fields %}}
 * setOrderBillingAddress(input: [CreateAddressInput](/docs/graphql-api/shop/input-types#createaddressinput)!): [ActiveOrderResult](/docs/graphql-api/shop/object-types#activeorderresult)!
{{% /gql-fields %}}



## setOrderCustomFields
Allows any custom fields to be set for the active order

{{% gql-fields %}}
 * setOrderCustomFields(input: [UpdateOrderInput](/docs/graphql-api/shop/input-types#updateorderinput)!): [ActiveOrderResult](/docs/graphql-api/shop/object-types#activeorderresult)!
{{% /gql-fields %}}



## setOrderShippingAddress
Sets the shipping address for this order

{{% gql-fields %}}
 * setOrderShippingAddress(input: [CreateAddressInput](/docs/graphql-api/shop/input-types#createaddressinput)!): [ActiveOrderResult](/docs/graphql-api/shop/object-types#activeorderresult)!
{{% /gql-fields %}}



## setOrderShippingMethod
Sets the shipping method by id, which can be obtained with the `eligibleShippingMethods` query.
An Order can have multiple shipping methods, in which case you can pass an array of ids. In this case,
you should configure a custom ShippingLineAssignmentStrategy in order to know which OrderLines each
shipping method will apply to.

{{% gql-fields %}}
 * setOrderShippingMethod(shippingMethodId: [[ID](/docs/graphql-api/shop/object-types#id)!]!): [SetOrderShippingMethodResult](/docs/graphql-api/shop/object-types#setordershippingmethodresult)!
{{% /gql-fields %}}



## transitionOrderToState
Transitions an Order to a new state. Valid next states can be found by querying `nextOrderStates`

{{% gql-fields %}}
 * transitionOrderToState(state: [String](/docs/graphql-api/shop/object-types#string)!): [TransitionOrderToStateResult](/docs/graphql-api/shop/object-types#transitionordertostateresult)
{{% /gql-fields %}}



## updateCustomer
Update an existing Customer

{{% gql-fields %}}
 * updateCustomer(input: [UpdateCustomerInput](/docs/graphql-api/shop/input-types#updatecustomerinput)!): [Customer](/docs/graphql-api/shop/object-types#customer)!
{{% /gql-fields %}}



## updateCustomerAddress
Update an existing Address

{{% gql-fields %}}
 * updateCustomerAddress(input: [UpdateAddressInput](/docs/graphql-api/shop/input-types#updateaddressinput)!): [Address](/docs/graphql-api/shop/object-types#address)!
{{% /gql-fields %}}



## updateCustomerEmailAddress
Confirm the update of the emailAddress with the provided token, which has been generated by the
`requestUpdateCustomerEmailAddress` mutation.

{{% gql-fields %}}
 * updateCustomerEmailAddress(token: [String](/docs/graphql-api/shop/object-types#string)!): [UpdateCustomerEmailAddressResult](/docs/graphql-api/shop/object-types#updatecustomeremailaddressresult)!
{{% /gql-fields %}}



## updateCustomerPassword
Update the password of the active Customer

{{% gql-fields %}}
 * updateCustomerPassword(currentPassword: [String](/docs/graphql-api/shop/object-types#string)!, newPassword: [String](/docs/graphql-api/shop/object-types#string)!): [UpdateCustomerPasswordResult](/docs/graphql-api/shop/object-types#updatecustomerpasswordresult)!
{{% /gql-fields %}}



## verifyCustomerAccount
Verify a Customer email address with the token sent to that address. Only applicable if `authOptions.requireVerification` is set to true.

If the Customer was not registered with a password in the `registerCustomerAccount` mutation, the password _must_ be
provided here.

{{% gql-fields %}}
 * verifyCustomerAccount(token: [String](/docs/graphql-api/shop/object-types#string)!, password: [String](/docs/graphql-api/shop/object-types#string)): [VerifyCustomerAccountResult](/docs/graphql-api/shop/object-types#verifycustomeraccountresult)!
{{% /gql-fields %}}



