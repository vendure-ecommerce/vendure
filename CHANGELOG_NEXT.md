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

