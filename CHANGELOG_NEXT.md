## 2.1.0-next.7 (2023-09-29)

#### Features

* **admin-ui** Add Persian/Farsi i18n messages (#2418) ([1193863](https://github.com/vendure-ecommerce/vendure/commit/1193863)), closes [#2418](https://github.com/vendure-ecommerce/vendure/issues/2418)

#### Fixes

* **core** Fix discount calculation error edge-case ([7549aad](https://github.com/vendure-ecommerce/vendure/commit/7549aad)), closes [#2385](https://github.com/vendure-ecommerce/vendure/issues/2385)

## 2.1.0-next.6 (2023-09-27)


#### Features

* **admin-ui** Add filter preset support to Collection list ([cbfb402](https://github.com/vendure-ecommerce/vendure/commit/cbfb402))
* **admin-ui** Display original quantity after order has been modified ([a36c6e0](https://github.com/vendure-ecommerce/vendure/commit/a36c6e0))
* **admin-ui** Implement job queue filtering by status ([baeb036](https://github.com/vendure-ecommerce/vendure/commit/baeb036))
* **admin-ui** Implement values pagination for Facet detail view ([4cf1826](https://github.com/vendure-ecommerce/vendure/commit/4cf1826)), closes [#1257](https://github.com/vendure-ecommerce/vendure/issues/1257)
* **admin-ui** Improve naming & layout of catalog & stock locations ([8452300](https://github.com/vendure-ecommerce/vendure/commit/8452300))
* **core** Pass variant to ProductVariantPriceCalculationStrategy ([fee995c](https://github.com/vendure-ecommerce/vendure/commit/fee995c)), closes [#2398](https://github.com/vendure-ecommerce/vendure/issues/2398)
* **create** Allow selection of package manager ([6561bb7](https://github.com/vendure-ecommerce/vendure/commit/6561bb7))
* **job-queue-plugin** Implement default cleanup of old BullMQ jobs ([6c1d7bb](https://github.com/vendure-ecommerce/vendure/commit/6c1d7bb)), closes [#1425](https://github.com/vendure-ecommerce/vendure/issues/1425)
* **payments-plugin** Allow custom params to be passed to Stripe API ([1b29097](https://github.com/vendure-ecommerce/vendure/commit/1b29097)), closes [#2412](https://github.com/vendure-ecommerce/vendure/issues/2412)

#### Fixes

* **admin-ui** Correctly display job retries ([d3107fd](https://github.com/vendure-ecommerce/vendure/commit/d3107fd)), closes [#1467](https://github.com/vendure-ecommerce/vendure/issues/1467)
* **job-queue-plugin** Correct behaviour of job list query with BullMQ ([c148a92](https://github.com/vendure-ecommerce/vendure/commit/c148a92)), closes [#2120](https://github.com/vendure-ecommerce/vendure/issues/2120) [#1327](https://github.com/vendure-ecommerce/vendure/issues/1327)
* **job-queue-plugin** Correct retry setting for BullMQ jobs ([972ba0e](https://github.com/vendure-ecommerce/vendure/commit/972ba0e)), closes [#1467](https://github.com/vendure-ecommerce/vendure/issues/1467)


### BREAKING CHANGE

* In the Admin UI, the "stock locations" list and detail views
have been moved from the "catalog" module to the "settings" module. Also, the
menu item & breadcrumb for "inventory" has been renamed to "products".

  This is an end-user breaking change rather than a code breaking change. Any UI
extensions that link to a `/catalog/inventory/...` route will still work as there
is a redirect in place to `/catalog/products/...`.
## 2.1.0-next.5 (2023-09-18)


#### Features

* **admin-ui** Add image carousel to asset preview dialog (#2370) ([bd834d0](https://github.com/vendure-ecommerce/vendure/commit/bd834d0)), closes [#2370](https://github.com/vendure-ecommerce/vendure/issues/2370) [#2129](https://github.com/vendure-ecommerce/vendure/issues/2129)
* **admin-ui** Add more native React UI components ([04e03f8](https://github.com/vendure-ecommerce/vendure/commit/04e03f8))
* **admin-ui** Add useRouteParams react hook ([b63fb7f](https://github.com/vendure-ecommerce/vendure/commit/b63fb7f))
* **admin-ui** Expose providers to nav menu routerLink function ([1bae40e](https://github.com/vendure-ecommerce/vendure/commit/1bae40e))
* **admin-ui** Improved control over ActionBar buttons ([065a2b4](https://github.com/vendure-ecommerce/vendure/commit/065a2b4))
* **create** Better defaults for project scaffold ([fa683e7](https://github.com/vendure-ecommerce/vendure/commit/fa683e7))
* **cli** Introduce new `@vendure/cli` package which exposes a `vendure` binary. Currently supports `vendure new plugin` command.
* **cli** Implement plugin scaffold command ([a6df4c1](https://github.com/vendure-ecommerce/vendure/commit/a6df4c1))
* **cli** Include custom CRUD permissions with plugin scaffold ([0c62b6f](https://github.com/vendure-ecommerce/vendure/commit/0c62b6f))

#### Fixes

* **admin-ui** Fix component for new Angular extension route API ([6fe1bd0](https://github.com/vendure-ecommerce/vendure/commit/6fe1bd0))
* **admin-ui** Fix creating nullable string fields ([7e2c17a](https://github.com/vendure-ecommerce/vendure/commit/7e2c17a)), closes [#2343](https://github.com/vendure-ecommerce/vendure/issues/2343)
* **core** Export EntityId and Money decorators ([4664dee](https://github.com/vendure-ecommerce/vendure/commit/4664dee))

## 2.1.0-next.4 (2023-09-08)


#### Fixes

* **ui-devkit** Fix scaffold logic for custom providers ([2f2ddb5](https://github.com/vendure-ecommerce/vendure/commit/2f2ddb5))

## 2.1.0-next.3 (2023-09-08)


#### Fixes

* **admin-ui** Add custom field support to Customer list ([97ba022](https://github.com/vendure-ecommerce/vendure/commit/97ba022))
* **admin-ui** Fix channel switcher icon style ([7f30361](https://github.com/vendure-ecommerce/vendure/commit/7f30361))
* **admin-ui** Fix error when data table filters not defined ([2425a33](https://github.com/vendure-ecommerce/vendure/commit/2425a33))
* **admin-ui** Fix styling of custom field tabs ([57f47df](https://github.com/vendure-ecommerce/vendure/commit/57f47df))
* **admin-ui** Give all data table columns immutable ids ([73a78db](https://github.com/vendure-ecommerce/vendure/commit/73a78db))
* **admin-ui** Use correct defaults for nullable custom fields (#2360) ([88430e5](https://github.com/vendure-ecommerce/vendure/commit/88430e5)), closes [#2360](https://github.com/vendure-ecommerce/vendure/issues/2360)
* **core** Downgrade ForbiddenError from Error to Warn log level ([c186392](https://github.com/vendure-ecommerce/vendure/commit/c186392)), closes [#2383](https://github.com/vendure-ecommerce/vendure/issues/2383)
* **core** Fix channel association on promotion update (#2376) ([e1ff2c7](https://github.com/vendure-ecommerce/vendure/commit/e1ff2c7)), closes [#2376](https://github.com/vendure-ecommerce/vendure/issues/2376)

#### Features

* **admin-ui** Add initial React support for UI extensions ([1075dd7](https://github.com/vendure-ecommerce/vendure/commit/1075dd7))
* **admin-ui** Allow custom components in data table columns ([d3474dd](https://github.com/vendure-ecommerce/vendure/commit/d3474dd)), closes [#2347](https://github.com/vendure-ecommerce/vendure/issues/2347) [#2353](https://github.com/vendure-ecommerce/vendure/issues/2353)
* **admin-ui** Allow custom React components in data table columns ([5cde775](https://github.com/vendure-ecommerce/vendure/commit/5cde775)), closes [#2347](https://github.com/vendure-ecommerce/vendure/issues/2347) [#2353](https://github.com/vendure-ecommerce/vendure/issues/2353)
* **admin-ui** Implement custom components in Collection data table ([4ab7c1e](https://github.com/vendure-ecommerce/vendure/commit/4ab7c1e))
* **admin-ui** Implement react Card component ([c588a1f](https://github.com/vendure-ecommerce/vendure/commit/c588a1f))
* **admin-ui** Implement simplified API for UI route extensions ([b9ca367](https://github.com/vendure-ecommerce/vendure/commit/b9ca367))
* **admin-ui** Improve dev mode extension point display ([4678930](https://github.com/vendure-ecommerce/vendure/commit/4678930))
* **admin-ui** Initial support for React UI extensions ([83d5756](https://github.com/vendure-ecommerce/vendure/commit/83d5756))
* **admin-ui** Style improvements to table and form input borders ([5287287](https://github.com/vendure-ecommerce/vendure/commit/5287287))
* **admin-ui** Support for React-based custom detail components ([55d9ffc](https://github.com/vendure-ecommerce/vendure/commit/55d9ffc))
* **core** Support bi-directional relations in customFields (#2365) ([0313ce5](https://github.com/vendure-ecommerce/vendure/commit/0313ce5)), closes [#2365](https://github.com/vendure-ecommerce/vendure/issues/2365)
* **ui-devkit** Add experimental wrapper for shared ui providers ([daf6f8c](https://github.com/vendure-ecommerce/vendure/commit/daf6f8c))

## 2.1.0-next.2 (2023-08-28)


#### Fixes

* **core** Fix resolution of facet valueList for postgres ([1d8fe47](https://github.com/vendure-ecommerce/vendure/commit/1d8fe47))

## 2.1.0-next.1 (2023-08-28)


#### Fixes

* **admin-ui** Correct handling of ID filters in data tables ([0e05496](https://github.com/vendure-ecommerce/vendure/commit/0e05496))
* **admin-ui** Data table filters react to page navigation ([39832bd](https://github.com/vendure-ecommerce/vendure/commit/39832bd))
* **core** Fix circular dependency issue in SQLiteSearchStrategy ([f2e2e32](https://github.com/vendure-ecommerce/vendure/commit/f2e2e32))

#### Features

* **admin-ui** Add data table filter presets functionality ([a656ef2](https://github.com/vendure-ecommerce/vendure/commit/a656ef2))
* **admin-ui** Implement drag-and-drop reorder of filter presets ([8e06705](https://github.com/vendure-ecommerce/vendure/commit/8e06705))
* **admin-ui** Implement filter preset renaming ([8b52e6f](https://github.com/vendure-ecommerce/vendure/commit/8b52e6f))
* **admin-ui** Implement relative date filtering ([d07a5f3](https://github.com/vendure-ecommerce/vendure/commit/d07a5f3))
* **admin-ui** Update to Angular v16.2 ([608d5d3](https://github.com/vendure-ecommerce/vendure/commit/608d5d3))
* **core** Update NestJS to v10, Apollo Server v4 ([b675fda](https://github.com/vendure-ecommerce/vendure/commit/b675fda))


### BREAKING CHANGE

* The update of Apollo Server to v4 includes some breaking changes if you have
defined any custom ApolloServerPlugins. See the Apollo migration guide for full details:
https://www.apollographql.com/docs/apollo-server/migration/
## 2.1.0-next.0 (2023-08-11)

Includes all changes from v2.0.6, plus:

#### Features

* **admin-ui** Admin UI rtl with Arabic translation improvements (#2322) ([44ea12b](https://github.com/vendure-ecommerce/vendure/commit/44ea12b)), closes [#2322](https://github.com/vendure-ecommerce/vendure/issues/2322)
* **core** Add `Facet.valueList` resolver for paginated values ([09c7175](https://github.com/vendure-ecommerce/vendure/commit/09c7175)), closes [#1257](https://github.com/vendure-ecommerce/vendure/issues/1257)
* **core** Add maximum coupon usage (#2331) ([bdd2720](https://github.com/vendure-ecommerce/vendure/commit/bdd2720)), closes [#2331](https://github.com/vendure-ecommerce/vendure/issues/2331) [#2330](https://github.com/vendure-ecommerce/vendure/issues/2330)
* **email-plugin** Expose template vars to template loader (#2243) ([78ea016](https://github.com/vendure-ecommerce/vendure/commit/78ea016)), closes [#2243](https://github.com/vendure-ecommerce/vendure/issues/2243) [#2242](https://github.com/vendure-ecommerce/vendure/issues/2242)

#### Fixes

* **admin-ui** Improve RTL styles ([056d205](https://github.com/vendure-ecommerce/vendure/commit/056d205))
* **admin-ui** Limit FacetValues in Facet list component ([b445955](https://github.com/vendure-ecommerce/vendure/commit/b445955)), closes [#1257](https://github.com/vendure-ecommerce/vendure/issues/1257)

