## 1.3.0-beta.0 (2021-09-30)


#### Features

* **admin-ui** Add admin-ui Portuguese (Portugal) translation (#1069) ([81d9836](https://github.com/vendure-ecommerce/vendure/commit/81d9836)), closes [#1069](https://github.com/vendure-ecommerce/vendure/issues/1069)
* **admin-ui** Improve facet filtering for product search input ([43f0adb](https://github.com/vendure-ecommerce/vendure/commit/43f0adb)), closes [#1078](https://github.com/vendure-ecommerce/vendure/issues/1078)
* **admin-ui** Use server pagination of product variants ([552eafe](https://github.com/vendure-ecommerce/vendure/commit/552eafe)), closes [#1110](https://github.com/vendure-ecommerce/vendure/issues/1110)
* **core** Add config for enabling/disabling worker health check ([f620566](https://github.com/vendure-ecommerce/vendure/commit/f620566)), closes [#1112](https://github.com/vendure-ecommerce/vendure/issues/1112)
* **core** Add Product.variantList field ([438ac46](https://github.com/vendure-ecommerce/vendure/commit/438ac46)), closes [#1110](https://github.com/vendure-ecommerce/vendure/issues/1110)
* **core** Implement EntityHydrator to simplify working with entities ([28e6a3a](https://github.com/vendure-ecommerce/vendure/commit/28e6a3a)), closes [#1103](https://github.com/vendure-ecommerce/vendure/issues/1103)
* **core** Make entity cache ttl values configurable ([a05e7ab](https://github.com/vendure-ecommerce/vendure/commit/a05e7ab)), closes [#988](https://github.com/vendure-ecommerce/vendure/issues/988)
* **core** Make event bus subscriptions transaction-safe ([f0fd662](https://github.com/vendure-ecommerce/vendure/commit/f0fd662)), closes [#1107](https://github.com/vendure-ecommerce/vendure/issues/1107) [#520](https://github.com/vendure-ecommerce/vendure/issues/520)
* **core** Remove all long-lived in-memory state, use short-TTL caching ([d428ffc](https://github.com/vendure-ecommerce/vendure/commit/d428ffc))

#### Fixes

* **core** Fix transaction-related issues with in-memory caching ([d35306f](https://github.com/vendure-ecommerce/vendure/commit/d35306f))

#### Perf

* **core** Simplify hot DB query for active order ([fa563f2](https://github.com/vendure-ecommerce/vendure/commit/fa563f2))
* **core** Use memoization when caching zone members ([54dfbf4](https://github.com/vendure-ecommerce/vendure/commit/54dfbf4)), closes [#988](https://github.com/vendure-ecommerce/vendure/issues/988)
* **core** Use per-request caching for hot ProductVariant paths ([214b86b](https://github.com/vendure-ecommerce/vendure/commit/214b86b)), closes [#988](https://github.com/vendure-ecommerce/vendure/issues/988)
* **core** Use request cache for hot-path tax rate calculation ([9e22e8b](https://github.com/vendure-ecommerce/vendure/commit/9e22e8b))
