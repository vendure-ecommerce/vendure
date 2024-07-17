---
title: "Mutations"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';



## addItemToOrder
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Adds an item to the order. If custom fields are defined on the OrderLine entity, a third argument 'customFields' will be available.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">addItemToOrder(productVariantId: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!, quantity: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!): <a href="/reference/graphql-api/shop/object-types#updateorderitemsresult">UpdateOrderItemsResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## addPaymentToOrder
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Add a Payment to the Order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">addPaymentToOrder(input: <a href="/reference/graphql-api/shop/input-types#paymentinput">PaymentInput</a>!): <a href="/reference/graphql-api/shop/object-types#addpaymenttoorderresult">AddPaymentToOrderResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## adjustOrderLine
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Adjusts an OrderLine. If custom fields are defined on the OrderLine entity, a third argument 'customFields' of type <code>OrderLineCustomFieldsInput</code> will be available.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">adjustOrderLine(orderLineId: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!, quantity: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!): <a href="/reference/graphql-api/shop/object-types#updateorderitemsresult">UpdateOrderItemsResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## applyCouponCode
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Applies the given coupon code to the active Order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">applyCouponCode(couponCode: <a href="/reference/graphql-api/shop/object-types#string">String</a>!): <a href="/reference/graphql-api/shop/object-types#applycouponcoderesult">ApplyCouponCodeResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## authenticate
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Authenticates the user using a named authentication strategy</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">authenticate(input: <a href="/reference/graphql-api/shop/input-types#authenticationinput">AuthenticationInput</a>!, rememberMe: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>): <a href="/reference/graphql-api/shop/object-types#authenticationresult">AuthenticationResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createCustomerAddress
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new Customer Address</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createCustomerAddress(input: <a href="/reference/graphql-api/shop/input-types#createaddressinput">CreateAddressInput</a>!): <a href="/reference/graphql-api/shop/object-types#address">Address</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteCustomerAddress
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete an existing Address</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteCustomerAddress(id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!): <a href="/reference/graphql-api/shop/object-types#success">Success</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## login
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Authenticates the user using the native authentication strategy. This mutation is an alias for authenticate(&#123; native: &#123; ... &#125;&#125;)</div>

<div class="graphql-code-line top-level comment"></div>

<div class="graphql-code-line top-level comment">The <code>rememberMe</code> option applies when using cookie-based sessions, and if <code>true</code> it will set the maxAge of the session cookie</div>

<div class="graphql-code-line top-level comment">to 1 year.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">login(username: <a href="/reference/graphql-api/shop/object-types#string">String</a>!, password: <a href="/reference/graphql-api/shop/object-types#string">String</a>!, rememberMe: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>): <a href="/reference/graphql-api/shop/object-types#nativeauthenticationresult">NativeAuthenticationResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## logout
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">End the current authenticated session</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">logout: <a href="/reference/graphql-api/shop/object-types#success">Success</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## refreshCustomerVerification
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Regenerate and send a verification token for a new Customer registration. Only applicable if <code>authOptions.requireVerification</code> is set to true.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">refreshCustomerVerification(emailAddress: <a href="/reference/graphql-api/shop/object-types#string">String</a>!): <a href="/reference/graphql-api/shop/object-types#refreshcustomerverificationresult">RefreshCustomerVerificationResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## registerCustomerAccount
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Register a Customer account with the given credentials. There are three possible registration flows:</div>

<div class="graphql-code-line top-level comment"></div>

<div class="graphql-code-line top-level comment">_If <code>authOptions.requireVerification</code> is set to `true`:_</div>

<div class="graphql-code-line top-level comment"></div>

<div class="graphql-code-line top-level comment">1. **The Customer is registered _with_ a password**. A verificationToken will be created (and typically emailed to the Customer). That</div>

<div class="graphql-code-line top-level comment">   verificationToken would then be passed to the <code>verifyCustomerAccount</code> mutation _without_ a password. The Customer is then</div>

<div class="graphql-code-line top-level comment">   verified and authenticated in one step.</div>

<div class="graphql-code-line top-level comment">2. **The Customer is registered _without_ a password**. A verificationToken will be created (and typically emailed to the Customer). That</div>

<div class="graphql-code-line top-level comment">   verificationToken would then be passed to the <code>verifyCustomerAccount</code> mutation _with_ the chosen password of the Customer. The Customer is then</div>

<div class="graphql-code-line top-level comment">   verified and authenticated in one step.</div>

<div class="graphql-code-line top-level comment"></div>

<div class="graphql-code-line top-level comment">_If <code>authOptions.requireVerification</code> is set to `false`:_</div>

<div class="graphql-code-line top-level comment"></div>

<div class="graphql-code-line top-level comment">3. The Customer _must_ be registered _with_ a password. No further action is needed - the Customer is able to authenticate immediately.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">registerCustomerAccount(input: <a href="/reference/graphql-api/shop/input-types#registercustomerinput">RegisterCustomerInput</a>!): <a href="/reference/graphql-api/shop/object-types#registercustomeraccountresult">RegisterCustomerAccountResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## removeAllOrderLines
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Remove all OrderLine from the Order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">removeAllOrderLines: <a href="/reference/graphql-api/shop/object-types#removeorderitemsresult">RemoveOrderItemsResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## removeCouponCode
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Removes the given coupon code from the active Order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">removeCouponCode(couponCode: <a href="/reference/graphql-api/shop/object-types#string">String</a>!): <a href="/reference/graphql-api/shop/object-types#order">Order</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## removeOrderLine
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Remove an OrderLine from the Order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">removeOrderLine(orderLineId: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!): <a href="/reference/graphql-api/shop/object-types#removeorderitemsresult">RemoveOrderItemsResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## requestPasswordReset
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Requests a password reset email to be sent</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">requestPasswordReset(emailAddress: <a href="/reference/graphql-api/shop/object-types#string">String</a>!): <a href="/reference/graphql-api/shop/object-types#requestpasswordresetresult">RequestPasswordResetResult</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## requestUpdateCustomerEmailAddress
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Request to update the emailAddress of the active Customer. If <code>authOptions.requireVerification</code> is enabled</div>

<div class="graphql-code-line top-level comment">(as is the default), then the <code>identifierChangeToken</code> will be assigned to the current User and</div>

<div class="graphql-code-line top-level comment">a IdentifierChangeRequestEvent will be raised. This can then be used e.g. by the EmailPlugin to email</div>

<div class="graphql-code-line top-level comment">that verification token to the Customer, which is then used to verify the change of email address.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">requestUpdateCustomerEmailAddress(password: <a href="/reference/graphql-api/shop/object-types#string">String</a>!, newEmailAddress: <a href="/reference/graphql-api/shop/object-types#string">String</a>!): <a href="/reference/graphql-api/shop/object-types#requestupdatecustomeremailaddressresult">RequestUpdateCustomerEmailAddressResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## resetPassword
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Resets a Customer's password based on the provided token</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">resetPassword(token: <a href="/reference/graphql-api/shop/object-types#string">String</a>!, password: <a href="/reference/graphql-api/shop/object-types#string">String</a>!): <a href="/reference/graphql-api/shop/object-types#resetpasswordresult">ResetPasswordResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## setCustomerForOrder
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Set the Customer for the Order. Required only if the Customer is not currently logged in</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">setCustomerForOrder(input: <a href="/reference/graphql-api/shop/input-types#createcustomerinput">CreateCustomerInput</a>!): <a href="/reference/graphql-api/shop/object-types#setcustomerfororderresult">SetCustomerForOrderResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## setOrderBillingAddress
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Sets the billing address for this order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">setOrderBillingAddress(input: <a href="/reference/graphql-api/shop/input-types#createaddressinput">CreateAddressInput</a>!): <a href="/reference/graphql-api/shop/object-types#activeorderresult">ActiveOrderResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## setOrderCustomFields
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Allows any custom fields to be set for the active order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">setOrderCustomFields(input: <a href="/reference/graphql-api/shop/input-types#updateorderinput">UpdateOrderInput</a>!): <a href="/reference/graphql-api/shop/object-types#activeorderresult">ActiveOrderResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## setOrderShippingAddress
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Sets the shipping address for this order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">setOrderShippingAddress(input: <a href="/reference/graphql-api/shop/input-types#createaddressinput">CreateAddressInput</a>!): <a href="/reference/graphql-api/shop/object-types#activeorderresult">ActiveOrderResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## setOrderShippingMethod
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Sets the shipping method by id, which can be obtained with the <code>eligibleShippingMethods</code> query.</div>

<div class="graphql-code-line top-level comment">An Order can have multiple shipping methods, in which case you can pass an array of ids. In this case,</div>

<div class="graphql-code-line top-level comment">you should configure a custom ShippingLineAssignmentStrategy in order to know which OrderLines each</div>

<div class="graphql-code-line top-level comment">shipping method will apply to.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">setOrderShippingMethod(shippingMethodId: [<a href="/reference/graphql-api/shop/object-types#id">ID</a>!]!): <a href="/reference/graphql-api/shop/object-types#setordershippingmethodresult">SetOrderShippingMethodResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## transitionOrderToState
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Transitions an Order to a new state. Valid next states can be found by querying `nextOrderStates`</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">transitionOrderToState(state: <a href="/reference/graphql-api/shop/object-types#string">String</a>!): <a href="/reference/graphql-api/shop/object-types#transitionordertostateresult">TransitionOrderToStateResult</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateCustomer
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing Customer</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateCustomer(input: <a href="/reference/graphql-api/shop/input-types#updatecustomerinput">UpdateCustomerInput</a>!): <a href="/reference/graphql-api/shop/object-types#customer">Customer</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateCustomerAddress
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing Address</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateCustomerAddress(input: <a href="/reference/graphql-api/shop/input-types#updateaddressinput">UpdateAddressInput</a>!): <a href="/reference/graphql-api/shop/object-types#address">Address</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateCustomerEmailAddress
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Confirm the update of the emailAddress with the provided token, which has been generated by the</div>

<div class="graphql-code-line top-level comment">`requestUpdateCustomerEmailAddress` mutation.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateCustomerEmailAddress(token: <a href="/reference/graphql-api/shop/object-types#string">String</a>!): <a href="/reference/graphql-api/shop/object-types#updatecustomeremailaddressresult">UpdateCustomerEmailAddressResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateCustomerPassword
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update the password of the active Customer</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateCustomerPassword(currentPassword: <a href="/reference/graphql-api/shop/object-types#string">String</a>!, newPassword: <a href="/reference/graphql-api/shop/object-types#string">String</a>!): <a href="/reference/graphql-api/shop/object-types#updatecustomerpasswordresult">UpdateCustomerPasswordResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## verifyCustomerAccount
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Verify a Customer email address with the token sent to that address. Only applicable if <code>authOptions.requireVerification</code> is set to true.</div>

<div class="graphql-code-line top-level comment"></div>

<div class="graphql-code-line top-level comment">If the Customer was not registered with a password in the <code>registerCustomerAccount</code> mutation, the password _must_ be</div>

<div class="graphql-code-line top-level comment">provided here.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">verifyCustomerAccount(token: <a href="/reference/graphql-api/shop/object-types#string">String</a>!, password: <a href="/reference/graphql-api/shop/object-types#string">String</a>): <a href="/reference/graphql-api/shop/object-types#verifycustomeraccountresult">VerifyCustomerAccountResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>
