---
title: "Beta Release & Roadmap 2019"
date: 2019-05-27T10:27:46+01:00
draft: false
author: "Michael Bromley"
images: 
    - "/blog/2019/02/introducing-vendure/introducing-vendure.jpg"
aliases:
    - /blog/beta-release-and-roadmap-2019/
--- 

Vendure, a new headless e-commerce framework built on Nodejs, TypeScript and GraphQL, has just graduated from *alpha* to *beta*! 

This means that the basic foundations of an e-commerce application are now in place - [check the demo](https://demo.vendure.io/); the GraphQL APIs are pretty stable; the codebase has been reworked into a more maintainable core/plugins monorepo; the developer experience has vastly improved with the introduction of [@vendure/create](https://github.com/vendure-ecommerce/vendure/tree/master/packages/create).

## Next Steps

For the remainder of the year I will be building a shop with Vendure, rounding out the features and fixing issues as I go along. By the time Vendure comes out of beta into v1.0.0, it will be production-ready and battle-tested on a shop with ~10k products. Along the way, there will be regular beta releases, which will be fully documented in the [changelog](https://github.com/vendure-ecommerce/vendure/blob/master/CHANGELOG.md).

## Roadmap 2019

As I build out our Vendure-based shop, I plan to work on the following features which we require:

* Elastic search plugin
* Payment provider plugins (exact providers to be determined)
* Shipping provider plugins (exact providers to be determined)
* More advanced promotions capabilities (free gifts, voucher codes, limited use etc.)
* Reward points plugin
* Product reviews plugin
* Support for digital goods
* More advanced control over custom entity fields
* A database migrations story to make plugin & custom field usage safe for production
* Reporting capabilities
* System monitoring dashboard
* Improved product import
* Performance tuning
* Improved developer documentation
* Administrator documentation

## Should I use Vendure yet?

I know a number of you will be wondering whether it is "safe" to invest time building on top of Vendure right now. My honest advice is that if you have a large, critical application, you should wait until Vendure comes out of beta.

However, if you have a smaller e-commerce project, the latitude to experiment and the willingness to roll up your sleeves and pitch in as an early adopter, I'd welcome your feedback and support! If this describes you, then [go get started now](https://www.vendure.io/docs/getting-started/)!
