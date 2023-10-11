---
title: "Storefront Migration"
sidebar_position: 4
---

# Storefront migration

There are relatively few breaking changes that will affect the storefront.

- The `setOrderShippingMethod` mutation now takes an array of shipping method IDs rather than just a single one. This is so we can support multiple shipping methods per Order.
   ```diff
   -mutation setOrderShippingMethod($shippingMethodId: ID!) {
   +mutation setOrderShippingMethod($shippingMethodId: [ID!]!) {
     setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
       # ... etc
     }
   } 
   ```
- The `OrderLine.fulfillments` field has been changed to `OrderLine.fulfillmentLines`. Your storefront may be using this when displaying the details of an Order.
- If you are using the `graphql-code-generator` package to generate types for your storefront, all monetary values such as `Order.totalWithTax` or `ProductVariant.priceWithTax` are now represented by the new `Money` scalar rather than by an `Int`. You'll need to tell your codegen about this scalar and configure it to be interpreted as a number type:
   ```diff
   documents:
     - "app/**/*.{ts,tsx}"
     - "!app/generated/*"
   +config:
   +  scalars:
   +    Money: number
   generates:
     # ... etc
   ```
