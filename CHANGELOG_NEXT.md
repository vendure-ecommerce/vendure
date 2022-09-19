## 2.0.0-next.17 (2022-09-19)


#### Features

* **admin-ui** Add basic table support to rich text editor ([09f8482](https://github.com/vendure-ecommerce/vendure/commit/09f8482)), closes [#1716](https://github.com/vendure-ecommerce/vendure/issues/1716)
* **admin-ui** Add context menu for images in rich text editor ([5b09abd](https://github.com/vendure-ecommerce/vendure/commit/5b09abd)), closes [#1716](https://github.com/vendure-ecommerce/vendure/issues/1716)
* **admin-ui** Add context menu for table operations ([7b68300](https://github.com/vendure-ecommerce/vendure/commit/7b68300)), closes [#1716](https://github.com/vendure-ecommerce/vendure/issues/1716)
* **admin-ui** Add filter inheritance control to Collection detail view ([7f1b01e](https://github.com/vendure-ecommerce/vendure/commit/7f1b01e)), closes [#1382](https://github.com/vendure-ecommerce/vendure/issues/1382)
* **admin-ui** Implement raw HTML editing support in rich text editor ([e9f7fcd](https://github.com/vendure-ecommerce/vendure/commit/e9f7fcd)), closes [#1716](https://github.com/vendure-ecommerce/vendure/issues/1716)
* **admin-ui** Improve styling of rich text editor ([054aba4](https://github.com/vendure-ecommerce/vendure/commit/054aba4))
* **admin-ui** Update collection preview on filter inheritance toggle ([1a4aced](https://github.com/vendure-ecommerce/vendure/commit/1a4aced))
* **admin-ui** Update to Angular v13 ([3b49d23](https://github.com/vendure-ecommerce/vendure/commit/3b49d23))
* **asset-server-plugin** Update to Sharp v0.30 ([15d8e8d](https://github.com/vendure-ecommerce/vendure/commit/15d8e8d))
* **core** Add indices to many-to-one relations ([01e369f](https://github.com/vendure-ecommerce/vendure/commit/01e369f)), closes [#1502](https://github.com/vendure-ecommerce/vendure/issues/1502)
* **core** Added a unique index to Order.code ([aa6025d](https://github.com/vendure-ecommerce/vendure/commit/aa6025d))
* **core** Collection preview handles filter inheritance ([3d2c0fb](https://github.com/vendure-ecommerce/vendure/commit/3d2c0fb))
* **core** Collections can control inheritance of filters ([5d4206f](https://github.com/vendure-ecommerce/vendure/commit/5d4206f)), closes [#1382](https://github.com/vendure-ecommerce/vendure/issues/1382)
* **core** Export prorate function (#1783) ([d86fa29](https://github.com/vendure-ecommerce/vendure/commit/d86fa29)), closes [#1783](https://github.com/vendure-ecommerce/vendure/issues/1783)
* **core** Improve Collection tree data structure ([5e7af0d](https://github.com/vendure-ecommerce/vendure/commit/5e7af0d))
* **core** Update codegen errors plugin to use object inputs ([6b9b2a4](https://github.com/vendure-ecommerce/vendure/commit/6b9b2a4))
* **core** Update to NestJS v8, Apollo Server v3, GraphQL v16 ([c843860](https://github.com/vendure-ecommerce/vendure/commit/c843860))
* **email-plugin** Allow to override email language (#1775) ([54c41ac](https://github.com/vendure-ecommerce/vendure/commit/54c41ac)), closes [#1775](https://github.com/vendure-ecommerce/vendure/issues/1775)
* **email-plugin** Use full Nodemailer SMTPTransport options (#1781) ([86b12bc](https://github.com/vendure-ecommerce/vendure/commit/86b12bc)), closes [#1781](https://github.com/vendure-ecommerce/vendure/issues/1781)
* **payments-plugin** Add `includeCustomerId` metadata key to Braintree ([a94fc22](https://github.com/vendure-ecommerce/vendure/commit/a94fc22))
* **payments-plugin** Add support for opting-out of Braintree vault ([faeef6d](https://github.com/vendure-ecommerce/vendure/commit/faeef6d)), closes [#1651](https://github.com/vendure-ecommerce/vendure/issues/1651)

#### Fixes

* **admin-ui** Adjust rich text context menu sensitivity ([86442cf](https://github.com/vendure-ecommerce/vendure/commit/86442cf))
* **admin-ui** Fix broken filter controls in Collection detail ([fd67ac2](https://github.com/vendure-ecommerce/vendure/commit/fd67ac2))
* **admin-ui** Fix issues with rich text editor in custom field ([f350ad8](https://github.com/vendure-ecommerce/vendure/commit/f350ad8))
* **admin-ui** Fix issues with rich text editor in custom field ([aa13dcb](https://github.com/vendure-ecommerce/vendure/commit/aa13dcb))
* **admin-ui** Fix merge error in collection detail component ([09fc5ef](https://github.com/vendure-ecommerce/vendure/commit/09fc5ef))
* **admin-ui** Fix rich text editor when used in custom field list ([77fef28](https://github.com/vendure-ecommerce/vendure/commit/77fef28))
* **admin-ui** Fix rich text editor when used in custom field list ([21ef048](https://github.com/vendure-ecommerce/vendure/commit/21ef048))
* **admin-ui** Rename vdr-product-selector ([9d9275c](https://github.com/vendure-ecommerce/vendure/commit/9d9275c))
* **core** Correctly populate Collections in channel ([58090bb](https://github.com/vendure-ecommerce/vendure/commit/58090bb))


### BREAKING CHANGE

* Explicit indexes have been added to many-to-one relations used throughout the data
model. If you are using MySQL/MariaDB you should not notice a change from this, since they
automatically add indexes to FK relations. Postgres, however, does not so this change will require
a DB migration.
* The Admin UI component `vdr-product-selector` has been renamed to
 `vdr-product-variant-selector` to more accurately represent what it does.

 If you are using `vdr-product-selector` if any ui extensions code, update it to use the
 new selector.
* The data structure used to represent the tree of Collections has changed,
which will require a DB migration.
* The internal ErrorResult classes now take all constructors arguments
as a single input object.
* The internal ErrorResult classes now take all constructors arguments
as a single input object.

feat(core): Update codegen errors plugin to use object inputs
* The new `inheritFilters` property on the Collection entity will require a DB
migration.
## 2.0.0-next.16 (2022-09-15)


#### Features

* **core** Export prorate function (#1783) ([d86fa29](https://github.com/vendure-ecommerce/vendure/commit/d86fa29)), closes [#1783](https://github.com/vendure-ecommerce/vendure/issues/1783)
* **email-plugin** Allow to override email language (#1775) ([54c41ac](https://github.com/vendure-ecommerce/vendure/commit/54c41ac)), closes [#1775](https://github.com/vendure-ecommerce/vendure/issues/1775)
* **email-plugin** Use full Nodemailer SMTPTransport options (#1781) ([86b12bc](https://github.com/vendure-ecommerce/vendure/commit/86b12bc)), closes [#1781](https://github.com/vendure-ecommerce/vendure/issues/1781)
* **payments-plugin** Add `includeCustomerId` metadata key to Braintree ([a94fc22](https://github.com/vendure-ecommerce/vendure/commit/a94fc22))

#### Fixes

* **admin-ui** Adjust rich text context menu sensitivity ([86442cf](https://github.com/vendure-ecommerce/vendure/commit/86442cf))
* **admin-ui** Fix issues with rich text editor in custom field ([f350ad8](https://github.com/vendure-ecommerce/vendure/commit/f350ad8))
* **admin-ui** Fix rich text editor when used in custom field list ([77fef28](https://github.com/vendure-ecommerce/vendure/commit/77fef28))
* **core** Handle edge-case of Collection.breadcrumbs having null values ([4a9ec5c](https://github.com/vendure-ecommerce/vendure/commit/4a9ec5c))
* **create** Make dotenv a dependency, not devDependency ([a641beb](https://github.com/vendure-ecommerce/vendure/commit/a641beb))

## 2.0.0-next.15 (2022-09-06)

(This was released to rectify a publishing error with the last version. No code changes.)

## 2.0.0-next.14 (2022-09-06)


#### Fixes

* **admin-ui** Fix issues with rich text editor in custom field ([aa13dcb](https://github.com/vendure-ecommerce/vendure/commit/aa13dcb))
* **admin-ui** Fix rich text editor when used in custom field list ([21ef048](https://github.com/vendure-ecommerce/vendure/commit/21ef048))

## 2.0.0-next.13 (2022-09-06)


#### Features

* **admin-ui** Add basic table support to rich text editor ([09f8482](https://github.com/vendure-ecommerce/vendure/commit/09f8482)), closes [#1716](https://github.com/vendure-ecommerce/vendure/issues/1716)
* **admin-ui** Add context menu for images in rich text editor ([5b09abd](https://github.com/vendure-ecommerce/vendure/commit/5b09abd)), closes [#1716](https://github.com/vendure-ecommerce/vendure/issues/1716)
* **admin-ui** Add context menu for table operations ([7b68300](https://github.com/vendure-ecommerce/vendure/commit/7b68300)), closes [#1716](https://github.com/vendure-ecommerce/vendure/issues/1716)
* **admin-ui** Implement raw HTML editing support in rich text editor ([e9f7fcd](https://github.com/vendure-ecommerce/vendure/commit/e9f7fcd)), closes [#1716](https://github.com/vendure-ecommerce/vendure/issues/1716)
* **admin-ui** Improve styling of rich text editor ([054aba4](https://github.com/vendure-ecommerce/vendure/commit/054aba4))
* **payments-plugin** Add support for opting-out of Braintree vault ([faeef6d](https://github.com/vendure-ecommerce/vendure/commit/faeef6d)), closes [#1651](https://github.com/vendure-ecommerce/vendure/issues/1651)

#### Fixes

* **core** Correctly populate shipping/billing address for new customer ([264b326](https://github.com/vendure-ecommerce/vendure/commit/264b326))
* **create** Fix default migration path of scaffold (#1759) ([e1c90cc](https://github.com/vendure-ecommerce/vendure/commit/e1c90cc)), closes [#1759](https://github.com/vendure-ecommerce/vendure/issues/1759)

## 2.0.0-next.12 (2022-08-29)

* Includes all features & fixes from v1.7.1

## 2.0.0-next.11 (2022-08-15)


#### Features

* **admin-ui** Implement pagination & filtering for customer groups ([972123f](https://github.com/vendure-ecommerce/vendure/commit/972123f)), closes [#1360](https://github.com/vendure-ecommerce/vendure/issues/1360)
* **admin-ui** Support filtering orders by transaction ID ([74eac8f](https://github.com/vendure-ecommerce/vendure/commit/74eac8f)), closes [#1520](https://github.com/vendure-ecommerce/vendure/issues/1520)
* **admin-ui** Support tabbed custom fields in Order detail view ([013c126](https://github.com/vendure-ecommerce/vendure/commit/013c126)), closes [#1562](https://github.com/vendure-ecommerce/vendure/issues/1562)
* **asset-server-plugin** Add support for avif image format ([1c49143](https://github.com/vendure-ecommerce/vendure/commit/1c49143)), closes [#482](https://github.com/vendure-ecommerce/vendure/issues/482)
* **asset-server-plugin** Allow custom AssetPreviewStrategy to be set ([add65e3](https://github.com/vendure-ecommerce/vendure/commit/add65e3)), closes [#1650](https://github.com/vendure-ecommerce/vendure/issues/1650)
* **asset-server-plugin** Enable preview image format configuration ([f7c0800](https://github.com/vendure-ecommerce/vendure/commit/f7c0800)), closes [#1650](https://github.com/vendure-ecommerce/vendure/issues/1650)
* **asset-server-plugin** Support for specifying format in query param ([5a0cbe6](https://github.com/vendure-ecommerce/vendure/commit/5a0cbe6)), closes [#482](https://github.com/vendure-ecommerce/vendure/issues/482)
* **core** Add support for custom GraphQL scalars ([099a36c](https://github.com/vendure-ecommerce/vendure/commit/099a36c)), closes [#1593](https://github.com/vendure-ecommerce/vendure/issues/1593)
* **core** Declare setDefaultContext in VendureLogger (#1672) ([5a93bf0](https://github.com/vendure-ecommerce/vendure/commit/5a93bf0)), closes [#1672](https://github.com/vendure-ecommerce/vendure/issues/1672)
* **core** Enable defining custom states in a type-safe manner (#1678) ([4e2b4ad](https://github.com/vendure-ecommerce/vendure/commit/4e2b4ad)), closes [#1678](https://github.com/vendure-ecommerce/vendure/issues/1678)
* **core** Support filtering orders by transactionId ([7806bc4](https://github.com/vendure-ecommerce/vendure/commit/7806bc4)), closes [#1520](https://github.com/vendure-ecommerce/vendure/issues/1520)
* **ui-devkit** Support Clarity Sass variable overrides (#1684) ([46d1e2d](https://github.com/vendure-ecommerce/vendure/commit/46d1e2d)), closes [#1684](https://github.com/vendure-ecommerce/vendure/issues/1684)

#### Fixes

* Includes all fixes from v1.6.5

## 2.0.0-next.10 (2022-07-07)


#### Fixes

* **admin-ui** Fix facet-value-form-input when used with custom fields ([0ae36a9](https://github.com/vendure-ecommerce/vendure/commit/0ae36a9))
* **core** Add missing `languageCode` field on ShippingMethod type ([4fab7cf](https://github.com/vendure-ecommerce/vendure/commit/4fab7cf))
* **core** Correctly resolve translatable custom field relations ([354932c](https://github.com/vendure-ecommerce/vendure/commit/354932c))
* **payments-plugin** Fix error on Braintree refund failure ([0b79eb5](https://github.com/vendure-ecommerce/vendure/commit/0b79eb5))

Includes all fixes from v1.6.3

#### Features

* **admin-ui** Show total items in datatables (#1580) ([e8e349c](https://github.com/vendure-ecommerce/vendure/commit/e8e349c)), closes [#1580](https://github.com/vendure-ecommerce/vendure/issues/1580)
* **core** Deprecation of getRepository without context argument (#1603) ([9ec2fe5](https://github.com/vendure-ecommerce/vendure/commit/9ec2fe5)), closes [#1603](https://github.com/vendure-ecommerce/vendure/issues/1603)
* **payments-plugin** BraintreePlugin make card vault optional ([16ad00c](https://github.com/vendure-ecommerce/vendure/commit/16ad00c)), closes [#1651](https://github.com/vendure-ecommerce/vendure/issues/1651)
* **payments-plugin** Make BraintreePlugin metadata configurable ([99c80e8](https://github.com/vendure-ecommerce/vendure/commit/99c80e8))


### BREAKING CHANGE

* (TypeORM): Due to an update of the TypeORM version, there is a potential breaking change if you make use of TypeORM's soft-remove feature in combination with listeners/subscribers. Namely, update listeners and subscriber no longer triggered by soft-remove and recover (https://github.com/typeorm/typeorm/blob/master/CHANGELOG.md#0242-2022-02-16). This is not used in Vendure core and is a relatively obscure edge-case.

## 2.0.0-next.9 (2022-06-21)


#### Features

* **core** Implement AssetImportStrategy, enable asset import from urls ([75653ae](https://github.com/vendure-ecommerce/vendure/commit/75653ae))
* **core** Support save points (nested transactions) (#1579) ([9813d11](https://github.com/vendure-ecommerce/vendure/commit/9813d11)), closes [#1579](https://github.com/vendure-ecommerce/vendure/issues/1579)

#### Fixes

* **core** Introduced errorOnFail flag for job.updates() method (#1627) ([464924c](https://github.com/vendure-ecommerce/vendure/commit/464924c)), closes [#1627](https://github.com/vendure-ecommerce/vendure/issues/1627) [#1551](https://github.com/vendure-ecommerce/vendure/issues/1551)


### BREAKING CHANGE

* (TypeORM): Due to an update of the TypeORM version, there is a potential breaking change if you make use of TypeORM's soft-remove feature in combination with listeners/subscribers. Namely, update listeners and subscriber no longer triggered by soft-remove and recover (https://github.com/typeorm/typeorm/blob/master/CHANGELOG.md#0242-2022-02-16). This is not used in Vendure core and is a relatively obscure edge-case.
## 2.0.0-next.8 (2022-06-12)

Includes all fixes from v1.6.2

## 2.0.0-next.7 (2022-05-19)

This release brings the next branch to parity with v1.6 (in addition to the new breaking changes already on the `next` release).

#### Features

* **admin-ui** Update collection preview on filter inheritance toggle ([1a4aced](https://github.com/vendure-ecommerce/vendure/commit/1a4aced))
* **core** Collection preview handles filter inheritance ([3d2c0fb](https://github.com/vendure-ecommerce/vendure/commit/3d2c0fb))

#### Fixes

* **admin-ui** Fix broken filter controls in Collection detail ([fd67ac2](https://github.com/vendure-ecommerce/vendure/commit/fd67ac2))



## 2.0.0-next.6 (2022-05-18)


#### Fixes

* **admin-ui** Fix merge error in collection detail component ([09fc5ef](https://github.com/vendure-ecommerce/vendure/commit/09fc5ef))
* **admin-ui** Rename vdr-product-selector ([9d9275c](https://github.com/vendure-ecommerce/vendure/commit/9d9275c))
* **core** Correctly populate Collections in channel ([58090bb](https://github.com/vendure-ecommerce/vendure/commit/58090bb))

#### Features

* **admin-ui** Add filter inheritance control to Collection detail view ([7f1b01e](https://github.com/vendure-ecommerce/vendure/commit/7f1b01e)), closes [#1382](https://github.com/vendure-ecommerce/vendure/issues/1382)
* **admin-ui** Update to Angular v13 ([3b49d23](https://github.com/vendure-ecommerce/vendure/commit/3b49d23))
* **asset-server-plugin** Update to Sharp v0.30 ([15d8e8d](https://github.com/vendure-ecommerce/vendure/commit/15d8e8d))
* **core** Add indices to many-to-one relations ([01e369f](https://github.com/vendure-ecommerce/vendure/commit/01e369f)), closes [#1502](https://github.com/vendure-ecommerce/vendure/issues/1502)
* **core** Added a unique index to Order.code ([aa6025d](https://github.com/vendure-ecommerce/vendure/commit/aa6025d))
* **core** Collections can control inheritance of filters ([5d4206f](https://github.com/vendure-ecommerce/vendure/commit/5d4206f)), closes [#1382](https://github.com/vendure-ecommerce/vendure/issues/1382)
* **core** Improve Collection tree data structure ([5e7af0d](https://github.com/vendure-ecommerce/vendure/commit/5e7af0d))
* **core** Update codegen errors plugin to use object inputs ([6b9b2a4](https://github.com/vendure-ecommerce/vendure/commit/6b9b2a4))
* **core** Update to NestJS v8, Apollo Server v3, GraphQL v16 ([c843860](https://github.com/vendure-ecommerce/vendure/commit/c843860))


### BREAKING CHANGE

* Explicit indexes have been added to many-to-one relations used throughout the data
model. If you are using MySQL/MariaDB you should not notice a change from this, since they
automatically add indexes to FK relations. Postgres, however, does not so this change will require
a DB migration.
* The Admin UI component `vdr-product-selector` has been renamed to
 `vdr-product-variant-selector` to more accurately represent what it does.

 If you are using `vdr-product-selector` if any ui extensions code, update it to use the
 new selector.
* The data structure used to represent the tree of Collections has changed,
which will require a DB migration.
* The internal ErrorResult classes now take all constructors arguments
as a single input object.
* The internal ErrorResult classes now take all constructors arguments
as a single input object.

feat(core): Update codegen errors plugin to use object inputs
* The new `inheritFilters` property on the Collection entity will require a DB
migration.
## 2.0.0-next.5 (2022-05-02)


#### Features

* **admin-ui** Implement combination mode toggle for Collection filters ([cb1e137](https://github.com/vendure-ecommerce/vendure/commit/cb1e137))
* **admin-ui** Implement FormInput for multi product/variant selection ([47c9b0e](https://github.com/vendure-ecommerce/vendure/commit/47c9b0e))
* **core** Add boolean combination support on default CollectionFilters ([8889ac2](https://github.com/vendure-ecommerce/vendure/commit/8889ac2))
* **core** Implement unique constraint for custom fields ([07e1601](https://github.com/vendure-ecommerce/vendure/commit/07e1601)), closes [#1476](https://github.com/vendure-ecommerce/vendure/issues/1476)
* **core** Make all health checks configurable ([f3d2d59](https://github.com/vendure-ecommerce/vendure/commit/f3d2d59)), closes [#1494](https://github.com/vendure-ecommerce/vendure/issues/1494)
* **core** Make OrderService.applyPriceAdjustments() public ([826fd55](https://github.com/vendure-ecommerce/vendure/commit/826fd55)), closes [#1522](https://github.com/vendure-ecommerce/vendure/issues/1522)
* **core** Use variant featuredAsset in OrderLine if available ([0c308e2](https://github.com/vendure-ecommerce/vendure/commit/0c308e2)), closes [#1488](https://github.com/vendure-ecommerce/vendure/issues/1488)
* **payments-plugin** Deprecate orderId when generating Braintree token ([8ba76f2](https://github.com/vendure-ecommerce/vendure/commit/8ba76f2)), closes [#1517](https://github.com/vendure-ecommerce/vendure/issues/1517)

#### Fixes

* **admin-ui** Improve display of many channels on Product detail ([87b8a53](https://github.com/vendure-ecommerce/vendure/commit/87b8a53)), closes [#1431](https://github.com/vendure-ecommerce/vendure/issues/1431)
* **core** Manage transactions outside of orderService.modifyOrder function. (#1533) ([e707274](https://github.com/vendure-ecommerce/vendure/commit/e707274)), closes [#1533](https://github.com/vendure-ecommerce/vendure/issues/1533)
* **job-queue-plugin** Fix Redis health indicator error reporting ([48a30fb](https://github.com/vendure-ecommerce/vendure/commit/48a30fb))
* **ui-devkit** Wrap output path in quotes. (#1519) ([755d2e2](https://github.com/vendure-ecommerce/vendure/commit/755d2e2)), closes [#1519](https://github.com/vendure-ecommerce/vendure/issues/1519)

#### Perf

* **core** Optimize query to fetch all collection ids on changes ([a362fb4](https://github.com/vendure-ecommerce/vendure/commit/a362fb4))

## 2.0.0-next.4 (2022-04-26)


#### Fixes

* **admin-ui** Fix merge error in collection detail component ([09fc5ef](https://github.com/vendure-ecommerce/vendure/commit/09fc5ef))
* **core** Make OrderLine.items eager-loaded from the DB ([8465d84](https://github.com/vendure-ecommerce/vendure/commit/8465d84))

## 2.0.0-next.3 (2022-04-25)


#### Features

* **admin-ui** Add live preview of Collection filter changes ([ba6c64a](https://github.com/vendure-ecommerce/vendure/commit/ba6c64a)), closes [#1530](https://github.com/vendure-ecommerce/vendure/issues/1530)
* **admin-ui** Add sku to Collection contents table ([8c2263c](https://github.com/vendure-ecommerce/vendure/commit/8c2263c))
* **admin-ui** Display description tooltip for configurable args ([837e1f2](https://github.com/vendure-ecommerce/vendure/commit/837e1f2))
* **admin-ui** Implement content preview when creating collection ([1e4f072](https://github.com/vendure-ecommerce/vendure/commit/1e4f072)), closes [#1530](https://github.com/vendure-ecommerce/vendure/issues/1530)
* **admin-ui** Improve styling of configurable arg inputs ([d20a1dc](https://github.com/vendure-ecommerce/vendure/commit/d20a1dc))
* **admin-ui** Persist Collection list expanded states to the url ([d67187e](https://github.com/vendure-ecommerce/vendure/commit/d67187e)), closes [#1532](https://github.com/vendure-ecommerce/vendure/issues/1532)
* **admin-ui** Persist Collection list filter term to the url ([dcdd05b](https://github.com/vendure-ecommerce/vendure/commit/dcdd05b)), closes [#1532](https://github.com/vendure-ecommerce/vendure/issues/1532)
* **core** Add `metadataModifiers` for low-level DB entity config ([16e52f2](https://github.com/vendure-ecommerce/vendure/commit/16e52f2)), closes [#1506](https://github.com/vendure-ecommerce/vendure/issues/1506) [#1502](https://github.com/vendure-ecommerce/vendure/issues/1502)
* **core** Add indices to many-to-one relations ([01e369f](https://github.com/vendure-ecommerce/vendure/commit/01e369f)), closes [#1502](https://github.com/vendure-ecommerce/vendure/issues/1502)
* **core** Add new variantIdCollectionFilter default CollectionFilter ([449c584](https://github.com/vendure-ecommerce/vendure/commit/449c584))
* **core** Added a unique index to Order.code ([aa6025d](https://github.com/vendure-ecommerce/vendure/commit/aa6025d))
* **core** Allow entity alias to be specified in ListQueryBuilder ([f221940](https://github.com/vendure-ecommerce/vendure/commit/f221940))
* **core** Create Relations decorator ([063b5fe](https://github.com/vendure-ecommerce/vendure/commit/063b5fe)), closes [#1506](https://github.com/vendure-ecommerce/vendure/issues/1506)
* **core** Expose Importer.importProducts method ([bbe09aa](https://github.com/vendure-ecommerce/vendure/commit/bbe09aa))
* **core** Implement `previewCollectionVariants` query in Admin API ([1c3b38c](https://github.com/vendure-ecommerce/vendure/commit/1c3b38c)), closes [#1530](https://github.com/vendure-ecommerce/vendure/issues/1530)
* **core** Make search strategy configurable via plugin options (#1504) ([b31694f](https://github.com/vendure-ecommerce/vendure/commit/b31694f)), closes [#1504](https://github.com/vendure-ecommerce/vendure/issues/1504)
* **core** Pass shipping method to calculator and eligibility checker (#1509) ([826aa4a](https://github.com/vendure-ecommerce/vendure/commit/826aa4a)), closes [#1509](https://github.com/vendure-ecommerce/vendure/issues/1509)
* **core** Use query relations data to optimize DB joins ([0421285](https://github.com/vendure-ecommerce/vendure/commit/0421285)), closes [#1506](https://github.com/vendure-ecommerce/vendure/issues/1506) [#1407](https://github.com/vendure-ecommerce/vendure/issues/1407)

#### Fixes

* **admin-ui** Prevent route change on collection contents list change ([5589628](https://github.com/vendure-ecommerce/vendure/commit/5589628)), closes [#1530](https://github.com/vendure-ecommerce/vendure/issues/1530)
* **core** Fix error in configurable operation codec when arg not found ([9ba44f4](https://github.com/vendure-ecommerce/vendure/commit/9ba44f4))

#### Perf

* **core** Further optimizations to ListQueryBuilder ([d9577f8](https://github.com/vendure-ecommerce/vendure/commit/d9577f8)), closes [#1506](https://github.com/vendure-ecommerce/vendure/issues/1506) [#1503](https://github.com/vendure-ecommerce/vendure/issues/1503)
* **core** Optimize ListQueryBuilder performance ([8d87f05](https://github.com/vendure-ecommerce/vendure/commit/8d87f05)), closes [#1503](https://github.com/vendure-ecommerce/vendure/issues/1503) [#1506](https://github.com/vendure-ecommerce/vendure/issues/1506) [1#L122](https://github.com/1/issues/L122)


### BREAKING CHANGE

* Explicit indexes have been added to many-to-one relations used throughout the data
model. If you are using MySQL/MariaDB you should not notice a change from this, since they
automatically add indexes to FK relations. Postgres, however, does not so this change will require
a DB migration.

## 2.0.0-next.2 (2022-03-21)


#### Features


* **core** Loosen constraints on adding payment to Order ([7a42b01](https://github.com/vendure-ecommerce/vendure/commit/7a42b01)), closes [#963](https://github.com/vendure-ecommerce/vendure/issues/963)
* **core** Allow schema introspection to be disabled ([052d494](https://github.com/vendure-ecommerce/vendure/commit/052d494)), closes [#1353](https://github.com/vendure-ecommerce/vendure/issues/1353)
* **admin-ui** Allow couponCodes to be set when modifying Order ([8083219](https://github.com/vendure-ecommerce/vendure/commit/8083219)), closes [#1308](https://github.com/vendure-ecommerce/vendure/issues/1308)
* **core** Allow couponCodes to be set when modifying Order ([af3a705](https://github.com/vendure-ecommerce/vendure/commit/af3a705)), closes [#1308](https://github.com/vendure-ecommerce/vendure/issues/1308)
* **admin-ui-plugin** Make refund/cancellation reasons configurable ([1ab0119](https://github.com/vendure-ecommerce/vendure/commit/1ab0119)), closes [#893](https://github.com/vendure-ecommerce/vendure/issues/893)
* **admin-ui** Implement generic custom field relation selector ([f3ea8a3](https://github.com/vendure-ecommerce/vendure/commit/f3ea8a3))

#### Fixes

* **core** Fix FK error when merging orders with an existing session ([7cedf49](https://github.com/vendure-ecommerce/vendure/commit/7cedf49)), closes [#1454](https://github.com/vendure-ecommerce/vendure/issues/1454)
* **core** Export all Promotion conditions & actions ([56b30fa](https://github.com/vendure-ecommerce/vendure/commit/56b30fa)), closes [#1308](https://github.com/vendure-ecommerce/vendure/issues/1308)
* **core** Prevent error cause by order in outdated state ([2266293](https://github.com/vendure-ecommerce/vendure/commit/2266293))

## 2.0.0-next.1 (2022-03-07)


#### Fixes

* **admin-ui** Rename vdr-product-selector ([9d9275c](https://github.com/vendure-ecommerce/vendure/commit/9d9275c))
* **core** Correctly populate Collections in channel ([b42bf1e](https://github.com/vendure-ecommerce/vendure/commit/b42bf1e))
* **core** Support usage of GQL interfaces on relational custom field (#1460) ([c608516](https://github.com/vendure-ecommerce/vendure/commit/c608516)), closes [#1460](https://github.com/vendure-ecommerce/vendure/issues/1460)
* **email-plugin** Add currency code in mock email confirmation (#1448) ([ef8b244](https://github.com/vendure-ecommerce/vendure/commit/ef8b244)), closes [#1448](https://github.com/vendure-ecommerce/vendure/issues/1448)
* **payments-plugin** Mollie payment intent + Stripe unauthorized settlement fix (#1437) ([37e5f58](https://github.com/vendure-ecommerce/vendure/commit/37e5f58)), closes [#1437](https://github.com/vendure-ecommerce/vendure/issues/1437) [#1432](https://github.com/vendure-ecommerce/vendure/issues/1432) [#1340](https://github.com/vendure-ecommerce/vendure/issues/1340)

#### Features

* **admin-ui** Add filter inheritance control to Collection detail view ([7f1b01e](https://github.com/vendure-ecommerce/vendure/commit/7f1b01e)), closes [#1382](https://github.com/vendure-ecommerce/vendure/issues/1382)
* **admin-ui** Allow custom ng compiler args to be passed to admin ui compiler (#1386) ([d47df21](https://github.com/vendure-ecommerce/vendure/commit/d47df21)), closes [#1386](https://github.com/vendure-ecommerce/vendure/issues/1386)
* **core** Collections can control inheritance of filters ([5d4206f](https://github.com/vendure-ecommerce/vendure/commit/5d4206f)), closes [#1382](https://github.com/vendure-ecommerce/vendure/issues/1382)
* **core** Improve Collection tree data structure ([5e7af0d](https://github.com/vendure-ecommerce/vendure/commit/5e7af0d))


### BREAKING CHANGE

* The Admin UI component `vdr-product-selector` has been renamed to
 `vdr-product-variant-selector` to more accurately represent what it does.

 If you are using `vdr-product-selector` if any ui extensions code, update it to use the
 new selector.
* The data structure used to represent the tree of Collections has changed,
which will require a DB migration.
* The new `inheritFilters` property on the Collection entity will require a DB
migration.
## 2.0.0-next.0 (2022-03-01)


#### Fixes

* **admin-ui** Fix circular dependency error ([ddc8941](https://github.com/vendure-ecommerce/vendure/commit/ddc8941))
* **core** Correctly populate Collections in channel ([58090bb](https://github.com/vendure-ecommerce/vendure/commit/58090bb))
* **core** Fix regression in accessing OrderLine.items when not defined ([3fcf5dc](https://github.com/vendure-ecommerce/vendure/commit/3fcf5dc))
* **core** Use sessionDuration when creating anonymous sessions ([2960a09](https://github.com/vendure-ecommerce/vendure/commit/2960a09)), closes [#1425](https://github.com/vendure-ecommerce/vendure/issues/1425)
* **email-plugin** Correctly resolve urls for OrderLine featured assets ([15f9b44](https://github.com/vendure-ecommerce/vendure/commit/15f9b44))

#### Features

* **admin-ui** Add asset preview links to asset gallery & asset detail ([b09bc1f](https://github.com/vendure-ecommerce/vendure/commit/b09bc1f)), closes [#1305](https://github.com/vendure-ecommerce/vendure/issues/1305)
* **admin-ui** Enable filtering CustomerList by postalCode ([f3a2654](https://github.com/vendure-ecommerce/vendure/commit/f3a2654)), closes [#1389](https://github.com/vendure-ecommerce/vendure/issues/1389)
* **admin-ui** Implement deletion of addresses from customer detail ([4a81f7c](https://github.com/vendure-ecommerce/vendure/commit/4a81f7c))
* **admin-ui** Improve cancel modal to allow full order cancellation ([3b90888](https://github.com/vendure-ecommerce/vendure/commit/3b90888)), closes [#1414](https://github.com/vendure-ecommerce/vendure/issues/1414)
* **admin-ui** More flexible assets component (#1358) ([259e352](https://github.com/vendure-ecommerce/vendure/commit/259e352)), closes [#1358](https://github.com/vendure-ecommerce/vendure/issues/1358) [#1357](https://github.com/vendure-ecommerce/vendure/issues/1357)
* **admin-ui** Update to Angular v13 ([3b49d23](https://github.com/vendure-ecommerce/vendure/commit/3b49d23))
* **asset-server-plugin** Update to Sharp v0.30 ([15d8e8d](https://github.com/vendure-ecommerce/vendure/commit/15d8e8d))
* **core** Add `inList` op to enable filtering on custom field lists ([94da850](https://github.com/vendure-ecommerce/vendure/commit/94da850)), closes [#1332](https://github.com/vendure-ecommerce/vendure/issues/1332)
* **core** Add a job queue name prefix as a config option (#1359) ([921f8e0](https://github.com/vendure-ecommerce/vendure/commit/921f8e0)), closes [#1359](https://github.com/vendure-ecommerce/vendure/issues/1359) [#1350](https://github.com/vendure-ecommerce/vendure/issues/1350)
* **core** Add option to CancelOrderInput to cancel of shipping ([9eebae3](https://github.com/vendure-ecommerce/vendure/commit/9eebae3)), closes [#1414](https://github.com/vendure-ecommerce/vendure/issues/1414)
* **core** Add order event (#1306) ([c682c0e](https://github.com/vendure-ecommerce/vendure/commit/c682c0e)), closes [#1306](https://github.com/vendure-ecommerce/vendure/issues/1306)
* **core** Add OrderLineEvent, to notify on changes to Order.lines ([16e099f](https://github.com/vendure-ecommerce/vendure/commit/16e099f)), closes [#1316](https://github.com/vendure-ecommerce/vendure/issues/1316)
* **core** Add PasswordValidationStrategy to enable password policies ([dc4bc2d](https://github.com/vendure-ecommerce/vendure/commit/dc4bc2d)), closes [#863](https://github.com/vendure-ecommerce/vendure/issues/863)
* **core** Allow channel to be specified in `populate()` function ([03b9fe1](https://github.com/vendure-ecommerce/vendure/commit/03b9fe1)), closes [#877](https://github.com/vendure-ecommerce/vendure/issues/877)
* **core** Enable filtering customers by postalCode ([6692b95](https://github.com/vendure-ecommerce/vendure/commit/6692b95)), closes [#1389](https://github.com/vendure-ecommerce/vendure/issues/1389)
* **core** Expose & document DataImportModule providers ([640f087](https://github.com/vendure-ecommerce/vendure/commit/640f087)), closes [#1336](https://github.com/vendure-ecommerce/vendure/issues/1336)
* **core** Expose RequestContextService and add `create()` method ([335dfb5](https://github.com/vendure-ecommerce/vendure/commit/335dfb5))
* **core** Include Customer in CustomerAddressEvent ([67f60ac](https://github.com/vendure-ecommerce/vendure/commit/67f60ac)), closes [#1369](https://github.com/vendure-ecommerce/vendure/issues/1369)
* **core** Update codegen errors plugin to use object inputs ([6b9b2a4](https://github.com/vendure-ecommerce/vendure/commit/6b9b2a4))
* **core** Update to NestJS v8, Apollo Server v3, GraphQL v16 ([c843860](https://github.com/vendure-ecommerce/vendure/commit/c843860))
* **payments-plugin** Add Stripe integration (#1417) ([238be6b](https://github.com/vendure-ecommerce/vendure/commit/238be6b)), closes [#1417](https://github.com/vendure-ecommerce/vendure/issues/1417)
* **ui-devkit** Allow yarn or npm to be specified to run ng compiler ([db66657](https://github.com/vendure-ecommerce/vendure/commit/db66657))


### BREAKING CHANGE

* The internal ErrorResult classes now take all constructors arguments as a single input object.

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
