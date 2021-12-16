## 1.4.0-beta.0 (2021-12-06)


#### Features

* **admin-ui-plugin** Support for defaultLocale ([e7bd576](https://github.com/vendure-ecommerce/vendure/commit/e7bd576)), closes [#1196](https://github.com/vendure-ecommerce/vendure/issues/1196)
* **admin-ui** Add json editor field input component ([4297b87](https://github.com/vendure-ecommerce/vendure/commit/4297b87))
* **admin-ui** Add language switcher to Country & Zone list views ([7552fae](https://github.com/vendure-ecommerce/vendure/commit/7552fae))
* **admin-ui** Add rich text control form input ([0b09598](https://github.com/vendure-ecommerce/vendure/commit/0b09598)), closes [#415](https://github.com/vendure-ecommerce/vendure/issues/415) [#722](https://github.com/vendure-ecommerce/vendure/issues/722)
* **admin-ui** Add support for tabbed custom fields ([b6cb16f](https://github.com/vendure-ecommerce/vendure/commit/b6cb16f)), closes [#724](https://github.com/vendure-ecommerce/vendure/issues/724)
* **admin-ui** Allow custom components to embed in detail views ([e15c553](https://github.com/vendure-ecommerce/vendure/commit/e15c553)), closes [#415](https://github.com/vendure-ecommerce/vendure/issues/415)
* **admin-ui** Allow manual payments to be added by Administrator ([0416869](https://github.com/vendure-ecommerce/vendure/commit/0416869)), closes [#753](https://github.com/vendure-ecommerce/vendure/issues/753)
* **admin-ui** Display available UI extension points ([0963745](https://github.com/vendure-ecommerce/vendure/commit/0963745)), closes [#415](https://github.com/vendure-ecommerce/vendure/issues/415)
* **admin-ui** Export all catalog components (#1248) ([e5feac4](https://github.com/vendure-ecommerce/vendure/commit/e5feac4)), closes [#1248](https://github.com/vendure-ecommerce/vendure/issues/1248) [#1245](https://github.com/vendure-ecommerce/vendure/issues/1245)
* **admin-ui** Implement custom fields on newly-supported entities ([2da2ec9](https://github.com/vendure-ecommerce/vendure/commit/2da2ec9)), closes [#1185](https://github.com/vendure-ecommerce/vendure/issues/1185)
* **admin-ui** Implement filtering in Collection list view ([aa74129](https://github.com/vendure-ecommerce/vendure/commit/aa74129))
* **admin-ui** Support for language regions (language + locale) ([b5cdbce](https://github.com/vendure-ecommerce/vendure/commit/b5cdbce)), closes [#1196](https://github.com/vendure-ecommerce/vendure/issues/1196)
* **admin-ui** Use customField ui components specified in config ([f52459f](https://github.com/vendure-ecommerce/vendure/commit/f52459f)), closes [#415](https://github.com/vendure-ecommerce/vendure/issues/415)
* **core** Add OrderPlacedEvent ([c1465dc](https://github.com/vendure-ecommerce/vendure/commit/c1465dc)), closes [#1219](https://github.com/vendure-ecommerce/vendure/issues/1219)
* **core** Allow customField ui components to be specified in config ([e22e006](https://github.com/vendure-ecommerce/vendure/commit/e22e006)), closes [#415](https://github.com/vendure-ecommerce/vendure/issues/415)
* **core** Allow manual payments to be added by Administrator ([107ca9a](https://github.com/vendure-ecommerce/vendure/commit/107ca9a)), closes [#753](https://github.com/vendure-ecommerce/vendure/issues/753)
* **core** CustomField support on Country, CustomerGroup, PaymentMethod, Promotion, TaxCategory, ([fac803d](https://github.com/vendure-ecommerce/vendure/commit/fac803d)), closes [#1185](https://github.com/vendure-ecommerce/vendure/issues/1185)
* **core** Expand the range of events published by the EventBus (#1222) ([edc9d69](https://github.com/vendure-ecommerce/vendure/commit/edc9d69)), closes [#1222](https://github.com/vendure-ecommerce/vendure/issues/1222) [#1219](https://github.com/vendure-ecommerce/vendure/issues/1219) [#1219](https://github.com/vendure-ecommerce/vendure/issues/1219) [#1219](https://github.com/vendure-ecommerce/vendure/issues/1219) [#1219](https://github.com/vendure-ecommerce/vendure/issues/1219) [#1219](https://github.com/vendure-ecommerce/vendure/issues/1219) [#1219](https://github.com/vendure-ecommerce/vendure/issues/1219) [#1219](https://github.com/vendure-ecommerce/vendure/issues/1219)
* **core** Support CSV import in multiple languages (#1199) ([4754954](https://github.com/vendure-ecommerce/vendure/commit/4754954)), closes [#1199](https://github.com/vendure-ecommerce/vendure/issues/1199)
* **core** Upgrade TypeORM to v0.2.41 ([44f6fd5](https://github.com/vendure-ecommerce/vendure/commit/44f6fd5))
* **elasticsearch-plugin** Add custom sort parameter mapping (#1230) ([0d1f687](https://github.com/vendure-ecommerce/vendure/commit/0d1f687)), closes [#1230](https://github.com/vendure-ecommerce/vendure/issues/1230) [#1220](https://github.com/vendure-ecommerce/vendure/issues/1220) [#1220](https://github.com/vendure-ecommerce/vendure/issues/1220)
* **elasticsearch-plugin** Add option to hide indexed fields in api (#1181) (#1212) ([9193dee](https://github.com/vendure-ecommerce/vendure/commit/9193dee)), closes [#1181](https://github.com/vendure-ecommerce/vendure/issues/1181) [#1212](https://github.com/vendure-ecommerce/vendure/issues/1212)
* **payments-plugin** Allow Braintree environment to be set ([55d67d9](https://github.com/vendure-ecommerce/vendure/commit/55d67d9))

#### Fixes

* **admin-ui** Fix error if no array of assets is provided (#1249) ([5af2b12](https://github.com/vendure-ecommerce/vendure/commit/5af2b12)), closes [#1249](https://github.com/vendure-ecommerce/vendure/issues/1249)
* **admin-ui** Fix layout of Zone & CustomerGroup lists ([cd8b93d](https://github.com/vendure-ecommerce/vendure/commit/cd8b93d))
* **admin-ui** Fix rendering of custom field lists ([da9e2ce](https://github.com/vendure-ecommerce/vendure/commit/da9e2ce))
* **core** Clear shippingLines if no eligible ShippingMethods exist ([f9bc532](https://github.com/vendure-ecommerce/vendure/commit/f9bc532)), closes [#1195](https://github.com/vendure-ecommerce/vendure/issues/1195)
* **core** Correctly validate custom field list types ([6f71bf2](https://github.com/vendure-ecommerce/vendure/commit/6f71bf2)), closes [#1241](https://github.com/vendure-ecommerce/vendure/issues/1241)
* **core** Ensure all Orders have a ShippingMethod before payment ([9b9e547](https://github.com/vendure-ecommerce/vendure/commit/9b9e547))
* **core** Fix batch size error on postgres when reindexing (#1242) ([57be4c5](https://github.com/vendure-ecommerce/vendure/commit/57be4c5)), closes [#1242](https://github.com/vendure-ecommerce/vendure/issues/1242)
* **core** Fix caching of zone members when switching language ([3c32fb2](https://github.com/vendure-ecommerce/vendure/commit/3c32fb2))
* **core** Fix permissions for `pendingSearchIndexUpdates` query ([152e64b](https://github.com/vendure-ecommerce/vendure/commit/152e64b))
* **core** Fix stream not being instance of ReadStream (#1238) ([5ee371d](https://github.com/vendure-ecommerce/vendure/commit/5ee371d)), closes [#1238](https://github.com/vendure-ecommerce/vendure/issues/1238)
* **core** Gracefully handle errors in creating asset previews ([c3cfcb3](https://github.com/vendure-ecommerce/vendure/commit/c3cfcb3)), closes [#1246](https://github.com/vendure-ecommerce/vendure/issues/1246)
* **core** Make facetValueCollectionFilter safe with uuids ([a3fef0f](https://github.com/vendure-ecommerce/vendure/commit/a3fef0f))
* **core** Make populator.populateCollections more robust to bad input ([8189c1b](https://github.com/vendure-ecommerce/vendure/commit/8189c1b))
* **core** Order collection.children by position ([f2def43](https://github.com/vendure-ecommerce/vendure/commit/f2def43)), closes [#1239](https://github.com/vendure-ecommerce/vendure/issues/1239)
* **core** Re-allocate stock when cancelling a Fulfillment ([693fd83](https://github.com/vendure-ecommerce/vendure/commit/693fd83)), closes [#1250](https://github.com/vendure-ecommerce/vendure/issues/1250)

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
