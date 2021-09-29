## <small>1.2.3 (2021-09-29)</small>


## <small>1.2.2 (2021-09-28)</small>


#### Perf

* **core** Cache certain field resolvers to avoid duplicated DB calls ([13697c3](https://github.com/vendure-ecommerce/vendure/commit/13697c3)), closes [#1119](https://github.com/vendure-ecommerce/vendure/issues/1119)

#### Fixes

* **admin-ui** Do not cache active admin details between logins ([20b4b04](https://github.com/vendure-ecommerce/vendure/commit/20b4b04)), closes [#1099](https://github.com/vendure-ecommerce/vendure/issues/1099)
* **admin-ui** Use correct order total on Customer detail page ([ddc2b0a](https://github.com/vendure-ecommerce/vendure/commit/ddc2b0a))
* **core**  Fix wrong event type when a variant is created (#1102) ([cc45254](https://github.com/vendure-ecommerce/vendure/commit/cc45254)), closes [#1102](https://github.com/vendure-ecommerce/vendure/issues/1102) [#1095](https://github.com/vendure-ecommerce/vendure/issues/1095)
* **core** Add missing logging & docs to DefaultJobQueuePlugin ([423f307](https://github.com/vendure-ecommerce/vendure/commit/423f307))
* **core** Fix collection update event generation (#1114) ([6e7e864](https://github.com/vendure-ecommerce/vendure/commit/6e7e864)), closes [#1114](https://github.com/vendure-ecommerce/vendure/issues/1114) [#1015](https://github.com/vendure-ecommerce/vendure/issues/1015)
* **core** Fix updating customer email with no NativeAuth configured ([f6d3a52](https://github.com/vendure-ecommerce/vendure/commit/f6d3a52)), closes [#1092](https://github.com/vendure-ecommerce/vendure/issues/1092)
* **core** Gracefully handle errors when populating initial data ([36c15b2](https://github.com/vendure-ecommerce/vendure/commit/36c15b2))
* **core** Return correct timestamp values for translated entities ([ded49c4](https://github.com/vendure-ecommerce/vendure/commit/ded49c4)), closes [#1101](https://github.com/vendure-ecommerce/vendure/issues/1101)
* **core** Soft-delete variants when a product is soft-deleted ([ff1ae90](https://github.com/vendure-ecommerce/vendure/commit/ff1ae90)), closes [#1096](https://github.com/vendure-ecommerce/vendure/issues/1096)
* **elasticsearch-plugin** Elasticsearch Cloud auth is not set during re-indexing (#1108) ([e40fc1c](https://github.com/vendure-ecommerce/vendure/commit/e40fc1c)), closes [#1108](https://github.com/vendure-ecommerce/vendure/issues/1108) [#1106](https://github.com/vendure-ecommerce/vendure/issues/1106)
* **email-plugin** Correctly register failed email sending, add retry ([f50708a](https://github.com/vendure-ecommerce/vendure/commit/f50708a))
* **job-queue-plugin** Add missing logging & backoff settings ([6f7cc34](https://github.com/vendure-ecommerce/vendure/commit/6f7cc34))
* **job-queue-plugin** Fix redis connection to remote hosts ([9e36873](https://github.com/vendure-ecommerce/vendure/commit/9e36873)), closes [#1097](https://github.com/vendure-ecommerce/vendure/issues/1097)

## <small>1.2.1 (2021-09-15)</small>


#### Fixes

* **admin-ui** Add missing Spanish translation strings and fix a few typos (#1079) ([bd22dc5](https://github.com/vendure-ecommerce/vendure/commit/bd22dc5)), closes [#1079](https://github.com/vendure-ecommerce/vendure/issues/1079)
* **admin-ui** Hide "assign to channel" button when creating Product ([ffeeaf6](https://github.com/vendure-ecommerce/vendure/commit/ffeeaf6)), closes [#1059](https://github.com/vendure-ecommerce/vendure/issues/1059)
* **admin-ui** Keep product search bar in sync with url params ([58d5634](https://github.com/vendure-ecommerce/vendure/commit/58d5634)), closes [#1053](https://github.com/vendure-ecommerce/vendure/issues/1053)
* **admin-ui** More consistent width of default custom field controls ([001207f](https://github.com/vendure-ecommerce/vendure/commit/001207f)), closes [#1077](https://github.com/vendure-ecommerce/vendure/issues/1077)
* **core** Fix validation for nullable custom string fields with options ([9afa145](https://github.com/vendure-ecommerce/vendure/commit/9afa145)), closes [#1083](https://github.com/vendure-ecommerce/vendure/issues/1083)
* **core** Improve log level of ForbiddenError to reduce log noise ([5be1dfe](https://github.com/vendure-ecommerce/vendure/commit/5be1dfe)), closes [#1080](https://github.com/vendure-ecommerce/vendure/issues/1080)
* **core** Translate root Collection on first creation ([46659c7](https://github.com/vendure-ecommerce/vendure/commit/46659c7)), closes [#1068](https://github.com/vendure-ecommerce/vendure/issues/1068)
* **core** Update login credentials when changing customer email address ([1ebc872](https://github.com/vendure-ecommerce/vendure/commit/1ebc872)), closes [#1071](https://github.com/vendure-ecommerce/vendure/issues/1071)
* **create** Do not HTML escape strings used in the config file ([954c03a](https://github.com/vendure-ecommerce/vendure/commit/954c03a)), closes [#1070](https://github.com/vendure-ecommerce/vendure/issues/1070)

## 1.2.0 (2021-09-01)


#### Features

* **admin-ui** Add admin-ui Italian translation (#998) ([657a32b](https://github.com/vendure-ecommerce/vendure/commit/657a32b)), closes [#998](https://github.com/vendure-ecommerce/vendure/issues/998)
* **admin-ui** Allow editing ProductOptionGroup names & options ([55d9784](https://github.com/vendure-ecommerce/vendure/commit/55d9784)), closes [#965](https://github.com/vendure-ecommerce/vendure/issues/965)
* **admin-ui** Allow OrderAddress custom fields to be modified ([175e61a](https://github.com/vendure-ecommerce/vendure/commit/175e61a)), closes [#979](https://github.com/vendure-ecommerce/vendure/issues/979)
* **admin-ui** Auto-select newly uploaded assets in AssetPickerDialog ([96cc8f9](https://github.com/vendure-ecommerce/vendure/commit/96cc8f9))
* **admin-ui** Support non-latin Product/Collection slugs ([fac735f](https://github.com/vendure-ecommerce/vendure/commit/fac735f)), closes [#1006](https://github.com/vendure-ecommerce/vendure/issues/1006)
* **core** Add  Russian and Ukrainian translation for server messages (#973) ([5b4a166](https://github.com/vendure-ecommerce/vendure/commit/5b4a166)), closes [#973](https://github.com/vendure-ecommerce/vendure/issues/973)
* **core** Add Facet queries to Shop API (#1016) ([d6a049c](https://github.com/vendure-ecommerce/vendure/commit/d6a049c)), closes [#1016](https://github.com/vendure-ecommerce/vendure/issues/1016) [#1013](https://github.com/vendure-ecommerce/vendure/issues/1013)
* **core** Allow cookie & bearer session tokens at the same time ([fc6b890](https://github.com/vendure-ecommerce/vendure/commit/fc6b890)), closes [#960](https://github.com/vendure-ecommerce/vendure/issues/960)
* **core** Allow OrderAddress custom fields to be modified ([c622f1f](https://github.com/vendure-ecommerce/vendure/commit/c622f1f)), closes [#979](https://github.com/vendure-ecommerce/vendure/issues/979)
* **core** Always pass current Order to TaxZoneStrategy calls ([7b76a7c](https://github.com/vendure-ecommerce/vendure/commit/7b76a7c)), closes [#1048](https://github.com/vendure-ecommerce/vendure/issues/1048)
* **core** Export I18nModule as part of PluginCommonModule ([cd8f3d4](https://github.com/vendure-ecommerce/vendure/commit/cd8f3d4)), closes [#966](https://github.com/vendure-ecommerce/vendure/issues/966)
* **core** Export ProcessContextModule from PluginCommonModule ([b787acb](https://github.com/vendure-ecommerce/vendure/commit/b787acb))
* **core** Implement health check server for worker ([fd374b3](https://github.com/vendure-ecommerce/vendure/commit/fd374b3)), closes [#994](https://github.com/vendure-ecommerce/vendure/issues/994)
* **core** Implement internal health check for worker ([812b2cb](https://github.com/vendure-ecommerce/vendure/commit/812b2cb)), closes [#994](https://github.com/vendure-ecommerce/vendure/issues/994)
* **elasticsearch-plugin** Add ability to customize index options and mappings ([92587e5](https://github.com/vendure-ecommerce/vendure/commit/92587e5)), closes [#995](https://github.com/vendure-ecommerce/vendure/issues/995) [#995](https://github.com/vendure-ecommerce/vendure/issues/995) [#995](https://github.com/vendure-ecommerce/vendure/issues/995) [#995](https://github.com/vendure-ecommerce/vendure/issues/995)
* **job-queue-plugin** Create BullMQJobQueuePlugin ([ba9f5d0](https://github.com/vendure-ecommerce/vendure/commit/ba9f5d0))
* **job-queue-plugin** Set default concurrency ([0e971e7](https://github.com/vendure-ecommerce/vendure/commit/0e971e7))

#### Fixes

* **admin-ui-plugin** Do not run server logic in worker context ([7c30f0e](https://github.com/vendure-ecommerce/vendure/commit/7c30f0e))
* **admin-ui** Fix fetch loop on job list view ([29c306a](https://github.com/vendure-ecommerce/vendure/commit/29c306a)), closes [#1049](https://github.com/vendure-ecommerce/vendure/issues/1049)
* **asset-server-plugin** Do not run server logic in worker context ([c3a67b6](https://github.com/vendure-ecommerce/vendure/commit/c3a67b6))
* **core** Correctly persist ProductVariant customFields ([e59f52e](https://github.com/vendure-ecommerce/vendure/commit/e59f52e)), closes [#1056](https://github.com/vendure-ecommerce/vendure/issues/1056)
* **core** Fix incorrect common import paths ([568e4b2](https://github.com/vendure-ecommerce/vendure/commit/568e4b2))
* **email-plugin** Do not run server logic in worker context ([f5b6ddc](https://github.com/vendure-ecommerce/vendure/commit/f5b6ddc))

## <small>1.1.5 (2021-08-19)</small>


#### Fixes

* **admin-ui** Fix regression from v1.1.4 which broke Admin UI ([63ad437](https://github.com/vendure-ecommerce/vendure/commit/63ad437)), closes [#1045](https://github.com/vendure-ecommerce/vendure/issues/1045)
* **core** Correct camel casing for custom orderable asset ids ([cd18431](https://github.com/vendure-ecommerce/vendure/commit/cd18431)), closes [#1035](https://github.com/vendure-ecommerce/vendure/issues/1035)

## <small>1.1.4 (2021-08-19)</small>


#### Fixes

* **admin-ui** Apply variant name auto-generation for new translations ([df3d3f4](https://github.com/vendure-ecommerce/vendure/commit/df3d3f4)), closes [#600](https://github.com/vendure-ecommerce/vendure/issues/600)
* **admin-ui** Correctly display OrderLine custom field values ([496ce5e](https://github.com/vendure-ecommerce/vendure/commit/496ce5e)), closes [#1031](https://github.com/vendure-ecommerce/vendure/issues/1031)
* **admin-ui** Correctly set content lang based on available langs ([d9531fd](https://github.com/vendure-ecommerce/vendure/commit/d9531fd)), closes [#1033](https://github.com/vendure-ecommerce/vendure/issues/1033)
* **admin-ui** Fix Channel dropdown auto-select in Safari (#1040) ([aee8416](https://github.com/vendure-ecommerce/vendure/commit/aee8416)), closes [#1040](https://github.com/vendure-ecommerce/vendure/issues/1040) [#1036](https://github.com/vendure-ecommerce/vendure/issues/1036)
* **admin-ui** Improve display of long Collection paths in dropdown ([4d7032b](https://github.com/vendure-ecommerce/vendure/commit/4d7032b)), closes [#1042](https://github.com/vendure-ecommerce/vendure/issues/1042)
* **core** Allow custom host id when creating new entity with orderable assets (#1035) ([aeaf308](https://github.com/vendure-ecommerce/vendure/commit/aeaf308)), closes [#1035](https://github.com/vendure-ecommerce/vendure/issues/1035) [#1034](https://github.com/vendure-ecommerce/vendure/issues/1034)
* **core** Fix custom field validation when updating ProductVariants ([372b4af](https://github.com/vendure-ecommerce/vendure/commit/372b4af)), closes [#1014](https://github.com/vendure-ecommerce/vendure/issues/1014)
* **core** Fix incorrect quantity adjustment (#983) ([2441ce7](https://github.com/vendure-ecommerce/vendure/commit/2441ce7)), closes [#983](https://github.com/vendure-ecommerce/vendure/issues/983) [#931](https://github.com/vendure-ecommerce/vendure/issues/931)
* **core** Fix publishing CustomerEvent without customer ID ([03cd5d7](https://github.com/vendure-ecommerce/vendure/commit/03cd5d7))
* **core** Fix stock movements when multiple OrderLines have same ProductVariant ([1b05f38](https://github.com/vendure-ecommerce/vendure/commit/1b05f38)), closes [#1028](https://github.com/vendure-ecommerce/vendure/issues/1028)
* **core** Improve def of Translated<T> to allow customField typings ([3911059](https://github.com/vendure-ecommerce/vendure/commit/3911059)), closes [#1021](https://github.com/vendure-ecommerce/vendure/issues/1021)
* **core** Loosen type def for ErrorResultUnion ([43ce722](https://github.com/vendure-ecommerce/vendure/commit/43ce722))

## <small>1.1.3 (2021-07-29)</small>


#### Fixes

* **admin-ui** Fix case sensitivity in product variant filter ([02f9995](https://github.com/vendure-ecommerce/vendure/commit/02f9995))
* **core** Correct typings for VendureConfig.catalogOptions ([73e859b](https://github.com/vendure-ecommerce/vendure/commit/73e859b))
* **core** Fix update of ProductVariant with relation custom fields ([6e794c0](https://github.com/vendure-ecommerce/vendure/commit/6e794c0)), closes [#997](https://github.com/vendure-ecommerce/vendure/issues/997)
* **core** Fix validation of relation custom fields ([fc3a9c5](https://github.com/vendure-ecommerce/vendure/commit/fc3a9c5)), closes [#1000](https://github.com/vendure-ecommerce/vendure/issues/1000)
* **core** Import localeString custom fields from csv ([d25ea26](https://github.com/vendure-ecommerce/vendure/commit/d25ea26)), closes [#1001](https://github.com/vendure-ecommerce/vendure/issues/1001)

## <small>1.1.2 (2021-07-20)</small>


#### Fixes

* **admin-ui** Fix error when saving Product ([dbf6c00](https://github.com/vendure-ecommerce/vendure/commit/dbf6c00))

## <small>1.1.1 (2021-07-19)</small>


#### Fixes

* **admin-ui** Correctly display currency names in all languages ([bf728d6](https://github.com/vendure-ecommerce/vendure/commit/bf728d6)), closes [#971](https://github.com/vendure-ecommerce/vendure/issues/971)
* **admin-ui** Correctly refund shipping amount when refunding an order ([42ef9bf](https://github.com/vendure-ecommerce/vendure/commit/42ef9bf)), closes [#989](https://github.com/vendure-ecommerce/vendure/issues/989)
* **admin-ui** Fix affix logic of CurrencyInputComponent ([bcb57b0](https://github.com/vendure-ecommerce/vendure/commit/bcb57b0)), closes [#971](https://github.com/vendure-ecommerce/vendure/issues/971)
* **admin-ui** Fix broken image re-ordering drag-drop ([e052b25](https://github.com/vendure-ecommerce/vendure/commit/e052b25)), closes [#982](https://github.com/vendure-ecommerce/vendure/issues/982)
* **admin-ui** Fix Russian & Ukrainian translations ([5061a43](https://github.com/vendure-ecommerce/vendure/commit/5061a43))
* **admin-ui** Fix saving relation custom fields on ProductVariants ([fb38c68](https://github.com/vendure-ecommerce/vendure/commit/fb38c68))
* **core** Correct handling of non-default languages in ListQueryBuilder ([837840e](https://github.com/vendure-ecommerce/vendure/commit/837840e)), closes [#980](https://github.com/vendure-ecommerce/vendure/issues/980)
* **core** Correctly handle nested parent collection query in Shop API ([2445e48](https://github.com/vendure-ecommerce/vendure/commit/2445e48)), closes [#981](https://github.com/vendure-ecommerce/vendure/issues/981)
* **core** Do not crash if asset filesize is over max size limit ([b289cc8](https://github.com/vendure-ecommerce/vendure/commit/b289cc8)), closes [#990](https://github.com/vendure-ecommerce/vendure/issues/990)
* **core** Fix race condition in worker when populating DB schema ([7ae1e94](https://github.com/vendure-ecommerce/vendure/commit/7ae1e94)), closes [#205](https://github.com/vendure-ecommerce/vendure/issues/205) [#462](https://github.com/vendure-ecommerce/vendure/issues/462)
* **core** Handle SqlJobQueueStrategy errors without crashing worker ([5d483f6](https://github.com/vendure-ecommerce/vendure/commit/5d483f6))
* **core** Handling of GlobalSettings edge-case bug ([8d23966](https://github.com/vendure-ecommerce/vendure/commit/8d23966)), closes [#987](https://github.com/vendure-ecommerce/vendure/issues/987)
* **core** Update relation custom fields when updating Asset ([510025a](https://github.com/vendure-ecommerce/vendure/commit/510025a)), closes [#952](https://github.com/vendure-ecommerce/vendure/issues/952)
* **ui-devkit** Fix baseHref setting when using npm ([511c2ed](https://github.com/vendure-ecommerce/vendure/commit/511c2ed)), closes [#916](https://github.com/vendure-ecommerce/vendure/issues/916) [#993](https://github.com/vendure-ecommerce/vendure/issues/993)

## 1.1.0 (2021-07-01)


#### Fixes

* **admin-ui** Correctly export relation selector components ([56ab5bd](https://github.com/vendure-ecommerce/vendure/commit/56ab5bd)), closes [#941](https://github.com/vendure-ecommerce/vendure/issues/941)
* **asset-server-plugin** Update sharp to fix Linux install issues ([e9de674](https://github.com/vendure-ecommerce/vendure/commit/e9de674)), closes [#962](https://github.com/vendure-ecommerce/vendure/issues/962)
* **core** Fix occasional failing variantNameCollectionFilter ([ac76e2c](https://github.com/vendure-ecommerce/vendure/commit/ac76e2c))
* **core** Improve fault tolerance of "apply-collection-filters" job ([be59bf9](https://github.com/vendure-ecommerce/vendure/commit/be59bf9))
* **core** Improve fault-tolerance of JobQueue ([cb5b100](https://github.com/vendure-ecommerce/vendure/commit/cb5b100))
* **core** Make verifyCustomerAccount channel-independent (#945) ([39b3937](https://github.com/vendure-ecommerce/vendure/commit/39b3937)), closes [#945](https://github.com/vendure-ecommerce/vendure/issues/945)

#### Features

* **admin-ui** Add ability to filter promotions by name or coupon code ([5795a84](https://github.com/vendure-ecommerce/vendure/commit/5795a84))
* **admin-ui** Add Ukrainian translation (#889) ([b0b1716](https://github.com/vendure-ecommerce/vendure/commit/b0b1716)), closes [#889](https://github.com/vendure-ecommerce/vendure/issues/889)
* **admin-ui** Enable adding OptionGroups to existing products ([bd5e7c0](https://github.com/vendure-ecommerce/vendure/commit/bd5e7c0)), closes [#711](https://github.com/vendure-ecommerce/vendure/issues/711)
* **admin-ui** Enable selection of content language from list views ([eb9cb4f](https://github.com/vendure-ecommerce/vendure/commit/eb9cb4f)), closes [#883](https://github.com/vendure-ecommerce/vendure/issues/883)
* **admin-ui** Support "text" custom fields with textarea control ([2abd018](https://github.com/vendure-ecommerce/vendure/commit/2abd018)), closes [#885](https://github.com/vendure-ecommerce/vendure/issues/885)
* **admin-ui** Support custom field controls in FulfillmentDetail ([a8a7eac](https://github.com/vendure-ecommerce/vendure/commit/a8a7eac)), closes [#887](https://github.com/vendure-ecommerce/vendure/issues/887)
* **admin-ui** Support custom field controls in OrderTable ([02c2d4e](https://github.com/vendure-ecommerce/vendure/commit/02c2d4e)), closes [#887](https://github.com/vendure-ecommerce/vendure/issues/887)
* **core** Access to orderByCode configurable by strategy ([2554822](https://github.com/vendure-ecommerce/vendure/commit/2554822))
* **core** Add "text" custom field type for storing data over 64k ([00c5c43](https://github.com/vendure-ecommerce/vendure/commit/00c5c43)), closes [#885](https://github.com/vendure-ecommerce/vendure/issues/885)
* **core** Add retries to TransactionalConnection.getEntityOrThrow() ([1e3ba7b](https://github.com/vendure-ecommerce/vendure/commit/1e3ba7b)), closes [#937](https://github.com/vendure-ecommerce/vendure/issues/937)
* **core** Allow middleware to execute before server.listen ([dd89204](https://github.com/vendure-ecommerce/vendure/commit/dd89204))
* **core** Allow Plugin entities to be defined with a function ([d130134](https://github.com/vendure-ecommerce/vendure/commit/d130134)), closes [#906](https://github.com/vendure-ecommerce/vendure/issues/906)
* **core** Check availability of variants when adding to Order ([ea2b6b0](https://github.com/vendure-ecommerce/vendure/commit/ea2b6b0)), closes [#723](https://github.com/vendure-ecommerce/vendure/issues/723)
* **core** Emit CustomerEvent on creation via Shop API ([680b8c2](https://github.com/vendure-ecommerce/vendure/commit/680b8c2)), closes [#949](https://github.com/vendure-ecommerce/vendure/issues/949)
* **core** Enable importing of custom field list data ([5d85c07](https://github.com/vendure-ecommerce/vendure/commit/5d85c07)), closes [#577](https://github.com/vendure-ecommerce/vendure/issues/577)
* **core** Export all helper classes from service layer ([d529db0](https://github.com/vendure-ecommerce/vendure/commit/d529db0))
* **core** Export PasswordCipher helper ([221051f](https://github.com/vendure-ecommerce/vendure/commit/221051f))
* **core** Improve typing of TransactionConnection.getEntityOrThrow ([eec8808](https://github.com/vendure-ecommerce/vendure/commit/eec8808))
* **core** Publish StockMovementEvent ([0a71723](https://github.com/vendure-ecommerce/vendure/commit/0a71723)), closes [#902](https://github.com/vendure-ecommerce/vendure/issues/902)
* **core** Add `collections` field to SearchResponse, closes [#943](https://github.com/vendure-ecommerce/vendure/issues/943)
* **elasticsearch-plugin** Add `collections` field to SearchResponse, closes [#943](https://github.com/vendure-ecommerce/vendure/issues/943)
* **email-plugin** Add `.setOptionalAddressFields()` - cc, bcc, replyTo ([8e9b72f](https://github.com/vendure-ecommerce/vendure/commit/8e9b72f)), closes [#921](https://github.com/vendure-ecommerce/vendure/issues/921)
* **email-plugin** Extend attachment support ([70a55fd](https://github.com/vendure-ecommerce/vendure/commit/70a55fd)), closes [#882](https://github.com/vendure-ecommerce/vendure/issues/882)

## <small>1.0.3 (2021-06-18)</small>


#### Fixes

* **admin-ui** Handle all ErrorResults when creating a Fulfillment ([75952dd](https://github.com/vendure-ecommerce/vendure/commit/75952dd)), closes [#929](https://github.com/vendure-ecommerce/vendure/issues/929)
* **core** Correct handling of nested variantNameCollectionFilters ([14b40bb](https://github.com/vendure-ecommerce/vendure/commit/14b40bb)), closes [#927](https://github.com/vendure-ecommerce/vendure/issues/927)
* **core** Do not return private collections in Shop API ([33f40f2](https://github.com/vendure-ecommerce/vendure/commit/33f40f2)), closes [#928](https://github.com/vendure-ecommerce/vendure/issues/928)
* **core** Fix Admin/Customer user conflict with external auth ([69f46a3](https://github.com/vendure-ecommerce/vendure/commit/69f46a3)), closes [#926](https://github.com/vendure-ecommerce/vendure/issues/926)
* **core** Remove "Placeholder" from Permission enum ([eabfe77](https://github.com/vendure-ecommerce/vendure/commit/eabfe77))

## <small>1.0.2 (2021-06-10)</small>


#### Fixes

* **admin-ui** Allow Channel tokens to be updated from ChannelDetail ([cafa04e](https://github.com/vendure-ecommerce/vendure/commit/cafa04e))
* **core** Do not error when removing deleted variant from channel ([e3e8828](https://github.com/vendure-ecommerce/vendure/commit/e3e8828))
* **core** Fix worker error when using custom Logger ([cbe764a](https://github.com/vendure-ecommerce/vendure/commit/cbe764a)), closes [#912](https://github.com/vendure-ecommerce/vendure/issues/912)
* **core** Update search index when removing translated variants ([fced1dc](https://github.com/vendure-ecommerce/vendure/commit/fced1dc)), closes [#896](https://github.com/vendure-ecommerce/vendure/issues/896)
* **create** Remove tslib resolution from package.json ([863ffcb](https://github.com/vendure-ecommerce/vendure/commit/863ffcb)), closes [#925](https://github.com/vendure-ecommerce/vendure/issues/925)

#### Perf

* **core** Improve performance of apply-collection-filters job (#915) ([1e8c137](https://github.com/vendure-ecommerce/vendure/commit/1e8c137)), closes [#915](https://github.com/vendure-ecommerce/vendure/issues/915)

## <small>1.0.1 (2021-05-27)</small>


#### Fixes

* **admin-ui** Account for refunds when calculating outstanding payment ([fce00c4](https://github.com/vendure-ecommerce/vendure/commit/fce00c4))
* **admin-ui** Fixed unsupported plural for Simple Chinese translation (#888) ([d43602f](https://github.com/vendure-ecommerce/vendure/commit/d43602f)), closes [#888](https://github.com/vendure-ecommerce/vendure/issues/888)
* **core** Correctly calculate refund amount when modifying order ([56d058d](https://github.com/vendure-ecommerce/vendure/commit/56d058d)), closes [#890](https://github.com/vendure-ecommerce/vendure/issues/890)
* **core** Prevent FK error when migrating with better-sqlite3 driver ([8bfa03d](https://github.com/vendure-ecommerce/vendure/commit/8bfa03d)), closes [#880](https://github.com/vendure-ecommerce/vendure/issues/880)
* **core** Publish PaymentStateTransitionEvent when settlePayment fails ([c01106c](https://github.com/vendure-ecommerce/vendure/commit/c01106c)), closes [#886](https://github.com/vendure-ecommerce/vendure/issues/886)
* **core** Update NestJS & graphql-related deps to fix version conflict. This fix enables compatibility with npm v7.x ([8891c43](https://github.com/vendure-ecommerce/vendure/commit/8891c43)), closes [#532](https://github.com/vendure-ecommerce/vendure/issues/532) [blob/9267a79b974e397e87ad9ee408b65c46751e4565/CHANGELOG.md#v2230](https://github.com/blob/9267a79b974e397e87ad9ee408b65c46751e4565/CHANGELOG.md/issues/v2230)
* **create** Remove redundant synchronize warning ([73841e4](https://github.com/vendure-ecommerce/vendure/commit/73841e4))

## 1.0.0 (2021-05-19)

Vendure v1.0 is here! 🎉

**Note** with this release, all deprecated APIs have been removed. If you were still using any, you'll have a very small amount of work to do in switching over to their replacements. Removed deprecated APIs:

* TypeScript: `EventBus.sucscribe()`, use `EventBus.ofType()` instead.
* TypeScript: `getEntityOrThrow()` helper. Use `TransactionalConnection.getEntityOrThrow()` instead.
* TypeScript: `Injector.getConnection()`. Use `Injector.get(TransactionalConnection)` instead.  
* TypeScript: `PriceCalculationStrategy`. Use `OrderItemPriceCalculationStrategy` instead.
* TypeScript: `TaxCalculationStrategy`. Use `ProductVariantPriceCalculationStrategy` instead.
* TypeScript: `VendureConfig.authOptions.sessionSecret`. Use `VendureConfig.authOptions.cookieOptions.secret` instead.
* TypeScript - AssetServerPlugin: The `region` option of the S3AssetStorageStrategy should be moved into the `nativeS3Configuration` object.
* GraphQL: `SearchResult` type - `productPreview` & `productVariantPreview` fields. Use `productAsset.preview`, `productVariantAsset.preview` instead. 
* GraphQL: `Order.adjustments`. Use `Order.discounts` instead.
* GraphQL: `OrderItem.unitPriceIncludesTax`. This is removed as redundant - `unitPrice` is always without tax.
* GraphQL: `OrderLine.totalPrice`. Use `OrderLine.linePriceWithTax` instead.
* GraphQL: `OrderLine.adjustments`. Use `OrderLine.discounts` instead.
* GraphQL: `Product.priceIncludesTax`. This is removed as redundant - `price` is always without tax.



#### Fixes

* **admin-ui** Improve FR translations (#884) ([ad5bc2b](https://github.com/vendure-ecommerce/vendure/commit/ad5bc2b)), closes [#884](https://github.com/vendure-ecommerce/vendure/issues/884)
* **admin-ui** Display refund metadata (#875) ([7bc7372](https://github.com/vendure-ecommerce/vendure/commit/7bc7372)), closes [#875](https://github.com/vendure-ecommerce/vendure/issues/875)
* **admin-ui** Enable retrying of failed refunds ([4fc749d](https://github.com/vendure-ecommerce/vendure/commit/4fc749d)), closes [#873](https://github.com/vendure-ecommerce/vendure/issues/873)
* **admin-ui** Fix configurable arg forms becoming unresponsive ([6039f0c](https://github.com/vendure-ecommerce/vendure/commit/6039f0c))
* **admin-ui** Update Chinese translations (#878) ([084dc31](https://github.com/vendure-ecommerce/vendure/commit/084dc31)), closes [#878](https://github.com/vendure-ecommerce/vendure/issues/878)
* **core** Correct order totals in order modification preview ([1795f48](https://github.com/vendure-ecommerce/vendure/commit/1795f48)), closes [#872](https://github.com/vendure-ecommerce/vendure/issues/872)
* **core** Fix bug in applying OrderItem promotions with postgres ([aaa8393](https://github.com/vendure-ecommerce/vendure/commit/aaa8393))
* **core** Fix multiple refunds on the same OrderLine ([7316d31](https://github.com/vendure-ecommerce/vendure/commit/7316d31)), closes [#868](https://github.com/vendure-ecommerce/vendure/issues/868)
* **core** Fix refunds after failures & with multiple payments ([ed30874](https://github.com/vendure-ecommerce/vendure/commit/ed30874)), closes [#873](https://github.com/vendure-ecommerce/vendure/issues/873)
* **core** Handle array circular refs when serializing RequestContext ([4abb912](https://github.com/vendure-ecommerce/vendure/commit/4abb912)), closes [#864](https://github.com/vendure-ecommerce/vendure/issues/864)
* **core** Include tax setting when populating default shipping methods ([26ce6ff](https://github.com/vendure-ecommerce/vendure/commit/26ce6ff))

## 1.0.0-rc.0 (2021-05-05)


#### Fixes

* **core** Fix transition to PaymentSettled with multiple payments ([c60fad7](https://github.com/vendure-ecommerce/vendure/commit/c60fad7)), closes [#847](https://github.com/vendure-ecommerce/vendure/issues/847)
* **core** Handle different input types in validateRequiredFields() (#861) ([2ca6bfd](https://github.com/vendure-ecommerce/vendure/commit/2ca6bfd)), closes [#861](https://github.com/vendure-ecommerce/vendure/issues/861) [#855](https://github.com/vendure-ecommerce/vendure/issues/855)

## 1.0.0-beta.11 (2021-04-28)


#### Fixes

* **core** Allow plugins to define global Nestjs providers ([97edcb9](https://github.com/vendure-ecommerce/vendure/commit/97edcb9)), closes [#837](https://github.com/vendure-ecommerce/vendure/issues/837)
* **core** Display informative message when saving a translatable fails ([ce6293d](https://github.com/vendure-ecommerce/vendure/commit/ce6293d))
* **core** Fix error on concurrent calls to new channel ([fad9006](https://github.com/vendure-ecommerce/vendure/commit/fad9006)), closes [#834](https://github.com/vendure-ecommerce/vendure/issues/834)
* **core** Fix missing customField input for Assets ([772bd8d](https://github.com/vendure-ecommerce/vendure/commit/772bd8d)), closes [#844](https://github.com/vendure-ecommerce/vendure/issues/844)

#### Features

* **admin-ui** Support new permissions ([57566b0](https://github.com/vendure-ecommerce/vendure/commit/57566b0)), closes [#617](https://github.com/vendure-ecommerce/vendure/issues/617)
* **core** Allow default Roles to be defined in InitialData ([d866325](https://github.com/vendure-ecommerce/vendure/commit/d866325))
* **core** Improved translations ([a8ca019](https://github.com/vendure-ecommerce/vendure/commit/a8ca019)), closes [#839](https://github.com/vendure-ecommerce/vendure/issues/839)
* **core** More granular (entity-based) permissions ([4ed2ed5](https://github.com/vendure-ecommerce/vendure/commit/4ed2ed5)), closes [#617](https://github.com/vendure-ecommerce/vendure/issues/617)

#### Perf

* **elasticsearch-plugin** Improve indexing memory usage [#833](https://github.com/vendure-ecommerce/vendure/pull/833)

## 1.0.0-beta.10 (2021-04-22)


#### Fixes

* **admin-ui** Fix error when updating roles ([432c89c](https://github.com/vendure-ecommerce/vendure/commit/432c89c)), closes [#828](https://github.com/vendure-ecommerce/vendure/issues/828)
* **admin-ui** Make dropdowns scrollable ([e887a2b](https://github.com/vendure-ecommerce/vendure/commit/e887a2b)), closes [#824](https://github.com/vendure-ecommerce/vendure/issues/824)
* **core** Backoff strategy does not block next jobs ([709cdff](https://github.com/vendure-ecommerce/vendure/commit/709cdff)), closes [#832](https://github.com/vendure-ecommerce/vendure/issues/832)
* **core** Fix crash on updating Facet code ([755ebc4](https://github.com/vendure-ecommerce/vendure/commit/755ebc4)), closes [#831](https://github.com/vendure-ecommerce/vendure/issues/831)
* **core** Fix error when assigning deleted ProductVariant to channel ([b5d0e43](https://github.com/vendure-ecommerce/vendure/commit/b5d0e43))
* **elasticsearch-plugin** Fix bad import ([9c76767](https://github.com/vendure-ecommerce/vendure/commit/9c76767))

#### Features

* **admin-ui** Add Russian translations (#829) ([650f38e](https://github.com/vendure-ecommerce/vendure/commit/650f38e)), closes [#829](https://github.com/vendure-ecommerce/vendure/issues/829)
* **core** Added i18n messages for DE (#830) ([d62628b](https://github.com/vendure-ecommerce/vendure/commit/d62628b)), closes [#830](https://github.com/vendure-ecommerce/vendure/issues/830)
* **core** JobQueueStrategy pollInterval accepts function ([c2701b9](https://github.com/vendure-ecommerce/vendure/commit/c2701b9))

### 1.0.0-beta.9 (2021-04-13)


#### Fixes

* **admin-ui** Display guest orders in OrderList ([c1dcb19](https://github.com/vendure-ecommerce/vendure/commit/c1dcb19))
* **admin-ui-plugin** Bump version to make fix available

## 1.0.0-beta.8 (2021-04-13)


#### Fixes

* **admin-ui** Better display Fulfillment customFields in Order detail ([0e9f528](https://github.com/vendure-ecommerce/vendure/commit/0e9f528)), closes [#816](https://github.com/vendure-ecommerce/vendure/issues/816)
* **core** Handle relation customFields when creating Fulfillments ([9559e34](https://github.com/vendure-ecommerce/vendure/commit/9559e34)), closes [#816](https://github.com/vendure-ecommerce/vendure/issues/816)
* **core** Join eager relations on OrderService.findOne method ([5e181ea](https://github.com/vendure-ecommerce/vendure/commit/5e181ea))
* **core** Return all assets when querying product by slug ([acb3fb0](https://github.com/vendure-ecommerce/vendure/commit/acb3fb0)), closes [#820](https://github.com/vendure-ecommerce/vendure/issues/820)
* **email-plugin** Added filename filter for json files (#821) ([317a63c](https://github.com/vendure-ecommerce/vendure/commit/317a63c)), closes [#821](https://github.com/vendure-ecommerce/vendure/issues/821)
* **email-plugin** make @types/nodemailer a dependency to resolve #817 ([1c2b353](https://github.com/vendure-ecommerce/vendure/commit/1c2b353)), closes [#817](https://github.com/vendure-ecommerce/vendure/issues/817) [#817](https://github.com/vendure-ecommerce/vendure/issues/817)

#### Features

* **admin-ui** Display payment errors in OrderDetail view ([cf31cbf](https://github.com/vendure-ecommerce/vendure/commit/cf31cbf))
* **admin-ui** Filter Customer list by customer last name ([6df325b](https://github.com/vendure-ecommerce/vendure/commit/6df325b)), closes [#572](https://github.com/vendure-ecommerce/vendure/issues/572)
* **admin-ui** Filter Order list by customer last name ([690dfa7](https://github.com/vendure-ecommerce/vendure/commit/690dfa7)), closes [#572](https://github.com/vendure-ecommerce/vendure/issues/572)
* **admin-ui** Improve display of OrderLine customFields ([fde3ffc](https://github.com/vendure-ecommerce/vendure/commit/fde3ffc))
* **admin-ui** UI for deletion of PaymentMethods ([fa67076](https://github.com/vendure-ecommerce/vendure/commit/fa67076))
* **core** Add server translations via plugin application bootstrap ([13a4b68](https://github.com/vendure-ecommerce/vendure/commit/13a4b68)), closes [#810](https://github.com/vendure-ecommerce/vendure/issues/810)
* **core** Allow ListQuery sort/filter inputs to be manually extended ([834ea2d](https://github.com/vendure-ecommerce/vendure/commit/834ea2d)), closes [#572](https://github.com/vendure-ecommerce/vendure/issues/572)
* **core** Allow setting PaymentState on failure to settle Payment ([0241ade](https://github.com/vendure-ecommerce/vendure/commit/0241ade)), closes [#809](https://github.com/vendure-ecommerce/vendure/issues/809)
* **core** Configurable backoff strategy for DefaultJobQueuePlugin ([be0a27d](https://github.com/vendure-ecommerce/vendure/commit/be0a27d)), closes [#813](https://github.com/vendure-ecommerce/vendure/issues/813)
* **core** Implement deletion of PaymentMethods ([f97cd4f](https://github.com/vendure-ecommerce/vendure/commit/f97cd4f))
* **core** Implement sort/filter OrderList by customerLastName ([c29e6f2](https://github.com/vendure-ecommerce/vendure/commit/c29e6f2)), closes [#572](https://github.com/vendure-ecommerce/vendure/issues/572)
* **elasticsearch-plugin** Add facetFilters input for search query ([23cc655](https://github.com/vendure-ecommerce/vendure/commit/23cc655)), closes [#726](https://github.com/vendure-ecommerce/vendure/issues/726)

#### Perf

* **core** Reduce memory usage of apply-collection-filters job ([76361d5](https://github.com/vendure-ecommerce/vendure/commit/76361d5))

## 1.0.0-beta.7 (2021-04-05)


#### Features

* **admin-ui** AssetPickerDialog can take initial tags ([03c6706](https://github.com/vendure-ecommerce/vendure/commit/03c6706))
* **asset-server-plugin** Support Apple M1 (update Sharp to 0.28) ([1335080](https://github.com/vendure-ecommerce/vendure/commit/1335080)), closes [#803](https://github.com/vendure-ecommerce/vendure/issues/803)
* **core** Add ability to get variants for a specific product in productVariants query ([1da0592](https://github.com/vendure-ecommerce/vendure/commit/1da0592)), closes [#786](https://github.com/vendure-ecommerce/vendure/issues/786)
* **core** Add name and description fields to eligiblePaymentMethods query ([fd28208](https://github.com/vendure-ecommerce/vendure/commit/fd28208)), closes [#738](https://github.com/vendure-ecommerce/vendure/issues/738)

#### Fixes

* **admin-ui** Fix asset search component ([d65277e](https://github.com/vendure-ecommerce/vendure/commit/d65277e))
* **admin-ui** Fix errors caused by lists greater than 1000 items ([5844715](https://github.com/vendure-ecommerce/vendure/commit/5844715)), closes [#807](https://github.com/vendure-ecommerce/vendure/issues/807)
* **admin-ui** Fix facet display in product search bar ([a05044d](https://github.com/vendure-ecommerce/vendure/commit/a05044d))
* **core** Fix product query by slug ([2ace0eb](https://github.com/vendure-ecommerce/vendure/commit/2ace0eb)), closes [#800](https://github.com/vendure-ecommerce/vendure/issues/800)

## 1.0.0-beta.6 (2021-04-01)


#### Fixes

* **core** Correct ordering of Collection breadcrumbs ([92952fb](https://github.com/vendure-ecommerce/vendure/commit/92952fb))
* **core** Correctly defer incomplete jobs on shutdown ([d3fa83a](https://github.com/vendure-ecommerce/vendure/commit/d3fa83a))
* **core** Correctly handle multiple external auth methods ([b397ba2](https://github.com/vendure-ecommerce/vendure/commit/b397ba2)), closes [#695](https://github.com/vendure-ecommerce/vendure/issues/695)
* **core** Fix edge case in auth guard resolver detection ([b190300](https://github.com/vendure-ecommerce/vendure/commit/b190300))
* **core** Fix memory leak in default JobQueueStrategies ([e9e3c18](https://github.com/vendure-ecommerce/vendure/commit/e9e3c18))
* **core** Fix some issues with sorting/filtering calculated properties ([2d89554](https://github.com/vendure-ecommerce/vendure/commit/2d89554))
* **core** Fix sorting of Order calculated properties in Postgres ([e9b18fe](https://github.com/vendure-ecommerce/vendure/commit/e9b18fe))
* **core** Fix TypeScript TS2502 error in Translation<T> type ([a4243c4](https://github.com/vendure-ecommerce/vendure/commit/a4243c4)), closes [#787](https://github.com/vendure-ecommerce/vendure/issues/787)
* **core** Prevent customer data leak via Shop API ([8ea544b](https://github.com/vendure-ecommerce/vendure/commit/8ea544b)), closes [#730](https://github.com/vendure-ecommerce/vendure/issues/730)
* **core** Resolver permission changes work with REST routes ([b61b47d](https://github.com/vendure-ecommerce/vendure/commit/b61b47d))

#### Features

* **core** AssetService can create assets from Readable streams ([9d80145](https://github.com/vendure-ecommerce/vendure/commit/9d80145))
* **core** Enable the use of Permissions of GraphQL field resolvers ([5c837b8](https://github.com/vendure-ecommerce/vendure/commit/5c837b8)), closes [#730](https://github.com/vendure-ecommerce/vendure/issues/730)
* **core** Implement size limits for paginated list results ([92be4e0](https://github.com/vendure-ecommerce/vendure/commit/92be4e0)), closes [#751](https://github.com/vendure-ecommerce/vendure/issues/751)

## 1.0.0-beta.5 (2021-03-24)


#### Fixes

* **admin-ui** Fix buggy price input in ProductVariant list & table ([f2b53ca](https://github.com/vendure-ecommerce/vendure/commit/f2b53ca)), closes [#770](https://github.com/vendure-ecommerce/vendure/issues/770)
* **admin-ui** Fix display of string results in JobQueue list ([10899f3](https://github.com/vendure-ecommerce/vendure/commit/10899f3))
* **admin-ui** Make assetPreview pipe handle null inputs ([2c19759](https://github.com/vendure-ecommerce/vendure/commit/2c19759))
* **core** Correctly compare falsy customField values in OrderLines ([265781c](https://github.com/vendure-ecommerce/vendure/commit/265781c))
* **core** Fix gql error when OrderLine has only private customFields ([4440fea](https://github.com/vendure-ecommerce/vendure/commit/4440fea))
* **core** Fix race condition in updating JobRecords ([b446c8f](https://github.com/vendure-ecommerce/vendure/commit/b446c8f))
* **core** Improve reliability of Job cancellation ([410b4c2](https://github.com/vendure-ecommerce/vendure/commit/410b4c2))
* **core** Make addPaymentToOrder channel aware ([6338212](https://github.com/vendure-ecommerce/vendure/commit/6338212)), closes [#773](https://github.com/vendure-ecommerce/vendure/issues/773)
* **core** Save relation custom fields in addItemToOrder mutation ([10d43e8](https://github.com/vendure-ecommerce/vendure/commit/10d43e8)), closes [#760](https://github.com/vendure-ecommerce/vendure/issues/760)
* **email-plugin** Fix broken images in order-confirmation mock emails ([82eefde](https://github.com/vendure-ecommerce/vendure/commit/82eefde))

#### Features

* **admin-ui** Display Order discounts with & without tax ([ea5a9f2](https://github.com/vendure-ecommerce/vendure/commit/ea5a9f2)), closes [#749](https://github.com/vendure-ecommerce/vendure/issues/749)
* **admin-ui** Improve German translations ([3497e81](https://github.com/vendure-ecommerce/vendure/commit/3497e81))
* **core** Add `code` field to ShippingMethodQuote ([847b4e2](https://github.com/vendure-ecommerce/vendure/commit/847b4e2)), closes [#780](https://github.com/vendure-ecommerce/vendure/issues/780)
* **core** Add CustomerEvent and CustomerAddressEvent ([480de31](https://github.com/vendure-ecommerce/vendure/commit/480de31))
* **core** Enable population of relational custom fields from CSV ([38611fb](https://github.com/vendure-ecommerce/vendure/commit/38611fb))
* **core** Include with/without tax amounts on discounts ([2de6bf5](https://github.com/vendure-ecommerce/vendure/commit/2de6bf5)), closes [#749](https://github.com/vendure-ecommerce/vendure/issues/749)
* **core** Make DefaultJobQueuePlugin configurable ([6373d9f](https://github.com/vendure-ecommerce/vendure/commit/6373d9f))
* **core** Make JobQueue jobs subscribable ([baba268](https://github.com/vendure-ecommerce/vendure/commit/baba268)), closes [#775](https://github.com/vendure-ecommerce/vendure/issues/775)
* **core** Reinstate ProcessContext provider ([9e30505](https://github.com/vendure-ecommerce/vendure/commit/9e30505)), closes [#772](https://github.com/vendure-ecommerce/vendure/issues/772)
* **email-plugin** Fix broken mock events ([9ae47f1](https://github.com/vendure-ecommerce/vendure/commit/9ae47f1)), closes [#771](https://github.com/vendure-ecommerce/vendure/issues/771)


### BREAKING CHANGE

* A minor breaking change has been made to the GraphQL API: The `Order.discounts` and
`OrderLine.discounts` fields now return `amount` and `amountWithTax`. Previously they only had
`amount`, which was actually the tax-inclusive value. So if you want to show discount amounts with
tax, use `amountWithTax` and otherwise use `amount`.
## 1.0.0-beta.4 (2021-03-18)


#### Fixes

* **asset-server-plugin** Make S3 credentials optional ([56bcbff](https://github.com/vendure-ecommerce/vendure/commit/56bcbff)), closes [#733](https://github.com/vendure-ecommerce/vendure/issues/733)
* **core** Correctly handle refunds on Orders with multiple Payments ([f4ed0e7](https://github.com/vendure-ecommerce/vendure/commit/f4ed0e7))
* **core** Filter Promotions on Channel before applying to Order ([0cb29e5](https://github.com/vendure-ecommerce/vendure/commit/0cb29e5))
* **core** Hide private OrderLine customFields in addItemToOrder ([c2c7f1d](https://github.com/vendure-ecommerce/vendure/commit/c2c7f1d))
* **core** Payment amount accounts for existing Payments on Order ([e92d2ce](https://github.com/vendure-ecommerce/vendure/commit/e92d2ce))
* **core** Really correctly handle multiple payment refunds ([ba8d411](https://github.com/vendure-ecommerce/vendure/commit/ba8d411))
* **core** Resolve all LocaleString fields in GraphQL API ([3ddadc0](https://github.com/vendure-ecommerce/vendure/commit/3ddadc0)), closes [#763](https://github.com/vendure-ecommerce/vendure/issues/763)
* **core** Resolve all ProductVariant price fields in GraphQL API ([2bd289a](https://github.com/vendure-ecommerce/vendure/commit/2bd289a)), closes [#763](https://github.com/vendure-ecommerce/vendure/issues/763)
* **ui-devkit** Fix Angular compiler compatibility issue ([05b2b12](https://github.com/vendure-ecommerce/vendure/commit/05b2b12)), closes [#758](https://github.com/vendure-ecommerce/vendure/issues/758)

#### Features

* **asset-server-plugin** Allow assetUrlPrefix to be a function ([10eb014](https://github.com/vendure-ecommerce/vendure/commit/10eb014)), closes [#766](https://github.com/vendure-ecommerce/vendure/issues/766)
* **core** Add Promotion Channel mutations to Admin API ([ff051ae](https://github.com/vendure-ecommerce/vendure/commit/ff051ae))
* **core** add promotion state and promotion action-condition dependency ([dd66138](https://github.com/vendure-ecommerce/vendure/commit/dd66138))
* **core** Allow to pass validationRules to shop and admin GraphQL API ([02a37ec](https://github.com/vendure-ecommerce/vendure/commit/02a37ec))

## 1.0.0-beta.3 (2021-03-11)


#### Fixes

* **admin-ui-plugin** Fix proxy port when in dev mode ([28b096c](https://github.com/vendure-ecommerce/vendure/commit/28b096c))
* **core** Fix featuredAsset error when adding item to Order ([e635f25](https://github.com/vendure-ecommerce/vendure/commit/e635f25)), closes [#756](https://github.com/vendure-ecommerce/vendure/issues/756)
* **core** Fix foreign key error on merging orders ([5e385df](https://github.com/vendure-ecommerce/vendure/commit/5e385df)), closes [#754](https://github.com/vendure-ecommerce/vendure/issues/754)
* **core** Fix indexing of long descriptions in postgres ([9efd7db](https://github.com/vendure-ecommerce/vendure/commit/9efd7db)), closes [#745](https://github.com/vendure-ecommerce/vendure/issues/745)
* **core** Prevent max integer error in job duration ([305727e](https://github.com/vendure-ecommerce/vendure/commit/305727e)), closes [#755](https://github.com/vendure-ecommerce/vendure/issues/755)

## 1.0.0-beta.2 (2021-03-09)


#### Fixes

* **core** Fix error in SqlJobQueueStrategy when using SQLite ([c775822](https://github.com/vendure-ecommerce/vendure/commit/c775822))

## 1.0.0-beta.1 (2021-03-09)


#### Fixes

* **admin-ui** Improved control over Order payments ([475b72a](https://github.com/vendure-ecommerce/vendure/commit/475b72a)), closes [#688](https://github.com/vendure-ecommerce/vendure/issues/688) [#507](https://github.com/vendure-ecommerce/vendure/issues/507)
* **admin-ui** Make order modification note not required ([432a51a](https://github.com/vendure-ecommerce/vendure/commit/432a51a)), closes [#688](https://github.com/vendure-ecommerce/vendure/issues/688)
* **core** Allow loading of Order with deleted ShippingMethod ([7ba27f2](https://github.com/vendure-ecommerce/vendure/commit/7ba27f2)), closes [#716](https://github.com/vendure-ecommerce/vendure/issues/716)
* **core** Allow unsetting PaymentMethod checkers ([48c0e96](https://github.com/vendure-ecommerce/vendure/commit/48c0e96)), closes [#469](https://github.com/vendure-ecommerce/vendure/issues/469)
* **core** Apply Promotions when calculating modified order total ([c678a21](https://github.com/vendure-ecommerce/vendure/commit/c678a21)), closes [#688](https://github.com/vendure-ecommerce/vendure/issues/688)
* **core** Correctly handle negative "skip"/"take" in list query options ([04a4c39](https://github.com/vendure-ecommerce/vendure/commit/04a4c39))
* **core** Do not return assets not in current channel ([5de1141](https://github.com/vendure-ecommerce/vendure/commit/5de1141)), closes [#717](https://github.com/vendure-ecommerce/vendure/issues/717)
* **core** Fix "float" customField types ([b4dc912](https://github.com/vendure-ecommerce/vendure/commit/b4dc912))
* **core** Fix Asset uploads on Node v13+ ([049c75c](https://github.com/vendure-ecommerce/vendure/commit/049c75c)), closes [#396](https://github.com/vendure-ecommerce/vendure/issues/396)
* **core** Fix broken Collection population ([29ff1f9](https://github.com/vendure-ecommerce/vendure/commit/29ff1f9))
* **core** Fix OrderMergeStrategy implementation ([3193080](https://github.com/vendure-ecommerce/vendure/commit/3193080)), closes [#669](https://github.com/vendure-ecommerce/vendure/issues/669)
* **core** Fix transaction errors in job queue for better-sqlite3 ([0043ace](https://github.com/vendure-ecommerce/vendure/commit/0043ace))
* **core** Improve error message for missing price data ([634e14b](https://github.com/vendure-ecommerce/vendure/commit/634e14b))
* **core** Include shipping tax in Order.taxSummary ([cf5aa31](https://github.com/vendure-ecommerce/vendure/commit/cf5aa31)), closes [#729](https://github.com/vendure-ecommerce/vendure/issues/729)
* **core** Invoke SessionCacheStrategy lifecycle hooks ([c3c5888](https://github.com/vendure-ecommerce/vendure/commit/c3c5888))
* **core** Make CustomFulfillmentProcess injectable ([8bce2b4](https://github.com/vendure-ecommerce/vendure/commit/8bce2b4))
* **core** Make CustomPaymentProcess injectable ([a0a9352](https://github.com/vendure-ecommerce/vendure/commit/a0a9352))
* **core** Make SqlJobQueueStrategy concurrency-safe ([5e5e55a](https://github.com/vendure-ecommerce/vendure/commit/5e5e55a))
* **core** Prevent plugin providers multiple instantiation ([98e463e](https://github.com/vendure-ecommerce/vendure/commit/98e463e))
* **core** Relax some restrictions on adding new payments to Order ([26c1b7a](https://github.com/vendure-ecommerce/vendure/commit/26c1b7a)), closes [#688](https://github.com/vendure-ecommerce/vendure/issues/688)
* **core** RememberMe args not passed correctly for NativeAuthenticationStrategy ([532ea21](https://github.com/vendure-ecommerce/vendure/commit/532ea21))
* **core** Remove inapplicable order-level discounts ([2396cc3](https://github.com/vendure-ecommerce/vendure/commit/2396cc3)), closes [#710](https://github.com/vendure-ecommerce/vendure/issues/710)
* **create** Fix broken bootstrap when populating data ([5dcf6e5](https://github.com/vendure-ecommerce/vendure/commit/5dcf6e5))
* **elasticsearch-plugin** Delete product/variant indexes for all channels ([80fabb0](https://github.com/vendure-ecommerce/vendure/commit/80fabb0))
* **email-plugin** Correctly initialize email processor ([819e480](https://github.com/vendure-ecommerce/vendure/commit/819e480))

#### Features

* **admin-ui** Add support for "relation" custom field type ([63e97c7](https://github.com/vendure-ecommerce/vendure/commit/63e97c7)), closes [#308](https://github.com/vendure-ecommerce/vendure/issues/308) [#464](https://github.com/vendure-ecommerce/vendure/issues/464)
* **admin-ui** Filter Asset list by tags ([c244c0a](https://github.com/vendure-ecommerce/vendure/commit/c244c0a)), closes [#316](https://github.com/vendure-ecommerce/vendure/issues/316)
* **admin-ui** Implement creation of new PaymentMethods ([09a1a97](https://github.com/vendure-ecommerce/vendure/commit/09a1a97)), closes [#671](https://github.com/vendure-ecommerce/vendure/issues/671)
* **admin-ui** Implement default TaxCategory support ([90ed7c4](https://github.com/vendure-ecommerce/vendure/commit/90ed7c4)), closes [#566](https://github.com/vendure-ecommerce/vendure/issues/566)
* **admin-ui** Implement PaymentMethod checker/handler UI ([15fc707](https://github.com/vendure-ecommerce/vendure/commit/15fc707)), closes [#469](https://github.com/vendure-ecommerce/vendure/issues/469)
* **admin-ui** Manage tags interface ([205391d](https://github.com/vendure-ecommerce/vendure/commit/205391d)), closes [#316](https://github.com/vendure-ecommerce/vendure/issues/316)
* **admin-ui** Open Asset selection when clicking placeholder ([c39fa55](https://github.com/vendure-ecommerce/vendure/commit/c39fa55))
* **admin-ui** PaymentMethod & promotions list update on channel change ([c02518c](https://github.com/vendure-ecommerce/vendure/commit/c02518c)), closes [#587](https://github.com/vendure-ecommerce/vendure/issues/587)
* **admin-ui** Support channel-aware Facets & FacetValues ([4ccc65e](https://github.com/vendure-ecommerce/vendure/commit/4ccc65e)), closes [#612](https://github.com/vendure-ecommerce/vendure/issues/612)
* **admin-ui** Support custom fields on Administrator & Channel ([ecd1b17](https://github.com/vendure-ecommerce/vendure/commit/ecd1b17)), closes [#598](https://github.com/vendure-ecommerce/vendure/issues/598)
* **admin-ui** Support for editing Asset custom fields ([f109436](https://github.com/vendure-ecommerce/vendure/commit/f109436)), closes [#684](https://github.com/vendure-ecommerce/vendure/issues/684)
* **admin-ui** Tags can be assigned to Assets in detail view ([995d1b4](https://github.com/vendure-ecommerce/vendure/commit/995d1b4)), closes [#316](https://github.com/vendure-ecommerce/vendure/issues/316)
* **asset-server-plugin** Add S3 upload options in configuration ([fa4d1c0](https://github.com/vendure-ecommerce/vendure/commit/fa4d1c0))
* **core** Add eligiblePaymentMethods query to Shop API ([e528c09](https://github.com/vendure-ecommerce/vendure/commit/e528c09)), closes [#469](https://github.com/vendure-ecommerce/vendure/issues/469)
* **core** Add order line limit to Vendure configuration ([6755329](https://github.com/vendure-ecommerce/vendure/commit/6755329))
* **core** Add support for Asset tags ([71cf3b9](https://github.com/vendure-ecommerce/vendure/commit/71cf3b9)), closes [#316](https://github.com/vendure-ecommerce/vendure/issues/316)
* **core** Add support for relation custom fields on Channel entity ([7b96b9f](https://github.com/vendure-ecommerce/vendure/commit/7b96b9f)), closes [#598](https://github.com/vendure-ecommerce/vendure/issues/598)
* **core** Allow custom field validate fn to be async & injectable ([5e04a14](https://github.com/vendure-ecommerce/vendure/commit/5e04a14))
* **core** Allow NestJS middleware to be passed in apiOptions ([44d0b45](https://github.com/vendure-ecommerce/vendure/commit/44d0b45))
* **core** Base custom payment process ([83af699](https://github.com/vendure-ecommerce/vendure/commit/83af699))
* **core** Channel aware assets ([4ea74e2](https://github.com/vendure-ecommerce/vendure/commit/4ea74e2)), closes [#677](https://github.com/vendure-ecommerce/vendure/issues/677)
* **core** Create APIs & resolver for Tag operations ([6630063](https://github.com/vendure-ecommerce/vendure/commit/6630063)), closes [#316](https://github.com/vendure-ecommerce/vendure/issues/316)
* **core** De-couple PaymentMethod from PaymentMethodHandler ([ee9ba23](https://github.com/vendure-ecommerce/vendure/commit/ee9ba23)), closes [#671](https://github.com/vendure-ecommerce/vendure/issues/671)
* **core** Export startJobQueue helper from boostrapWorker() ([d6e4af5](https://github.com/vendure-ecommerce/vendure/commit/d6e4af5))
* **core** Facet:value pairs can be used in InitialData collection def ([2dc7f15](https://github.com/vendure-ecommerce/vendure/commit/2dc7f15))
* **core** Implement "relation" custom field type ([3e1a900](https://github.com/vendure-ecommerce/vendure/commit/3e1a900)), closes [#308](https://github.com/vendure-ecommerce/vendure/issues/308) [#464](https://github.com/vendure-ecommerce/vendure/issues/464)
* **core** Implement ChangedPriceHandlingStrategy ([3aae4fb](https://github.com/vendure-ecommerce/vendure/commit/3aae4fb)), closes [#664](https://github.com/vendure-ecommerce/vendure/issues/664)
* **core** Implement eligibility checking for PaymentMethods ([690514a](https://github.com/vendure-ecommerce/vendure/commit/690514a)), closes [#469](https://github.com/vendure-ecommerce/vendure/issues/469)
* **core** Implement isDefault on TaxCategory ([7eb21d1](https://github.com/vendure-ecommerce/vendure/commit/7eb21d1)), closes [#566](https://github.com/vendure-ecommerce/vendure/issues/566)
* **core** Implement StockDisplayStrategy to display stockLevel in API ([2709922](https://github.com/vendure-ecommerce/vendure/commit/2709922)), closes [#442](https://github.com/vendure-ecommerce/vendure/issues/442)
* **core** Import ServiceModule into AppModule to expose services ([117a0a7](https://github.com/vendure-ecommerce/vendure/commit/117a0a7))
* **core** Introduce OrderPlacedStrategy for better control of process ([b9b7767](https://github.com/vendure-ecommerce/vendure/commit/b9b7767))
* **core** Make Facets/FacetValues Channel-aware ([e8fcb99](https://github.com/vendure-ecommerce/vendure/commit/e8fcb99)), closes [#612](https://github.com/vendure-ecommerce/vendure/issues/612)
* **core** Make PaymentMethod channel-aware ([1a3b04f](https://github.com/vendure-ecommerce/vendure/commit/1a3b04f)), closes [#587](https://github.com/vendure-ecommerce/vendure/issues/587)
* **core** Make ProductOptionGroup / ProductOption soft-deletable ([0c997bf](https://github.com/vendure-ecommerce/vendure/commit/0c997bf)), closes [#291](https://github.com/vendure-ecommerce/vendure/issues/291)
* **core** Support custom fields on Administrator entity ([260ccfc](https://github.com/vendure-ecommerce/vendure/commit/260ccfc)), closes [#598](https://github.com/vendure-ecommerce/vendure/issues/598)
* **core** Support custom fields on Channel entity ([489faf5](https://github.com/vendure-ecommerce/vendure/commit/489faf5)), closes [#598](https://github.com/vendure-ecommerce/vendure/issues/598)
* **core** Support custom Payment process ([d3b0f60](https://github.com/vendure-ecommerce/vendure/commit/d3b0f60)), closes [#359](https://github.com/vendure-ecommerce/vendure/issues/359) [#507](https://github.com/vendure-ecommerce/vendure/issues/507)
* **core** Support for custom fields on Asset entity ([60b6171](https://github.com/vendure-ecommerce/vendure/commit/60b6171)), closes [#684](https://github.com/vendure-ecommerce/vendure/issues/684)

#### Perf

* **core** Correctly optimized OrderItem persistence ([5c879e7](https://github.com/vendure-ecommerce/vendure/commit/5c879e7))
* **core** Improve order quantity update performance ([3c20837](https://github.com/vendure-ecommerce/vendure/commit/3c20837))
* **core** Run job queues in the worker process ([f05210a](https://github.com/vendure-ecommerce/vendure/commit/f05210a))


### BREAKING CHANGE

* `Order.taxSummary` now includes shipping taxes
* A database migration is required for the new Asset tags support.
* New DB relation Asset to Channel, requiring a migration. The Admin API mutations `deleteAsset` and `deleteAssets` have changed their argument signature.
* The Facet and FacetValue entities are now channel-aware. This change to the
schema will require a DB migration.
* The OrderItem entity has a new field, `initialListPrice`, used to better
handle price changes to items in an active Order. This schema change will require a DB migration.
* The PaymentMethod entity and type has changed. Previously, a PaymentMethod was
coupled to the configured PaymentMethodHandlers 1-to-1. Now the PaymentMethodHandler is just
a configurable _property_ of the PaymentMethod, much in the same way that a ShippingCalculator
relates to a ShippingMethod. Any existing PaymentMethod entities will need to be migrated to the
new structure.
* The PaymentMethod entity is now channel-aware which will require a DB migration
to migrate existing PaymentMethods
* The ProductOptionGroup & ProductOption entities have a new `deletedAt` column
which will require a DB migration.
* The signature of the `OrderMergeStrategy.merge()` method has changed. If you have
implemented a custom OrderMergeStrategy, you'll need to update it to return the expected type.
* The TaxCategory entity now has an `isDefault` property, requiring a DB migration.
## <small>0.18.5 (2021-03-01)</small>


#### Fixes

* **admin-ui** Typing error on pt-Br i18n (#725) ([50aafb3](https://github.com/vendure-ecommerce/vendure/commit/50aafb3)), closes [#725](https://github.com/vendure-ecommerce/vendure/issues/725)
* **core** Allow asset uploads with same major mime type ([070c5f2](https://github.com/vendure-ecommerce/vendure/commit/070c5f2)), closes [#727](https://github.com/vendure-ecommerce/vendure/issues/727)
* **core** Fix list query sorting by non-default language with filters ([1e31828](https://github.com/vendure-ecommerce/vendure/commit/1e31828))
* **core** Prevent Facet code conflicts ([bce3b59](https://github.com/vendure-ecommerce/vendure/commit/bce3b59)), closes [#715](https://github.com/vendure-ecommerce/vendure/issues/715)

#### Features

* **email-plugin** Support custom EmailGenerators and EmailSenders ([3e20624](https://github.com/vendure-ecommerce/vendure/commit/3e20624))

## <small>0.18.4 (2021-02-10)</small>


#### Features

* **core** Implement productVariants list query in Admin API ([6d830a0](https://github.com/vendure-ecommerce/vendure/commit/6d830a0))
* **core** Language fallback when querying Product/Collection by slug ([5967c8a](https://github.com/vendure-ecommerce/vendure/commit/5967c8a)), closes [#538](https://github.com/vendure-ecommerce/vendure/issues/538)

#### Fixes

* **admin-ui** Fix modification of order addresses ([cd9a812](https://github.com/vendure-ecommerce/vendure/commit/cd9a812)), closes [#688](https://github.com/vendure-ecommerce/vendure/issues/688)
* **common** Correctly normalize strings with single quotes ([d12f369](https://github.com/vendure-ecommerce/vendure/commit/d12f369)), closes [#679](https://github.com/vendure-ecommerce/vendure/issues/679)
* **core** Clean up Sessions when deleting a Channel ([7e7d4b8](https://github.com/vendure-ecommerce/vendure/commit/7e7d4b8)), closes [#686](https://github.com/vendure-ecommerce/vendure/issues/686)
* **core** Correctly constrain inventory on addItemToOrder mutation ([8975247](https://github.com/vendure-ecommerce/vendure/commit/8975247)), closes [#691](https://github.com/vendure-ecommerce/vendure/issues/691)
* **core** Do not modify billing address when shipping address changed ([7e9a709](https://github.com/vendure-ecommerce/vendure/commit/7e9a709)), closes [#688](https://github.com/vendure-ecommerce/vendure/issues/688)
* **core** Fix bad column reference in querybuilder string ([61e9f83](https://github.com/vendure-ecommerce/vendure/commit/61e9f83)), closes [#687](https://github.com/vendure-ecommerce/vendure/issues/687)
* **core** Fix sorting by price on productVariants list ([0102232](https://github.com/vendure-ecommerce/vendure/commit/0102232)), closes [#690](https://github.com/vendure-ecommerce/vendure/issues/690)
* **core** Fix sorting by translatable fields in list queries ([d00bafb](https://github.com/vendure-ecommerce/vendure/commit/d00bafb)), closes [#689](https://github.com/vendure-ecommerce/vendure/issues/689)
* **core** Loosen restriction on transitioning to PaymentAuthorized ([59d39d6](https://github.com/vendure-ecommerce/vendure/commit/59d39d6))
* **core** Products without variants are indexed by DefaultSearchPlugin ([2dab174](https://github.com/vendure-ecommerce/vendure/commit/2dab174)), closes [#609](https://github.com/vendure-ecommerce/vendure/issues/609)
* **core** Reduce chance of index err in assigning variants to channels ([58e3f7b](https://github.com/vendure-ecommerce/vendure/commit/58e3f7b))
* **elasticsearch-plugin** Products without variants are indexed ([21b6aa3](https://github.com/vendure-ecommerce/vendure/commit/21b6aa3)), closes [#609](https://github.com/vendure-ecommerce/vendure/issues/609)

## <small>0.18.3 (2021-01-29)</small>


#### Fixes

* **admin-ui** Fix filtering products by term in Channel ([d880f8e](https://github.com/vendure-ecommerce/vendure/commit/d880f8e))
* **admin-ui** Fix role editor Channel value display  ([c258975](https://github.com/vendure-ecommerce/vendure/commit/c258975))
* **admin-ui** Fix various issues with product variant management view ([d34f935](https://github.com/vendure-ecommerce/vendure/commit/d34f935)), closes [#602](https://github.com/vendure-ecommerce/vendure/issues/602)
* **admin-ui** Translate missing Brazilian (PT-br) i18n json ([808d1fe](https://github.com/vendure-ecommerce/vendure/commit/808d1fe))
* **core** Do not allow updating products not in active channel ([4b2fac7](https://github.com/vendure-ecommerce/vendure/commit/4b2fac7))
* **core** Prevent multiple ProductVariantPrice creation ([c853033](https://github.com/vendure-ecommerce/vendure/commit/c853033)), closes [#652](https://github.com/vendure-ecommerce/vendure/issues/652)
* **core** Re-calculate OrderItem price on all OrderLine changes ([0d8c485](https://github.com/vendure-ecommerce/vendure/commit/0d8c485)), closes [#660](https://github.com/vendure-ecommerce/vendure/issues/660)
* **core** Update search index for all channels on updates ([85de520](https://github.com/vendure-ecommerce/vendure/commit/85de520)), closes [#629](https://github.com/vendure-ecommerce/vendure/issues/629)
* **elasticsearch-plugin** Update search index for all channels on updates ([2be29c2](https://github.com/vendure-ecommerce/vendure/commit/2be29c2)), closes [#629](https://github.com/vendure-ecommerce/vendure/issues/629)

#### Features

* **admin-ui** Nav menu requirePermissions accepts predicate fn ([c74765d](https://github.com/vendure-ecommerce/vendure/commit/c74765d)), closes [#651](https://github.com/vendure-ecommerce/vendure/issues/651)
* **admin-ui** Support "required" & "defaultValue" in ConfigArgs ([6e5e482](https://github.com/vendure-ecommerce/vendure/commit/6e5e482)), closes [#643](https://github.com/vendure-ecommerce/vendure/issues/643)
* **core** Support "defaultValue" field in ConfigArgs ([92ae819](https://github.com/vendure-ecommerce/vendure/commit/92ae819)), closes [#643](https://github.com/vendure-ecommerce/vendure/issues/643)
* **core** Support "required" field in ConfigArgs ([9940385](https://github.com/vendure-ecommerce/vendure/commit/9940385)), closes [#643](https://github.com/vendure-ecommerce/vendure/issues/643)
* **elasticsearch-plugin** LanguageCode support in CustomMappings ([b114428](https://github.com/vendure-ecommerce/vendure/commit/b114428))

## <small>0.18.2 (2021-01-15)</small>


#### Fixes

* **admin-ui** Fix translation of facet values ([a6f3083](https://github.com/vendure-ecommerce/vendure/commit/a6f3083)), closes [#636](https://github.com/vendure-ecommerce/vendure/issues/636)
* **admin-ui** Order widget i18n fix ([68b8adb](https://github.com/vendure-ecommerce/vendure/commit/68b8adb))
* **admin-ui** Preserve asset changes between product list/table view ([c83e511](https://github.com/vendure-ecommerce/vendure/commit/c83e511)), closes [#632](https://github.com/vendure-ecommerce/vendure/issues/632)
* **admin-ui** Preserve changes between product/variant tabs ([242787a](https://github.com/vendure-ecommerce/vendure/commit/242787a)), closes [#632](https://github.com/vendure-ecommerce/vendure/issues/632)
* **admin-ui** Preserve variant price changes between list/table views ([43bd770](https://github.com/vendure-ecommerce/vendure/commit/43bd770)), closes [#632](https://github.com/vendure-ecommerce/vendure/issues/632)
* **admin-ui** Update CS translations ([d18dab0](https://github.com/vendure-ecommerce/vendure/commit/d18dab0))
* **asset-server-plugin** Fix corrupt SVG previews ([3a16d87](https://github.com/vendure-ecommerce/vendure/commit/3a16d87)), closes [#456](https://github.com/vendure-ecommerce/vendure/issues/456)
* **core** Add ReadOrder perm to fulfillment-related shipping queries ([72ed50c](https://github.com/vendure-ecommerce/vendure/commit/72ed50c)), closes [#644](https://github.com/vendure-ecommerce/vendure/issues/644)
* **core** Allow list queries to filter/sort on calculated columns ([5325387](https://github.com/vendure-ecommerce/vendure/commit/5325387)), closes [#642](https://github.com/vendure-ecommerce/vendure/issues/642)
* **core** Clear order discounts after removing coupon code ([e1cce8f](https://github.com/vendure-ecommerce/vendure/commit/e1cce8f)), closes [#649](https://github.com/vendure-ecommerce/vendure/issues/649)
* **core** Correctly prorate order discounts over differing tax rates ([b128425](https://github.com/vendure-ecommerce/vendure/commit/b128425)), closes [#653](https://github.com/vendure-ecommerce/vendure/issues/653)
* **core** Correctly return order quantities from list query ([a2e34ec](https://github.com/vendure-ecommerce/vendure/commit/a2e34ec)), closes [#603](https://github.com/vendure-ecommerce/vendure/issues/603)
* **core** Do not error when querying fulfillment on empty order ([b0c0457](https://github.com/vendure-ecommerce/vendure/commit/b0c0457)), closes [#639](https://github.com/vendure-ecommerce/vendure/issues/639)
* **core** Fix NaN error when prorating discount over zero-tax line ([51af5a0](https://github.com/vendure-ecommerce/vendure/commit/51af5a0))
* **core** Gracefully handle errors in JobQueue ([6d1b8c6](https://github.com/vendure-ecommerce/vendure/commit/6d1b8c6)), closes [#635](https://github.com/vendure-ecommerce/vendure/issues/635)

#### Features

* **admin-ui** Auto update ProductVariant name with Product name ([69cd0d0](https://github.com/vendure-ecommerce/vendure/commit/69cd0d0)), closes [#600](https://github.com/vendure-ecommerce/vendure/issues/600)
* **admin-ui** Auto update ProductVariant name with ProductOption name ([0e98cb5](https://github.com/vendure-ecommerce/vendure/commit/0e98cb5)), closes [#600](https://github.com/vendure-ecommerce/vendure/issues/600)
* **admin-ui** Currencies respect UI language setting ([5530782](https://github.com/vendure-ecommerce/vendure/commit/5530782)), closes [#568](https://github.com/vendure-ecommerce/vendure/issues/568)
* **admin-ui** Dates respect UI language setting ([dd0e73a](https://github.com/vendure-ecommerce/vendure/commit/dd0e73a)), closes [#568](https://github.com/vendure-ecommerce/vendure/issues/568)
* **admin-ui** Display channel filter when more than 10 Channels ([b1b363d](https://github.com/vendure-ecommerce/vendure/commit/b1b363d)), closes [#594](https://github.com/vendure-ecommerce/vendure/issues/594)
* **email-plugin** Allow attachments to be set on emails ([0082067](https://github.com/vendure-ecommerce/vendure/commit/0082067)), closes [#481](https://github.com/vendure-ecommerce/vendure/issues/481)
* **email-plugin** Do not re-send order confirmation after modifying ([ddb71df](https://github.com/vendure-ecommerce/vendure/commit/ddb71df)), closes [#650](https://github.com/vendure-ecommerce/vendure/issues/650)

## <small>0.18.1 (2021-01-08)</small>


#### Fixes

* **admin-ui** Refresh ShippingMethodList on channel change ([6811ca8](https://github.com/vendure-ecommerce/vendure/commit/6811ca8)), closes [#595](https://github.com/vendure-ecommerce/vendure/issues/595)
* **admin-ui** Shipping method validators fix ([bbdd5be](https://github.com/vendure-ecommerce/vendure/commit/bbdd5be))
* **admin-ui** Translate to Spanish all languages available ([b56e45d](https://github.com/vendure-ecommerce/vendure/commit/b56e45d))
* **core** Always include customFields on OrderAddress type ([c5e3c6d](https://github.com/vendure-ecommerce/vendure/commit/c5e3c6d)), closes [#616](https://github.com/vendure-ecommerce/vendure/issues/616)
* **core** Fix error when creating Product in sub-channel ([96c5103](https://github.com/vendure-ecommerce/vendure/commit/96c5103)), closes [#556](https://github.com/vendure-ecommerce/vendure/issues/556) [#613](https://github.com/vendure-ecommerce/vendure/issues/613)

#### Features

* **admin-ui** Add dark mode theme & switcher component ([76f80f6](https://github.com/vendure-ecommerce/vendure/commit/76f80f6)), closes [#391](https://github.com/vendure-ecommerce/vendure/issues/391)
* **admin-ui** Add default branding values to vendure-ui-config ([50aeb2b](https://github.com/vendure-ecommerce/vendure/commit/50aeb2b)), closes [#391](https://github.com/vendure-ecommerce/vendure/issues/391)
* **admin-ui** Add support for job cancellation ([c6004c1](https://github.com/vendure-ecommerce/vendure/commit/c6004c1)), closes [#614](https://github.com/vendure-ecommerce/vendure/issues/614)
* **admin-ui** Allow "enabled" state to be set when creating products ([3e006ce](https://github.com/vendure-ecommerce/vendure/commit/3e006ce)), closes [#608](https://github.com/vendure-ecommerce/vendure/issues/608)
* **admin-ui** Enable theming by use of css custom properties ([68107d2](https://github.com/vendure-ecommerce/vendure/commit/68107d2)), closes [#391](https://github.com/vendure-ecommerce/vendure/issues/391)
* **core** Add `cancelJob` mutation ([2d099cf](https://github.com/vendure-ecommerce/vendure/commit/2d099cf)), closes [#614](https://github.com/vendure-ecommerce/vendure/issues/614)
* **core** Allow "enabled" state to be set when creating products ([02eb9f7](https://github.com/vendure-ecommerce/vendure/commit/02eb9f7)), closes [#608](https://github.com/vendure-ecommerce/vendure/issues/608)
* **ui-devkit** Allow custom global styles to be specified ([2081a15](https://github.com/vendure-ecommerce/vendure/commit/2081a15)), closes [#391](https://github.com/vendure-ecommerce/vendure/issues/391)
* **ui-devkit** Allow extensions consisting of only static assets ([5ea3422](https://github.com/vendure-ecommerce/vendure/commit/5ea3422)), closes [#391](https://github.com/vendure-ecommerce/vendure/issues/391) [#309](https://github.com/vendure-ecommerce/vendure/issues/309)
* **ui-devkit** Export helper function to set brand images ([6cde0d8](https://github.com/vendure-ecommerce/vendure/commit/6cde0d8)), closes [#391](https://github.com/vendure-ecommerce/vendure/issues/391)

## 0.18.0 (2020-12-31)


#### Fixes

* **admin-ui** Correctly handle order modification with no custom fields ([c0b699b](https://github.com/vendure-ecommerce/vendure/commit/c0b699b))
* **admin-ui** Correctly handle widget permissions ([e3d7855](https://github.com/vendure-ecommerce/vendure/commit/e3d7855))
* **admin-ui** Fix error when creating new Channel ([58db345](https://github.com/vendure-ecommerce/vendure/commit/58db345))
* **admin-ui** Fix memory leak with refetchOnChannelChange usage ([1bad22a](https://github.com/vendure-ecommerce/vendure/commit/1bad22a))
* **admin-ui** Fix variant price display issues ([f62f569](https://github.com/vendure-ecommerce/vendure/commit/f62f569))
* **core** Correct handling of discounts & taxes when prices include tax ([c04b1c7](https://github.com/vendure-ecommerce/vendure/commit/c04b1c7)), closes [#573](https://github.com/vendure-ecommerce/vendure/issues/573)
* **core** Correctly handle addItemToOrder when 0 stock available ([187cf3d](https://github.com/vendure-ecommerce/vendure/commit/187cf3d))
* **core** Fix ChannelAware ProductVariant performance issues ([275cd62](https://github.com/vendure-ecommerce/vendure/commit/275cd62))
* **core** Fix default PromotionActions when Channel prices include tax ([efe640c](https://github.com/vendure-ecommerce/vendure/commit/efe640c)), closes [#573](https://github.com/vendure-ecommerce/vendure/issues/573)
* **core** Fix error on updateCustomer mutation ([bb1878f](https://github.com/vendure-ecommerce/vendure/commit/bb1878f)), closes [#590](https://github.com/vendure-ecommerce/vendure/issues/590)
* **core** Fix failing e2e tests ([36b6dab](https://github.com/vendure-ecommerce/vendure/commit/36b6dab))
* **core** Fix Postgres search with multiple terms ([5ece0d5](https://github.com/vendure-ecommerce/vendure/commit/5ece0d5))
* **core** Handle undefined reference in customerGroup condition ([0eaffc1](https://github.com/vendure-ecommerce/vendure/commit/0eaffc1))
* **core** Ignore deleted products when checking slug uniqueness ([844a12d](https://github.com/vendure-ecommerce/vendure/commit/844a12d)), closes [#558](https://github.com/vendure-ecommerce/vendure/issues/558)
* **core** Return all ProductVariant.channels from default Channel ([799f306](https://github.com/vendure-ecommerce/vendure/commit/799f306))

#### Features

* **admin-ui** Add support for dashboard widgets ([aa835e8](https://github.com/vendure-ecommerce/vendure/commit/aa835e8)), closes [#334](https://github.com/vendure-ecommerce/vendure/issues/334)
* **admin-ui** Allow cancellation of OrderItems without refunding ([df55d2d](https://github.com/vendure-ecommerce/vendure/commit/df55d2d)), closes [#569](https://github.com/vendure-ecommerce/vendure/issues/569)
* **admin-ui** Allow default dashboard widget widths to be set ([3e33bbc](https://github.com/vendure-ecommerce/vendure/commit/3e33bbc)), closes [#334](https://github.com/vendure-ecommerce/vendure/issues/334)
* **admin-ui** Allow OrderLine customFields to be modified ([e89845e](https://github.com/vendure-ecommerce/vendure/commit/e89845e)), closes [#314](https://github.com/vendure-ecommerce/vendure/issues/314)
* **admin-ui** Allow OrderLine customFields to be modified ([5a4811f](https://github.com/vendure-ecommerce/vendure/commit/5a4811f)), closes [#314](https://github.com/vendure-ecommerce/vendure/issues/314)
* **admin-ui** Allow overriding built-in nav menu items ([9d862c6](https://github.com/vendure-ecommerce/vendure/commit/9d862c6)), closes [#562](https://github.com/vendure-ecommerce/vendure/issues/562)
* **admin-ui** Allow setting FulfillmentHandler in ShippingDetail page ([8207c84](https://github.com/vendure-ecommerce/vendure/commit/8207c84)), closes [#529](https://github.com/vendure-ecommerce/vendure/issues/529)
* **admin-ui** Correctly display cancelled Fulfillments ([7efe800](https://github.com/vendure-ecommerce/vendure/commit/7efe800)), closes [#565](https://github.com/vendure-ecommerce/vendure/issues/565)
* **admin-ui** Display order tax summary, update to latest Order API ([9b8e7d4](https://github.com/vendure-ecommerce/vendure/commit/9b8e7d4)), closes [#573](https://github.com/vendure-ecommerce/vendure/issues/573)
* **admin-ui** Display surcharges in OrderDetail ([bbcc6d8](https://github.com/vendure-ecommerce/vendure/commit/bbcc6d8)), closes [#583](https://github.com/vendure-ecommerce/vendure/issues/583)
* **admin-ui** Display tax description in OrderDetail tax summary ([843bec2](https://github.com/vendure-ecommerce/vendure/commit/843bec2))
* **admin-ui** Enable manual order state transitions ([0868b4c](https://github.com/vendure-ecommerce/vendure/commit/0868b4c))
* **admin-ui** Fulfillment dialog accepts handler-defined arguments ([c787241](https://github.com/vendure-ecommerce/vendure/commit/c787241)), closes [#529](https://github.com/vendure-ecommerce/vendure/issues/529)
* **admin-ui** Implement order modification flow ([d3e3a88](https://github.com/vendure-ecommerce/vendure/commit/d3e3a88)), closes [#314](https://github.com/vendure-ecommerce/vendure/issues/314)
* **admin-ui** Implement reordering, resize, add, remove of widgets ([9a52bdf](https://github.com/vendure-ecommerce/vendure/commit/9a52bdf)), closes [#334](https://github.com/vendure-ecommerce/vendure/issues/334)
* **admin-ui** Implement variant channel assignment controls ([83a33b5](https://github.com/vendure-ecommerce/vendure/commit/83a33b5)), closes [#519](https://github.com/vendure-ecommerce/vendure/issues/519)
* **admin-ui** Persist dashboard layout to localStorage ([ace115d](https://github.com/vendure-ecommerce/vendure/commit/ace115d))
* **admin-ui** Persist dashboard layout to localStorage ([15cae77](https://github.com/vendure-ecommerce/vendure/commit/15cae77)), closes [#334](https://github.com/vendure-ecommerce/vendure/issues/334)
* **core** Add Order history entry for modifications ([894f95b](https://github.com/vendure-ecommerce/vendure/commit/894f95b)), closes [#314](https://github.com/vendure-ecommerce/vendure/issues/314)
* **core** Allow multiple Fulfillments per OrderItem ([3245e00](https://github.com/vendure-ecommerce/vendure/commit/3245e00)), closes [#565](https://github.com/vendure-ecommerce/vendure/issues/565)
* **core** Allow Order/OrderLine customFields to be modified ([ce656c4](https://github.com/vendure-ecommerce/vendure/commit/ce656c4)), closes [#314](https://github.com/vendure-ecommerce/vendure/issues/314)
* **core** ChannelAware ProductVariants ([4c1a2be](https://github.com/vendure-ecommerce/vendure/commit/4c1a2be))
* **core** Extend OrderLine type with more discount & tax info ([aa5513f](https://github.com/vendure-ecommerce/vendure/commit/aa5513f)), closes [#573](https://github.com/vendure-ecommerce/vendure/issues/573)
* **core** Implement add/remove Surcharge methods in OrderService ([6cf6984](https://github.com/vendure-ecommerce/vendure/commit/6cf6984)), closes [#583](https://github.com/vendure-ecommerce/vendure/issues/583)
* **core** Implement FulfillmentHandlers ([4e53d08](https://github.com/vendure-ecommerce/vendure/commit/4e53d08)), closes [#529](https://github.com/vendure-ecommerce/vendure/issues/529)
* **core** Implement order modification ([9cd3e24](https://github.com/vendure-ecommerce/vendure/commit/9cd3e24)), closes [#314](https://github.com/vendure-ecommerce/vendure/issues/314)
* **core** Implement Order surcharges ([b608e14](https://github.com/vendure-ecommerce/vendure/commit/b608e14)), closes [#583](https://github.com/vendure-ecommerce/vendure/issues/583)
* **core** Implement Shipping promotion actions ([69b12e3](https://github.com/vendure-ecommerce/vendure/commit/69b12e3)), closes [#580](https://github.com/vendure-ecommerce/vendure/issues/580)
* **core** Implement TaxLineCalculationStrategy ([95663b4](https://github.com/vendure-ecommerce/vendure/commit/95663b4)), closes [#307](https://github.com/vendure-ecommerce/vendure/issues/307)
* **core** Improve naming of price calculation strategies ([ccbebc9](https://github.com/vendure-ecommerce/vendure/commit/ccbebc9)), closes [#307](https://github.com/vendure-ecommerce/vendure/issues/307)
* **core** Improved handling of ShopAPI activeOrder mutations ([958af1a](https://github.com/vendure-ecommerce/vendure/commit/958af1a)), closes [#557](https://github.com/vendure-ecommerce/vendure/issues/557)
* **core** Log unhandled errors ([4dbb974](https://github.com/vendure-ecommerce/vendure/commit/4dbb974))
* **core** Modify ShippingCalculator API to enable correct tax handling ([1ab1c81](https://github.com/vendure-ecommerce/vendure/commit/1ab1c81)), closes [#580](https://github.com/vendure-ecommerce/vendure/issues/580) [#573](https://github.com/vendure-ecommerce/vendure/issues/573)
* **core** Pass `amount` argument into createPayment method ([0c85c76](https://github.com/vendure-ecommerce/vendure/commit/0c85c76))
* **core** Re-work handling of taxes, order-level discounts ([9e39af3](https://github.com/vendure-ecommerce/vendure/commit/9e39af3)), closes [#573](https://github.com/vendure-ecommerce/vendure/issues/573) [#573](https://github.com/vendure-ecommerce/vendure/issues/573)
* **core** Rework Order shipping to support multiple shipping lines ([a711780](https://github.com/vendure-ecommerce/vendure/commit/a711780)), closes [#580](https://github.com/vendure-ecommerce/vendure/issues/580)
* **core** Simplify TaxCalculationStrategy API ([9544dd4](https://github.com/vendure-ecommerce/vendure/commit/9544dd4)), closes [#307](https://github.com/vendure-ecommerce/vendure/issues/307)
* **core** Split taxes from adjustments ([2c71a82](https://github.com/vendure-ecommerce/vendure/commit/2c71a82)), closes [#573](https://github.com/vendure-ecommerce/vendure/issues/573)
* **ui-devkit** Make baseUrl configurable ([54700d2](https://github.com/vendure-ecommerce/vendure/commit/54700d2)), closes [#552](https://github.com/vendure-ecommerce/vendure/issues/552)


### BREAKING CHANGE

* A change to the relation between OrderItems and Fulfillments means a database
migration will be required to preserve fulfillment data of existing Orders.
See the release blog post for details.
* In order to support order modification, a couple of new default order states
have been created - `Modifying` and `ArrangingAdditionalPayment`. Also a new DB entity,
`OrderModification` has been created.
* The `OrderLine.pendingAdjustments` field has been renamed to `adjustments`, tax
adjustments are now stored in a new field, `taxLines`. This will require a DB migration to
preserve data from existing Orders (see guide in release blog post)
* The `PaymentMethodHandler.createPayment()` method now takes a new `amount`
argument. Update any custom PaymentMethodHandlers to use account for this new parameter and use
it instead of `order.total` when creating a new payment.

    ```ts
    // before
    createPayment: async (ctx, order, args, metadata) {
      const transactionAmount = order.total;
      // ...
    }

    // after
    createPayment: async (ctx, order, amount, args, metadata) {
      const transactionAmount = amount;
      // ...
    }
    ```
* The `TaxCalculationStrategy` has been renamed to
`ProductVariantPriceCalculationStrategy` and moved in the VendureConfig from `taxOptions` to
`catalogOptions` and its API has been simplified.
The `PriceCalculationStrategy` has been renamed to `OrderItemPriceCalculationStrategy`.
* The Fulfillment and ShippingMethod entities have new fields relating to
FulfillmentHandlers. This will require a DB migration, though no custom data migration will be
needed for this particular change. 
* The `addFulfillmentToOrder` mutation input has changed: the `method` & `trackingCode` fields
have been replaced by a `handler` field which accepts a FulfillmentHandler code, and any
expected arguments defined by that handler.
* The ProductTranslation entity has had a constraint removed, requiring a schema
migration.
* The return object of the ShippingCalculator class has changed:
    ```ts
    // before
    return {
      price: 500,
      priceWithTax: 600,
    };

    // after
    return {
      price: 500,
      taxRate: 20,
      priceIncludesTax: false,
    };
    ```
    This change will require you to update any custom ShippingCalculator implementations, and also
    to update any ShippingMethods by removing and re-selecting the ShippingCalculator.
* The Shop API mutations `setOrderShippingAddress`, `setOrderBillingAddress`
`setOrderCustomFields` now return a union type which includes a new `NoActiveOrderError`.
Code which refers to these mutations will need to be updated to account for the union
with the fragment spread syntax `...on Order {...}`.
* The TaxCalculationStrategy return value has been simplified - it now only need
return the `price` and `priceIncludesTax` properties. The `ProductVariant` entity has also been
refactored to bring it into line with the corrected tax handling of the OrderItem entity. This
will require a DB migration. See release blog post for details.
* The way shipping charges on Orders are represented has been changed - an Order
now contains multiple ShippingLine entities, each of which has a reference to a ShippingMethod.
This will require a database migration with manual queries to preserve existing order data. See
release blog post for details.
* There have been some major changes to the way that Order taxes and discounts are handled. For a full discussion of the issues behind these changes see #573. These changes will
require a DB migration as well as possible custom scripts to port existing Orders to the new
format. See the release blog post for details.
* The following GraphQL `Order` type properties have changed:
    * `subTotalBeforeTax` has been removed, `subTotal` now excludes tax, and
`subTotalWithTax` has been added.
    * `totalBeforeTax` has been removed, `total` now excludes tax, and
`totalWithTax` has been added.
## <small>0.17.3 (2020-12-14)</small>

This release fixes an error in publishing the last release. No changes have been made.

## <small>0.17.2 (2020-12-11)</small>


#### Features

* **admin-ui** Add French translations ([891be89](https://github.com/vendure-ecommerce/vendure/commit/891be89))
* **core** Implement negated string filter operators ([75b5b7a](https://github.com/vendure-ecommerce/vendure/commit/75b5b7a)), closes [#571](https://github.com/vendure-ecommerce/vendure/issues/571)
* **core** Include express request object in RequestContext ([c4352b2](https://github.com/vendure-ecommerce/vendure/commit/c4352b2)), closes [#581](https://github.com/vendure-ecommerce/vendure/issues/581)
* **core** Log unhandled errors ([c9a0bcc](https://github.com/vendure-ecommerce/vendure/commit/c9a0bcc))
* **email-plugin** Improve error logging ([70cb932](https://github.com/vendure-ecommerce/vendure/commit/70cb932)), closes [#574](https://github.com/vendure-ecommerce/vendure/issues/574)
* **testing** Create TestingLogger ([c4bed2d](https://github.com/vendure-ecommerce/vendure/commit/c4bed2d))

#### Fixes

* **admin-ui** Fix error when creating new Channel ([b38e35d](https://github.com/vendure-ecommerce/vendure/commit/b38e35d))

## <small>0.17.1 (2020-11-20)</small>


#### Features

* **admin-ui** Add "allocated" and "saleable" values to Variant form ([0df7c71](https://github.com/vendure-ecommerce/vendure/commit/0df7c71)), closes [#554](https://github.com/vendure-ecommerce/vendure/issues/554)
* **admin-ui** Add profile page to edit current admin details ([e183041](https://github.com/vendure-ecommerce/vendure/commit/e183041))
* **admin-ui** Allow fulfillment when in PartiallyDelivered state ([b36ce38](https://github.com/vendure-ecommerce/vendure/commit/b36ce38)), closes [#565](https://github.com/vendure-ecommerce/vendure/issues/565)
* **admin-ui** Improved login error message ([2b952aa](https://github.com/vendure-ecommerce/vendure/commit/2b952aa))
* **admin-ui** Persist custom order filter params in url ([8eb6246](https://github.com/vendure-ecommerce/vendure/commit/8eb6246)), closes [#561](https://github.com/vendure-ecommerce/vendure/issues/561)
* **admin-ui** Store last used order list filters in localStorage ([7a9ba23](https://github.com/vendure-ecommerce/vendure/commit/7a9ba23)), closes [#561](https://github.com/vendure-ecommerce/vendure/issues/561)
* **core** Add `activeAdministrator` query to Admin API ([70e14f2](https://github.com/vendure-ecommerce/vendure/commit/70e14f2))
* **core** Add `updateActiveAdministrator` mutation ([73ab736](https://github.com/vendure-ecommerce/vendure/commit/73ab736))

#### Fixes

* **admin-ui** Add missing Czech translations for new translation tokens ([f2b541f](https://github.com/vendure-ecommerce/vendure/commit/f2b541f))
* **admin-ui** Refetch customer list on channel change ([078de40](https://github.com/vendure-ecommerce/vendure/commit/078de40))

## 0.17.0 (2020-11-13)


#### Fixes

* **admin-ui** Add missing "authorized" state translation ([788ba87](https://github.com/vendure-ecommerce/vendure/commit/788ba87))
* **admin-ui** Add missing "state.error" token ([b40843a](https://github.com/vendure-ecommerce/vendure/commit/b40843a))
* **admin-ui** Fix payment states ([df32ba1](https://github.com/vendure-ecommerce/vendure/commit/df32ba1))
* **admin-ui** Fix permission handling in nav menu ([70037e5](https://github.com/vendure-ecommerce/vendure/commit/70037e5))
* **admin-ui** Use select control for string custom field with options ([5c59b67](https://github.com/vendure-ecommerce/vendure/commit/5c59b67)), closes [#546](https://github.com/vendure-ecommerce/vendure/issues/546)
* **admin-ui** Use the ShippingMethod name in fulfillment dialog ([ca2ed58](https://github.com/vendure-ecommerce/vendure/commit/ca2ed58))
* **admin-ui** Use translated state labels in custom filter select ([5f6f9ff](https://github.com/vendure-ecommerce/vendure/commit/5f6f9ff))
* **core** Allow configurable stock allocation logic ([782c0f4](https://github.com/vendure-ecommerce/vendure/commit/782c0f4)), closes [#550](https://github.com/vendure-ecommerce/vendure/issues/550)
* **core** Correctly cascade deletions in HistoryEntries ([6054b71](https://github.com/vendure-ecommerce/vendure/commit/6054b71))
* **core** Correctly encode IDs in nested fragments ([d2333fc](https://github.com/vendure-ecommerce/vendure/commit/d2333fc))
* **core** Correctly update cache in customerGroup promo condition ([8df4fec](https://github.com/vendure-ecommerce/vendure/commit/8df4fec))
* **core** Fix double-allocation of stock on 2-stage payments ([c43a343](https://github.com/vendure-ecommerce/vendure/commit/c43a343)), closes [#550](https://github.com/vendure-ecommerce/vendure/issues/550)
* **core** Mitigate QueryRunnerAlreadyReleasedError in EventBus handlers ([739e56c](https://github.com/vendure-ecommerce/vendure/commit/739e56c)), closes [#520](https://github.com/vendure-ecommerce/vendure/issues/520)
* **core** Validate all Role permissions on bootstrap ([60c8a0e](https://github.com/vendure-ecommerce/vendure/commit/60c8a0e)), closes [#450](https://github.com/vendure-ecommerce/vendure/issues/450)

#### Features

* **admin-ui** Account for stockOnHand when creating Fulfillments ([540d2c6](https://github.com/vendure-ecommerce/vendure/commit/540d2c6)), closes [#319](https://github.com/vendure-ecommerce/vendure/issues/319)
* **admin-ui** Add filter presets to the OrderDetail view ([4f5a440](https://github.com/vendure-ecommerce/vendure/commit/4f5a440)), closes [#477](https://github.com/vendure-ecommerce/vendure/issues/477)
* **admin-ui** Allow the setting of custom Permissions ([d525a32](https://github.com/vendure-ecommerce/vendure/commit/d525a32)), closes [#450](https://github.com/vendure-ecommerce/vendure/issues/450)
* **admin-ui** Display Fulfillment custom fields ([838943e](https://github.com/vendure-ecommerce/vendure/commit/838943e)), closes [#525](https://github.com/vendure-ecommerce/vendure/issues/525)
* **admin-ui** Implement UI controls for setting outOfStockThreshold ([335c345](https://github.com/vendure-ecommerce/vendure/commit/335c345)), closes [#319](https://github.com/vendure-ecommerce/vendure/issues/319)
* **admin-ui** Support for ShippingMethod translations & custom fields ([e189bd4](https://github.com/vendure-ecommerce/vendure/commit/e189bd4)), closes [#530](https://github.com/vendure-ecommerce/vendure/issues/530)
* **admin-ui** Support new API for ProductVariant.trackInventory ([b825df1](https://github.com/vendure-ecommerce/vendure/commit/b825df1))
* **core** Add `shouldRunCheck` function to ShippingEligibilityChecker ([3b7e7db](https://github.com/vendure-ecommerce/vendure/commit/3b7e7db)), closes [#536](https://github.com/vendure-ecommerce/vendure/issues/536)
* **core** Add tax summary data to Order type ([a666fab](https://github.com/vendure-ecommerce/vendure/commit/a666fab)), closes [#467](https://github.com/vendure-ecommerce/vendure/issues/467)
* **core** Allow custom Permissions to be defined ([1baeedf](https://github.com/vendure-ecommerce/vendure/commit/1baeedf)), closes [#450](https://github.com/vendure-ecommerce/vendure/issues/450)
* **core** Emit event when assigning/removing Customer to/from group ([6676335](https://github.com/vendure-ecommerce/vendure/commit/6676335))
* **core** Enable inventory tracking by default in GlobalSettings ([31bb06a](https://github.com/vendure-ecommerce/vendure/commit/31bb06a))
* **core** Export custom entity field types ([21706b3](https://github.com/vendure-ecommerce/vendure/commit/21706b3))
* **core** Export HistoryService ([8688c35](https://github.com/vendure-ecommerce/vendure/commit/8688c35))
* **core** Export StockMovementService ([fe98c79](https://github.com/vendure-ecommerce/vendure/commit/fe98c79)), closes [#550](https://github.com/vendure-ecommerce/vendure/issues/550)
* **core** Expose additional price & tax data on OrderLine ([c870684](https://github.com/vendure-ecommerce/vendure/commit/c870684)), closes [#467](https://github.com/vendure-ecommerce/vendure/issues/467)
* **core** Expose assignable Permissions via ServerConfig type ([ab2f62c](https://github.com/vendure-ecommerce/vendure/commit/ab2f62c)), closes [#450](https://github.com/vendure-ecommerce/vendure/issues/450)
* **core** Implement `in` string filter for PaginatedList queries ([7c7dcf2](https://github.com/vendure-ecommerce/vendure/commit/7c7dcf2)), closes [#543](https://github.com/vendure-ecommerce/vendure/issues/543)
* **core** Implement `regex` string filter for PaginatedList queries ([0a33441](https://github.com/vendure-ecommerce/vendure/commit/0a33441)), closes [#543](https://github.com/vendure-ecommerce/vendure/issues/543)
* **core** Implement constraints on adding & fulfilling OrderItems ([87d07f8](https://github.com/vendure-ecommerce/vendure/commit/87d07f8)), closes [#319](https://github.com/vendure-ecommerce/vendure/issues/319)
* **core** Implement inheritance for ProductVariant.trackInventory ([f27f985](https://github.com/vendure-ecommerce/vendure/commit/f27f985))
* **core** Improve feedback & error handling in migration functions ([7a1773c](https://github.com/vendure-ecommerce/vendure/commit/7a1773c))
* **core** Make ShippingMethod translatable ([c7418d1](https://github.com/vendure-ecommerce/vendure/commit/c7418d1)), closes [#530](https://github.com/vendure-ecommerce/vendure/issues/530)
* **core** New "Created" initial state for Fulfillments ([a53f27e](https://github.com/vendure-ecommerce/vendure/commit/a53f27e)), closes [#510](https://github.com/vendure-ecommerce/vendure/issues/510)
* **core** New "Created" initial state for Orders ([7a774e3](https://github.com/vendure-ecommerce/vendure/commit/7a774e3)), closes [#510](https://github.com/vendure-ecommerce/vendure/issues/510)
* **core** OrderItem.unitPrice now _always_ excludes tax ([6e2d490](https://github.com/vendure-ecommerce/vendure/commit/6e2d490)), closes [#467](https://github.com/vendure-ecommerce/vendure/issues/467)
* **core** Pass RequestContext to AssetNamingStrategy functions ([48ae372](https://github.com/vendure-ecommerce/vendure/commit/48ae372))
* **core** Pass RequestContext to AssetPreviewStrategy functions ([05e6f9e](https://github.com/vendure-ecommerce/vendure/commit/05e6f9e))
* **core** Pass RequestContext to AuthenticationStrategy.onLogOut() ([a46ea5d](https://github.com/vendure-ecommerce/vendure/commit/a46ea5d))
* **core** Pass RequestContext to OrderMergeStrategy functions ([eae71f0](https://github.com/vendure-ecommerce/vendure/commit/eae71f0))
* **core** Pass RequestContext to PaymentMethodHandler functions ([9c2257d](https://github.com/vendure-ecommerce/vendure/commit/9c2257d)), closes [#488](https://github.com/vendure-ecommerce/vendure/issues/488)
* **core** Pass RequestContext to PriceCalculationStrategy ([8a58325](https://github.com/vendure-ecommerce/vendure/commit/8a58325)), closes [#487](https://github.com/vendure-ecommerce/vendure/issues/487)
* **core** Pass RequestContext to PromotionAction functions ([0a35a12](https://github.com/vendure-ecommerce/vendure/commit/0a35a12))
* **core** Pass RequestContext to ShippingCalculator functions ([6eee894](https://github.com/vendure-ecommerce/vendure/commit/6eee894))
* **core** Pass RequestContext to ShippingEligibilityChecker functions ([a5db022](https://github.com/vendure-ecommerce/vendure/commit/a5db022))
* **core** Pass RequestContext to TaxZoneStrategy functions ([a4d4311](https://github.com/vendure-ecommerce/vendure/commit/a4d4311))
* **core** Return ErrorResult when setting ineligible ShippingMethod ([0e09d51](https://github.com/vendure-ecommerce/vendure/commit/0e09d51))
* **core** Support custom fields on Fulfillment entity ([380f68e](https://github.com/vendure-ecommerce/vendure/commit/380f68e)), closes [#525](https://github.com/vendure-ecommerce/vendure/issues/525)
* **core** Track stock allocations ([75e3f9c](https://github.com/vendure-ecommerce/vendure/commit/75e3f9c)), closes [#319](https://github.com/vendure-ecommerce/vendure/issues/319)

#### Perf

* **core** Optimize invocation of ShippingEligibilityCheckers ([11415e6](https://github.com/vendure-ecommerce/vendure/commit/11415e6)), closes [#536](https://github.com/vendure-ecommerce/vendure/issues/536)


### BREAKING CHANGE

* Deletions of Orders or Customers now cascade to any associated HistoryEntries,
thus preserving referential integrity. This involves a DB schema change which will necessitate
a migration.
* Fulfillments now start in the new "Created" state, and then _immediately_
transition to the "Pending" state. This allows e.g. event listeners to pick up newly-created
Fulfillments.
* Orders now start in the new "Created" state, and then _immediately_ transition
to the "AddingItems" state. This allows e.g. event listeners to pick up newly-created Orders.
* The `AuthenticationStrategy.onLogOut()` function
signature has changed: the first argument is now the RequestContext of the current request.
* The `OrderItem.unitPrice` is now _always_ given as the net (without tax) price
of the related ProductVariant. Formerly, it was either the net or gross price, depending on
the `pricesIncludeTax` setting of the Channel. If you have existing Orders where
`unitPriceIncludesTax = true`, you will need to manually update the `unitPrice` value *before*
running any other migrations for this release. The query will look like:

    `UPDATE order_item SET unitPrice = ROUND(unitPrice / ((taxRate + 100) / 100)) WHERE unitPriceIncludesTax = 1`
* The `OrderLine.totalPrice` field has been deprecated and will be removed in a
future release. Use the new `OrderLine.linePriceWithTax` field instead.
* The `PaymentMethodHandler` function signatures have changed:
`createPayment()`, `settlePayment()` & `createRefund()` now all get passed the
RequestContext object as the first argument.
* The `PriceCalculationStrategy.calculateUnitPrice()` function
signature has changed: the first argument is now the RequestContext of the current request.
* The `ProductVariant.trackInventory` field is now an Enum rather than a boolean, allowing explicit inheritance of the value set in GlobalSettings. This will require a DB migration with a custom query to transform the previous boolean values to the new enum (string) values of "TRUE", "FALSE" or "INHERIT". Check the release blog post for more details.
* The `ShippingMethod` entity is now translatable. This change will require a DB
migration to be performed, including custom queries to migrate any existing ShippingMethods
to the new table structure (see release blog post for details).
* The AssetNamingStrategy `generateSourceFileName()` & `generatePreviewFileName()`
function signatures have changed: the first argument is now the
RequestContext of the current request.
* The AssetPreviewStrategy `generatePreviewImage()`
function signature has changed: the first argument is now the
RequestContext of the current request.
* The internal handling of stock movements has been refined,
which required changes to the DB schema. This will require a migration.
* The OrderMergeStrategy `merge()`
function signature has changed: the first argument is now the
RequestContext of the current request.
* The PromotionAction `execute()`
function signature has changed: the first argument is now the
RequestContext of the current request.
* The ShippingCalculator `calculate()`
function signature has changed: the first argument is now the
RequestContext of the current request.
* The ShippingEligibilityChecker `check()`
function signature has changed: the first argument is now the
RequestContext of the current request.
* The TaxZoneStrategy `determineTaxZone()`
function signature has changed: the first argument is now the
RequestContext of the current request.
## <small>0.16.3 (2020-11-05)</small>


#### Fixes

* **admin-ui** Add missing I18n state tokens ([215a637](https://github.com/vendure-ecommerce/vendure/commit/215a637))
* **admin-ui** Fix Apollo cache warning for GlobalSettings.serverConfig ([8b135ad](https://github.com/vendure-ecommerce/vendure/commit/8b135ad))
* **admin-ui** Fix CustomerGroupList layout in Firefox ([c432a14](https://github.com/vendure-ecommerce/vendure/commit/c432a14)), closes [#531](https://github.com/vendure-ecommerce/vendure/issues/531)
* **admin-ui** Fix overflow that made ui unusable on mobile ([f129e0c](https://github.com/vendure-ecommerce/vendure/commit/f129e0c))
* **admin-ui** Fix saving countries in other languages ([11a1004](https://github.com/vendure-ecommerce/vendure/commit/11a1004)), closes [#528](https://github.com/vendure-ecommerce/vendure/issues/528)
* **core** Add retry logic in case of transaction deadlocks ([3b60bcb](https://github.com/vendure-ecommerce/vendure/commit/3b60bcb)), closes [#527](https://github.com/vendure-ecommerce/vendure/issues/527)

#### Features

* **core** Export FacetValueChecker promotion utility ([fc3890e](https://github.com/vendure-ecommerce/vendure/commit/fc3890e))

## <small>0.16.2 (2020-10-22)</small>


#### Fixes

* **admin-ui** Auto-fill Product & Collection slugs in other languages ([9393d04](https://github.com/vendure-ecommerce/vendure/commit/9393d04)), closes [#522](https://github.com/vendure-ecommerce/vendure/issues/522)
* **admin-ui** Correct display of args input in PaymentMethodDetail ([3f7627e](https://github.com/vendure-ecommerce/vendure/commit/3f7627e)), closes [#489](https://github.com/vendure-ecommerce/vendure/issues/489)
* **admin-ui** Fix collection list "expand all" behaviour when toggling ([c77af2b](https://github.com/vendure-ecommerce/vendure/commit/c77af2b)), closes [#513](https://github.com/vendure-ecommerce/vendure/issues/513)
* **admin-ui** Fix display of existing variants in ProductVariantEditor ([ca538b8](https://github.com/vendure-ecommerce/vendure/commit/ca538b8)), closes [#521](https://github.com/vendure-ecommerce/vendure/issues/521)
* **admin-ui** Preserve expanded state on moving collections ([8d028cf](https://github.com/vendure-ecommerce/vendure/commit/8d028cf)), closes [#515](https://github.com/vendure-ecommerce/vendure/issues/515)
* **core** Add missing events to export (fulfillment, logout) ([04a49bf](https://github.com/vendure-ecommerce/vendure/commit/04a49bf))
* **core** Correctly de-duplicate OrderLines with empty custom fields ([ef99c22](https://github.com/vendure-ecommerce/vendure/commit/ef99c22)), closes [#512](https://github.com/vendure-ecommerce/vendure/issues/512)
* **email-plugin** Only call `loadData()` function after filters run ([e22db7e](https://github.com/vendure-ecommerce/vendure/commit/e22db7e)), closes [#518](https://github.com/vendure-ecommerce/vendure/issues/518)

#### Features

* **admin-ui** Add Czech translations ([89ee826](https://github.com/vendure-ecommerce/vendure/commit/89ee826))
* **admin-ui** Enable filtering by custom Order states in list view ([76d2d56](https://github.com/vendure-ecommerce/vendure/commit/76d2d56))
* **core** Add custom error result on AuthenticationStrategy ([d3ddb96](https://github.com/vendure-ecommerce/vendure/commit/d3ddb96)), closes [#499](https://github.com/vendure-ecommerce/vendure/issues/499)
* **core** Add NotVerifiedError to AuthenticationResult ([ee39263](https://github.com/vendure-ecommerce/vendure/commit/ee39263)), closes [#500](https://github.com/vendure-ecommerce/vendure/issues/500)
* **core** Add support for better-sqlite3 driver to DefaultSearchPlugin ([7a71fbe](https://github.com/vendure-ecommerce/vendure/commit/7a71fbe)), closes [#505](https://github.com/vendure-ecommerce/vendure/issues/505)
* **create** Use better-sqlite3 driver for improved sqlite perf ([dfd4f36](https://github.com/vendure-ecommerce/vendure/commit/dfd4f36)), closes [#505](https://github.com/vendure-ecommerce/vendure/issues/505)

## <small>0.16.1 (2020-10-15)</small>


#### Fixes

* **admin-ui** Allow SortPipe to work with frozen arrays ([00e0af9](https://github.com/vendure-ecommerce/vendure/commit/00e0af9))
* **admin-ui** Correctly handle missing error codes ([aa80092](https://github.com/vendure-ecommerce/vendure/commit/aa80092))
* **admin-ui** Fix Apollo cache errors when switching Channels ([ca2c1b6](https://github.com/vendure-ecommerce/vendure/commit/ca2c1b6)), closes [#496](https://github.com/vendure-ecommerce/vendure/issues/496)
* **admin-ui** Fix build-time Angular CLI warnings ([c52a258](https://github.com/vendure-ecommerce/vendure/commit/c52a258))
* **admin-ui** Fix DateFormInputComponent error ([5575778](https://github.com/vendure-ecommerce/vendure/commit/5575778))
* **admin-ui** Fix widths of product variant inputs ([feca114](https://github.com/vendure-ecommerce/vendure/commit/feca114)), closes [#503](https://github.com/vendure-ecommerce/vendure/issues/503)
* **core** DefaultSearchPlugin correctly indexes language variants ([909479b](https://github.com/vendure-ecommerce/vendure/commit/909479b)), closes [#493](https://github.com/vendure-ecommerce/vendure/issues/493)
* **core** Restore export of ZoneService ([9b8d278](https://github.com/vendure-ecommerce/vendure/commit/9b8d278))
* **core** Use correct permission for `updateAdministrator` mutation ([4b55288](https://github.com/vendure-ecommerce/vendure/commit/4b55288))
* **elasticsearch-plugin** Compatible with UUID primary keys strategy ([cdf3a39](https://github.com/vendure-ecommerce/vendure/commit/cdf3a39)), closes [#494](https://github.com/vendure-ecommerce/vendure/issues/494)
* **elasticsearch-plugin** Correctly index language variants ([e37e5c9](https://github.com/vendure-ecommerce/vendure/commit/e37e5c9)), closes [#493](https://github.com/vendure-ecommerce/vendure/issues/493)

## 0.16.0 (2020-10-09)


#### Fixes

* **admin-ui-plugin** Fix default languages list ([be3bf29](https://github.com/vendure-ecommerce/vendure/commit/be3bf29))
* **admin-ui** Allow Fulfillments to be created based on state machine ([5b99f59](https://github.com/vendure-ecommerce/vendure/commit/5b99f59)), closes [#471](https://github.com/vendure-ecommerce/vendure/issues/471)
* **admin-ui** Correctly handle missing shipping checker/calculator defs ([460963a](https://github.com/vendure-ecommerce/vendure/commit/460963a))
* **core** Add check on order PaymentSettled transition ([141d650](https://github.com/vendure-ecommerce/vendure/commit/141d650))
* **core** Correctly transition Order on Fulfillment transitions ([9b2c088](https://github.com/vendure-ecommerce/vendure/commit/9b2c088))
* **core** Fix error when using channelId with getEntityOrThrow method ([65c50d4](https://github.com/vendure-ecommerce/vendure/commit/65c50d4))
* **core** Fix NativeAuthenticationStrategy user lookup ([b275c20](https://github.com/vendure-ecommerce/vendure/commit/b275c20)), closes [#486](https://github.com/vendure-ecommerce/vendure/issues/486)

#### Features

* **admin-ui** Display error messages on failed Asset uploads ([5aebcd6](https://github.com/vendure-ecommerce/vendure/commit/5aebcd6))
* **admin-ui** Handle Fulfillments state from Order detail view ([7883a7a](https://github.com/vendure-ecommerce/vendure/commit/7883a7a)), closes [#426](https://github.com/vendure-ecommerce/vendure/issues/426)
* **admin-ui** Make order history collapsible ([db37707](https://github.com/vendure-ecommerce/vendure/commit/db37707))
* **admin-ui** Update Apollo Client to v3 ([4e628a6](https://github.com/vendure-ecommerce/vendure/commit/4e628a6))
* **admin-ui** Update to Angular v10 & Clarity v4 ([57c4106](https://github.com/vendure-ecommerce/vendure/commit/57c4106))
* **core** Allow public & private Payment metadata ([3f72311](https://github.com/vendure-ecommerce/vendure/commit/3f72311)), closes [#476](https://github.com/vendure-ecommerce/vendure/issues/476)
* **core** Create improved error-handling infrastructure ([0c0a7b2](https://github.com/vendure-ecommerce/vendure/commit/0c0a7b2)), closes [#437](https://github.com/vendure-ecommerce/vendure/issues/437)
* **core** Create OrderCodeStrategy for more control over order codes ([30dc639](https://github.com/vendure-ecommerce/vendure/commit/30dc639)), closes [#452](https://github.com/vendure-ecommerce/vendure/issues/452)
* **core** Create Transaction decorator ([4040089](https://github.com/vendure-ecommerce/vendure/commit/4040089))
* **core** Create unit-of-work infrastructure for transactions ([82b54e6](https://github.com/vendure-ecommerce/vendure/commit/82b54e6)), closes [#242](https://github.com/vendure-ecommerce/vendure/issues/242)
* **core** Implement a state machine for Fulfillments ([70a7665](https://github.com/vendure-ecommerce/vendure/commit/70a7665))
* **core** Improved error handling for Admin API mutations ([af49054](https://github.com/vendure-ecommerce/vendure/commit/af49054)), closes [#437](https://github.com/vendure-ecommerce/vendure/issues/437)
* **core** Improved error handling for ShopAPI order resolvers ([156c9e2](https://github.com/vendure-ecommerce/vendure/commit/156c9e2)), closes [#437](https://github.com/vendure-ecommerce/vendure/issues/437)
* **core** Make Customers ChannelAware ([0f73473](https://github.com/vendure-ecommerce/vendure/commit/0f73473))
* **core** Run all mutations within transactions ([b40209e](https://github.com/vendure-ecommerce/vendure/commit/b40209e)), closes [#242](https://github.com/vendure-ecommerce/vendure/issues/242)
* **core** Update GraphQL to v15 ([177a14f](https://github.com/vendure-ecommerce/vendure/commit/177a14f))
* **core** Update to TypeScript v4.0.3 ([e1ce807](https://github.com/vendure-ecommerce/vendure/commit/e1ce807))
* **core** Update TypeORM to 0.2.28 ([d280466](https://github.com/vendure-ecommerce/vendure/commit/d280466))
* **core** Use transaction to update Fulfillment state ([8232ddc](https://github.com/vendure-ecommerce/vendure/commit/8232ddc))
* **email-plugin** Provide an Injector instance to .loadData function ([e2665a7](https://github.com/vendure-ecommerce/vendure/commit/e2665a7))
* **testing** Create helpers for testing of ErrorResult union types ([6ef6045](https://github.com/vendure-ecommerce/vendure/commit/6ef6045)), closes [#437](https://github.com/vendure-ecommerce/vendure/issues/437)


### BREAKING CHANGE

* All Vendure packages are now built on TypeScript v4.0.3. With new TypeScript versions come the possibility that its improved type-checking abilities will uncover new errors that it had not detected previously.
* If you are using the `.loadData()` method of an EmailEventHandler, the callback signature has changed to provide an instance of the Injector class, rather than an `inject()` function.
* The `orderOptions.generateOrderCode` config option has been replaced with `orderOptions.orderCodeStrategy`. This change allows order code generation to take advantage of the `InjectableStrategy` interface, i.e. to be able to inject Vendure services and other providers (e.g. the database connection). See the `OrderCodeStrategy` documentation for guidance on how to use the new API.
* The `Payment.metadata` field is not private by default, meaning that it can only be read via the Admin API. Data required in the Shop API can be accessed by putting it in a field named `public`. Example: `Payment.metadata.public.redirectUrl`
* The TypeORM `Connection` should no longer be directly used. Instead, inject the new `TransactionalConnection` class, which wraps the TypeORM connection and enables database transactions to be used in conjunction with the new `@Transaction` decorator.

   The `getEntityOrThrow()` and `findOneInChannel()` helper functions have been deprecated and replaced by methods with the same name (but slightly different signature) on the TransactionalConnection class.
* The upgrade of the Admin UI to Angular v10 means that if you are using the `@vendure/ui-devkit` package to compile an extended version of the Admin UI, you need to have at least TypeScript v3.9.2 installed.
## <small>0.15.2 (2020-09-30)</small>


#### Fixes

* **admin-ui** Allow cancellation from custom Order states ([117264f](https://github.com/vendure-ecommerce/vendure/commit/117264f)), closes [#472](https://github.com/vendure-ecommerce/vendure/issues/472)
* **admin-ui** Fix address dialog issues ([0d61f47](https://github.com/vendure-ecommerce/vendure/commit/0d61f47)), closes [#463](https://github.com/vendure-ecommerce/vendure/issues/463)
* **admin-ui** Fix asset drag/drop support in safari ([55304c5](https://github.com/vendure-ecommerce/vendure/commit/55304c5))
* **core** Fix handling of JobRecord ids when using UUID strategy ([30e6e70](https://github.com/vendure-ecommerce/vendure/commit/30e6e70)), closes [#478](https://github.com/vendure-ecommerce/vendure/issues/478)
* **email-plugin** Include shipping method in order receipt handler ([ea907a4](https://github.com/vendure-ecommerce/vendure/commit/ea907a4)), closes [#473](https://github.com/vendure-ecommerce/vendure/issues/473)

#### Features

* **core** Add `totalQuantity` field to Order type ([829ac96](https://github.com/vendure-ecommerce/vendure/commit/829ac96)), closes [#465](https://github.com/vendure-ecommerce/vendure/issues/465)
* **elasticsearch-plugin** Allow full client options to be passed ([c686509](https://github.com/vendure-ecommerce/vendure/commit/c686509)), closes [#474](https://github.com/vendure-ecommerce/vendure/issues/474)

## <small>0.15.1 (2020-09-09)</small>


#### Features

* **admin-ui** Customer address editor opens in modal ([0a4d460](https://github.com/vendure-ecommerce/vendure/commit/0a4d460))
* **create** Make distinction between MySQL & MariaDB ([a31bbf8](https://github.com/vendure-ecommerce/vendure/commit/a31bbf8))

#### Fixes

* **admin-ui** Allow removing last item from ProductSelectorFromInput ([21db8cf](https://github.com/vendure-ecommerce/vendure/commit/21db8cf))
* **admin-ui** Correctly update product list after deletion ([5587144](https://github.com/vendure-ecommerce/vendure/commit/5587144)), closes [#453](https://github.com/vendure-ecommerce/vendure/issues/453)
* **admin-ui** Display custom fields in Address form ([f074f65](https://github.com/vendure-ecommerce/vendure/commit/f074f65)), closes [#455](https://github.com/vendure-ecommerce/vendure/issues/455)
* **core** Add resolver for Product.facetValues ([163a32f](https://github.com/vendure-ecommerce/vendure/commit/163a32f)), closes [#449](https://github.com/vendure-ecommerce/vendure/issues/449)
* **core** Add warning for list defaults in mysql ([d47becc](https://github.com/vendure-ecommerce/vendure/commit/d47becc))
* **core** Correctly parse fragments defined before operations ([44a9ab9](https://github.com/vendure-ecommerce/vendure/commit/44a9ab9)), closes [#459](https://github.com/vendure-ecommerce/vendure/issues/459)
* **core** Fix only_full_group_by issues in MySQL search ([188cfaa](https://github.com/vendure-ecommerce/vendure/commit/188cfaa))

## 0.15.0 (2020-08-27)


#### Fixes

* **admin-ui** Dynamically set yearRange of DatetimePickerComponent ([c66b10b](https://github.com/vendure-ecommerce/vendure/commit/c66b10b)), closes [#425](https://github.com/vendure-ecommerce/vendure/issues/425)
* **admin-ui** Fix channel header when using bearer auth ([fa29805](https://github.com/vendure-ecommerce/vendure/commit/fa29805))
* **admin-ui** Fix filtering of product variant table ([121b6fc](https://github.com/vendure-ecommerce/vendure/commit/121b6fc))
* **admin-ui** Prevent clipping of product selector overlay ([7f9b6d7](https://github.com/vendure-ecommerce/vendure/commit/7f9b6d7))
* **admin-ui** Refetch orders list on channel change ([ffa5615](https://github.com/vendure-ecommerce/vendure/commit/ffa5615))
* **asset-server-plugin** Make nativeS3Configuration optional ([650977d](https://github.com/vendure-ecommerce/vendure/commit/650977d))
* **core** Correct shipping calculator typing ([9052845](https://github.com/vendure-ecommerce/vendure/commit/9052845))
* **core** Correct shipping calculator typing ([4a8e9ed](https://github.com/vendure-ecommerce/vendure/commit/4a8e9ed))
* **core** Correct typing of GraphQL ID type in generated code ([dc7b303](https://github.com/vendure-ecommerce/vendure/commit/dc7b303)), closes [#410](https://github.com/vendure-ecommerce/vendure/issues/410)
* **core** Correctly calculate item price discount actions ([06bb780](https://github.com/vendure-ecommerce/vendure/commit/06bb780))
* **core** Correctly handle adjustOrderLine with quantity 0 ([7381d3d](https://github.com/vendure-ecommerce/vendure/commit/7381d3d)), closes [#435](https://github.com/vendure-ecommerce/vendure/issues/435)
* **core** Ignore deleted variants when validating options ([9c242f8](https://github.com/vendure-ecommerce/vendure/commit/9c242f8)), closes [#412](https://github.com/vendure-ecommerce/vendure/issues/412)
* **core** Make AssetOptions fields optional ([698011e](https://github.com/vendure-ecommerce/vendure/commit/698011e))

#### Features

* **admin-ui** Add Brazilian Portuguese translations ([7673353](https://github.com/vendure-ecommerce/vendure/commit/7673353))
* **admin-ui** Add password form input ([6c909b3](https://github.com/vendure-ecommerce/vendure/commit/6c909b3)), closes [#445](https://github.com/vendure-ecommerce/vendure/issues/445)
* **admin-ui** Add pt_BR to default translations ([5da5b4e](https://github.com/vendure-ecommerce/vendure/commit/5da5b4e))
* **admin-ui** Implement list types for ConfigurableOperationDef args ([4c7467b](https://github.com/vendure-ecommerce/vendure/commit/4c7467b)), closes [#414](https://github.com/vendure-ecommerce/vendure/issues/414)
* **admin-ui** Implement list types for custom fields ([e72f0b3](https://github.com/vendure-ecommerce/vendure/commit/e72f0b3)), closes [#416](https://github.com/vendure-ecommerce/vendure/issues/416)
* **admin-ui** Implement pagination & filtering of product variants ([e2b445b](https://github.com/vendure-ecommerce/vendure/commit/e2b445b)), closes [#411](https://github.com/vendure-ecommerce/vendure/issues/411)
* **admin-ui** Implement product selector custom form input ([f687f49](https://github.com/vendure-ecommerce/vendure/commit/f687f49)), closes [#400](https://github.com/vendure-ecommerce/vendure/issues/400)
* **admin-ui** Unify CustomFieldControl type with FormInputComponent ([9e22347](https://github.com/vendure-ecommerce/vendure/commit/9e22347)), closes [#415](https://github.com/vendure-ecommerce/vendure/issues/415)
* **core** Add `productVariant` query to Admin API ([72b6ccd](https://github.com/vendure-ecommerce/vendure/commit/72b6ccd))
* **core** Add removeAllOrderLines mutation in Shop API  ([841e352](https://github.com/vendure-ecommerce/vendure/commit/841e352)), closes [#430](https://github.com/vendure-ecommerce/vendure/issues/430)
* **core** Add support for list types in ConfigurableOperationDefs ([6698195](https://github.com/vendure-ecommerce/vendure/commit/6698195)), closes [#414](https://github.com/vendure-ecommerce/vendure/issues/414)
* **core** Implement "containsProducts" PromotionCondition ([688d304](https://github.com/vendure-ecommerce/vendure/commit/688d304)), closes [#400](https://github.com/vendure-ecommerce/vendure/issues/400)
* **core** Implement customer group form input ([177866e](https://github.com/vendure-ecommerce/vendure/commit/177866e)), closes [#400](https://github.com/vendure-ecommerce/vendure/issues/400)
* **core** Implement customer group promotion condition ([fd70448](https://github.com/vendure-ecommerce/vendure/commit/fd70448)), closes [#400](https://github.com/vendure-ecommerce/vendure/issues/400)
* **core** Implement product discount promotion action ([7da0d46](https://github.com/vendure-ecommerce/vendure/commit/7da0d46)), closes [#400](https://github.com/vendure-ecommerce/vendure/issues/400)
* **core** Implement search by collection slug ([a4cbdbb](https://github.com/vendure-ecommerce/vendure/commit/a4cbdbb)), closes [#405](https://github.com/vendure-ecommerce/vendure/issues/405)
* **core** Improve type-safety of custom ui input config ([d0cc096](https://github.com/vendure-ecommerce/vendure/commit/d0cc096)), closes [#414](https://github.com/vendure-ecommerce/vendure/issues/414)
* **core** Make Orders ChannelAware ([9bb5750](https://github.com/vendure-ecommerce/vendure/commit/9bb5750)), closes [#440](https://github.com/vendure-ecommerce/vendure/issues/440)
* **core** Support list types for custom fields ([1fa3cf1](https://github.com/vendure-ecommerce/vendure/commit/1fa3cf1)), closes [#416](https://github.com/vendure-ecommerce/vendure/issues/416)
* **elasticsearch-plugin** Implement search by collection slug ([cbfd499](https://github.com/vendure-ecommerce/vendure/commit/cbfd499)), closes [#405](https://github.com/vendure-ecommerce/vendure/issues/405)


### BREAKING CHANGE

* If you use custom field controls in the Admin UI, you'll need to slightly modify the component class: the `customFieldConfig` property has been renamed to `config` and a required `readonly: boolean;` field should be added. This is part of an effort to unify the way custom input components work across different parts of the Admin UI.
* Orders are now channel-aware which requires a non-destructive DB migration to apply the schema changes required for this relation. In addition, this migration is required to relate existing Orders to the default Channel:
  ```TypeScript
  // Assuming the ID of the default Channel is 1. If you are using a UUID strategy,
  // replace 1 with the ID of the default channel.
  await queryRunner.query(
    'INSERT INTO `order_channels_channel` (orderId, channelId) SELECT id, 1 FROM `order`',
    undefined,
  );
  ```
* The `'facetValueIds'` type has been removed from the `ConfigArgType` type, and replaced by `'ID'` and the `list` option. This change only affects you if you have created custom CollectionFilters of PromotionActions/Conditions using the `'facetValueIds'` type for an argument.
* The `ID` type in `@vendure/common/lib/generated-types` & `@vendure/common/lib/generated-shop-types` is now correctly typed as `string | number`, whereas previously it was `string`. If you are using any generated types in your plugin code, this may lead to TypeScript compiler errors which will need to be corrected.
## <small>0.14.1 (2020-08-18)</small>


#### Fixes

* **admin-ui** Fix notification for customer verification email ([6c76ebe](https://github.com/vendure-ecommerce/vendure/commit/6c76ebe)), closes [#438](https://github.com/vendure-ecommerce/vendure/issues/438)
* **admin-ui** Make emailAddress required in CustomerDetail form ([2a9ee2e](https://github.com/vendure-ecommerce/vendure/commit/2a9ee2e)), closes [#438](https://github.com/vendure-ecommerce/vendure/issues/438)
* **admin-ui** Update facets cache after deletion ([f4eec6a](https://github.com/vendure-ecommerce/vendure/commit/f4eec6a)), closes [#424](https://github.com/vendure-ecommerce/vendure/issues/424)
* **core** Correct shipping calculator typing ([18f5bcd](https://github.com/vendure-ecommerce/vendure/commit/18f5bcd))
* **core** Correctly handle aliases when transforming Asset urls ([18bbeee](https://github.com/vendure-ecommerce/vendure/commit/18bbeee)), closes [#417](https://github.com/vendure-ecommerce/vendure/issues/417)
* **email-plugin** Add filter of emailVerificationHandler ([a68b18e](https://github.com/vendure-ecommerce/vendure/commit/a68b18e)), closes [#438](https://github.com/vendure-ecommerce/vendure/issues/438)

#### Features

* **admin-ui** Add Address custom fields to order detail ([c4ca2d0](https://github.com/vendure-ecommerce/vendure/commit/c4ca2d0)), closes [#409](https://github.com/vendure-ecommerce/vendure/issues/409)
* **admin-ui** Restrict Asset input based on permitted file types ([dc668d9](https://github.com/vendure-ecommerce/vendure/commit/dc668d9)), closes [#421](https://github.com/vendure-ecommerce/vendure/issues/421)
* **asset-server-plugin** Extended S3Config to accept aws-sdk configuration properties ([ce903ad](https://github.com/vendure-ecommerce/vendure/commit/ce903ad))
* **core** Add Address custom fields to OrderAddress ([6f35493](https://github.com/vendure-ecommerce/vendure/commit/6f35493)), closes [#409](https://github.com/vendure-ecommerce/vendure/issues/409)
* **core** Custom field length configuration for localeString ([9fab7e8](https://github.com/vendure-ecommerce/vendure/commit/9fab7e8))
* **core** Expose all cookie options in VendureConfig ([ad089ea](https://github.com/vendure-ecommerce/vendure/commit/ad089ea)), closes [#436](https://github.com/vendure-ecommerce/vendure/issues/436)
* **core** Expose permitted Asset types in ServerConfig type ([66abc7f](https://github.com/vendure-ecommerce/vendure/commit/66abc7f)), closes [#421](https://github.com/vendure-ecommerce/vendure/issues/421)
* **core** Implement permitted mime types for Assets ([272b2db](https://github.com/vendure-ecommerce/vendure/commit/272b2db)), closes [#421](https://github.com/vendure-ecommerce/vendure/issues/421)
* **core** Validate DB table structure on worker bootstrap ([c1ccaa1](https://github.com/vendure-ecommerce/vendure/commit/c1ccaa1))
* **core** Verbose query error logging (#433) ([8cf7483](https://github.com/vendure-ecommerce/vendure/commit/8cf7483)), closes [#433](https://github.com/vendure-ecommerce/vendure/issues/433)

## 0.14.0 (2020-07-20)


#### Fixes

* **admin-ui** Fix error when creating new Customer ([edc56f8](https://github.com/vendure-ecommerce/vendure/commit/edc56f8))
* **admin-ui** Fix ts error introduced by ShippingMethods custom fields ([8c38ad1](https://github.com/vendure-ecommerce/vendure/commit/8c38ad1))
* **admin-ui** Save custom fields in the Customer detail view ([3c45b16](https://github.com/vendure-ecommerce/vendure/commit/3c45b16)), closes [#387](https://github.com/vendure-ecommerce/vendure/issues/387)
* **core** Correct handling of multiple session for same user ([2c42305](https://github.com/vendure-ecommerce/vendure/commit/2c42305))
* **core** Correctly call PaymentMethodHandler.onStateTransitionStart ([143e62f](https://github.com/vendure-ecommerce/vendure/commit/143e62f))
* **core** Define cascade behaviour for featured assets ([3f0c79b](https://github.com/vendure-ecommerce/vendure/commit/3f0c79b))
* **core** Fix bug where session user in cache would get removed ([ebec0f0](https://github.com/vendure-ecommerce/vendure/commit/ebec0f0))
* **core** Fix error when de-serializing a RequestContext without expiry ([a1e03fd](https://github.com/vendure-ecommerce/vendure/commit/a1e03fd))
* **core** Prevent countryCode exception when adding payment to order ([49c2ad4](https://github.com/vendure-ecommerce/vendure/commit/49c2ad4))

#### Features

* **admin-ui-plugin** Support `loginUrl` option ([5a95476](https://github.com/vendure-ecommerce/vendure/commit/5a95476))
* **admin-ui** Add `loginUrl` option to support external login pages ([2745146](https://github.com/vendure-ecommerce/vendure/commit/2745146)), closes [#215](https://github.com/vendure-ecommerce/vendure/issues/215)
* **admin-ui** Add ability to delete administrator from admin list ([e217ce0](https://github.com/vendure-ecommerce/vendure/commit/e217ce0)), closes [#384](https://github.com/vendure-ecommerce/vendure/issues/384)
* **admin-ui** Display auth strategy in customer history ([bdfc43d](https://github.com/vendure-ecommerce/vendure/commit/bdfc43d))
* **admin-ui** Display customer last login time ([0f9dd1c](https://github.com/vendure-ecommerce/vendure/commit/0f9dd1c))
* **admin-ui** Enable updating of Order custom fields ([5bbd80b](https://github.com/vendure-ecommerce/vendure/commit/5bbd80b)), closes [#404](https://github.com/vendure-ecommerce/vendure/issues/404)
* **admin-ui** Implement multiple asset deletion ([b2f3f08](https://github.com/vendure-ecommerce/vendure/commit/b2f3f08)), closes [#380](https://github.com/vendure-ecommerce/vendure/issues/380)
* **admin-ui** Implement order process state chart view ([7283258](https://github.com/vendure-ecommerce/vendure/commit/7283258))
* **admin-ui** Improve multi-selection in Asset gallery component ([a4e132a](https://github.com/vendure-ecommerce/vendure/commit/a4e132a)), closes [#380](https://github.com/vendure-ecommerce/vendure/issues/380)
* **admin-ui** Support custom state transitions from Order detail view ([1d2ba31](https://github.com/vendure-ecommerce/vendure/commit/1d2ba31))
* **core** Add `ProductOption.group` field & resolver ([f20e108](https://github.com/vendure-ecommerce/vendure/commit/f20e108)), closes [#378](https://github.com/vendure-ecommerce/vendure/issues/378)
* **core** Add `ProductVariant.product` field & resolver ([0334848](https://github.com/vendure-ecommerce/vendure/commit/0334848)), closes [#378](https://github.com/vendure-ecommerce/vendure/issues/378)
* **core** Add admin helpers to ExternalAuthenticationService ([3456ffb](https://github.com/vendure-ecommerce/vendure/commit/3456ffb))
* **core** Add custom fields to registerCustomerAccount mutation ([be1f200](https://github.com/vendure-ecommerce/vendure/commit/be1f200)), closes [#388](https://github.com/vendure-ecommerce/vendure/issues/388)
* **core** Allow all CustomOrderProcess handlers to be async functions ([5d67d06](https://github.com/vendure-ecommerce/vendure/commit/5d67d06))
* **core** Enable custom fields on ShippingMethod entity (#406) ([fbc36ab](https://github.com/vendure-ecommerce/vendure/commit/fbc36ab)), closes [#406](https://github.com/vendure-ecommerce/vendure/issues/406) [#402](https://github.com/vendure-ecommerce/vendure/issues/402)
* **core** Export ExternalAuthenticationService ([c3ed2cd](https://github.com/vendure-ecommerce/vendure/commit/c3ed2cd))
* **core** Expose `nextStates` on Order type in Admin API ([ece0bbe](https://github.com/vendure-ecommerce/vendure/commit/ece0bbe))
* **core** Expose order state machine config via `serverConfig` type ([0a77438](https://github.com/vendure-ecommerce/vendure/commit/0a77438))
* **core** Expose User.authenticationMethod in GraphQL APIs ([96f923a](https://github.com/vendure-ecommerce/vendure/commit/96f923a))
* **core** Implement `authenticate` mutation for Admin API ([357f878](https://github.com/vendure-ecommerce/vendure/commit/357f878))
* **core** Implement `deleteAdministrator` mutation ([dc82b2c](https://github.com/vendure-ecommerce/vendure/commit/dc82b2c)), closes [#384](https://github.com/vendure-ecommerce/vendure/issues/384)
* **core** Implement `setOrderCustomFields` in Admin API ([ad89fc9](https://github.com/vendure-ecommerce/vendure/commit/ad89fc9)), closes [#404](https://github.com/vendure-ecommerce/vendure/issues/404)
* **core** Implement `setOrderCustomFields` in Shop API ([3a12dc5](https://github.com/vendure-ecommerce/vendure/commit/3a12dc5)), closes [#404](https://github.com/vendure-ecommerce/vendure/issues/404)
* **core** Implement `transitionOrderToState` in Admin API ([3196b52](https://github.com/vendure-ecommerce/vendure/commit/3196b52))
* **core** Implement configurable session caching ([09a432d](https://github.com/vendure-ecommerce/vendure/commit/09a432d)), closes [#394](https://github.com/vendure-ecommerce/vendure/issues/394)
* **core** Implement deleteAssets mutation ([6f12014](https://github.com/vendure-ecommerce/vendure/commit/6f12014)), closes [#380](https://github.com/vendure-ecommerce/vendure/issues/380)
* **core** Improve customization of order process ([0011ea9](https://github.com/vendure-ecommerce/vendure/commit/0011ea9)), closes [#401](https://github.com/vendure-ecommerce/vendure/issues/401)
* **core** Include auth strategy name in AttemptedLoginEvent ([b83f1fe](https://github.com/vendure-ecommerce/vendure/commit/b83f1fe))
* **core** Log error variables as well as message ([de25bdb](https://github.com/vendure-ecommerce/vendure/commit/de25bdb))
* **core** More flexible customer registration flow ([92350e6](https://github.com/vendure-ecommerce/vendure/commit/92350e6)), closes [#392](https://github.com/vendure-ecommerce/vendure/issues/392)
* **core** More flexible handling of shipping calculations ([d166c08](https://github.com/vendure-ecommerce/vendure/commit/d166c08)), closes [#397](https://github.com/vendure-ecommerce/vendure/issues/397) [#398](https://github.com/vendure-ecommerce/vendure/issues/398)
* **core** Record lastLogin date on authenticate ([39c743b](https://github.com/vendure-ecommerce/vendure/commit/39c743b))
* **core** Record strategy used to register in Customer history ([5504044](https://github.com/vendure-ecommerce/vendure/commit/5504044))
* **core** Rework User/auth implementation to enable 3rd party auth ([f12b96f](https://github.com/vendure-ecommerce/vendure/commit/f12b96f)), closes [#215](https://github.com/vendure-ecommerce/vendure/issues/215)
* **core** Store authenticationStrategy on an AuthenticatedSession ([e737c56](https://github.com/vendure-ecommerce/vendure/commit/e737c56))
* **email-plugin** Use new User model in email handlers ([16dd884](https://github.com/vendure-ecommerce/vendure/commit/16dd884))


### BREAKING CHANGE

* (email-plugin) The default email handlers have been updated to use the new User model, and as a result the email templates "email-verification", "email-address-change" and "password-reset" should be updated to remove the "user" object, so `{{ user.verificationToken }}` becomes `{{ verificationToken }}` and so on.
* A new `AuthenticationMethod` entity has been added, with a one-to-many relation to the existing User entities. Several properties that were formerly part of the User entity have now moved to the `AuthenticationMethod` entity. Upgrading with therefore require a careful database migration to ensure that no data is lost. On release, a migration script will be provided for this.
* Some ON DELETE behaviour was incorrectly defined in the database schema, and has how been fixed. This will require a non-destructive migration.
* The `AttemptedLoginEvent.identifier` property is now optional, since it will only be sent when using the "native" authentication strategy. Code that listens for this event should now check that the `identifier` property is defined before attempting to use it.
* The `RequestContext.session` object is no longer a `Session` entity. Instead it is a new type, `SerializedSession` which contains a subset of data pertaining to the current session. For example, if you have custom code which references `ctx.session.activeOrder` you will now get an error, since `activeOrder` does not exist on `SerializedSession`. Instead you would use `SerializedSession.activeOrderId` and then lookup the order in a separate query.

The reason for this change is to enable efficient session caching.
* The Administrator entity has a new `deletedAt` field, which will require a non-destructive database migration.
* The way custom Order states are defined has changed. The `VendureConfig.orderOptions.process` property now accepts an **array** of objects implementing the `CustomerOrderProcess` interface. This interface is more-or-less the same as the old `OrderProcessOptions` object, but the use of an array now allows better composition, and since `CustomerOrderProcess` inherits from `InjectableStrategy`, this means providers can now be injected and used in the custom order process logic.
## <small>0.13.1 (2020-06-30)</small>


#### Features

* **admin-ui** Display billing address in Order detail view ([c8992a5](https://github.com/vendure-ecommerce/vendure/commit/c8992a5)), closes [#372](https://github.com/vendure-ecommerce/vendure/issues/372)
* **core** Add setOrderBillingAddress mutation to Shop API ([83347b2](https://github.com/vendure-ecommerce/vendure/commit/83347b2)), closes [#372](https://github.com/vendure-ecommerce/vendure/issues/372)
* **core** Allow phoneNumber in registerCustomerAccount mutation ([2c710b9](https://github.com/vendure-ecommerce/vendure/commit/2c710b9)), closes [#389](https://github.com/vendure-ecommerce/vendure/issues/389)

#### Fixes

* **admin-ui** Add custom field controls to ProductOption dialog ([4678360](https://github.com/vendure-ecommerce/vendure/commit/4678360)), closes [#382](https://github.com/vendure-ecommerce/vendure/issues/382)
* **admin-ui** Correctly render channels in Role detail view ([cfb3c03](https://github.com/vendure-ecommerce/vendure/commit/cfb3c03))
* **admin-ui** Only check jobs if Admin has ReadSettings permission ([daca6b6](https://github.com/vendure-ecommerce/vendure/commit/daca6b6)), closes [#383](https://github.com/vendure-ecommerce/vendure/issues/383)
* **core** Correctly resolve activeCustomer order lines ([56449b8](https://github.com/vendure-ecommerce/vendure/commit/56449b8)), closes [#374](https://github.com/vendure-ecommerce/vendure/issues/374) [#375](https://github.com/vendure-ecommerce/vendure/issues/375)
* **core** Implement field resolvers for Facet & FacetValue ([7a4d046](https://github.com/vendure-ecommerce/vendure/commit/7a4d046))

## 0.13.0 (2020-06-12)


#### Fixes

* **admin-ui-plugin** Correct handling of missing config file ([41f9085](https://github.com/vendure-ecommerce/vendure/commit/41f9085))
* **admin-ui** Fix duplicated "Adding Items" filter option in Order list ([2da3c16](https://github.com/vendure-ecommerce/vendure/commit/2da3c16))
* **admin-ui** Fix facet detail form losing input data ([2430f30](https://github.com/vendure-ecommerce/vendure/commit/2430f30)), closes [#353](https://github.com/vendure-ecommerce/vendure/issues/353)
* **core** Attach Order to PaymentStateTransitionEvent on create ([1c57462](https://github.com/vendure-ecommerce/vendure/commit/1c57462)), closes [#371](https://github.com/vendure-ecommerce/vendure/issues/371)
* **core** Correctly serialize job queue data payloads ([1a9ac07](https://github.com/vendure-ecommerce/vendure/commit/1a9ac07))
* **core** Fix collection.parent resolver in Postgres ([f3feb7c](https://github.com/vendure-ecommerce/vendure/commit/f3feb7c)), closes [#361](https://github.com/vendure-ecommerce/vendure/issues/361)
* **core** Fix cookie auth for custom controller routes ([e36b9db](https://github.com/vendure-ecommerce/vendure/commit/e36b9db)), closes [#362](https://github.com/vendure-ecommerce/vendure/issues/362)
* **core** Fix error when applying multiple promotions ([c807d32](https://github.com/vendure-ecommerce/vendure/commit/c807d32))
* **core** Fix findByIdsInChannel to take ids into account (#365) ([dd4bbc9](https://github.com/vendure-ecommerce/vendure/commit/dd4bbc9)), closes [#365](https://github.com/vendure-ecommerce/vendure/issues/365)
* **core** Fix removal of order item promotions ([f385d69](https://github.com/vendure-ecommerce/vendure/commit/f385d69))
* **core** Fix typo in "transitions" config option name ([41b07eb](https://github.com/vendure-ecommerce/vendure/commit/41b07eb))
* **email-plugin** Do not HTML-escape "from" address ([699c796](https://github.com/vendure-ecommerce/vendure/commit/699c796)), closes [#363](https://github.com/vendure-ecommerce/vendure/issues/363)
* **email-plugin** Fix dev mailbox when trailing slash omitted ([5372561](https://github.com/vendure-ecommerce/vendure/commit/5372561)), closes [#355](https://github.com/vendure-ecommerce/vendure/issues/355)

#### Features

* **admin-ui-plugin** Enable traditional & simplified Chinese trans ([43ef874](https://github.com/vendure-ecommerce/vendure/commit/43ef874))
* **admin-ui** Add 'groups' field to Customer type in Admin API ([9635677](https://github.com/vendure-ecommerce/vendure/commit/9635677)), closes [#330](https://github.com/vendure-ecommerce/vendure/issues/330)
* **admin-ui** Add Collection slug to detail form ([700f4d6](https://github.com/vendure-ecommerce/vendure/commit/700f4d6)), closes [#335](https://github.com/vendure-ecommerce/vendure/issues/335)
* **admin-ui** Add phoneNumber to customer detail form ([768c838](https://github.com/vendure-ecommerce/vendure/commit/768c838)), closes [#359](https://github.com/vendure-ecommerce/vendure/issues/359)
* **admin-ui** Add Traditional Chinese for i18n-Message ([7160048](https://github.com/vendure-ecommerce/vendure/commit/7160048))
* **admin-ui** Allow groups admin from CustomerDetailComponent ([8dca9a3](https://github.com/vendure-ecommerce/vendure/commit/8dca9a3)), closes [#330](https://github.com/vendure-ecommerce/vendure/issues/330)
* **admin-ui** Create CustomerGroup UI components & routes ([90b38a5](https://github.com/vendure-ecommerce/vendure/commit/90b38a5)), closes [#330](https://github.com/vendure-ecommerce/vendure/issues/330)
* **admin-ui** Display customer history in detail view ([8eea7d6](https://github.com/vendure-ecommerce/vendure/commit/8eea7d6)), closes [#343](https://github.com/vendure-ecommerce/vendure/issues/343)
* **admin-ui** Enable deletion of Customers from customer list ([d1b0b9e](https://github.com/vendure-ecommerce/vendure/commit/d1b0b9e)), closes [#360](https://github.com/vendure-ecommerce/vendure/issues/360)
* **admin-ui** Implement UI for updating, deleting notes ([ef5eddf](https://github.com/vendure-ecommerce/vendure/commit/ef5eddf)), closes [#310](https://github.com/vendure-ecommerce/vendure/issues/310)
* **core** Add "slug" field to Collection entity ([5b4d3db](https://github.com/vendure-ecommerce/vendure/commit/5b4d3db)), closes [#335](https://github.com/vendure-ecommerce/vendure/issues/335)
* **core** Add "slug" field to CollectionBreadcrumb type ([97ffb1d](https://github.com/vendure-ecommerce/vendure/commit/97ffb1d))
* **core** Create customer history entries for groups ([4620730](https://github.com/vendure-ecommerce/vendure/commit/4620730)), closes [#343](https://github.com/vendure-ecommerce/vendure/issues/343)
* **core** Enable Collection query by slug ([d5586bc](https://github.com/vendure-ecommerce/vendure/commit/d5586bc)), closes [#335](https://github.com/vendure-ecommerce/vendure/issues/335)
* **core** Enable users to specify superadmin credentials ([0f0a1ad](https://github.com/vendure-ecommerce/vendure/commit/0f0a1ad)), closes [#279](https://github.com/vendure-ecommerce/vendure/issues/279)
* **core** Implement Customer history tracking ([ccedf7c](https://github.com/vendure-ecommerce/vendure/commit/ccedf7c)), closes [#343](https://github.com/vendure-ecommerce/vendure/issues/343)
* **core** Implement CustomerGroup queries & mutations ([13342c0](https://github.com/vendure-ecommerce/vendure/commit/13342c0)), closes [#330](https://github.com/vendure-ecommerce/vendure/issues/330)
* **core** Implement editing & deletion of Order/Customer notes ([90bacf5](https://github.com/vendure-ecommerce/vendure/commit/90bacf5)), closes [#310](https://github.com/vendure-ecommerce/vendure/issues/310)
* **core** Improved control over TypeORM query logging ([3168e54](https://github.com/vendure-ecommerce/vendure/commit/3168e54)), closes [#368](https://github.com/vendure-ecommerce/vendure/issues/368)
* **core** Search by facetValueId allows operator argument ([2eca24e](https://github.com/vendure-ecommerce/vendure/commit/2eca24e)), closes [#357](https://github.com/vendure-ecommerce/vendure/issues/357)
* **core** Update LanguageCode enum to support common regional variants ([8daee55](https://github.com/vendure-ecommerce/vendure/commit/8daee55)), closes [#356](https://github.com/vendure-ecommerce/vendure/issues/356)
* **elasticsearch-plugin** Added mapQuery option ([a6de120](https://github.com/vendure-ecommerce/vendure/commit/a6de120)), closes [#364](https://github.com/vendure-ecommerce/vendure/issues/364)
* **elasticsearch-plugin** Search by facetValueId allows operator arg ([f7f7e5c](https://github.com/vendure-ecommerce/vendure/commit/f7f7e5c)), closes [#357](https://github.com/vendure-ecommerce/vendure/issues/357)
* **email-plugin** Enable logging for SMTP transport ([5ed6c24](https://github.com/vendure-ecommerce/vendure/commit/5ed6c24)), closes [#369](https://github.com/vendure-ecommerce/vendure/issues/369)


### BREAKING CHANGE

* A DB migration will be required due to some additions to the schema related to Customer history entries.
* A new "slug" field has been added to the CollectionTranslation entity, requiring a DB migration. Also, when creating a new Collection via the `createCollection` mutation, each translation must include a slug.
## <small>0.12.5 (2020-05-28)</small>


#### Features

* **admin-ui** Add German translations ([00bf630](https://github.com/vendure-ecommerce/vendure/commit/00bf630))
* **admin-ui** Focus facet selector when opening "add facets" dialog ([42c1a48](https://github.com/vendure-ecommerce/vendure/commit/42c1a48))

#### Fixes

* **admin-ui** Fix error updating PaymentMethod config parameters ([b4061a5](https://github.com/vendure-ecommerce/vendure/commit/b4061a5)), closes [#345](https://github.com/vendure-ecommerce/vendure/issues/345)
* **admin-ui** Update available facets when creating new values ([05864c6](https://github.com/vendure-ecommerce/vendure/commit/05864c6)), closes [#347](https://github.com/vendure-ecommerce/vendure/issues/347)
* **asset-server-plugin** Fix mime type detection ([7613f74](https://github.com/vendure-ecommerce/vendure/commit/7613f74)), closes [#341](https://github.com/vendure-ecommerce/vendure/issues/341)

## <small>0.12.4 (2020-05-20)</small>
Fixes broken publish of admin-ui-plugin


## <small>0.12.3 (2020-05-20)</small>


#### Fixes

* **core** Fix MySQL error in DefaultSearchPlugin ([9eb39a2](https://github.com/vendure-ecommerce/vendure/commit/9eb39a2)), closes [#331](https://github.com/vendure-ecommerce/vendure/issues/331) [#342](https://github.com/vendure-ecommerce/vendure/issues/342)
* **core** Increase resilience of app close when worker in main thread ([3ce74ff](https://github.com/vendure-ecommerce/vendure/commit/3ce74ff))

#### Features

* **admin-ui** Display visual feedback when uploading Assets ([ca6c30f](https://github.com/vendure-ecommerce/vendure/commit/ca6c30f))
* **core** Add static lifecycle hooks to run before bootstrap ([c92c21b](https://github.com/vendure-ecommerce/vendure/commit/c92c21b))
* **core** Implement configurable PriceCalculationStrategy ([3e2cc2b](https://github.com/vendure-ecommerce/vendure/commit/3e2cc2b)), closes [#237](https://github.com/vendure-ecommerce/vendure/issues/237)
* **testing** Expose underlying NestApplication & NestMicroservice ([ebf78a2](https://github.com/vendure-ecommerce/vendure/commit/ebf78a2))

## <small>0.12.2 (2020-05-13)</small>


#### Fixes

* **create** Add work-around for upstream tslib issue ([2f39379](https://github.com/vendure-ecommerce/vendure/commit/2f39379))

## <small>0.12.1 (2020-05-12)</small>


#### Fixes

* **admin-ui-plugin** Fix default value for apiPort ([efde4d7](https://github.com/vendure-ecommerce/vendure/commit/efde4d7))
* **create** Fix use of deprecated port option ([96765b4](https://github.com/vendure-ecommerce/vendure/commit/96765b4))

## 0.12.0 (2020-05-12)


#### Perf

* **core** Improved performance of validateVariantOptionIds (#337) ([7d19b9c](https://github.com/vendure-ecommerce/vendure/commit/7d19b9c)), closes [#337](https://github.com/vendure-ecommerce/vendure/issues/337) [#328](https://github.com/vendure-ecommerce/vendure/issues/328)

#### Features

* **admin-ui** Add Polish translations (#317) ([65a113b](https://github.com/vendure-ecommerce/vendure/commit/65a113b)), closes [#317](https://github.com/vendure-ecommerce/vendure/issues/317)
* **admin-ui** Add system health status page ([b3411f2](https://github.com/vendure-ecommerce/vendure/commit/b3411f2)), closes [#289](https://github.com/vendure-ecommerce/vendure/issues/289)
* **admin-ui** Allow status badges to be defined for NavMenuItems ([97e209c](https://github.com/vendure-ecommerce/vendure/commit/97e209c))
* **asset-server-plugin** Add health check ([05820f4](https://github.com/vendure-ecommerce/vendure/commit/05820f4)), closes [#289](https://github.com/vendure-ecommerce/vendure/issues/289)
* **asset-server-plugin** Create S3AssetStorageStrategy ([3f89022](https://github.com/vendure-ecommerce/vendure/commit/3f89022)), closes [#191](https://github.com/vendure-ecommerce/vendure/issues/191)
* **core** Add health check for DB & worker ([1b84ea7](https://github.com/vendure-ecommerce/vendure/commit/1b84ea7)), closes [#289](https://github.com/vendure-ecommerce/vendure/issues/289)
* **core** Added playground and debug config for graphql apis ([1fb5fb4](https://github.com/vendure-ecommerce/vendure/commit/1fb5fb4))
* **core** Allow custom CollectionFilters in config ([87edc9b](https://github.com/vendure-ecommerce/vendure/commit/87edc9b)), closes [#325](https://github.com/vendure-ecommerce/vendure/issues/325)
* **core** Group api options in VendureConfig ([6904743](https://github.com/vendure-ecommerce/vendure/commit/6904743)), closes [#327](https://github.com/vendure-ecommerce/vendure/issues/327)
* **core** Implement injectable lifecycle hooks for configurable ops ([16db620](https://github.com/vendure-ecommerce/vendure/commit/16db620)), closes [#303](https://github.com/vendure-ecommerce/vendure/issues/303)
* **core** Implement injectable lifecycle hooks for strategies ([451caf1](https://github.com/vendure-ecommerce/vendure/commit/451caf1)), closes [#303](https://github.com/vendure-ecommerce/vendure/issues/303)
* **core** Prettier console greeting on server start ([fc30dfd](https://github.com/vendure-ecommerce/vendure/commit/fc30dfd))
* **elasticsearch-plugin** Add health check ([47a8cb9](https://github.com/vendure-ecommerce/vendure/commit/47a8cb9)), closes [#289](https://github.com/vendure-ecommerce/vendure/issues/289)

#### Fixes

* **admin-ui-plugin** Correctly fall back to 'auto' apiHost option ([b02d58a](https://github.com/vendure-ecommerce/vendure/commit/b02d58a))
* **core** Fix emailAddress conflict when creating Customers ([0d4e31a](https://github.com/vendure-ecommerce/vendure/commit/0d4e31a)), closes [#300](https://github.com/vendure-ecommerce/vendure/issues/300)


### BREAKING CHANGE

* Options in the VendureConfig related to the API have been moved into a new location: `VendureConfig.apiOptions`. The affected options are `hostname`, `port`, `adminApiPath`, `shopApiPath`, `channelTokenKey`, `cors`, `middleware` and `apolloServerPlugins`.

  ```TypeScript
  // before
  const config: VendureConfig = {
    port: 3000,
    middleware: [/*...*/],
    // ...
  }
  
  // after
  const config: VendureConfig = {
    apiOptions: {
        port: 3000,
        middleware: [/*...*/],
    },
    // ...
  }
  ```

  This also applies to the `ConfigService`, in case you are using it in a custom plugin.
* The `customer` and `user` tables have received some non-destructive modifications, requiring a DB migration.
* The graphql-playground for the Shop and Admin APIs are now turned off by default, and the Apollo server debug option is also set to false by default (it was formerly true). You can manually configure these values using the VendureConfig.apiOptions object.

## <small>0.11.1 (2020-04-23)</small>


#### Fixes

* **admin-ui** Correctly display overlays inside modals ([ee9c8ca](https://github.com/vendure-ecommerce/vendure/commit/ee9c8ca))
* **admin-ui** Restore missing translation for "public" ([2f06d30](https://github.com/vendure-ecommerce/vendure/commit/2f06d30))
* **core** Correctly invalidate Zone cache on Country changes ([f4101b7](https://github.com/vendure-ecommerce/vendure/commit/f4101b7))
* **core** Fix swiss and congolese currency codes (#302) ([2fbf37a](https://github.com/vendure-ecommerce/vendure/commit/2fbf37a)), closes [#302](https://github.com/vendure-ecommerce/vendure/issues/302)
* **core** Throw on no active taxZone when applying taxes to price ([451ae50](https://github.com/vendure-ecommerce/vendure/commit/451ae50)), closes [#321](https://github.com/vendure-ecommerce/vendure/issues/321)
* **core** Use correct error type for email address conflict ([0ba66cb](https://github.com/vendure-ecommerce/vendure/commit/0ba66cb)), closes [#299](https://github.com/vendure-ecommerce/vendure/issues/299)
* **ui-devkit** Correctly handle static asset file paths ([27b0adb](https://github.com/vendure-ecommerce/vendure/commit/27b0adb)), closes [#309](https://github.com/vendure-ecommerce/vendure/issues/309)
* **ui-devkit** Fix generation of shared module file (#318) ([fd73472](https://github.com/vendure-ecommerce/vendure/commit/fd73472)), closes [#318](https://github.com/vendure-ecommerce/vendure/issues/318)

#### Features

* **admin-ui** Display warnings if Channel lacks default zones ([e80fcf8](https://github.com/vendure-ecommerce/vendure/commit/e80fcf8)), closes [#323](https://github.com/vendure-ecommerce/vendure/issues/323)
* **admin-ui** Implement Zone list view, improved Zone/Country admin ([821f258](https://github.com/vendure-ecommerce/vendure/commit/821f258)), closes [#323](https://github.com/vendure-ecommerce/vendure/issues/323)
* **asset-server-plugin** Implement asset binary deletion ([571ee55](https://github.com/vendure-ecommerce/vendure/commit/571ee55)), closes [#306](https://github.com/vendure-ecommerce/vendure/issues/306)
* **core** Implement asset binary deletion ([b8fc937](https://github.com/vendure-ecommerce/vendure/commit/b8fc937)), closes [#306](https://github.com/vendure-ecommerce/vendure/issues/306)
* **core** Warn when deleting a Zone used as a Channel default ([945c36d](https://github.com/vendure-ecommerce/vendure/commit/945c36d))

## 0.11.0 (2020-04-13)


#### Fixes

* **admin-ui** Fix display of in-progress jobs ([5bed0e6](https://github.com/vendure-ecommerce/vendure/commit/5bed0e6))
* **admin-ui** Get entity default language from active Channel ([effe2c6](https://github.com/vendure-ecommerce/vendure/commit/effe2c6)), closes [#296](https://github.com/vendure-ecommerce/vendure/issues/296)
* **admin-ui** Refresh Collection List on deletion ([4202398](https://github.com/vendure-ecommerce/vendure/commit/4202398)), closes [#295](https://github.com/vendure-ecommerce/vendure/issues/295)
* **core** add missing translations for default channel not found (#301) ([07e1958](https://github.com/vendure-ecommerce/vendure/commit/07e1958)), closes [#301](https://github.com/vendure-ecommerce/vendure/issues/301)
* **core** Correctly derive request language from active Channel ([aae4aa9](https://github.com/vendure-ecommerce/vendure/commit/aae4aa9))
* **core** Correctly reindex enabled state ([2231505](https://github.com/vendure-ecommerce/vendure/commit/2231505)), closes [#295](https://github.com/vendure-ecommerce/vendure/issues/295)
* **core** Fix deletion of Collections ([44916b7](https://github.com/vendure-ecommerce/vendure/commit/44916b7)), closes [#297](https://github.com/vendure-ecommerce/vendure/issues/297)
* **core** Fix generated import in CLI populate types ([4ea139f](https://github.com/vendure-ecommerce/vendure/commit/4ea139f))
* **core** Fix race condition when moving Collections ([987b611](https://github.com/vendure-ecommerce/vendure/commit/987b611))
* **core** Limit Channel defaultLanguage to one of availableLanguages ([b9f4dc0](https://github.com/vendure-ecommerce/vendure/commit/b9f4dc0))
* **core** Use configured defaultLanguageCode rather than hard-coded val ([d2942e6](https://github.com/vendure-ecommerce/vendure/commit/d2942e6)), closes [#296](https://github.com/vendure-ecommerce/vendure/issues/296)
* **core** Validate availableLanguages when update GlobalSettings ([e304ae2](https://github.com/vendure-ecommerce/vendure/commit/e304ae2))
* **elasticsearch-plugin** Fix bad import paths ([99733fa](https://github.com/vendure-ecommerce/vendure/commit/99733fa))
* **email-plugin** Pass all email options when creating transport ([1c6b39f](https://github.com/vendure-ecommerce/vendure/commit/1c6b39f))

#### Features

* **admin-ui** Display live list of queued jobs ([bbe5855](https://github.com/vendure-ecommerce/vendure/commit/bbe5855))
* **admin-ui** Enable setting default language for Channels ([0120202](https://github.com/vendure-ecommerce/vendure/commit/0120202)), closes [#296](https://github.com/vendure-ecommerce/vendure/issues/296)
* **admin-ui** Implement Asset deletion UI ([4912a29](https://github.com/vendure-ecommerce/vendure/commit/4912a29)), closes [#285](https://github.com/vendure-ecommerce/vendure/issues/285)
* **admin-ui** Update to Angular 9.1.0 ([084edd9](https://github.com/vendure-ecommerce/vendure/commit/084edd9))
* **asset-server-plugin** Update Sharp version to 0.25.2 ([13edc9c](https://github.com/vendure-ecommerce/vendure/commit/13edc9c))
* **core** Add DB-based persistence for JobQueue ([a61df93](https://github.com/vendure-ecommerce/vendure/commit/a61df93)), closes [#282](https://github.com/vendure-ecommerce/vendure/issues/282)
* **core** Add jobQueues query ([46068b3](https://github.com/vendure-ecommerce/vendure/commit/46068b3))
* **core** Export ProcessContext service ([3177ac0](https://github.com/vendure-ecommerce/vendure/commit/3177ac0))
* **core** Extract SQL-based JobQueueStrategy in a bundled plugin ([a2069f6](https://github.com/vendure-ecommerce/vendure/commit/a2069f6))
* **core** Implement deleteAsset mutation ([efa12ba](https://github.com/vendure-ecommerce/vendure/commit/efa12ba)), closes [#285](https://github.com/vendure-ecommerce/vendure/issues/285)
* **core** Implement removeSettledJobs mutation ([82af7f6](https://github.com/vendure-ecommerce/vendure/commit/82af7f6))
* **core** Log any errors when creating Asset preview images ([e1b8cb8](https://github.com/vendure-ecommerce/vendure/commit/e1b8cb8))
* **core** Redesign JobQueue to allow persistence, concurrency etc ([7acf532](https://github.com/vendure-ecommerce/vendure/commit/7acf532)), closes [#282](https://github.com/vendure-ecommerce/vendure/issues/282)
* **core** Resume interrupted jobs in queue on restart ([9b66d33](https://github.com/vendure-ecommerce/vendure/commit/9b66d33))
* **core** Update to Nestjs v7 ([3d6657a](https://github.com/vendure-ecommerce/vendure/commit/3d6657a))
* **core** Update to TypeScript 3.8 ([e255674](https://github.com/vendure-ecommerce/vendure/commit/e255674)), closes [#286](https://github.com/vendure-ecommerce/vendure/issues/286)
* **create** Add DefaultJobQueuePlugin to default config template ([38b375f](https://github.com/vendure-ecommerce/vendure/commit/38b375f))
* **elasticsearch-plugin** Update index on asset deletion ([c80662a](https://github.com/vendure-ecommerce/vendure/commit/c80662a))
* **elasticsearch-plugin** Update to use new job queue ([42b1d28](https://github.com/vendure-ecommerce/vendure/commit/42b1d28))
* **email-plugin** Generate and send emails on the worker ([0cc5f87](https://github.com/vendure-ecommerce/vendure/commit/0cc5f87))
* **testing** Add `bootstrap` method to TestServer ([dab9e21](https://github.com/vendure-ecommerce/vendure/commit/dab9e21))

#### Perf

* **admin-ui-plugin** Use trackBy function to improve perf of datatable ([09ab4d7](https://github.com/vendure-ecommerce/vendure/commit/09ab4d7))


### BREAKING CHANGE

* (If using the DefaultJobQueuePlugin) A new JobRecord entity has been added, so a DB migration will be needed.
* In order to accommodate Asset deletion, some non-destructive DB modifications have been made which will require a migration.
* Nestjs has been updated to v7. If you make use of any of the Nest internals in your plugins, this may cause some breaking changes. Please see the [Nest migration guide](https://docs.nestjs.com/migration-guide) for details.

  This release also includes updates to many dependencies which in turn have dropped support for Node.js v8. Therefore **Vendure now supports Node.js v10** or higher.
* The CollectionAsset entity had a cascade delete defined, which will require a DB migration.
* The JobQueueService has been completely re-designed. In the event that you are using this service in your Plugins, please see the [API documentation](https://www.vendure.io/docs/developer-guide/job-queue) on how to use it now.
## <small>0.10.2 (2020-04-02)</small>


#### Fixes

* **admin-ui-plugin** Add Chinese to the default available languages ([46ff932](https://github.com/vendure-ecommerce/vendure/commit/46ff932))
* **admin-ui** Fix prosemirror error when changing product detail tabs ([8a7cf9a](https://github.com/vendure-ecommerce/vendure/commit/8a7cf9a))
* **admin-ui** Make rich text editor editable when creating products etc ([d268276](https://github.com/vendure-ecommerce/vendure/commit/d268276))
* **asset-server-plugin** Fix build to export non-image file icon ([63166a2](https://github.com/vendure-ecommerce/vendure/commit/63166a2))

#### Features

* **admin-ui** Better error reporting for invalid translation files ([a64f7ac](https://github.com/vendure-ecommerce/vendure/commit/a64f7ac)), closes [#292](https://github.com/vendure-ecommerce/vendure/issues/292)
* **create** Check server port is free before install ([202f68d](https://github.com/vendure-ecommerce/vendure/commit/202f68d))
* **create** Pin TypeScript version ([a2fba13](https://github.com/vendure-ecommerce/vendure/commit/a2fba13)), closes [#268](https://github.com/vendure-ecommerce/vendure/issues/268)

## <small>0.10.1 (2020-03-24)</small>


#### Features

* **admin-ui-plugin** Allow ui languages to be set in the AdminUiPlugin ([db3bce3](https://github.com/vendure-ecommerce/vendure/commit/db3bce3)), closes [#264](https://github.com/vendure-ecommerce/vendure/issues/264)
* **admin-ui** Added Chinese i18n messages (#280) ([749ee3d](https://github.com/vendure-ecommerce/vendure/commit/749ee3d)), closes [#280](https://github.com/vendure-ecommerce/vendure/issues/280)
* **admin-ui** Enable ui language config & selection ([aa4452e](https://github.com/vendure-ecommerce/vendure/commit/aa4452e)), closes [#264](https://github.com/vendure-ecommerce/vendure/issues/264)
* **core** Export some missing symbols from Core ([f16bd7b](https://github.com/vendure-ecommerce/vendure/commit/f16bd7b))
* **testing** Expose raw http fetch method in SimpleGraphQLClient ([d715d30](https://github.com/vendure-ecommerce/vendure/commit/d715d30))
* **ui-devkit** Allow custom i18n files to compiled into the Admin UI ([df88d58](https://github.com/vendure-ecommerce/vendure/commit/df88d58)), closes [#264](https://github.com/vendure-ecommerce/vendure/issues/264)
* **ui-devkit** Allow stand-alone translation extensions ([7a70642](https://github.com/vendure-ecommerce/vendure/commit/7a70642)), closes [#264](https://github.com/vendure-ecommerce/vendure/issues/264)

#### Fixes

* **core** Correctly handle error responses for REST controllers ([72be58d](https://github.com/vendure-ecommerce/vendure/commit/72be58d)), closes [#187](https://github.com/vendure-ecommerce/vendure/issues/187)
* **core** Fix DefaultAssetNamingStrategy with files without extensions ([dee3258](https://github.com/vendure-ecommerce/vendure/commit/dee3258)), closes [#271](https://github.com/vendure-ecommerce/vendure/issues/271) [#272](https://github.com/vendure-ecommerce/vendure/issues/272)
* **core** Fix error when using non-TCP transport in workerOptions ([b37ea05](https://github.com/vendure-ecommerce/vendure/commit/b37ea05)), closes [#270](https://github.com/vendure-ecommerce/vendure/issues/270)
* **core** Prevent data leakage of guest Customer data ([ea51000](https://github.com/vendure-ecommerce/vendure/commit/ea51000)), closes [#98](https://github.com/vendure-ecommerce/vendure/issues/98)
* **elasticsearch-plugin** Do not expose private facets in search result ([60bb5b9](https://github.com/vendure-ecommerce/vendure/commit/60bb5b9))

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

