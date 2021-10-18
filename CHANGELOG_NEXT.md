## 1.3.0-beta.1 (2021-10-08)


#### Features

* **admin-ui** Add empty option for nullable custom field selects ([894ca4a](https://github.com/vendure-ecommerce/vendure/commit/894ca4a)), closes [#1083](https://github.com/vendure-ecommerce/vendure/issues/1083)
* **admin-ui** Display pending search index updates in product list ([6f4a89f](https://github.com/vendure-ecommerce/vendure/commit/6f4a89f)), closes [#1137](https://github.com/vendure-ecommerce/vendure/issues/1137)
* **admin-ui** Display retry data in job list ([9c544bf](https://github.com/vendure-ecommerce/vendure/commit/9c544bf))
* **core** Add DB-based buffer storage support to DefaultJobQueuePlugin ([f26ad4b](https://github.com/vendure-ecommerce/vendure/commit/f26ad4b)), closes [#1137](https://github.com/vendure-ecommerce/vendure/issues/1137)
* **core** Allow DefaultJobQueue retries to be configured per queue ([5017622](https://github.com/vendure-ecommerce/vendure/commit/5017622)), closes [#1111](https://github.com/vendure-ecommerce/vendure/issues/1111)
* **core** Create buffering logic for DefaultSearchPlugin ([6a47dcf](https://github.com/vendure-ecommerce/vendure/commit/6a47dcf)), closes [#1137](https://github.com/vendure-ecommerce/vendure/issues/1137)
* **core** Create JobBuffer infrastructure ([d6aa20f](https://github.com/vendure-ecommerce/vendure/commit/d6aa20f)), closes [#1137](https://github.com/vendure-ecommerce/vendure/issues/1137)
* **core** Expose `nullable` property of CustomFieldConfig ([9ec6b90](https://github.com/vendure-ecommerce/vendure/commit/9ec6b90)), closes [#1083](https://github.com/vendure-ecommerce/vendure/issues/1083)
* **core** Expose `withTransaction` method on TransactionalConnection ([861ef29](https://github.com/vendure-ecommerce/vendure/commit/861ef29)), closes [#1129](https://github.com/vendure-ecommerce/vendure/issues/1129)
* **core** Expose pending search index updates operations in Admin API ([53a1943](https://github.com/vendure-ecommerce/vendure/commit/53a1943)), closes [#1137](https://github.com/vendure-ecommerce/vendure/issues/1137)
* **core** Expose retry data on Job type in Admin API ([4b15ef4](https://github.com/vendure-ecommerce/vendure/commit/4b15ef4))
* **core** Make password hashing strategy configurable ([e5abab0](https://github.com/vendure-ecommerce/vendure/commit/e5abab0)), closes [#1063](https://github.com/vendure-ecommerce/vendure/issues/1063)
* **elasticsearch-plugin** Support search index job batching ([f3fb298](https://github.com/vendure-ecommerce/vendure/commit/f3fb298)), closes [#1137](https://github.com/vendure-ecommerce/vendure/issues/1137)
* **job-queue-plugin** Allow config of retries/backoff for BullMQ ([9fda858](https://github.com/vendure-ecommerce/vendure/commit/9fda858)), closes [#1111](https://github.com/vendure-ecommerce/vendure/issues/1111)
* **job-queue-plugin** Implement Redis-based job buffering ([c7b91c3](https://github.com/vendure-ecommerce/vendure/commit/c7b91c3))

#### Fixes

* **core** Correct cancellation logic with custom Order process ([b8448c1](https://github.com/vendure-ecommerce/vendure/commit/b8448c1)), closes [#1104](https://github.com/vendure-ecommerce/vendure/issues/1104)
* **core** Correctly calculate job duration for pending/retrying jobs ([73fa278](https://github.com/vendure-ecommerce/vendure/commit/73fa278))
* **core** Fix error when resolving deleted Product from Order ([511f04d](https://github.com/vendure-ecommerce/vendure/commit/511f04d)), closes [#1125](https://github.com/vendure-ecommerce/vendure/issues/1125)
* **create** Correct escaping of quotes in templates ([9537245](https://github.com/vendure-ecommerce/vendure/commit/9537245))
* **job-queue-plugin** Close redis connection on destroy ([64ebdd1](https://github.com/vendure-ecommerce/vendure/commit/64ebdd1))
* **job-queue-plugin** Correctly filter BullMQ jobs by isSettled ([2f24a33](https://github.com/vendure-ecommerce/vendure/commit/2f24a33))
* **job-queue-plugin** More accurate determination of BullMQ job state ([3b3bb3b](https://github.com/vendure-ecommerce/vendure/commit/3b3bb3b))

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
