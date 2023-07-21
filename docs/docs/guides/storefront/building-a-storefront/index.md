---
title: "Building a Storefront"
weight: 0
showtoc: true
---

# Building a Storefront

The storefront is the application that customers use to buy things from your store.

One of the benefits of Vendure's headless architecture is that you can build your storefront using any technology you like, and in the future you can update your storefront without requiring any changes to the Vendure server itself!

## Storefront starters

To get you up and running with your storefront implementation, we offer a number of integrations with popular front-end frameworks such as Remix, Angular & Qwik. See all of our [storefront integrations](https://demo.vendure.io/).

## Custom-building

If you'd prefer to build your storefront from scratch, here are the main points you'll need to cover at a minimum:

- Displaying navigation based on Collections using the `collections` query.
- Listing products. Use the `search` query for this - it will let you filter by collection and also implements faceted filtering.
- Product detail view with variant selection & add to cart functionality.
- A cart view which allows items to be removed or quantity to be modified.
- A checkout flow including shipping address and payment.
- Login page with forgotten password flow & account creation flow
- Customer account dashboard
- Customer order history
- Customer password reset flow
- Customer email address change flow

Some of these aspects are covered in more detail in this section, but we plan to create guides for each of these.
