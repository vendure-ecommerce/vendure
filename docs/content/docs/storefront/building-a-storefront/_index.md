---
title: "Building a Storefront"
weight: 0
showtoc: true
---

# Building a Storefront

The storefront is the application which customers use to buy things from your store.

As a headless server, Vendure provides a GraphQL API and admin UI app, but no storefront. The key advantage of the headless model is that the storefront (or indeed, any number of client applications) can be developed completely independently of the server. This flexibility comes at the cost of having to build and maintain your own storefront.

However, we'd like to lower the barrier to getting started in the regard, so here are some options you may wish to investigate:

## Vendure Angular Storefront

{{< figure src="./vendure-storefront-screenshot-01.jpg" >}}

This is an example storefront PWA application built with Angular. If you have Angular experience you may wish to use this as the basis of your own storefront implementation.

A live demo can be found here: [demo.vendure.io/storefront/](https://demo.vendure.io/storefront/)

Keep up with development here: [github.com/vendure-ecommerce/storefront](https://github.com/vendure-ecommerce/storefront)

## DEITY Falcon

[DEITY Falcon](https://falcon.deity.io/docs/getting-started/intro) is a React-based PWA storefront solution. It uses a modular architecture which allows it to connect to any e-commerce backend. We are developing the [Vendure Falcon API](https://www.npmjs.com/package/@vendure/falcon-vendure-api) which allows Falcon to be used with Vendure.

Here's a video showing how to quickly get started with Vendure + DEITY Falcon: 

{{< vimeo 322812102 >}}

## Vue Storefront

[Vue Storefront](https://www.vuestorefront.io/) is one of the most popular backend-agnostic storefront PWA solutions. They offer extensive documentation on connecting their frontend application with a custom backend such as Vendure: https://github.com/DivanteLtd/vue-storefront-integration-sdk

## Gatsby

We have developed a [Gatsby](https://www.gatsbyjs.org/)-based storefront app: [vendure-ecommerce/gatsby-storefront](https://github.com/vendure-ecommerce/gatsby-storefront). This is a proof-of-concept which can be used as the starting point for your own Gatsby-based storefront.
