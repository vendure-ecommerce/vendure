## <small>0.1.2-beta.8 (2019-07-18)</small>


#### Fixes

* **core** Fix filtering PaginatedList results ([b6a365f](https://github.com/vendure-ecommerce/vendure/commit/b6a365f))
* **core** Fix graphQL schema errors with latest nestjs/graphql ([fbeecef](https://github.com/vendure-ecommerce/vendure/commit/fbeecef)), closes [#129](https://github.com/vendure-ecommerce/vendure/issues/129)

#### Features

* **admin-ui** Extend custom field controls to support new options ([019cd02](https://github.com/vendure-ecommerce/vendure/commit/019cd02)), closes [#85](https://github.com/vendure-ecommerce/vendure/issues/85)
* **core** Add custom validation function to custom field config ([80eba9d](https://github.com/vendure-ecommerce/vendure/commit/80eba9d)), closes [#85](https://github.com/vendure-ecommerce/vendure/issues/85)
* **core** Add nullable & defaultValue options to custom fields config ([b1722d8](https://github.com/vendure-ecommerce/vendure/commit/b1722d8)), closes [#85](https://github.com/vendure-ecommerce/vendure/issues/85)
* **core** Add options to string custom field config ([bc0813e](https://github.com/vendure-ecommerce/vendure/commit/bc0813e)), closes [#85](https://github.com/vendure-ecommerce/vendure/issues/85)
* **core** Add validation parameters to custom fields ([b6b13a5](https://github.com/vendure-ecommerce/vendure/commit/b6b13a5)), closes [#85](https://github.com/vendure-ecommerce/vendure/issues/85)
* **core** Check for name conflict in custom fields, test sort/filter ([27abcff](https://github.com/vendure-ecommerce/vendure/commit/27abcff)), closes [#85](https://github.com/vendure-ecommerce/vendure/issues/85)
* **core** Implement access control for custom fields ([8f763b2](https://github.com/vendure-ecommerce/vendure/commit/8f763b2)), closes [#85](https://github.com/vendure-ecommerce/vendure/issues/85)
* **core** Improve error messages for invalid custom field inputs ([af13dc2](https://github.com/vendure-ecommerce/vendure/commit/af13dc2)), closes [#85](https://github.com/vendure-ecommerce/vendure/issues/85)

## <small>0.1.2-beta.7 (2019-07-10)</small>


#### Features

* **admin-ui** Implement deletion of Collections ([1d7ab26](https://github.com/vendure-ecommerce/vendure/commit/1d7ab26))
* **admin-ui** Implement deletion of ProductVariants ([bcc2662](https://github.com/vendure-ecommerce/vendure/commit/bcc2662))
* **admin-ui** Implement editing of ProductOptions ([420793d](https://github.com/vendure-ecommerce/vendure/commit/420793d))
* **admin-ui** Implement integrated ProductVariant creation ([58dad1d](https://github.com/vendure-ecommerce/vendure/commit/58dad1d)), closes [#124](https://github.com/vendure-ecommerce/vendure/issues/124)
* **core** Add createProductVariant mutation & tests ([9d74d9d](https://github.com/vendure-ecommerce/vendure/commit/9d74d9d)), closes [#124](https://github.com/vendure-ecommerce/vendure/issues/124)
* **core** Implement create and update of ProductOption ([601c766](https://github.com/vendure-ecommerce/vendure/commit/601c766))
* **core** Implement deleteCollection mutation ([051f2f3](https://github.com/vendure-ecommerce/vendure/commit/051f2f3))
* **core** Implement deleteProductVariant mutation ([8b22831](https://github.com/vendure-ecommerce/vendure/commit/8b22831)), closes [#124](https://github.com/vendure-ecommerce/vendure/issues/124)

#### Fixes

* **admin-ui** Do not hide dropdown panel ([bbbe70d](https://github.com/vendure-ecommerce/vendure/commit/bbbe70d))
* **common** Fix generateAllCombinations edge case ([016adf8](https://github.com/vendure-ecommerce/vendure/commit/016adf8))
* **core** Make ProductOption type fields non-nullable ([0ea150c](https://github.com/vendure-ecommerce/vendure/commit/0ea150c))
* **core** Publish CatalogModificationEvent when variant created ([65d18ee](https://github.com/vendure-ecommerce/vendure/commit/65d18ee))


### BREAKING CHANGE

* The `generateVariantsForProduct` mutation has been removed
## <small>0.1.2-beta.6 (2019-07-03)</small>


#### Features

* **admin-ui** Add controls to settle authorized payments ([32006ae](https://github.com/vendure-ecommerce/vendure/commit/32006ae)), closes [#117](https://github.com/vendure-ecommerce/vendure/issues/117)
* **admin-ui** Display order history timeline ([3f5745d](https://github.com/vendure-ecommerce/vendure/commit/3f5745d)), closes [#118](https://github.com/vendure-ecommerce/vendure/issues/118)
* **admin-ui** Implement adding notes to Order history ([1108914](https://github.com/vendure-ecommerce/vendure/commit/1108914)), closes [#118](https://github.com/vendure-ecommerce/vendure/issues/118)
* **admin-ui** Implement cancellation & refund flows ([9295a90](https://github.com/vendure-ecommerce/vendure/commit/9295a90)), closes [#121](https://github.com/vendure-ecommerce/vendure/issues/121)
* **admin-ui** Implement creating fulfillment for orders ([1a22d0d](https://github.com/vendure-ecommerce/vendure/commit/1a22d0d)), closes [#119](https://github.com/vendure-ecommerce/vendure/issues/119)
* **admin-ui** Implement fulfillment controls ([a006545](https://github.com/vendure-ecommerce/vendure/commit/a006545)), closes [#119](https://github.com/vendure-ecommerce/vendure/issues/119)
* **admin-ui** Implement manual refund settlement ([66006a1](https://github.com/vendure-ecommerce/vendure/commit/66006a1)), closes [#121](https://github.com/vendure-ecommerce/vendure/issues/121)
* **admin-ui** Improve layout of OrderDetailComponent ([c1d8664](https://github.com/vendure-ecommerce/vendure/commit/c1d8664))
* **core** Add settlePayment mutation ([f2b9a12](https://github.com/vendure-ecommerce/vendure/commit/f2b9a12)), closes [#117](https://github.com/vendure-ecommerce/vendure/issues/117)
* **core** Allow payment handler to reject settlement ([4cbae46](https://github.com/vendure-ecommerce/vendure/commit/4cbae46)), closes [#117](https://github.com/vendure-ecommerce/vendure/issues/117)
* **core** Implement adding notes to an Order ([3682cbf](https://github.com/vendure-ecommerce/vendure/commit/3682cbf)), closes [#118](https://github.com/vendure-ecommerce/vendure/issues/118)
* **core** Implement cancelOrder mutation ([a03fec7](https://github.com/vendure-ecommerce/vendure/commit/a03fec7)), closes [#120](https://github.com/vendure-ecommerce/vendure/issues/120)
* **core** Implement createFulfillment mutation ([e501578](https://github.com/vendure-ecommerce/vendure/commit/e501578)), closes [#119](https://github.com/vendure-ecommerce/vendure/issues/119)
* **core** Implement order history ([e4927c3](https://github.com/vendure-ecommerce/vendure/commit/e4927c3)), closes [#118](https://github.com/vendure-ecommerce/vendure/issues/118)
* **core** Implement OrderItem-level cancellation ([35084f3](https://github.com/vendure-ecommerce/vendure/commit/35084f3)), closes [#120](https://github.com/vendure-ecommerce/vendure/issues/120)
* **core** Implement Refund mutations ([8870b02](https://github.com/vendure-ecommerce/vendure/commit/8870b02)), closes [#121](https://github.com/vendure-ecommerce/vendure/issues/121)
* **core** Implement resolver for Order.fulfillments ([ff0bb0a](https://github.com/vendure-ecommerce/vendure/commit/ff0bb0a)), closes [#119](https://github.com/vendure-ecommerce/vendure/issues/119)
* **core** Simplify API for creating Fulfillments ([8cb4c41](https://github.com/vendure-ecommerce/vendure/commit/8cb4c41))

#### Fixes

* **core** Fix AssetInterceptor stack overflow with cyclic response ([c90a2a4](https://github.com/vendure-ecommerce/vendure/commit/c90a2a4))
* **core** Make @types/fs-extra a dependency ([37e9865](https://github.com/vendure-ecommerce/vendure/commit/37e9865))
* **elasticsearch-plugin** Close down es client when app closes ([44809a1](https://github.com/vendure-ecommerce/vendure/commit/44809a1))
* **elasticsearch-plugin** Index products when updating by variantIds ([6d243d2](https://github.com/vendure-ecommerce/vendure/commit/6d243d2))

## <small>0.1.2-beta.5 (2019-06-19)</small>


#### Fixes

* **admin-ui** Correctly display checkboxes and toggles ([bc42b95](https://github.com/vendure-ecommerce/vendure/commit/bc42b95))
* **admin-ui** Correctly handle boolean configurable inputs ([b5d10c1](https://github.com/vendure-ecommerce/vendure/commit/b5d10c1)), closes [#112](https://github.com/vendure-ecommerce/vendure/issues/112)
* **admin-ui** Fix asset picker dialog filtering ([16e7fc1](https://github.com/vendure-ecommerce/vendure/commit/16e7fc1)), closes [#113](https://github.com/vendure-ecommerce/vendure/issues/113)
* **admin-ui** Paginate Collections list ([17ac985](https://github.com/vendure-ecommerce/vendure/commit/17ac985)), closes [#114](https://github.com/vendure-ecommerce/vendure/issues/114)
* **core** Clean up unused dependencies in DefaultSearchPlugin ([9b3cd26](https://github.com/vendure-ecommerce/vendure/commit/9b3cd26))
* **core** Close worker when app closes when running in main process ([33b2fe1](https://github.com/vendure-ecommerce/vendure/commit/33b2fe1))
* **core** Fix bad imports from common module ([960b647](https://github.com/vendure-ecommerce/vendure/commit/960b647))
* **core** Set worker to run off main process by default ([8e14213](https://github.com/vendure-ecommerce/vendure/commit/8e14213))
* **core** Wait for worker tasks to complete on app shutdown ([2a9fb0b](https://github.com/vendure-ecommerce/vendure/commit/2a9fb0b))
* **core** When populating, run search index builder on main process ([6564d3f](https://github.com/vendure-ecommerce/vendure/commit/6564d3f))
* **create** Run worker on main process when populating ([87dc49a](https://github.com/vendure-ecommerce/vendure/commit/87dc49a))
* **email-plugin** Move server setup to onBootstrap method ([5f7a65e](https://github.com/vendure-ecommerce/vendure/commit/5f7a65e))

#### Features

* **core** Display more worker info on bootstrap ([edbcbc4](https://github.com/vendure-ecommerce/vendure/commit/edbcbc4))
* **core** FacetValue Collection filter can specify logical operator ([f136117](https://github.com/vendure-ecommerce/vendure/commit/f136117)), closes [#112](https://github.com/vendure-ecommerce/vendure/issues/112)
* **core** Get DefaultSearchPlugin working with new Worker architecture ([6ca2ab4](https://github.com/vendure-ecommerce/vendure/commit/6ca2ab4)), closes [#115](https://github.com/vendure-ecommerce/vendure/issues/115)
* **core** Prevent calling bootstrapWorker when runInMainProcess = true ([dc8e173](https://github.com/vendure-ecommerce/vendure/commit/dc8e173))
* **core** Set up worker architecture based on Nest microservices ([508bafd](https://github.com/vendure-ecommerce/vendure/commit/508bafd)), closes [#115](https://github.com/vendure-ecommerce/vendure/issues/115)
* **create** Set an env variable during the create process ([b085e49](https://github.com/vendure-ecommerce/vendure/commit/b085e49))
* **create** Update to use separate worker process ([f3560f2](https://github.com/vendure-ecommerce/vendure/commit/f3560f2))

## <small>0.1.2-beta.4 (2019-06-06)</small>


#### Fixes

* **admin-ui** Fix background image on login screen ([8066d9b](https://github.com/vendure-ecommerce/vendure/commit/8066d9b))
* **admin-ui** Fix styles to work with Clarity v2 ([6ab33cc](https://github.com/vendure-ecommerce/vendure/commit/6ab33cc))
* **core** Disable index builder worker thread for sql.js ([a49d1a3](https://github.com/vendure-ecommerce/vendure/commit/a49d1a3))
* **core** Fix i18next typing issues after update ([41a3e7a](https://github.com/vendure-ecommerce/vendure/commit/41a3e7a))
* **core** Fix TypeScript errors arising in v3.5.1 ([8e78450](https://github.com/vendure-ecommerce/vendure/commit/8e78450))
* **core** Queue concurrent search index writes to avoid key conflicts ([ae1145a](https://github.com/vendure-ecommerce/vendure/commit/ae1145a))

#### Features

* **admin-ui** Display background jobs in UI ([59d8312](https://github.com/vendure-ecommerce/vendure/commit/59d8312)), closes [#111](https://github.com/vendure-ecommerce/vendure/issues/111)
* **admin-ui** Improve polling logic for jobs ([ced3990](https://github.com/vendure-ecommerce/vendure/commit/ced3990))
* **admin-ui** Update to Angular 8 ([cb69306](https://github.com/vendure-ecommerce/vendure/commit/cb69306))
* **core** Background thread search indexing ([b78354e](https://github.com/vendure-ecommerce/vendure/commit/b78354e))
* **core** Create async job manager for long-running tasks ([a83945a](https://github.com/vendure-ecommerce/vendure/commit/a83945a)), closes [#111](https://github.com/vendure-ecommerce/vendure/issues/111)
* **core** Process all updates to the search index on worker thread ([fe40641](https://github.com/vendure-ecommerce/vendure/commit/fe40641))
* **core** Update TypeORM to 0.2.18, compatible with sql.js 1.0 ([7eda23b](https://github.com/vendure-ecommerce/vendure/commit/7eda23b))
* **core** Use batching when reindexing search index ([40c5946](https://github.com/vendure-ecommerce/vendure/commit/40c5946))
* **core** Use batching when updating collection filters ([325b807](https://github.com/vendure-ecommerce/vendure/commit/325b807))


### BREAKING CHANGE

* The `reindex` mutation now returns a JobInfo type, which has an id that can then be polled via the new `job` query as to its progress and status.
## <small>0.1.2-beta.3 (2019-05-31)</small>


#### Features

* **admin-ui** Allow custom error messages passed to FormFieldComponent ([220d861](https://github.com/vendure-ecommerce/vendure/commit/220d861))
* **admin-ui** Update slug in product detail form after save ([2cecb39](https://github.com/vendure-ecommerce/vendure/commit/2cecb39))
* **admin-ui** Validate slug pattern in product detail form ([29509d8](https://github.com/vendure-ecommerce/vendure/commit/29509d8)), closes [#103](https://github.com/vendure-ecommerce/vendure/issues/103)
* **core** Allow custom fields to be set on OrderLine ([a4b7e07](https://github.com/vendure-ecommerce/vendure/commit/a4b7e07)), closes [#109](https://github.com/vendure-ecommerce/vendure/issues/109)
* **core** Allow product to be queried by slug ([a2d847d](https://github.com/vendure-ecommerce/vendure/commit/a2d847d)), closes [#108](https://github.com/vendure-ecommerce/vendure/issues/108)
* **core** Enforce unique slugs for Products ([d8d5fcc](https://github.com/vendure-ecommerce/vendure/commit/d8d5fcc)), closes [#103](https://github.com/vendure-ecommerce/vendure/issues/103)
* **core** Normalize product slug values ([e2235cb](https://github.com/vendure-ecommerce/vendure/commit/e2235cb)), closes [#103](https://github.com/vendure-ecommerce/vendure/issues/103)
* **core** Rename SearchInput facetIds arg to facetValueIds ([8b116b2](https://github.com/vendure-ecommerce/vendure/commit/8b116b2))

#### Fixes

* **asset-server-plugin** Fix type of assetUrlPrefix option ([d753f0e](https://github.com/vendure-ecommerce/vendure/commit/d753f0e))
* **core** Configure GraphQL Playground to include credentials ([4429730](https://github.com/vendure-ecommerce/vendure/commit/4429730)), closes [#107](https://github.com/vendure-ecommerce/vendure/issues/107)
* **core** Do not list deleted productVariants in a Collection ([e1fecbb](https://github.com/vendure-ecommerce/vendure/commit/e1fecbb)), closes [#100](https://github.com/vendure-ecommerce/vendure/issues/100)
* **core** Do not throw when deleting Facet with no FacetValues ([f7d337f](https://github.com/vendure-ecommerce/vendure/commit/f7d337f)), closes [#105](https://github.com/vendure-ecommerce/vendure/issues/105)
* **core** Fix bad common import paths ([6a54be3](https://github.com/vendure-ecommerce/vendure/commit/6a54be3))
* **core** Fix error when searching ShopAPI with postgres ([f05360b](https://github.com/vendure-ecommerce/vendure/commit/f05360b)), closes [#99](https://github.com/vendure-ecommerce/vendure/issues/99)
* **core** Fix postgres error when specifying custom fields ([d8b6c47](https://github.com/vendure-ecommerce/vendure/commit/d8b6c47)), closes [#85](https://github.com/vendure-ecommerce/vendure/issues/85) [#101](https://github.com/vendure-ecommerce/vendure/issues/101)
* **email-plugin** Fix bad common import paths ([077fd6d](https://github.com/vendure-ecommerce/vendure/commit/077fd6d))


### BREAKING CHANGE

* The "facetIds" field of the SearchInput type has been renamed to "facetValueIds" to better reflect the expected id type.
* This change allows custom fields to be defined on the OrderLine entity. When they are, then the "addItemToOrder" mutation will accept a third argument - "customFields", which matches the fields specified in the config. Additionally, a couple of mutations have been renamed: "removeItemFromOrder" -> "removeOrderLine", "adjustItemQuantity" -> "adjustOrderLine" and their "orderItemId" argument has been renamed to "orderLineId".
## <small>0.1.2-beta.2 (2019-05-24)</small>


#### Fixes

* **core** Fix CollectionBreadcrumb.name error ([5b6f93a](https://github.com/vendure-ecommerce/vendure/commit/5b6f93a)), closes [#97](https://github.com/vendure-ecommerce/vendure/issues/97)
* **core** Fix intermittent "no active session" errors ([1313ca7](https://github.com/vendure-ecommerce/vendure/commit/1313ca7))

#### Features

* **asset-server-plugin** Allow url prefix to be set in options ([c0ea092](https://github.com/vendure-ecommerce/vendure/commit/c0ea092))

## <small>0.1.2-beta.1 (2019-05-22)</small>


#### Fixes

* **admin-ui** Fix publish flow to ensure correct version in UI ([dc52814](https://github.com/vendure-ecommerce/vendure/commit/dc52814))

## <small>0.1.2-beta.0 (2019-05-22)</small>


#### Fixes

* **admin-ui** Correctly display configurable money values ([3546071](https://github.com/vendure-ecommerce/vendure/commit/3546071))
* **admin-ui** Correctly sort assets ([e57450b](https://github.com/vendure-ecommerce/vendure/commit/e57450b))
* **admin-ui** Do not run CanDeactivateGuard when switching tabs ([d8e6258](https://github.com/vendure-ecommerce/vendure/commit/d8e6258))
* **admin-ui** Fix boolean configurable input ([994264d](https://github.com/vendure-ecommerce/vendure/commit/994264d))
* **admin-ui** Fix creation of zone from country list ([0aa0bc8](https://github.com/vendure-ecommerce/vendure/commit/0aa0bc8))
* **admin-ui** Fix error with rich text editor (trix) ([b42ead6](https://github.com/vendure-ecommerce/vendure/commit/b42ead6))
* **admin-ui** Replace all clr-dropdown with vdr-dropdown ([4de2a6a](https://github.com/vendure-ecommerce/vendure/commit/4de2a6a)), closes [#95](https://github.com/vendure-ecommerce/vendure/issues/95)
* **admin-ui** Reset page when filters changed in product list ([c9325b6](https://github.com/vendure-ecommerce/vendure/commit/c9325b6))
* **core** Add missing timestamp fields to Asset GraphQL type ([1c543db](https://github.com/vendure-ecommerce/vendure/commit/1c543db))
* **core** Add property resolver for Collection.featuredAsset ([cd367a7](https://github.com/vendure-ecommerce/vendure/commit/cd367a7))
* **core** Check existence of ProductVariant before updating ([fe5eedd](https://github.com/vendure-ecommerce/vendure/commit/fe5eedd))
* **core** Correctly intercept top-level Assets ([d767a9d](https://github.com/vendure-ecommerce/vendure/commit/d767a9d))
* **core** Correctly update country in customer address ([75f9492](https://github.com/vendure-ecommerce/vendure/commit/75f9492))
* **core** Fix bad import paths ([e126d2e](https://github.com/vendure-ecommerce/vendure/commit/e126d2e))
* **core** Fix bug which created new address for each order placed ([8703e25](https://github.com/vendure-ecommerce/vendure/commit/8703e25))
* **core** Fix error when updating variant stock level ([57c5499](https://github.com/vendure-ecommerce/vendure/commit/57c5499))
* **core** Fix reordering of collections ([75f8858](https://github.com/vendure-ecommerce/vendure/commit/75f8858)), closes [#75](https://github.com/vendure-ecommerce/vendure/issues/75)
* **core** Fix search.facetValues resolver error ([ecfbf56](https://github.com/vendure-ecommerce/vendure/commit/ecfbf56))
* **core** Fix type error (missing isPrivate property) ([4d1cd65](https://github.com/vendure-ecommerce/vendure/commit/4d1cd65))
* **core** Implement property resolver for Collection.children ([e5f614e](https://github.com/vendure-ecommerce/vendure/commit/e5f614e))
* **core** Prevent race conditions when updating search index ([8872a94](https://github.com/vendure-ecommerce/vendure/commit/8872a94))
* **core** Relax engines check for Yarn ([9c4f8fb](https://github.com/vendure-ecommerce/vendure/commit/9c4f8fb))
* **core** Typo in mock product data ([cf0f842](https://github.com/vendure-ecommerce/vendure/commit/cf0f842))
* **email-plugin** Fix failing test ([cf2acbf](https://github.com/vendure-ecommerce/vendure/commit/cf2acbf))

#### Features

* **admin-ui** Add ApiType to RequestContext ([9b55c17](https://github.com/vendure-ecommerce/vendure/commit/9b55c17))
* **admin-ui** Add asset preview dialog ([34413ce](https://github.com/vendure-ecommerce/vendure/commit/34413ce))
* **admin-ui** Add controls for stockOnHand & trackInventory ([4e021b8](https://github.com/vendure-ecommerce/vendure/commit/4e021b8)), closes [#81](https://github.com/vendure-ecommerce/vendure/issues/81)
* **admin-ui** Add enabled/disabled toggle to ProductVariants ([406ab28](https://github.com/vendure-ecommerce/vendure/commit/406ab28)), closes [#62](https://github.com/vendure-ecommerce/vendure/issues/62)
* **admin-ui** Add input for configurable string operators ([b5a07d1](https://github.com/vendure-ecommerce/vendure/commit/b5a07d1)), closes [#71](https://github.com/vendure-ecommerce/vendure/issues/71)
* **admin-ui** Add toggle to enable/disable Product ([a117bbe](https://github.com/vendure-ecommerce/vendure/commit/a117bbe)), closes [#62](https://github.com/vendure-ecommerce/vendure/issues/62)
* **admin-ui** Add UI controls for making Collections private ([4f17d3e](https://github.com/vendure-ecommerce/vendure/commit/4f17d3e)), closes [#71](https://github.com/vendure-ecommerce/vendure/issues/71)
* **admin-ui** Add UI controls for private Facets ([290a576](https://github.com/vendure-ecommerce/vendure/commit/290a576)), closes [#80](https://github.com/vendure-ecommerce/vendure/issues/80)
* **admin-ui** Collapse settings menu group by default ([c8539de](https://github.com/vendure-ecommerce/vendure/commit/c8539de))
* **admin-ui** Create ProductSearchInput bar ([0668443](https://github.com/vendure-ecommerce/vendure/commit/0668443))
* **admin-ui** Implement custom dropdown based on CDK Overlay ([409bb16](https://github.com/vendure-ecommerce/vendure/commit/409bb16)), closes [#95](https://github.com/vendure-ecommerce/vendure/issues/95)
* **admin-ui** Improve collection list & child collection creation ([c996fa7](https://github.com/vendure-ecommerce/vendure/commit/c996fa7))
* **admin-ui** Improve layout of ProductVariantList card ([8ecd2c3](https://github.com/vendure-ecommerce/vendure/commit/8ecd2c3))
* **admin-ui** Link up product filters with url ([8aab908](https://github.com/vendure-ecommerce/vendure/commit/8aab908))
* **admin-ui** Make facet list values expandable ([13ce943](https://github.com/vendure-ecommerce/vendure/commit/13ce943))
* **admin-ui** More styling for product variant list ([0522e5c](https://github.com/vendure-ecommerce/vendure/commit/0522e5c))
* **admin-ui** Numerous style tweaks ([14ee458](https://github.com/vendure-ecommerce/vendure/commit/14ee458))
* **admin-ui** Reindex search index from product list ([de7f22d](https://github.com/vendure-ecommerce/vendure/commit/de7f22d))
* **admin-ui** Restyle form inputs ([438802d](https://github.com/vendure-ecommerce/vendure/commit/438802d)), closes [#60](https://github.com/vendure-ecommerce/vendure/issues/60)
* **admin-ui** Set the global trackInventory setting ([bf4185b](https://github.com/vendure-ecommerce/vendure/commit/bf4185b)), closes [#81](https://github.com/vendure-ecommerce/vendure/issues/81)
* **admin-ui** Standardise colour palette ([9cb73ae](https://github.com/vendure-ecommerce/vendure/commit/9cb73ae)), closes [#41](https://github.com/vendure-ecommerce/vendure/issues/41)
* **admin-ui** Table view for product variants ([058749a](https://github.com/vendure-ecommerce/vendure/commit/058749a))
* **core** Add "enabled" field to Product & ProductVariant ([a877853](https://github.com/vendure-ecommerce/vendure/commit/a877853)), closes [#62](https://github.com/vendure-ecommerce/vendure/issues/62)
* **core** Add "enabled" field to search index, add & fix e2e tests ([fcd3086](https://github.com/vendure-ecommerce/vendure/commit/fcd3086)), closes [#62](https://github.com/vendure-ecommerce/vendure/issues/62)
* **core** Add isPrivate flag to Collection ([848c8b4](https://github.com/vendure-ecommerce/vendure/commit/848c8b4)), closes [#71](https://github.com/vendure-ecommerce/vendure/issues/71)
* **core** Correctly handle disabled field for grouped search ([56cad72](https://github.com/vendure-ecommerce/vendure/commit/56cad72)), closes [#62](https://github.com/vendure-ecommerce/vendure/issues/62)
* **core** Create entities & fields needed for stock control ([aace38f](https://github.com/vendure-ecommerce/vendure/commit/aace38f)), closes [#81](https://github.com/vendure-ecommerce/vendure/issues/81)
* **core** Create Logger service ([65445cb](https://github.com/vendure-ecommerce/vendure/commit/65445cb)), closes [#86](https://github.com/vendure-ecommerce/vendure/issues/86)
* **core** Create Sale stock movements when Order is completed ([e0a0441](https://github.com/vendure-ecommerce/vendure/commit/e0a0441)), closes [#81](https://github.com/vendure-ecommerce/vendure/issues/81)
* **core** Create StockMovements when variant stock changed ([f8521db](https://github.com/vendure-ecommerce/vendure/commit/f8521db)), closes [#81](https://github.com/vendure-ecommerce/vendure/issues/81)
* **core** Create workflow for updating a Customer email address ([f8065de](https://github.com/vendure-ecommerce/vendure/commit/f8065de)), closes [#87](https://github.com/vendure-ecommerce/vendure/issues/87)
* **core** Export populate-collections CLI command ([0aef0b7](https://github.com/vendure-ecommerce/vendure/commit/0aef0b7))
* **core** Expose init CLI command ([4d5f0d9](https://github.com/vendure-ecommerce/vendure/commit/4d5f0d9))
* **core** Implement CollectionFilter based on ProductVariant name ([18549c7](https://github.com/vendure-ecommerce/vendure/commit/18549c7)), closes [#71](https://github.com/vendure-ecommerce/vendure/issues/71)
* **core** Implement private Facets ([b6c3240](https://github.com/vendure-ecommerce/vendure/commit/b6c3240)), closes [#80](https://github.com/vendure-ecommerce/vendure/issues/80)
* **core** Implement tax on shipping ([1b13aa3](https://github.com/vendure-ecommerce/vendure/commit/1b13aa3)), closes [#54](https://github.com/vendure-ecommerce/vendure/issues/54)
* **core** Improved logging messages on bootstrap ([9efada8](https://github.com/vendure-ecommerce/vendure/commit/9efada8)), closes [#86](https://github.com/vendure-ecommerce/vendure/issues/86)
* **core** Publish events on login/logout ([5ab83da](https://github.com/vendure-ecommerce/vendure/commit/5ab83da)), closes [#53](https://github.com/vendure-ecommerce/vendure/issues/53)
* **core** Richer mock data ([089282e](https://github.com/vendure-ecommerce/vendure/commit/089282e)), closes [#96](https://github.com/vendure-ecommerce/vendure/issues/96)
* **core** Update import CSV format to include stock fields ([3f732ab](https://github.com/vendure-ecommerce/vendure/commit/3f732ab)), closes [#81](https://github.com/vendure-ecommerce/vendure/issues/81)
* **core** Use Logger to log TypeORM logs ([5966bec](https://github.com/vendure-ecommerce/vendure/commit/5966bec)), closes [#86](https://github.com/vendure-ecommerce/vendure/issues/86)
* **create** Better error reporting on DB connection issues. ([1a7dc05](https://github.com/vendure-ecommerce/vendure/commit/1a7dc05)), closes [#90](https://github.com/vendure-ecommerce/vendure/issues/90)
* **create** Update config with latest email-plugin API changes ([b2277c5](https://github.com/vendure-ecommerce/vendure/commit/b2277c5))
* **email-plugin** Create dev mode mailbox server ([e38075f](https://github.com/vendure-ecommerce/vendure/commit/e38075f))
* **email-plugin** Create handler for email address change ([8a5907e](https://github.com/vendure-ecommerce/vendure/commit/8a5907e)), closes [#87](https://github.com/vendure-ecommerce/vendure/issues/87)
* **email-plugin** Generate test emails from dev mailbox ([35105ec](https://github.com/vendure-ecommerce/vendure/commit/35105ec))
* **email-plugin** Highlight open email in dev mailbox ([3fac1ac](https://github.com/vendure-ecommerce/vendure/commit/3fac1ac))
* **email-plugin** Improve styling of email templates ([8f0c6e7](https://github.com/vendure-ecommerce/vendure/commit/8f0c6e7))
* **email-plugin** Introduce globalTemplateVars option ([407d232](https://github.com/vendure-ecommerce/vendure/commit/407d232))
* **email-plugin** Simplify email config API ([d35420a](https://github.com/vendure-ecommerce/vendure/commit/d35420a)), closes [#88](https://github.com/vendure-ecommerce/vendure/issues/88)

