---
title: "Vendure Summer Update: Towards v1.0"
date: 2019-08-28T10:00:46+01:00
draft: false
author: "Michael Bromley"
images: 
    - "/blog/2019/08/vendure-summer-update-towards-v1.0/falkert-austria-michael-bromley.jpg"
---

After pausing for a refreshing week high in the Austrian Alps, development of Vendure continues apace. This blog post explains an upcoming change to the version numbering prior to 1.0, as well as a discussion of the remaining work to be done for the first stable release.

{{< figure src="./falkert-austria-michael-bromley.jpg" caption="View from Mt. Falket, Austria. Photo © Michael Bromley" >}}

## Changed numbering scheme

Vendure started at version 0.1.0, and up until May this year, it had the suffix `-alpha.x`. The idea was to clearly indicate the "alpha" nature of the project, (translation: "This is barely functional - don't try to use it yet!"). According to the [SemVer spec](https://semver.org/):

> A pre-release version MAY be denoted by appending a hyphen and a series of dot separated identifiers immediately following the patch version. 

In May, I decided that Vendure was sufficiently complete to enter the "beta" phase (translation: "Still lots of work to do, but it *is* possible to build something on top of it") and added the `-beta.x` suffix which we have now. Again, the purpose of the explicit suffix was to signal the incomplete nature of the project.

While Vendure is not yet feature-complete, the core API seems to have settled to a reasonable degree over the past few releases. From the next release, we'll be dropping the `-beta.x` suffix and using a regular major-minor-patch version number, starting with 0.2.0. The [relevant portions of the SemVer spec](https://semver.org/#spec-item-4) are:

> 4 . Major version zero (0.y.z) is for initial development. Anything MAY change at any time. The public API SHOULD NOT be considered stable.

> 5 . Version 1.0.0 defines the public API. The way in which the version number is incremented after this release is dependent on this public API and how it changes.

Up until the 1.0 release, breaking changes will be signified by an increase in the minor version (0.2.0 -> 0.3.0), and all other changes will result in a patch version increase (0.2.0 -> 0.2.1).

So in summary, Vendure should still be considered to be in "beta", as per the major version of "0", despite not having an explicit `-beta.x` suffix. 

## Recent progress

Over the past couple of months, a new version has been released roughly weekly. Each release typically includes a whole host of new features and fixes. Here are some highlights from the recent releases:

* A new [plugin format]({{< ref "docs/plugins" >}}) which allows any [NestJS module](https://docs.nestjs.com/modules) to be plugged directly into Vendure. This major change allows you to harness the full power of NestJS in extending the Vendure server.
* Extended [custom fields configuration options]({{< ref "docs/typescript-api/custom-fields" >}}). Now you can extend your models with a rich set of custom data types, as well as specifying contraints, defaults and validation functions.
* A timeline view of each Order's history, including state transitions, payments, fulfillments and notes.
* A vastly improved product creation flow in the Admin UI.
* Integrated shipping method testing - pass a mock order and an address to Vendure and receive all eligible ShippingMethods and prices. This is also integrated into the Admin UI and makes development and testing of complex shipping rules much easier.  
* An [Elasticsearch plugin](https://www.vendure.io/docs/plugins/elasticsearch-plugin/) for advanced product search capabilities.

See the [Vendure changelog](https://github.com/vendure-ecommerce/vendure/blob/master/CHANGELOG.md) for a detailed breakdown of each recent release.

## Towards version 1.0

It is my opinion that Vendure should be subject to real-world usage and validation before the release of version 1.0. I am currently building a storefront application for our business which, when it goes into production, will validate Vendure against ~10k products and on the order of hundreds of orders per day. As part of this project I'm also developing functionality around product reviews, promo codes, reporting, advanced shipping calculations, advanced product search, gift vouchers, and more. All of this is good for Vendure - some of this work will find its way back into Vendure core, some into plugins, and all of it will inform the futher design and development of Vendure's APIs to facilitate this kind of highly custom e-commerce development.

In addition to this, there are a number of other Vendure-based projects currently under active development by others. All of this activity provides very focused feedback as to what are the key missing features required before we reach the 1.0 milestone.

Time estimates in software projects are notoriously difficult, but my personal aim is to have my Vendure implementation completed and ready for testing by the end of this year. I would then expect a period of work rounding out any missing features and fixing bugs revealed in a real-world deployment, and then the release of version 1.0.

In the meantime, please do [join us on Slack](https://join.slack.com/t/vendure-ecommerce/shared_invite/enQtNzA1NTcyMDY3NTg0LTMzZGQzNDczOWJiMTU2YjAyNWJlMzdmZGE3ZDY5Y2RjMGYxZWNlYTI4NmU4Y2Q1MDNlYzE4MzQ5ODcyYTdmMGU), where you can get any questions answered, provide feedback, and help me shape the development of Vendure.
