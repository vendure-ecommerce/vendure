---
title: "Vendure Frequently Asked Questions"
weight: 0
showtoc: true
--- 
 
## Vendure is still beta. Can I use it in production?

Short answer: **yes**, Vendure can be (and is) used in production. However, there are a number of caveats which you must be aware of before deciding to use Vendure beta:

1. Before Vendure reaches v1.0, breaking changes can and do occur with minor releases (e.g. between v0.10.0 and v0.11.0). These breaking changes are documented in the changelog entry that accompanies each release. Take a look at [the changelog](https://github.com/vendure-ecommerce/vendure/blob/master/CHANGELOG.md) to get a sense of the kinds of breaking changes that you can expect.
2. Certain features which are planned for v1.0 are either not yet implemented, or are incomplete. The Roadmap section covers the main outstanding areas.
3. As with any early-stage software, there will be edge-case bugs and rough edges that need finding and fixing. Be prepared to report issues and - if feasible - contribute to the ongoing development of the project.

## When will Vendure come out of beta?

Please see the [Vendure Roadmap]({{< relref "roadmap" >}}) for full details.

## Can I use React/Vue/Gatsby/Next etc. with Vendure?

**Yes**. Vendure is completely decoupled from the front-end storefront implementation. You are free to build your storefront using whatever technology you like.

For example, there are already Vendure storefront projects built with Vue, React, Angular and Svelte.

## Who is using Vendure?

There are a number of Vendure projects under development at the moment. Based on community interactions, we know that Vendure is being used in both public B2C settings and enterprise B2B. Here are some live Vendure sites that we know of. Please get in touch if you'd like yours to be added!

* [CB Made In Italy](https://cbmadeinitaly.com/): Vendure + [Vue Storefront](https://www.vuestorefront.io/)
* [Racketworld.ch](https://racketworld.ch/): Vendure + [Svelte](https://svelte.dev/) + [Sapper](https://sapper.svelte.dev/)

## Is enterprise support available?

We're not yet offering general support packages, but if you are planning a Vendure-based project and are interested in consulting & code-review services from the core Vendure development team, please [get in touch](mailto:contact@vendure.io).

## Is Vendure free to use?

**Yes**. Vendure and all the core packages are licensed under the [MIT licence](https://github.com/vendure-ecommerce/vendure/blob/master/LICENSE). This means you are free to use Vendure without restriction, even as the basis of your own commercial product.

## Does Vendure support multi-vendor / multi-tenant?

**No**, out-of-the box Vendure does not support multi-vendor. We have a [Channels feature]({{< relref "channels" >}}) which allows a single vendor to define multiple sales channels. 

It _would_ be possible to add multi-vendor support by way of a plugin, but bear in mind that this would entail a fair amount of custom development.

An official multi-vendor plugin is under consideration for after the v1.0 release.
