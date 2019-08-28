---
title: "Introducing Vendure"
date: 2019-02-11T10:27:46+01:00
draft: false
author: "Michael Bromley"
images: 
    - "./introducing-vendure.jpg"
aliases:
    - /blog/introducing-vendure/
---

Vendure is a new open-source headless e-commerce framework built on [Node.js](https://nodejs.org) with [TypeScript](http://www.typescriptlang.org/) and exposing a [GraphQL](https://graphql.org/) API. Today it is available to try with its first alpha release. In this post I'll outline some of the of major features and give some background to its development.

{{< figure src="./introducing-vendure.jpg" >}}

## Headless Architecture

The term "headless" or "API-first" refers to an architecture in which the server does not concern itself with rendering HTML pages. Instead, it exposes an API which can then be consumed by a client application which can be developed and evolve independently of the back end. This is in contrast to the traditional "monolithic" e-commerce frameworks wherein the storefront is part of the back-end framework and is typically customised via themes or templates.

Headless architecture is becoming increasingly popular with the advent of powerful browser-based frameworks, mobile applications, and the trend toward progressive web apps (PWA). Several of the established e-commerce frameworks are moving towards this approach, and there is a crop of new front-end solutions such as [Vue Storefront](https://www.vuestorefront.io/) and [Deity](https://deity.io) which build upon this trend.

## GraphQL 

Vendure exposes a GraphQL API, through which all interactions with the back end are conducted. GraphQL offers a number of advantages over REST-like APIs, such as the ability of the client application to ask for only the data that it needs, and the improved tooling afforded by static typing. The [2018 developer survey](https://blog.npmjs.org/post/180868064080/this-year-in-javascript-2018-in-review-and-npms) conducted by npm (the package manager for JavaScript) had this to say about GraphQL:

> GraphQL, tracked by its most popular client library Apollo, continues to explode in popularity. We think it’s going to be a technical force to reckon with in 2019.

{{< figure src="/features-code.png" >}}

## TypeScript and Node.js

TypeScript is a statically-typed superset of JavaScript. Also from the 2018 npm survey:

> Something of a surprise, however, was TypeScript, with 46% of survey respondents reporting they use Microsoft’s the type-checked JavaScript variant. This is major adoption for a tool of this kind and might signal a sea change in how developers write JavaScript.

Since the survey quoted above, a number of major JavaScript projects have announced a switch to TypeScript, including Vue, Jest and Yarn. It is also gaining massive traction in the React ecosystem. It seems it will take the place as the de facto language for large-scale JavaScript projects. *Note: Vendure also works just fine with JavaScript*.

{{< figure src="/features-dev.png" >}}

## History & Motivation

The development of Vendure is sponsored by [Ken Bromley Art Supplies](https://www.artsupplies.co.uk/), a leading UK art supplies retailer which has been in the e-commerce business for over 15 years, starting from a static HTML site built with [Netscape Composer](https://en.wikipedia.org/wiki/Netscape_Composer).

As our business expanded, our requirements outgrew the capabilities of the available off-the-shelf e-commerce solutions (even Magento was 5 years away from its first release at that point). So I did what any over-confident youngster would do; I rolled up my sleeves, dived into a couple of 6-inch-thick PHP & MySQL books (replete with CD ROMs in the back cover) and built one myself.

This solution has served us well, but over the years it became apparent that we needed something new. The e-commerce software landscaped had changed drastically in the intervening decade or so, but broadly there are two options available to retailers looking to build a store:

1. A hosted, SaaS solution requiring little custom development such as Shopify or BigCommerce.
2. A dedicated e-commerce framework to build on top of such as Magento or WooCommerce.

For a number of reasons (which could fill an entire blog post) we chose the second option. So I started to look around at what e-commerce frameworks were available. For context, I've spent the past five years primarily as a front-end developer, mainly working with TypeScript. For three of those years I was part of the team building the pioneering [Gentics Mesh](https://getmesh.io/) headless CMS. So I had a number of items on my wish list:

1. **Headless architecture**. During my time working on Gentics Mesh, I came to appreciate the power and flexibility afforded by this approach.
2. **Modern workflow & tooling**. I am at home in the Node.js, npm & JavaScript world and the rich ecosystem around it. I don't want to be locked in to outdated libraries and tools dictated by the back-end framework.
3. **A programming language I know and like to use**. TypeScript's type system is powerful, expressive and massively boosts my productivity and my confidence in my code. It would be tough to go back to working without it.
4. **GraphQL support**. After evaluating it for a while I became convinced of its value. Its statically-typed nature is a perfect complement to TypeScript.
5. **Easily extensible**. I need to be able to faithfully model the business requirements and processes without bending to the dictates of the tools we use.

There are a number of excellent frameworks out there which answer one or two of these criteria - [Spree](https://spreecommerce.org/) for Ruby, [Sylius](https://sylius.com/) for PHP, [Saleor](https://getsaleor.com/) for Python, [ReactionCommerce](https://www.reactioncommerce.com/) for JavaScript and so on. 

But I saw a gap for something that aimed for all of the above, and with Vendure I aim to fill it!

## Roadmap

This is an alpha release and is not intended for production use. However, I'd love to get feedback on the implementation so far. Over the coming months I'll be working on rounding out the features for a beta phase, including:

* Third-party integrations for things like search, payment, tax and shipping.
* Improved customization options.
* Multi-channel support.
* A reference storefront PWA app.
* Load testing and performance tuning.
* Expand the documentation.

## Try it out!

A primary goal of mine is to bring a simple and enjoyable developer experience to e-commerce development. To that end I've worked to make installation as painless as possible. As the video below demonstrates, you can be up and running with Vendure in a matter of minutes.

Please [try it out]({{< relref "getting-started" >}}) and let me know your feedback!

{{< vimeo id="315862294" >}}
