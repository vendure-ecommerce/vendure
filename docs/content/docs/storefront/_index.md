---
title: "Storefront"
weight: 1
---

# Storefront

The storefront is the application which customers use to interact with your store.

As a headless server, Vendure provides a GraphQL API and admin UI app, but no storefront. The key advantage of the headless model is that the storefront (or indeed, any number of client applications) can be developed completely independently of the server. This flexibility comes at the cost of having to build and maintain your own storefront.

However, we'd like to lower the barrier to getting started in the regard, so there are plans for integrations with existing e-commerce storefront solutions as well as our own vendure-storefront project.

## Vendure Storefront

{{< figure src="./vendure-storefront-screenshot-01.jpg" >}}

This is our own progressive web application (PWA) storefront. It is currently still in development, but when complete it will offer a ready-made, customizable storefront solution tailored specifically to work well with the Vendure server. 

A live demo can be found here: [demo.vendure.io/storefront/](https://demo.vendure.io/storefront/)

Keep up with development here: [github.com/vendure-ecommerce/storefront](https://github.com/vendure-ecommerce/storefront)

## DEITY Falcon

[DEITY Falcon](https://falcon.deity.io/docs/getting-started/intro) is a React-based PWA storefront solution. It uses a modular architecture which allows it to connect to any e-commerce backend. We are developing the [Vendure Falcon API](https://www.npmjs.com/package/@vendure/falcon-vendure-api) which allows Falcon to be used with Vendure.

Here's a video showing how to quickly get started with Vendure + DEITY Falcon: 

{{< vimeo 322812102 >}}

## Gatsby

We are also working on a [Gatsby](https://www.gatsbyjs.org/)-based storefront app: [vendure-ecommerce/gatsby-storefront](https://github.com/vendure-ecommerce/gatsby-storefront)
