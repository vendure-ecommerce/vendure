## <small>0.3.2 (2019-09-26)</small>

**Note** only the `@vendure/admin-ui`, `@vendure/admin-ui-plugin` & `@vendure/email-plugin` packages were updated in this release.

#### Fixes

* **admin-ui** Fix infinite loop hang on CollectionList page ([230703f](https://github.com/vendure-ecommerce/vendure/commit/230703f)), closes [#170](https://github.com/vendure-ecommerce/vendure/issues/170)
* **email-plugin** Fix smtp auth ([98bc90a](https://github.com/vendure-ecommerce/vendure/commit/98bc90a))

## <small>0.3.1 (2019-09-25)</small>


#### Features

* **admin-ui** Add controls for disabling & deleting a Promotion ([7568e20](https://github.com/vendure-ecommerce/vendure/commit/7568e20)), closes [#159](https://github.com/vendure-ecommerce/vendure/issues/159)
* **admin-ui** Add permissions checks for Product list/detail views ([75dc385](https://github.com/vendure-ecommerce/vendure/commit/75dc385)), closes [#94](https://github.com/vendure-ecommerce/vendure/issues/94)
* **admin-ui** Add permissions checks to main nav items ([78201fb](https://github.com/vendure-ecommerce/vendure/commit/78201fb)), closes [#94](https://github.com/vendure-ecommerce/vendure/issues/94)
* **admin-ui** Add permissions checks to Promotions & Settings views ([2552191](https://github.com/vendure-ecommerce/vendure/commit/2552191)), closes [#94](https://github.com/vendure-ecommerce/vendure/issues/94)
* **admin-ui** Allow extensions to define CustomField controls ([83d9090](https://github.com/vendure-ecommerce/vendure/commit/83d9090)), closes [#55](https://github.com/vendure-ecommerce/vendure/issues/55)
* **admin-ui** Allow shared & lazy UI plugins to be specified ([5daf756](https://github.com/vendure-ecommerce/vendure/commit/5daf756)), closes [#55](https://github.com/vendure-ecommerce/vendure/issues/55)
* **admin-ui** Can add custom buttons to list/detail views ([ef47c62](https://github.com/vendure-ecommerce/vendure/commit/ef47c62)), closes [#55](https://github.com/vendure-ecommerce/vendure/issues/55)
* **admin-ui** Expose `query` & `mutation` method on DataService ([09250a8](https://github.com/vendure-ecommerce/vendure/commit/09250a8))
* **admin-ui** Implement readonly state for RichTextEditor ([5f2987c](https://github.com/vendure-ecommerce/vendure/commit/5f2987c))
* **admin-ui** Permissions checks for Facet & Collection views ([7f8163a](https://github.com/vendure-ecommerce/vendure/commit/7f8163a)), closes [#94](https://github.com/vendure-ecommerce/vendure/issues/94)
* **admin-ui** Set up infrastructure for permission-based UI display ([6bd5181](https://github.com/vendure-ecommerce/vendure/commit/6bd5181)), closes [#94](https://github.com/vendure-ecommerce/vendure/issues/94)
* **core** Add Promotion-specific CRUD permissions ([7ddd893](https://github.com/vendure-ecommerce/vendure/commit/7ddd893))
* **core** Allow length of custom field strings to be specified ([fe360f5](https://github.com/vendure-ecommerce/vendure/commit/fe360f5)), closes [#166](https://github.com/vendure-ecommerce/vendure/issues/166)
* **core** Ensure SuperAdmin role has all permissions ([ab866c1](https://github.com/vendure-ecommerce/vendure/commit/ab866c1))
* **core** Expose active user permissions in Admin API ([b7cd6e5](https://github.com/vendure-ecommerce/vendure/commit/b7cd6e5)), closes [#94](https://github.com/vendure-ecommerce/vendure/issues/94)
* **create** Add example fromAddress global template variable ([b727327](https://github.com/vendure-ecommerce/vendure/commit/b727327))
* **email-plugin** Added `from` field to the email config (#168) ([09eb34e](https://github.com/vendure-ecommerce/vendure/commit/09eb34e)), closes [#168](https://github.com/vendure-ecommerce/vendure/issues/168)

#### Fixes

* **admin-ui** Correctly disable selects/toggles based on permissions ([1e41b92](https://github.com/vendure-ecommerce/vendure/commit/1e41b92))
* **core** Correct permissions for tax-related resolvers ([d2b52ce](https://github.com/vendure-ecommerce/vendure/commit/d2b52ce))
* **core** Correct some permissions in Channel & Promotion resolvers ([e2a64fa](https://github.com/vendure-ecommerce/vendure/commit/e2a64fa))
* **core** Ensure all Roles always include the Authenticated permission ([c2de3de](https://github.com/vendure-ecommerce/vendure/commit/c2de3de))

## 0.3.0 (2019-09-18)


#### Features

* **admin-ui-plugin** Add watch mode for UI extension development ([c0b4d3f](https://github.com/vendure-ecommerce/vendure/commit/c0b4d3f)), closes [#55](https://github.com/vendure-ecommerce/vendure/issues/55)
* **admin-ui-plugin** Detect whether extensions need to be re-compiled ([ba8c44f](https://github.com/vendure-ecommerce/vendure/commit/ba8c44f)), closes [#55](https://github.com/vendure-ecommerce/vendure/issues/55)
* **admin-ui** Display Order custom fields ([cbe11d2](https://github.com/vendure-ecommerce/vendure/commit/cbe11d2)), closes [#164](https://github.com/vendure-ecommerce/vendure/issues/164)
* **admin-ui** Enable adding options to single-variant Products ([7303171](https://github.com/vendure-ecommerce/vendure/commit/7303171)), closes [#162](https://github.com/vendure-ecommerce/vendure/issues/162)
* **admin-ui** Enable drag-drop reordering of assets ([0e624f4](https://github.com/vendure-ecommerce/vendure/commit/0e624f4)), closes [#156](https://github.com/vendure-ecommerce/vendure/issues/156)
* **admin-ui** Enable drag-drop reordering of Collections ([ffab838](https://github.com/vendure-ecommerce/vendure/commit/ffab838))
* **admin-ui** Experimental system for extending the UI ([1dcb2e6](https://github.com/vendure-ecommerce/vendure/commit/1dcb2e6)), closes [#55](https://github.com/vendure-ecommerce/vendure/issues/55)
* **admin-ui** Expose public API at @vendure/admin-ui/devkit ([c2742ec](https://github.com/vendure-ecommerce/vendure/commit/c2742ec))
* **admin-ui** Implement adding new variants by extending options ([fefe0ea](https://github.com/vendure-ecommerce/vendure/commit/fefe0ea)), closes [#162](https://github.com/vendure-ecommerce/vendure/issues/162)
* **core** Re-architect entity-asset relations to allow ordering ([4ed2ce3](https://github.com/vendure-ecommerce/vendure/commit/4ed2ce3)), closes [#156](https://github.com/vendure-ecommerce/vendure/issues/156)
* **create** Add ci option to test installs ([c2c7b82](https://github.com/vendure-ecommerce/vendure/commit/c2c7b82))

#### Fixes

* **admin-ui** Trigger navigation confirm if assets have been changed ([6e751b0](https://github.com/vendure-ecommerce/vendure/commit/6e751b0))
* **core** Allow removal of all Assets from an entity ([528eb3c](https://github.com/vendure-ecommerce/vendure/commit/528eb3c))
* **core** Fix facet value CollectionFilter ([7b6fe6c](https://github.com/vendure-ecommerce/vendure/commit/7b6fe6c)), closes [#158](https://github.com/vendure-ecommerce/vendure/issues/158)
* **core** Resolve collection assets field ([e32895f](https://github.com/vendure-ecommerce/vendure/commit/e32895f)), closes [#157](https://github.com/vendure-ecommerce/vendure/issues/157)
* **core** Specify Collection.description as text type ([351e811](https://github.com/vendure-ecommerce/vendure/commit/351e811)), closes [#165](https://github.com/vendure-ecommerce/vendure/issues/165)


### BREAKING CHANGE

* The internal representation of Asset relations has changed to enable explicit ordering of assets. This change means that the database schema had to be updated.
## <small>0.2.1 (2019-09-09)</small>


#### Features

* **admin-ui** Check for running jobs after each mutation ([8b2b0dc](https://github.com/vendure-ecommerce/vendure/commit/8b2b0dc))
* **core** Add optional metadata to JobInfo ([7ddec36](https://github.com/vendure-ecommerce/vendure/commit/7ddec36))
* **core** Create WorkerService for simpler communication to worker ([16ab03d](https://github.com/vendure-ecommerce/vendure/commit/16ab03d))
* **core** Enable custom fields on Order entity ([4ef0f15](https://github.com/vendure-ecommerce/vendure/commit/4ef0f15))
* **core** EventBus exposes Observable event stream with .ofType() ([506a0fa](https://github.com/vendure-ecommerce/vendure/commit/506a0fa))
* **core** Improve speed of bulk product import ([92abbcb](https://github.com/vendure-ecommerce/vendure/commit/92abbcb))

#### Fixes

* **admin-ui** Fix error creating product with localeString custom prop ([4ae5b72](https://github.com/vendure-ecommerce/vendure/commit/4ae5b72))
* **core** Fix fetching entities with a single localeString custom field ([0d0545f](https://github.com/vendure-ecommerce/vendure/commit/0d0545f))
* **elasticsearch-plugin** Fix null productVariantPreview error ([571f7af](https://github.com/vendure-ecommerce/vendure/commit/571f7af))

#### Perf

* **core** Move application of CollectionFilters to worker ([0a90982](https://github.com/vendure-ecommerce/vendure/commit/0a90982)), closes [#148](https://github.com/vendure-ecommerce/vendure/issues/148)

## 0.2.0 (2019-08-28)


#### Features

* **admin-ui** Add filtering to countries list ([fff6f19](https://github.com/vendure-ecommerce/vendure/commit/fff6f19))
* **admin-ui** Add filtering to orders list ([8dda408](https://github.com/vendure-ecommerce/vendure/commit/8dda408))
* **admin-ui** Add search input to customer list ([28e4e41](https://github.com/vendure-ecommerce/vendure/commit/28e4e41))
* **common** Add DeepRequired type ([c77e365](https://github.com/vendure-ecommerce/vendure/commit/c77e365))
* **core** Expose new RuntimeVendureConfig interface ([6ea7124](https://github.com/vendure-ecommerce/vendure/commit/6ea7124))
* **core** Include width and height in Asset entity ([338ef95](https://github.com/vendure-ecommerce/vendure/commit/338ef95)), closes [#79](https://github.com/vendure-ecommerce/vendure/issues/79)
* **elasticsearch-plugin** Add options for customising term query ([7191842](https://github.com/vendure-ecommerce/vendure/commit/7191842))
* **elasticsearch-plugin** Allow facetValues size to be configured ([3a5aff4](https://github.com/vendure-ecommerce/vendure/commit/3a5aff4))
* **elasticsearch-plugin** Allow querying by price range ([573f345](https://github.com/vendure-ecommerce/vendure/commit/573f345))
* **elasticsearch-plugin** Extend response with price range data ([81eff46](https://github.com/vendure-ecommerce/vendure/commit/81eff46))

#### Fixes

* **common** Add missing chars to normalizeString function ([f687cc8](https://github.com/vendure-ecommerce/vendure/commit/f687cc8)), closes [#144](https://github.com/vendure-ecommerce/vendure/issues/144)
* **core** Correctly prefix asset urls for resolved properties ([0517b6c](https://github.com/vendure-ecommerce/vendure/commit/0517b6c)), closes [#146](https://github.com/vendure-ecommerce/vendure/issues/146)
* **elasticsearch-plugin** Correctly remove deleted items from index ([f0a56fa](https://github.com/vendure-ecommerce/vendure/commit/f0a56fa))
* **elasticsearch-plugin** Correctly report facetValue counts ([2f8af7c](https://github.com/vendure-ecommerce/vendure/commit/2f8af7c))
* **elasticsearch-plugin** Fix error when creating new Product ([b6ae235](https://github.com/vendure-ecommerce/vendure/commit/b6ae235)), closes [#145](https://github.com/vendure-ecommerce/vendure/issues/145)
* **elasticsearch-plugin** Make option optional ([da8b2f2](https://github.com/vendure-ecommerce/vendure/commit/da8b2f2))

## <small>0.1.2-beta.12 (2019-08-20)</small>


#### Fixes

* **admin-ui** Add missing icon ([4027325](https://github.com/vendure-ecommerce/vendure/commit/4027325))
* **admin-ui** Fix error on creating product with empty option values ([452f5a9](https://github.com/vendure-ecommerce/vendure/commit/452f5a9)), closes [#141](https://github.com/vendure-ecommerce/vendure/issues/141)
* **core** Add 'float' type to arg types for shipping operations ([f8626d1](https://github.com/vendure-ecommerce/vendure/commit/f8626d1))
* **core** Correctly filter out ineligible shipping methods ([911463a](https://github.com/vendure-ecommerce/vendure/commit/911463a))
* **core** Fix application hang when worker microservice fails to start ([25de044](https://github.com/vendure-ecommerce/vendure/commit/25de044))
* **create** Correctly log verbose output from server ([a4b76b2](https://github.com/vendure-ecommerce/vendure/commit/a4b76b2))

#### Features

* **admin-ui-plugin** Automatically configure admin-ui auth method ([fd68d1e](https://github.com/vendure-ecommerce/vendure/commit/fd68d1e)), closes [#138](https://github.com/vendure-ecommerce/vendure/issues/138)
* **admin-ui** Add shipping method eligibility testing tool ([300da15](https://github.com/vendure-ecommerce/vendure/commit/300da15))
* **admin-ui** Automatically populate shipping method code ([082e882](https://github.com/vendure-ecommerce/vendure/commit/082e882))
* **admin-ui** Display shipping calculator metadata ([4e5bce5](https://github.com/vendure-ecommerce/vendure/commit/4e5bce5)), closes [#136](https://github.com/vendure-ecommerce/vendure/issues/136)
* **admin-ui** Enable deletion of shipping methods ([0032978](https://github.com/vendure-ecommerce/vendure/commit/0032978))
* **admin-ui** Support bearer token auth method ([c31a383](https://github.com/vendure-ecommerce/vendure/commit/c31a383)), closes [#138](https://github.com/vendure-ecommerce/vendure/issues/138)
* **core** Add testEligibleShippingMethods query ([bc860e0](https://github.com/vendure-ecommerce/vendure/commit/bc860e0))
* **core** Allow ShippingCalculator to return arbitrary metadata ([bdbdf9a](https://github.com/vendure-ecommerce/vendure/commit/bdbdf9a)), closes [#136](https://github.com/vendure-ecommerce/vendure/issues/136)
* **core** Automatically set CORS exposedHeaders for bearer auth ([f4cd718](https://github.com/vendure-ecommerce/vendure/commit/f4cd718)), closes [#137](https://github.com/vendure-ecommerce/vendure/issues/137)
* **core** Implement deleteShippingMethod mutation, add tests ([0b1dfd5](https://github.com/vendure-ecommerce/vendure/commit/0b1dfd5))

## <small>0.1.2-beta.11 (2019-08-08)</small>


#### Fixes

* **admin-ui** Correctly display long items in SimpleItemList ([ca2758f](https://github.com/vendure-ecommerce/vendure/commit/ca2758f))
* **admin-ui** Display zero shipping price in test tool ([0e7e2d3](https://github.com/vendure-ecommerce/vendure/commit/0e7e2d3))
* **admin-ui** Fix styling of order history ([8c5ff50](https://github.com/vendure-ecommerce/vendure/commit/8c5ff50))
* **admin-ui** Minor styling fixes ([c8fe561](https://github.com/vendure-ecommerce/vendure/commit/c8fe561))
* **core** Correct typing of PaymentMetadata ([e6d35df](https://github.com/vendure-ecommerce/vendure/commit/e6d35df))
* **core** Correctly update Refund state ([58caba7](https://github.com/vendure-ecommerce/vendure/commit/58caba7))

#### Features

* **admin-ui** Add shipping method test UI ([b76eac5](https://github.com/vendure-ecommerce/vendure/commit/b76eac5)), closes [#133](https://github.com/vendure-ecommerce/vendure/issues/133)
* **admin-ui** Display ProductVariant custom fields ([32017f3](https://github.com/vendure-ecommerce/vendure/commit/32017f3))
* **admin-ui** Display refund metadata ([eabd343](https://github.com/vendure-ecommerce/vendure/commit/eabd343))
* **admin-ui** Support extended ConfigurableOperations ([8cc0941](https://github.com/vendure-ecommerce/vendure/commit/8cc0941)), closes [#135](https://github.com/vendure-ecommerce/vendure/issues/135)
* **core** Extend configurable operation arguments API ([d17aaa9](https://github.com/vendure-ecommerce/vendure/commit/d17aaa9)), closes [#135](https://github.com/vendure-ecommerce/vendure/issues/135)
* **core** I18n for descriptions and labels of ConfigurableOperations ([a135e15](https://github.com/vendure-ecommerce/vendure/commit/a135e15))
* **core** Implement testShippingMethod query ([a3a9931](https://github.com/vendure-ecommerce/vendure/commit/a3a9931)), closes [#133](https://github.com/vendure-ecommerce/vendure/issues/133)


### BREAKING CHANGE

* `adjustmentOperations` query has been replaced by `promotionConditions` and `promotionActions`

* ConfigurableOperations (ShippingEligibilityChecker, ShippingCalculator, CollectionFilter, PromotionCondition, PromotionAction, PaymentMethodHandler) have a new API for defining their arguments. For existing Vendure installations, any Shipping Methods, Promotions and Collection will need to be re-configured after the update by removing any checker/calculator/filter/condition/action and re-adding it.
* ConfigurableOperations descriptions must now be specified as an array of LocalizedString rather than just a plain string. This allows the descriptions to be adapted to other locales.
## <small>0.1.2-beta.10 (2019-08-01)</small>


#### Features

* **admin-ui** Display nested payment metadata ([f90e773](https://github.com/vendure-ecommerce/vendure/commit/f90e773))
* **admin-ui** Enable cancellation of active orders ([8224ddd](https://github.com/vendure-ecommerce/vendure/commit/8224ddd))
* **core** Add error handling to payments ([cba63e1](https://github.com/vendure-ecommerce/vendure/commit/cba63e1))
* **core** Allow cancellation of order by id ([8d0a0eb](https://github.com/vendure-ecommerce/vendure/commit/8d0a0eb))
* **core** Export OrderState & PaymentState types ([8ef699d](https://github.com/vendure-ecommerce/vendure/commit/8ef699d))

#### Fixes

* **core** Correct ID types for SearchInput ([de78cc8](https://github.com/vendure-ecommerce/vendure/commit/de78cc8))
* **core** Fix incorrect import paths ([663fbd8](https://github.com/vendure-ecommerce/vendure/commit/663fbd8))
* **core** Remove LanguageCode arg from Shop API ([3b80224](https://github.com/vendure-ecommerce/vendure/commit/3b80224)), closes [#130](https://github.com/vendure-ecommerce/vendure/issues/130)
* **core** Remove non-existent import ([e660d46](https://github.com/vendure-ecommerce/vendure/commit/e660d46))
* **elasticsearch-plugin** Remove references to Decode decorator ([0d3d8ef](https://github.com/vendure-ecommerce/vendure/commit/0d3d8ef))


### BREAKING CHANGE

* The `languageCode` argument has been removed from all Shop API queries, namely `product`, `products`, `collection` and `collections`. Instead, LanguageCode should be specified as a query param.
## <small>0.1.2-beta.9 (2019-07-25)</small>


#### Features

* **core** Make request pipeline compatible with REST requests ([42aa5fb](https://github.com/vendure-ecommerce/vendure/commit/42aa5fb))
* **core** Rewrite plugin system to use Nest modules ([7ec309b](https://github.com/vendure-ecommerce/vendure/commit/7ec309b)), closes [#123](https://github.com/vendure-ecommerce/vendure/issues/123)
* **core** Use query param to specify language ([2035003](https://github.com/vendure-ecommerce/vendure/commit/2035003)), closes [#128](https://github.com/vendure-ecommerce/vendure/issues/128)
* **create** Improve error handling ([b5e0b62](https://github.com/vendure-ecommerce/vendure/commit/b5e0b62))
* **create** Update config template to new plugin format ([eb5d4ff](https://github.com/vendure-ecommerce/vendure/commit/eb5d4ff))

#### Fixes

* **admin-ui** Remove references to obsolete languageCode arguments ([1e81068](https://github.com/vendure-ecommerce/vendure/commit/1e81068)), closes [#128](https://github.com/vendure-ecommerce/vendure/issues/128)


### BREAKING CHANGE

* All `languageCode` GraphQL arguments have been removed from queries and instead, a "languageCode" query param may be attached to the API URL to specify the language of any translatable entities.
* Vendure plugins are now defined as Nestjs modules. For
existing installations, the VendureConfig will need to be modified so
that plugins are not instantiated, but use the static .init() method to
pass options to the plugin, e.g.:

    ```
    // before
    plugins: [ new AdminUiPlugin({ port: 3002 }) ],

    // after
    plugins: [ AdminUiPlugin.init({ port: 3002 }) ],
    ```
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

