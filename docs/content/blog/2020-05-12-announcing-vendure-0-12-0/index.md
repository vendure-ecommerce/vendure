---
title: "Announcing Vendure v0.12.0"
date: 2020-05-13T12:00:00
draft: false
author: "Michael Bromley"
images: 
    - "/blog/2020/05/announcing-vendure-v0.12.0/vendure-0.12.0-banner-01.jpg"
---

We're very excited to announce the release of version 0.12.0 of Vendure! This release includes a bunch of features geared towards real-world production deployment of Vendure as we move towards v1.0.

{{< figure src="./vendure-0.12.0-banner-01.jpg" >}}

## Health checks

Vendure consists of a few different parts: the Vendure server, the worker, and the database. On top of that, other parts can be added such as the AssetServerPlugin or ElasticsearchPlugin. Keeping a track of each of these parts is critical in production, and even more so when attempting to deploy to automated environments using tools like Kubernetes.

Version 0.12.0 adds a new [health check endpoint]({{< relref "deployment" >}}#health-readiness-checks) which returns a report of the health of each of the parts of your Vendure instance. Plugins which depend on external services can also register their own health checks by injecting the new [HealthCheckRegistryService]({{< relref "health-check-registry-service" >}}). 

{{< figure src="./health-check-ui.jpg" caption="The new UI for system health" >}}

## AWS S3 Asset storage

The AssetServerPlugin now ships with a storage strategy for the popular [S3 cloud storage service](https://aws.amazon.com/s3/) from Amazon Web Services. **Note:** This strategy should be used with care as it is untested at scale. We are looking for feedback to improve the implementation for future versions.

### 📖 See the [S3AssetStorageStrategy documentation]({{< relref "s3asset-storage-strategy" >}}#configures3assetstorage).

## Lifecycle hooks for configurable strategies

Vendure now allows all configurable strategies (e.g. [TaxCalculationStrategy]({{< relref "tax-calculation-strategy" >}})) and other handlers (e.g. [ShippingCalculator]({{< relref "shipping-calculator" >}})) to define lifecycle methods to run when the server starts up and shuts down. This can be useful for setting up connections to external services, or any other kind of initialization logic. Additionally, these strategies and handlers can now inject any provider from the Nestjs dependency injection container, giving them access to things like the TypeORM Connection object or any services defined by plugins, for example.

See the new documentation on the [InjectableStrategy interface]({{< relref "injectable-strategy" >}}), and a real-world example in the new [S3AssetStorageStrategy source](https://github.com/vendure-ecommerce/vendure/blob/5045ed0e69b08de4a122f7400b45c9e86e53d10b/packages/asset-server-plugin/src/s3-asset-storage-strategy.ts#L116-L133).

## Custom CollectionFilters

[CollectionFilters]({{< relref "collection-filter" >}}) are used to define which ProductVariants are included in a Collection. We currently ship with just a couple of filters, allowing filtering by facets and names. With this release, you can also define your own CollectionFilters and pass them in the [`catalogOptions`]({{< relref "vendure-config" >}}#catalogoptions) config object.

## 🚧 Breaking changes

Since this is a pre-1.0 minor release, there are a few breaking changes to be aware of. Please see the [breaking changes in the changelog](https://github.com/vendure-ecommerce/vendure/blob/5045ed0e69b08de4a122f7400b45c9e86e53d10b/CHANGELOG.md#breaking-change) for full details.

## 💪 Community contributions

A huge thanks is due to the community members who contributed to this release:

* [Jakub Rybinski](https://github.com/jrybinski) provided Polish translations for the Admin UI
* [Nico Hauser](https://github.com/Tyratox) fixed a critical performance issue
* [Kai Chu](https://github.com/kai-chu) improved the configuration possibilities of the GraphQL APIs

### 📃 All changes in the [Vendure 0.12.0 Changelog](https://github.com/vendure-ecommerce/vendure/blob/ed76b3c928129238df727c89b40ccfa7d0b26bf0/CHANGELOG.md#0120-2020-05-12)
