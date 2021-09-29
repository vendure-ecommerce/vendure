---
title: "Building a Storefront"
weight: 0
showtoc: true
---

# Building a Storefront

The storefront is the application which customers use to buy things from your store.

As a headless server, Vendure provides a GraphQL API and Admin UI app, but no storefront. The key advantage of the headless model is that the storefront (or indeed, any number of client applications) can be developed completely independently of the server. This flexibility comes at the cost of having to build and maintain your own storefront.

Essentially, you can use **any technology** to build your storefront. Here are some suggestions you may wish to investigate:

## Angular / Vendure Storefront

{{< figure src="./vendure-storefront-screenshot-01.jpg" >}}

This is an example storefront PWA application built with Angular. If you have Angular experience you may wish to use this as the basis of your own storefront implementation.

A live demo can be found here: [demo.vendure.io/storefront/](https://demo.vendure.io/storefront/)

Keep up with development here: [github.com/vendure-ecommerce/storefront](https://github.com/vendure-ecommerce/storefront)

## Next.js

[Next.js](https://nextjs.org/) is a popular React-based framework which many Vendure developers have chosen as the basis of their storefront application. The team behind Next.js are also working on an e-commerce-specific solution, [Next.js Commerce](https://nextjs.org/commerce), which is currently under development but is worth keeping an eye on.

## Vue / Nuxt

[Nuxt](https://nuxtjs.org/) is a framework based on [Vue](https://vuejs.org/) with a focus on developer experience and has support for PWA, server-side rendering and static content generation.


## Vue Storefront

[Vue Storefront](https://www.vuestorefront.io/) is a popular backend-agnostic storefront PWA solution. They offer documentation on connecting their frontend application with a custom backend such as Vendure: https://github.com/DivanteLtd/vue-storefront-integration-sdk

## Gatsby

[Gatsby](https://www.gatsbyjs.org/) is a popular React-based static site generator. We have developed a Gatsby-based storefront app: [vendure-ecommerce/gatsby-storefront](https://github.com/vendure-ecommerce/gatsby-storefront). This is a minimal proof-of-concept which can be used as the starting point for your own Gatsby-based storefront.

## Svelte / Sapper

[Sapper](https://sapper.svelte.dev/) is a framework based on [Svelte](https://svelte.dev/), and focuses on high-performance and supports server-rendering.
