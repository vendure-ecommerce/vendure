---
title: "Building a Storefront"
weight: 0
showtoc: true
---

# Building a Storefront

The storefront is the application which customers use to buy things from your store.

As a headless server, Vendure provides a GraphQL API and Admin UI app, but no storefront. The key advantage of the headless model is that the storefront (or indeed, any number of client applications) can be developed completely independently of the server. This flexibility comes at the cost of having to build and maintain your own storefront.

Luckily there are some projects that can help you get your storefront up-and-running quickly:


## Vue Storefront

{{< figure src="./vue-storefront-logo.png" >}}

[Vue Storefront](https://www.vuestorefront.io/) is a popular backend-agnostic storefront PWA solution and they offer an official [Vue Storefront Vendure integration](https://docs.vuestorefront.io/vendure/).

For step-by-step instructions see our [Vue Storefront integration blog post]({{< relref "/blog/2021-10-11-vendure-vue-storefront/index.md" >}}).

## Next.js Commerce
 
{{< figure src="./vercel-commerce-screenshot.webp" >}}

[Next.js](https://nextjs.org/) is a popular React-based framework which many Vendure developers have chosen as the basis of their storefront application. The team behind Next.js have created an e-commerce-specific solution, [Next.js Commerce](https://nextjs.org/commerce), and it includes an official [Vendure integration](https://github.com/vercel/commerce/tree/main/framework/vendure)

[Next.js Commerce Vendure integration demo](https://vendure.vercel.store/)


## Angular Demo Storefront

{{< figure src="./vendure-storefront-screenshot-01.jpg" >}}

This is an example storefront PWA application built with Angular. If you have Angular experience you may wish to use this as the basis of your own storefront implementation.

A live demo can be found here: [demo.vendure.io/storefront/](https://demo.vendure.io/storefront/)

Keep up with development here: [github.com/vendure-ecommerce/storefront](https://github.com/vendure-ecommerce/storefront)
