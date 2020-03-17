## 0.10.0 (2020-03-17)


#### Features

* **admin-ui** Export helper for hosting external ui extensions ([3d08460](https://github.com/vendure-ecommerce/vendure/commit/3d08460))
* **admin-ui** Export minified theme css for ui extensions dev ([99073c9](https://github.com/vendure-ecommerce/vendure/commit/99073c9))
* **admin-ui** Improved ui extension development API & architecture ([fe72c41](https://github.com/vendure-ecommerce/vendure/commit/fe72c41))
* **admin-ui** Simplify API for adding menu items, custom controls ([2b9e4c4](https://github.com/vendure-ecommerce/vendure/commit/2b9e4c4))
* **admin-ui** Update Angular to v9 ([bc35c25](https://github.com/vendure-ecommerce/vendure/commit/bc35c25))
* **admin-ui** Update Clarity to v3.rc ([f8b94b2](https://github.com/vendure-ecommerce/vendure/commit/f8b94b2))
* **admin-ui** Use ProseMirror as rich text editor ([e309111](https://github.com/vendure-ecommerce/vendure/commit/e309111))
* **ui-devkit** Allow static assets to be renamed ([08e23d0](https://github.com/vendure-ecommerce/vendure/commit/08e23d0))
* **ui-devkit** Run detect and run ngcc on first compilation ([b5a57a8](https://github.com/vendure-ecommerce/vendure/commit/b5a57a8))

#### Fixes

* **admin-ui** Enable full template type checks and fix issues ([db36111](https://github.com/vendure-ecommerce/vendure/commit/db36111))
* **admin-ui** Prevent removal of FacetValue on ProductDetail form enter ([1db6c3d](https://github.com/vendure-ecommerce/vendure/commit/1db6c3d)), closes [#267](https://github.com/vendure-ecommerce/vendure/issues/267)
* **core** Correctly resolve deprecated asset fields in search query ([e9a517b](https://github.com/vendure-ecommerce/vendure/commit/e9a517b))
* **core** Correctly update search index on ProductVariant deletion ([401c236](https://github.com/vendure-ecommerce/vendure/commit/401c236)), closes [#266](https://github.com/vendure-ecommerce/vendure/issues/266)
* **elasticsearch-plugin** Correctly update index on variant deletion ([8b91a59](https://github.com/vendure-ecommerce/vendure/commit/8b91a59)), closes [#266](https://github.com/vendure-ecommerce/vendure/issues/266)


### BREAKING CHANGE

* This release introduces a re-architected solution for handling extensions to the Admin UI. *If you do not use the ui extensions feature, you will not need to change anything*. For those already using ui extensions, these are the changes:

* The `@vendure/admin-ui-plugin` now contains only the default admin ui app.
* To create extensions, you will need to install `@vendure/ui-devkit`, which exposes a `compileUiExtensions()` function.
* Here is an example of how the config differs:
  ```ts
    // before
    AdminUiPlugin.init({
        port: 3002,
        extensions: [
            ReviewsPlugin.uiExtensions,
            RewardsPlugin.uiExtensions,
        ],
        watch: true,
    }),
  ```
  ```ts
    // after
  import { compileUiExtensions } from '@vendure/ui-devkit/compiler';

  // ...

    AdminUiPlugin.init({
        port: 3002,
        app: compileUiExtensions({
            // The source files of the admin ui, extended with your extensions,
            // will be output and compiled from this location
            outputPath: path.join(__dirname, '../admin-ui'),
            extensions: [
                ReviewsPlugin.uiExtensions,
                RewardsPlugin.uiExtensions,
            ],
            watch: true,
        }),
    }),
  ```
* For lazy-loaded extension modules, you must now specify a `route` property. This allows us to lazy-load each extension individually, whereas previously _all_ extensions were bundled into a single lazy-loaded chunk.
  ```diff
  export class ReviewsPlugin {
      static uiExtensions: AdminUiExtension = {
          extensionPath: path.join(__dirname, 'ui'),
          id: 'reviews-plugin',
          ngModules: [{
              type: 'lazy',
  +           route: 'product-reviews',
              ngModuleFileName: 'reviews-ui-lazy.module.ts',
              ngModuleName: 'ReviewsUiLazyModule',
          }],
      };
  }

  // in the route config of the lazy-loaded module
  {
  -   path: 'product-reviews',
  +   path: '',
  +   pathMatch: 'full',
      component: AllProductReviewsListComponent,
  },
  ```
* The `CustomFieldControl` interface changed slightly:
  ```diff
  import {
  - CustomFieldConfig,
  + CustomFieldConfigType,
    CustomFieldControl,
  } from '@vendure/admin-ui/core';

  @Component({
      // ...
  })
  export class ReviewCountComponent implements CustomFieldControl  {
  -   customFieldConfig: CustomFieldConfig;
  +   customFieldConfig: CustomFieldConfigType;
      formControl: FormControl;
      // ...
  }
  ```
* **NOTE:** if you run into errors with Angular dependencies in the wrong place (e.g. nested inside the `node_modules` of another dependency), try running `yarn upgrade --check-files`, or failing that, remove the node_modules directory, delete the lockfile, and re-install.

## 0.9.0 (2020-02-19)


#### Fixes

* **asset-server-plugin** Correctly handle non-integer image dimensions ([e28c2b3](https://github.com/vendure-ecommerce/vendure/commit/e28c2b3))
* **core** Do not merge orders from another Customer ([de3715f](https://github.com/vendure-ecommerce/vendure/commit/de3715f)), closes [#263](https://github.com/vendure-ecommerce/vendure/issues/263)
* **testing** Correctly log from the main process ([bdd419f](https://github.com/vendure-ecommerce/vendure/commit/bdd419f))

#### Features

* **admin-ui** Asset names can be updated ([fcb4f3d](https://github.com/vendure-ecommerce/vendure/commit/fcb4f3d))
* **admin-ui** Export BaseEntityResolver ([db68d86](https://github.com/vendure-ecommerce/vendure/commit/db68d86))
* **admin-ui** Implement editing of Asset focal point ([11b6b33](https://github.com/vendure-ecommerce/vendure/commit/11b6b33)), closes [#93](https://github.com/vendure-ecommerce/vendure/issues/93)
* **admin-ui** Thumbnails make use of focal point data ([667b885](https://github.com/vendure-ecommerce/vendure/commit/667b885)), closes [#93](https://github.com/vendure-ecommerce/vendure/issues/93)
* **asset-server-plugin** Add ability to disable caching per-request ([22cc878](https://github.com/vendure-ecommerce/vendure/commit/22cc878))
* **asset-server-plugin** Implement focal point-aware cropping ([5fef77d](https://github.com/vendure-ecommerce/vendure/commit/5fef77d)), closes [#93](https://github.com/vendure-ecommerce/vendure/issues/93)
* **asset-server-plugin** Make AssetNamingStrategy configurable ([09dc445](https://github.com/vendure-ecommerce/vendure/commit/09dc445)), closes [#258](https://github.com/vendure-ecommerce/vendure/issues/258)
* **asset-server-plugin** Make the AssetStorageStrategy configurable ([a13a504](https://github.com/vendure-ecommerce/vendure/commit/a13a504)), closes [#258](https://github.com/vendure-ecommerce/vendure/issues/258)
* **core** Add `focalPoint` field to Asset entity ([1666e22](https://github.com/vendure-ecommerce/vendure/commit/1666e22)), closes [#93](https://github.com/vendure-ecommerce/vendure/issues/93)
* **core** Add asset focal point data to SearchResult type ([f717fb3](https://github.com/vendure-ecommerce/vendure/commit/f717fb3)), closes [#93](https://github.com/vendure-ecommerce/vendure/issues/93)
* **core** Publish AssetEvent when Asset created/modified ([3a352c5](https://github.com/vendure-ecommerce/vendure/commit/3a352c5))
* **elasticsearch-plugin** Store asset focal point data ([9027beb](https://github.com/vendure-ecommerce/vendure/commit/9027beb)), closes [#93](https://github.com/vendure-ecommerce/vendure/issues/93)

#### Perf

* **asset-server-plugin** Implement hashed directory naming for assets ([30c27c5](https://github.com/vendure-ecommerce/vendure/commit/30c27c5)), closes [#258](https://github.com/vendure-ecommerce/vendure/issues/258)
* **testing** Disable synchronization for sqljs e2e tests ([4ad7752](https://github.com/vendure-ecommerce/vendure/commit/4ad7752))


### BREAKING CHANGE

* A new field, `focalPoint` has been added to the `Asset` entity which will require a database migration to add.
* The `LocalAssetStorageStrategy` class has been removed from `@vendure/core` and now lives in the `@vendure/asset-server-plugin` package.
* The `search` query's `SearchResult` type has had two properties deprecated: `productPreview` and `productVariantPreview`. They are replaced by `productAsset.preview` and `productVariantAsset.preview respectively`. The deprecated properties still work but will be removed from a future release.
* The AssetServerPlugin has a new default naming strategy - instead of dumping all assets & previews into a single directory, it will now split sources & previews into subdirectories and in each of them will use hashed directories to ensure that the total number of files in a single directory does not grow too large (as this can have a negative performance impact). If you wish to keep the current behavior, then you must manually set the `namingStrategy: new DefaultAssetNamingStrategy()` in the `AssetServerPlugin.init()` method.
## <small>0.8.2 (2020-02-12)</small>


#### Features

* **admin-ui** Can delete TaxCategory via list view ([6f6e0a1](https://github.com/vendure-ecommerce/vendure/commit/6f6e0a1)), closes [#262](https://github.com/vendure-ecommerce/vendure/issues/262)
* **admin-ui** Can delete TaxRate via list view ([ee02aa2](https://github.com/vendure-ecommerce/vendure/commit/ee02aa2)), closes [#262](https://github.com/vendure-ecommerce/vendure/issues/262)
* **core** Implement deletion of TaxCategory ([b263b8b](https://github.com/vendure-ecommerce/vendure/commit/b263b8b)), closes [#262](https://github.com/vendure-ecommerce/vendure/issues/262)
* **core** Implement deletion of TaxRate ([8c2db90](https://github.com/vendure-ecommerce/vendure/commit/8c2db90)), closes [#262](https://github.com/vendure-ecommerce/vendure/issues/262)

#### Fixes

* **email-plugin** Correctly filter when using loadData in handler ([66bc98c](https://github.com/vendure-ecommerce/vendure/commit/66bc98c)), closes [#257](https://github.com/vendure-ecommerce/vendure/issues/257)
* **email-plugin** Fix Handlebars "cannot resolve property" error ([2984a90](https://github.com/vendure-ecommerce/vendure/commit/2984a90)), closes [#259](https://github.com/vendure-ecommerce/vendure/issues/259)

## <small>0.8.1 (2020-02-05)</small>


#### Fixes

* **admin-ui** Do not reset Promotion actions & conditions on update ([2b3fc72](https://github.com/vendure-ecommerce/vendure/commit/2b3fc72)), closes [#256](https://github.com/vendure-ecommerce/vendure/issues/256)
* **core** Prevent Customers from logging in to admin API ([09eb30c](https://github.com/vendure-ecommerce/vendure/commit/09eb30c)), closes [#77](https://github.com/vendure-ecommerce/vendure/issues/77)

#### Features

* **core** Allow a custom function for generating order codes ([7d36de9](https://github.com/vendure-ecommerce/vendure/commit/7d36de9)), closes [#252](https://github.com/vendure-ecommerce/vendure/issues/252)

## 0.8.0 (2020-01-30)


#### Fixes

* **admin-ui** Better error message when user lacks permissions ([1f7c230](https://github.com/vendure-ecommerce/vendure/commit/1f7c230)), closes [#246](https://github.com/vendure-ecommerce/vendure/issues/246)
* **admin-ui** Correct types for OrderDetail ([2169366](https://github.com/vendure-ecommerce/vendure/commit/2169366)), closes [#232](https://github.com/vendure-ecommerce/vendure/issues/232)
* **admin-ui** Fix TS error with latest apollo-client typings ([465f81e](https://github.com/vendure-ecommerce/vendure/commit/465f81e)), closes [#243](https://github.com/vendure-ecommerce/vendure/issues/243)
* **admin-ui** Set default `requiresPermission` for ActionBar items ([292e6d4](https://github.com/vendure-ecommerce/vendure/commit/292e6d4))
* **core** Correctly resolve Customer.User property ([c11c8a0](https://github.com/vendure-ecommerce/vendure/commit/c11c8a0))
* **core** Fix "contains" list filter operator for postgres ([c3898a6](https://github.com/vendure-ecommerce/vendure/commit/c3898a6))
* **core** Fix date handling for ListQueryBuilder ([6a6397b](https://github.com/vendure-ecommerce/vendure/commit/6a6397b)), closes [#251](https://github.com/vendure-ecommerce/vendure/issues/251)
* **core** Fix inconsistencies in behaviour between DB drivers ([71b8f4c](https://github.com/vendure-ecommerce/vendure/commit/71b8f4c))
* **core** Fix inconsistencies in DefaultSearchPlugin search strategies ([50fbae6](https://github.com/vendure-ecommerce/vendure/commit/50fbae6))
* **core** Fix worker becoming unresponsive after errors ([0f905b0](https://github.com/vendure-ecommerce/vendure/commit/0f905b0)), closes [#250](https://github.com/vendure-ecommerce/vendure/issues/250)
* **core** Publish state transition events after persisting entities ([005a553](https://github.com/vendure-ecommerce/vendure/commit/005a553)), closes [#245](https://github.com/vendure-ecommerce/vendure/issues/245)
* **core** Remove null defaults from entity fields ([98bff33](https://github.com/vendure-ecommerce/vendure/commit/98bff33)), closes [#244](https://github.com/vendure-ecommerce/vendure/issues/244)
* **core** Validate non-nullable custom fields ([f5dd95e](https://github.com/vendure-ecommerce/vendure/commit/f5dd95e))
* **elasticsearch-plugin** Fix inconsistencies in behaviour between DBs ([35d0008](https://github.com/vendure-ecommerce/vendure/commit/35d0008))

#### Features

* **admin-ui** Expose services to ActionBarItem onClick function ([e44d372](https://github.com/vendure-ecommerce/vendure/commit/e44d372)), closes [#247](https://github.com/vendure-ecommerce/vendure/issues/247)
* **core** Set default DB timezone to UTC ([8bf2c7a](https://github.com/vendure-ecommerce/vendure/commit/8bf2c7a))
* **core** Store TaxRate value as decimal type ([1aea1b5](https://github.com/vendure-ecommerce/vendure/commit/1aea1b5)), closes [#234](https://github.com/vendure-ecommerce/vendure/issues/234)
* **core** Use decimal type for OrderItem.taxRate ([92650ec](https://github.com/vendure-ecommerce/vendure/commit/92650ec)), closes [#234](https://github.com/vendure-ecommerce/vendure/issues/234)
* **testing** Add support for e2e tests backed by MySQL/MariaDB ([dbc591f](https://github.com/vendure-ecommerce/vendure/commit/dbc591f)), closes [#207](https://github.com/vendure-ecommerce/vendure/issues/207)
* **testing** Add support for e2e tests backed by Postgres ([50bdbd8](https://github.com/vendure-ecommerce/vendure/commit/50bdbd8)), closes [#207](https://github.com/vendure-ecommerce/vendure/issues/207)
* **testing** Modularize DB support for e2e tests ([f8060b5](https://github.com/vendure-ecommerce/vendure/commit/f8060b5)), closes [#207](https://github.com/vendure-ecommerce/vendure/issues/207)


### BREAKING CHANGE

* The `@vendure/testing` package now requires you to explicitly register initializers for the databases you with to test against. This change enables e2e tests to be run against any database supported by TypeORM. The `dataDir` option has been removed from the call to the `TestServer.init()` method, as it is specific to the SqljsInitializer:

before:
```TypeScript
import { createTestEnvironment, testConfig } from '@vendure/testing';

describe('my e2e test suite', () => {
    const { server, adminClient } = createTestEnvironment(testConfig);

    beforeAll(() => {
        await server.init({
            dataDir: path.join(__dirname, '__data__'),
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
    });

    //...
});
```

after:
```TypeScript
import { createTestEnvironment, registerInitializer, SqljsInitializer, testConfig } from '@vendure/testing';

registerInitializer('sqljs', new SqljsInitializer(path.join(__dirname, '__data__')));

describe('my e2e test suite', () => {
    const { server, adminClient } = createTestEnvironment(testConfig);

    beforeAll(() => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
    });

    //...
});
```
* The `OrderItem.taxRate` column type in the database has been changed from `int` to `decimal`. You will need to perform a migration to update this column and depending on your database type, you may need to manually edit the migration script in order to preserve the old values.
* The `TaxRate.value` column type in the database has been changed from `int` to `decimal`. You will need to perform a migration to update this column and depending on your database type, you may need to manually edit the migration script in order to preserve the old values.
* The default `dbConnectionOptions.timezone` setting is now set to `'Z'` (UTC). If you have not explicitly set the timezone in your project, then up until now it would have defaulted to `'local'`. To preserve this behavior you can override this new default by setting `dbConnectionOptions.timezone: 'local'` in your VendureConfig.
* This relates to Admin UI extensions. The `onClick` function signature of any custom ActionBarItems has changed - the second parameter used to be the `ActivatedRoute` - it is now an object containing `ActivatedRoute` plus an instance of `DataService` and `NotificationService`.
## 0.7.0 (2019-12-18)


#### Features

* **admin-ui** Display CustomFields for OrderLines in order detail view ([c33f1f6](https://github.com/vendure-ecommerce/vendure/commit/c33f1f6)), closes [#227](https://github.com/vendure-ecommerce/vendure/issues/227)
* **ui-devkit** Allow ui extensions to be launched in a new window ([71eb6a5](https://github.com/vendure-ecommerce/vendure/commit/71eb6a5))

#### Fixes

* **admin-ui** Correct mis-spelled "secondary" type in ModalService ([9600c42](https://github.com/vendure-ecommerce/vendure/commit/9600c42))
* **admin-ui** Correctly handle multiple additional NavMenu items ([6e27c37](https://github.com/vendure-ecommerce/vendure/commit/6e27c37))
* **core** Update TypeORM version to fix Postgres 12 compatibility ([895ebdf](https://github.com/vendure-ecommerce/vendure/commit/895ebdf)), closes [#177](https://github.com/vendure-ecommerce/vendure/issues/177)

#### Perf

* **core** Add `reload: false` to .save() operations ([3c33f33](https://github.com/vendure-ecommerce/vendure/commit/3c33f33))
* **core** Implement caching of GraphqlValueTransformer type trees ([ffe47b1](https://github.com/vendure-ecommerce/vendure/commit/ffe47b1)), closes [#226](https://github.com/vendure-ecommerce/vendure/issues/226)
* **core** Optimize OrderCalculator logic to improve performance ([71f3eab](https://github.com/vendure-ecommerce/vendure/commit/71f3eab)), closes [#226](https://github.com/vendure-ecommerce/vendure/issues/226)
* **core** Optimize some SQL queries in hot code paths for Orders ([691f579](https://github.com/vendure-ecommerce/vendure/commit/691f579)), closes [#226](https://github.com/vendure-ecommerce/vendure/issues/226)
* **core** Remove the @RelationId() decorator from OrderItem ([6bda232](https://github.com/vendure-ecommerce/vendure/commit/6bda232)), closes [#226](https://github.com/vendure-ecommerce/vendure/issues/226)


### BREAKING CHANGE

* The `Order` entity now has a new column, `taxZoneId`. This is used to more efficiently track changes to the active tax zone, and therefore reduce the number of tax calculations to be performed on an Order. This change will require a migration which should be routine.
## <small>0.6.5 (2019-12-11)</small>


#### Fixes

* **admin-ui** Add polling to watch mode to alleviate race condition ([1b95a81](https://github.com/vendure-ecommerce/vendure/commit/1b95a81))
* **admin-ui** Allow new FacetValues to be added ([337762e](https://github.com/vendure-ecommerce/vendure/commit/337762e)), closes [#222](https://github.com/vendure-ecommerce/vendure/issues/222)
* **admin-ui** Assign NavMenuSection default permission if not specified ([b476dcb](https://github.com/vendure-ecommerce/vendure/commit/b476dcb))
* **admin-ui** Correctly initialize Facet detail view ([d68fcb7](https://github.com/vendure-ecommerce/vendure/commit/d68fcb7))
* **admin-ui** Fix CustomerDetail display of custom fields ([02757ea](https://github.com/vendure-ecommerce/vendure/commit/02757ea))
* **core** Fix error when patching custom fields ([a3afc1b](https://github.com/vendure-ecommerce/vendure/commit/a3afc1b))

#### Features

* **admin-ui** Export Dialog interface ([6b31f28](https://github.com/vendure-ecommerce/vendure/commit/6b31f28))
* **admin-ui** Initial implementation of extension host architecture ([85815c1](https://github.com/vendure-ecommerce/vendure/commit/85815c1)), closes [#225](https://github.com/vendure-ecommerce/vendure/issues/225)
* **ui-devkit** Add `notify()` function ([085c7cf](https://github.com/vendure-ecommerce/vendure/commit/085c7cf))
* **ui-devkit** Create ui-devkit package for developing UI extensions ([20cd34d](https://github.com/vendure-ecommerce/vendure/commit/20cd34d)), closes [#225](https://github.com/vendure-ecommerce/vendure/issues/225)

## <small>0.6.4 (2019-12-04)</small>


#### Fixes

* **admin-ui** Correct bad imports ([3cd74ab](https://github.com/vendure-ecommerce/vendure/commit/3cd74ab))
* **admin-ui** Make Channel zones required in ChannelDetailComponent ([ba27360](https://github.com/vendure-ecommerce/vendure/commit/ba27360)), closes [#218](https://github.com/vendure-ecommerce/vendure/issues/218)
* **admin-ui** Order detail - fix broken app when no featuredAsset (#219) ([e0bfa4d](https://github.com/vendure-ecommerce/vendure/commit/e0bfa4d)), closes [#219](https://github.com/vendure-ecommerce/vendure/issues/219)
* **core** Enforce Channels created with a default tax/shipping Zone ([f57fb51](https://github.com/vendure-ecommerce/vendure/commit/f57fb51)), closes [#218](https://github.com/vendure-ecommerce/vendure/issues/218)
* **core** Use "double precision" as column type for float custom fields ([8f2d034](https://github.com/vendure-ecommerce/vendure/commit/8f2d034)), closes [#217](https://github.com/vendure-ecommerce/vendure/issues/217)
* **email-plugin** Fix incorrect relative imports ([561c793](https://github.com/vendure-ecommerce/vendure/commit/561c793))

#### Features

* **admin-ui** Make readonly custom fields readonly in the UI ([cf1d7f1](https://github.com/vendure-ecommerce/vendure/commit/cf1d7f1)), closes [#216](https://github.com/vendure-ecommerce/vendure/issues/216)
* **core** Export OrderCalculator helper service ([6340045](https://github.com/vendure-ecommerce/vendure/commit/6340045))
* **core** Implement internal and readonly CustomField properties ([c2ae44f](https://github.com/vendure-ecommerce/vendure/commit/c2ae44f)), closes [#216](https://github.com/vendure-ecommerce/vendure/issues/216)

## <small>0.6.3 (2019-11-26)</small>

*Note: only the `@vendure/email-plugin` package was updated in this release, as v0.6.2 included a critical bug which prevented installation via `@vendure/create`*

#### Fixes

* **email-plugin** Fix TypeScript compiler error on defaultEmailHandlers ([d794e5f](https://github.com/vendure-ecommerce/vendure/commit/d794e5f))

## <small>0.6.2 (2019-11-26)</small>


#### Features

* **core** Allow custom ApolloServerPlugins to be specified ([dc45c87](https://github.com/vendure-ecommerce/vendure/commit/dc45c87)), closes [#210](https://github.com/vendure-ecommerce/vendure/issues/210)
* **create** Include a .gitignore file ([6b6b3e3](https://github.com/vendure-ecommerce/vendure/commit/6b6b3e3))
* **email-plugin** Allow async data loading in EmailEventHandlers ([155d429](https://github.com/vendure-ecommerce/vendure/commit/155d429)), closes [#184](https://github.com/vendure-ecommerce/vendure/issues/184)

#### Fixes

* **core** Ensure plugins instantiated only once per process ([7198b85](https://github.com/vendure-ecommerce/vendure/commit/7198b85)), closes [#213](https://github.com/vendure-ecommerce/vendure/issues/213)
* **core** Export LoginEvent & RefundStateTransitionEvent ([90e161b](https://github.com/vendure-ecommerce/vendure/commit/90e161b))
* **core** Use correct config & output path when generating migrations ([637c863](https://github.com/vendure-ecommerce/vendure/commit/637c863))
* **core** Use correct config for runMigrations & revertLastMigration ([c9acd68](https://github.com/vendure-ecommerce/vendure/commit/c9acd68))

## <small>0.6.1 (2019-11-18)</small>


#### Fixes

* **asset-server-plugin** Update sharp dependency for node 13 compat ([186b47e](https://github.com/vendure-ecommerce/vendure/commit/186b47e)), closes [#204](https://github.com/vendure-ecommerce/vendure/issues/204)
* **core** Fix product search with postgres ([dadef4c](https://github.com/vendure-ecommerce/vendure/commit/dadef4c)), closes [#206](https://github.com/vendure-ecommerce/vendure/issues/206)

## 0.6.0 (2019-11-14)


#### Fixes

* **admin-ui** Correctly display HttpErrorResponse messages ([8cc6885](https://github.com/vendure-ecommerce/vendure/commit/8cc6885))
* **admin-ui** Correctly specify channels when creating a Role ([34a6a3e](https://github.com/vendure-ecommerce/vendure/commit/34a6a3e))
* **admin-ui** Update permissions-based display when permissions change ([aec08be](https://github.com/vendure-ecommerce/vendure/commit/aec08be))
* **core** Add resolver for Role.channels ([5a2ddc5](https://github.com/vendure-ecommerce/vendure/commit/5a2ddc5))

#### Features

* **admin-ui** Add channel switcher ([0396e88](https://github.com/vendure-ecommerce/vendure/commit/0396e88)), closes [#12](https://github.com/vendure-ecommerce/vendure/issues/12)
* **admin-ui** Display color-coded label for Channels ([571c379](https://github.com/vendure-ecommerce/vendure/commit/571c379))
* **admin-ui** Display permissions by Channel in Admin detail view ([586f2d7](https://github.com/vendure-ecommerce/vendure/commit/586f2d7))
* **admin-ui** Enable assigning Products to Channels ([59b9c91](https://github.com/vendure-ecommerce/vendure/commit/59b9c91)), closes [#12](https://github.com/vendure-ecommerce/vendure/issues/12)
* **admin-ui** Enable deletion of Channels ([b295e52](https://github.com/vendure-ecommerce/vendure/commit/b295e52)), closes [#12](https://github.com/vendure-ecommerce/vendure/issues/12)
* **admin-ui** Enable deletion of Roles ([2a674a3](https://github.com/vendure-ecommerce/vendure/commit/2a674a3))
* **admin-ui** Enable removal of Product from Channel ([27eea68](https://github.com/vendure-ecommerce/vendure/commit/27eea68)), closes [#12](https://github.com/vendure-ecommerce/vendure/issues/12)
* **admin-ui** Enable setting Role channel on update ([8379a82](https://github.com/vendure-ecommerce/vendure/commit/8379a82)), closes [#12](https://github.com/vendure-ecommerce/vendure/issues/12)
* **admin-ui** Truncate display of role permissions if too long ([98d971f](https://github.com/vendure-ecommerce/vendure/commit/98d971f))
* **core** Add channel handling to DefaultSearchPlugin ([280a38b](https://github.com/vendure-ecommerce/vendure/commit/280a38b))
* **core** Allow Roles to be created in other channels ([df5f006](https://github.com/vendure-ecommerce/vendure/commit/df5f006)), closes [#12](https://github.com/vendure-ecommerce/vendure/issues/12)
* **core** Allow Roles to have Channels specified on update ([b3dd6c1](https://github.com/vendure-ecommerce/vendure/commit/b3dd6c1))
* **core** Assign superadmin Role to newly created Channels ([6fc421a](https://github.com/vendure-ecommerce/vendure/commit/6fc421a))
* **core** Automatically assign Customer role to all new Channels ([da826f2](https://github.com/vendure-ecommerce/vendure/commit/da826f2))
* **core** Constrain channel-aware queries by channelId ([51c1b07](https://github.com/vendure-ecommerce/vendure/commit/51c1b07)), closes [#12](https://github.com/vendure-ecommerce/vendure/issues/12)
* **core** Implement `assignProductsToChannel` mutation ([5fda66b](https://github.com/vendure-ecommerce/vendure/commit/5fda66b)), closes [#12](https://github.com/vendure-ecommerce/vendure/issues/12)
* **core** Implement deleteChannel mutation ([989960b](https://github.com/vendure-ecommerce/vendure/commit/989960b)), closes [#12](https://github.com/vendure-ecommerce/vendure/issues/12)
* **core** Implement deleteRole mutation ([7b338a4](https://github.com/vendure-ecommerce/vendure/commit/7b338a4))
* **core** Implement removeProductsFromChannel mutation ([6a165dc](https://github.com/vendure-ecommerce/vendure/commit/6a165dc))
* **core** Make product/variant events more granular ([4f9a186](https://github.com/vendure-ecommerce/vendure/commit/4f9a186))
* **core** Update search index on Product assigned/removed from Channel ([3a6c277](https://github.com/vendure-ecommerce/vendure/commit/3a6c277)), closes [#12](https://github.com/vendure-ecommerce/vendure/issues/12)
* **elasticsearch-plugin** Add support for multiple channels ([aacfaf4](https://github.com/vendure-ecommerce/vendure/commit/aacfaf4))


### BREAKING CHANGE

* The `CatalogModificationEvent` which was previously published whenever changes were made to `Product` or `ProductVariant` entities has been replaced with a `ProductEvent` and `ProductVariantEvent`, including the type of event ('created', 'updated', 'deleted').
* The `SearchIndexItem` entity used by the `DefaultSearchPlugin` has a couple of new fields related to Channel handling. Once the schema is updated (either by synchronizing or running a migration), the search index should be rebuilt.
## <small>0.5.1 (2019-11-04)</small>


#### Fixes

* **admin-ui** Display correct net total in Order detail ([b177f2c](https://github.com/vendure-ecommerce/vendure/commit/b177f2c)), closes [#200](https://github.com/vendure-ecommerce/vendure/issues/200)

#### Features

* **admin-ui** Export CanDeactivateDetailGuard ([89c0699](https://github.com/vendure-ecommerce/vendure/commit/89c0699))
* **core** Allow lazy evaluation of APIExtensionDefinitions ([69dad0b](https://github.com/vendure-ecommerce/vendure/commit/69dad0b))
* **core** Export some entity utils from service helpers ([ddceb64](https://github.com/vendure-ecommerce/vendure/commit/ddceb64))
* **core** Export the Api decorator & ApiType type ([c7857d3](https://github.com/vendure-ecommerce/vendure/commit/c7857d3))
* **core** Update Nestjs to v6.8.5, TypeORM to v0.2.20
* **elasticsearch-plugin** Allow definition of custom mappings ([2c8b7df](https://github.com/vendure-ecommerce/vendure/commit/2c8b7df))
* **testing** Extract e2e testing tools into `@vendute/testing` package, closes [#198](https://github.com/vendure-ecommerce/vendure/issues/198)

## 0.5.0 (2019-10-23)


#### Features

* **admin-ui-plugin** Allow UI extensions to contain multiple modules ([b23c3e8](https://github.com/vendure-ecommerce/vendure/commit/b23c3e8))
* **admin-ui** Display hint if deleting Collection with descendants ([27b7080](https://github.com/vendure-ecommerce/vendure/commit/27b7080))
* **admin-ui** Export BaseListComponent & BaseDetailComponent ([d222449](https://github.com/vendure-ecommerce/vendure/commit/d222449))
* **admin-ui** Make CollectionList items expandable ([147bf17](https://github.com/vendure-ecommerce/vendure/commit/147bf17))
* **core** Allow log level to be set in migration helpers ([34cb07e](https://github.com/vendure-ecommerce/vendure/commit/34cb07e))
* **core** Auto-generate GraphQL ListOptions for plugin extensions ([aa40776](https://github.com/vendure-ecommerce/vendure/commit/aa40776))
* **core** Export all service-layer helpers in PluginCommonModule ([0d57eca](https://github.com/vendure-ecommerce/vendure/commit/0d57eca))
* **core** Export ListQueryBuilder helper ([5bb5c1e](https://github.com/vendure-ecommerce/vendure/commit/5bb5c1e))

#### Fixes

* **admin-ui** Fix notification label for CollectionList ([cd02789](https://github.com/vendure-ecommerce/vendure/commit/cd02789)), closes [#186](https://github.com/vendure-ecommerce/vendure/issues/186)
* **admin-ui** Import missing social-shapes icons ([7b5b943](https://github.com/vendure-ecommerce/vendure/commit/7b5b943))
* **admin-ui** Remove paging from CollectionList ([517fcd0](https://github.com/vendure-ecommerce/vendure/commit/517fcd0))
* **core** Correctly handle 404 and other Nestjs errors ([4f2c4df](https://github.com/vendure-ecommerce/vendure/commit/4f2c4df)), closes [#187](https://github.com/vendure-ecommerce/vendure/issues/187)
* **core** Deleting a Collection also deletes descendants ([1ba9e2d](https://github.com/vendure-ecommerce/vendure/commit/1ba9e2d)), closes [#186](https://github.com/vendure-ecommerce/vendure/issues/186)
* **core** Prevent unhandled promise rejection on worker SIGINT ([39ca526](https://github.com/vendure-ecommerce/vendure/commit/39ca526)), closes [#150](https://github.com/vendure-ecommerce/vendure/issues/150)
* **create** Add .gitattributes to prevent eol conversions ([5fdeace](https://github.com/vendure-ecommerce/vendure/commit/5fdeace)), closes [#185](https://github.com/vendure-ecommerce/vendure/issues/185)


### BREAKING CHANGE

* The API for configuring Admin UI extensions has changed to allow a single extension to define multiple Angular NgModules. This arose as a requirement when working on more complex UI extensions which e.g. define both a shared and a lazy module which share code. Such an arrangement was not possible using the existing API.

Here's how to update:
```TypeScript
// Old API
extensions: [
    {
        type: 'lazy',
        ngModulePath: path.join(__dirname, 'ui-extensions/greeter'),
        ngModuleFileName: 'greeter-extension.module.ts',
        ngModuleName: 'GreeterModule',
    }
],

// New API
extensions: [
    {
        extensionPath: path.join(__dirname, 'ui-extensions/greeter'),
        ngModules: [{
            type: 'lazy',
            ngModuleFileName: 'greeter-extension.module.ts',
            ngModuleName: 'GreeterModule',
        }],
    }
],
```
## 0.4.0 (2019-10-16)


#### Features

* **admin-ui** Add coupon & date rage data to PromotionList ([4827aa4](https://github.com/vendure-ecommerce/vendure/commit/4827aa4))
* **admin-ui** Add date range & coupon code controls to PromotionDetail ([48def65](https://github.com/vendure-ecommerce/vendure/commit/48def65)), closes [#174](https://github.com/vendure-ecommerce/vendure/issues/174)
* **admin-ui** Add detailed promotion & tax info to OrderDetail view ([cd823fe](https://github.com/vendure-ecommerce/vendure/commit/cd823fe))
* **admin-ui** Add visibility to Order notes ([760d519](https://github.com/vendure-ecommerce/vendure/commit/760d519)), closes [#180](https://github.com/vendure-ecommerce/vendure/issues/180)
* **admin-ui** Create cross-browser datetime picker component ([78a713c](https://github.com/vendure-ecommerce/vendure/commit/78a713c)), closes [#181](https://github.com/vendure-ecommerce/vendure/issues/181)
* **admin-ui** Display coupon code entries in order history ([9f269fe](https://github.com/vendure-ecommerce/vendure/commit/9f269fe))
* **core** Add couponCodes to Order & mutations to add/remove codes ([fdacb4b](https://github.com/vendure-ecommerce/vendure/commit/fdacb4b)), closes [#174](https://github.com/vendure-ecommerce/vendure/issues/174)
* **core** Add date range and couponCode to Promotion entity ([e615d2f](https://github.com/vendure-ecommerce/vendure/commit/e615d2f)), closes [#174](https://github.com/vendure-ecommerce/vendure/issues/174)
* **core** Add history entry to Order when vouchers applied/removed ([887cc6c](https://github.com/vendure-ecommerce/vendure/commit/887cc6c))
* **core** Add isPublic flag to AddNoteToOrderInput ([f97c3ac](https://github.com/vendure-ecommerce/vendure/commit/f97c3ac)), closes [#180](https://github.com/vendure-ecommerce/vendure/issues/180)
* **core** Add validation to Promotion conditions ([74e7444](https://github.com/vendure-ecommerce/vendure/commit/74e7444))
* **core** Export database migration helpers ([d509805](https://github.com/vendure-ecommerce/vendure/commit/d509805))
* **core** Expose Order.promotions via GraphQL APIs ([02ebd9c](https://github.com/vendure-ecommerce/vendure/commit/02ebd9c)), closes [#174](https://github.com/vendure-ecommerce/vendure/issues/174)
* **core** Implement per-customer usage limits for Promotions ([9d45069](https://github.com/vendure-ecommerce/vendure/commit/9d45069)), closes [#174](https://github.com/vendure-ecommerce/vendure/issues/174)
* **core** Implement Promotion date range & coupon code checks ([f6eb343](https://github.com/vendure-ecommerce/vendure/commit/f6eb343)), closes [#174](https://github.com/vendure-ecommerce/vendure/issues/174)
* **core** Log thrown errors ([ed7f5fb](https://github.com/vendure-ecommerce/vendure/commit/ed7f5fb))
* **core** Move error logging to the API Filter layer ([e8fd15d](https://github.com/vendure-ecommerce/vendure/commit/e8fd15d))
* **create** Generate README file with new projects ([4e2784f](https://github.com/vendure-ecommerce/vendure/commit/4e2784f))
* **create** Rework folder structure, add build & migration scripts ([746abff](https://github.com/vendure-ecommerce/vendure/commit/746abff)), closes [#175](https://github.com/vendure-ecommerce/vendure/issues/175)

#### Fixes

* **admin-ui** Fix creating new Channels ([b8e4c6c](https://github.com/vendure-ecommerce/vendure/commit/b8e4c6c)), closes [#182](https://github.com/vendure-ecommerce/vendure/issues/182)
* **admin-ui** Fix customField product error: handle undef. case ([8265359](https://github.com/vendure-ecommerce/vendure/commit/8265359))
* **core** Allow nullable fields to be unset via GraphQL API ([d9f5c41](https://github.com/vendure-ecommerce/vendure/commit/d9f5c41))
* **core** Fix DefaultLogger logLevel Error ([d5405a0](https://github.com/vendure-ecommerce/vendure/commit/d5405a0))
* **core** Fix duplicate plugin entities being registered on bootstrap ([ce00406](https://github.com/vendure-ecommerce/vendure/commit/ce00406))
* **core** Fix order totals calculation with order % discount ([a4fea59](https://github.com/vendure-ecommerce/vendure/commit/a4fea59))
* **core** Fix OrderItem totals calculation logic ([3c66cf8](https://github.com/vendure-ecommerce/vendure/commit/3c66cf8))


### BREAKING CHANGE

* A new `couponCodes` column is added to the Order table, which will require a DB migration.
* A new `promotions` relation has been added to the order table, and a `perCustomerUsageLimit` column to the promotion table. This will require a DB migration.
* Removes `atLeastNOfProduct` from defaultPromotionConditions and `itemPercentageDiscount` & `buy1Get1Free` from defaultPromotionActions. They are either not useful or need to be re-implemented in a way that works correctly.
## <small>0.3.4 (2019-10-09)</small>


#### Features

* **admin-ui** Add entity info to detail views ([cf604aa](https://github.com/vendure-ecommerce/vendure/commit/cf604aa)), closes [#179](https://github.com/vendure-ecommerce/vendure/issues/179)

#### Fixes

* **admin-ui** Do not expose internal entity IDs ([2ca9cc1](https://github.com/vendure-ecommerce/vendure/commit/2ca9cc1)), closes [#178](https://github.com/vendure-ecommerce/vendure/issues/178)
* **core** Add date fields to graphql Country type ([818be24](https://github.com/vendure-ecommerce/vendure/commit/818be24))
* **core** Fix uuid strategy, rework setting of ID data types in DB ([d50d488](https://github.com/vendure-ecommerce/vendure/commit/d50d488)), closes [#176](https://github.com/vendure-ecommerce/vendure/issues/176)

## <small>0.3.3 (2019-10-03)</small>


#### Features

* **admin-ui** Allow creation of verified Customers ([f451115](https://github.com/vendure-ecommerce/vendure/commit/f451115)), closes [#171](https://github.com/vendure-ecommerce/vendure/issues/171)
* **admin-ui** Allow selection of payment to be refunded ([8009220](https://github.com/vendure-ecommerce/vendure/commit/8009220))
* **core** Improved Collection import ([c654d6f](https://github.com/vendure-ecommerce/vendure/commit/c654d6f)), closes [#173](https://github.com/vendure-ecommerce/vendure/issues/173)
* **core** Verify admin-created Customers if password supplied ([9931e25](https://github.com/vendure-ecommerce/vendure/commit/9931e25)), closes [#171](https://github.com/vendure-ecommerce/vendure/issues/171)

#### Fixes

* **admin-ui** Correctly handle defaults for configurable operations ([9bd6a79](https://github.com/vendure-ecommerce/vendure/commit/9bd6a79))
* **admin-ui** Fix DisabledDirective making form dirty ([70e857d](https://github.com/vendure-ecommerce/vendure/commit/70e857d))
* **core** Do not duplicate plugins when running work in main process ([c040c0b](https://github.com/vendure-ecommerce/vendure/commit/c040c0b))

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

