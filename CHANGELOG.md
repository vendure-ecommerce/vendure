## <small>3.4.2 (2025-09-11)</small>


#### Fixes

* **core** Correctly implement SettingsStore validation & argument order (#3808) ([d8cdd62](https://github.com/vendure-ecommerce/vendure/commit/d8cdd62)), closes [#3808](https://github.com/vendure-ecommerce/vendure/issues/3808)
* **core** Emit `CollectionEvent` after moving a collection (#3801) ([d80e28f](https://github.com/vendure-ecommerce/vendure/commit/d80e28f)), closes [#3801](https://github.com/vendure-ecommerce/vendure/issues/3801)
* **core** Fix logic for calculating interval ([394fb05](https://github.com/vendure-ecommerce/vendure/commit/394fb05))
* **core** Handle foreign key violations during order merge (#3795) ([c00a044](https://github.com/vendure-ecommerce/vendure/commit/c00a044)), closes [#3795](https://github.com/vendure-ecommerce/vendure/issues/3795)
* **core** Log warning when attempting to persist invalid custom fields (#3793) ([eefbd9c](https://github.com/vendure-ecommerce/vendure/commit/eefbd9c)), closes [#3793](https://github.com/vendure-ecommerce/vendure/issues/3793)
* **core** Handle stale locks on scheduled tasks (#3708) ([4492850](https://github.com/vendure-ecommerce/vendure/commit/4492850)), closes [#3708](https://github.com/vendure-ecommerce/vendure/issues/3708)
* **create** Fix resolving path in repos using hoisted node_modules (#3802) ([fd971a5](https://github.com/vendure-ecommerce/vendure/commit/fd971a5)), closes [#3802](https://github.com/vendure-ecommerce/vendure/issues/3802)
* **dashboard** Add initial value to reduce call ([9261f03](https://github.com/vendure-ecommerce/vendure/commit/9261f03))
* **dashboard** Allow column selection on recent orders ([182c0b7](https://github.com/vendure-ecommerce/vendure/commit/182c0b7))
* **dashboard** Derive breadcrumbs from path/basepath to match sidebar (#3784) ([562cc54](https://github.com/vendure-ecommerce/vendure/commit/562cc54)), closes [#3784](https://github.com/vendure-ecommerce/vendure/issues/3784)
* **dashboard** Ensure language is valid when switching channel ([97d9a9d](https://github.com/vendure-ecommerce/vendure/commit/97d9a9d)), closes [#3780](https://github.com/vendure-ecommerce/vendure/issues/3780)
* **dashboard** Ensure language is valid when switching channel ([7473956](https://github.com/vendure-ecommerce/vendure/commit/7473956))
* **dashboard** Fix api 'auto' options (#3807) ([b597dfc](https://github.com/vendure-ecommerce/vendure/commit/b597dfc)), closes [#3807](https://github.com/vendure-ecommerce/vendure/issues/3807)
* **dashboard** Fix change detection in RichTextInput ([1c18b41](https://github.com/vendure-ecommerce/vendure/commit/1c18b41))
* **dashboard** Fix checkboxes on variant creation ([4b69839](https://github.com/vendure-ecommerce/vendure/commit/4b69839))
* **dashboard** Fix data table date filter ([225b774](https://github.com/vendure-ecommerce/vendure/commit/225b774))
* **dashboard** Fix filtering in latest orders widget ([b8ac456](https://github.com/vendure-ecommerce/vendure/commit/b8ac456))
* **dashboard** Fix multi select on asset gallery ([5826c7f](https://github.com/vendure-ecommerce/vendure/commit/5826c7f))
* **dashboard** Fix navigation to Asset detail from gallery dialog ([846ab24](https://github.com/vendure-ecommerce/vendure/commit/846ab24))
* **dashboard** Fix scroll behaviour on asset picker dialog ([363043d](https://github.com/vendure-ecommerce/vendure/commit/363043d))
* **dashboard** Improve facet list table ([b76d1dc](https://github.com/vendure-ecommerce/vendure/commit/b76d1dc))
* **dashboard** Improve layout & rendering of order summary widget ([cf72c72](https://github.com/vendure-ecommerce/vendure/commit/cf72c72))
* **dashboard** Improve styling of metrics widget, add refresh ([e8f8d99](https://github.com/vendure-ecommerce/vendure/commit/e8f8d99))
* **dashboard** Make long table column dropdowns scrollable ([f878e24](https://github.com/vendure-ecommerce/vendure/commit/f878e24))
* **dashboard** Show “Create” for new entities, “Update” for edits (#3805) ([fdece02](https://github.com/vendure-ecommerce/vendure/commit/fdece02)), closes [#3805](https://github.com/vendure-ecommerce/vendure/issues/3805)
* **dashboard** Update channel switcher when Channel added/updated ([1cd7652](https://github.com/vendure-ecommerce/vendure/commit/1cd7652))

Note: In this release, the `SettingsStoreService` methods have been revised to put the
`ctx` argument in the first position, as is standard across Vendure APIs. Existing code
with the ctx last will still work, but you are advised to update it.

```diff
- SettingsStoreService.get<T>(key, ctx)       
- SettingsStoreService.getMany(keys, ctx)     
- SettingsStoreService.set<T>(key, value, ctx)
- SettingsStoreService.setMany(values, ctx)

+ SettingsStoreService.get<T>(ctx, key)       
+ SettingsStoreService.getMany(ctx, keys)     
+ SettingsStoreService.set<T>(ctx, key, value)
+ SettingsStoreService.setMany(ctx, values)   
```

#### Features

* **dashboard** Add manage variants screen ([cdfd4ca](https://github.com/vendure-ecommerce/vendure/commit/cdfd4ca))

## <small>3.4.1 (2025-08-25)</small>


#### Fixes

* **admin-ui** Fixed facets and tags references in Spanish translations (#3752) ([bc8bbea](https://github.com/vendure-ecommerce/vendure/commit/bc8bbea)), closes [#3752](https://github.com/vendure-ecommerce/vendure/issues/3752)
* **cli** Use dynamic import for strip-json-comments (#3745) ([a3acd91](https://github.com/vendure-ecommerce/vendure/commit/a3acd91)), closes [#3745](https://github.com/vendure-ecommerce/vendure/issues/3745)
* **core** Filter StockMovements by type when fetching by product variant (#3713) ([99907fc](https://github.com/vendure-ecommerce/vendure/commit/99907fc)), closes [#3713](https://github.com/vendure-ecommerce/vendure/issues/3713)
* **core** Fix scheduled task registration to avoid entity ID errors (#3763) ([68e98eb](https://github.com/vendure-ecommerce/vendure/commit/68e98eb)), closes [#3763](https://github.com/vendure-ecommerce/vendure/issues/3763)
* **dashboard** Add error handling to schema generation process (#3731) ([23ef906](https://github.com/vendure-ecommerce/vendure/commit/23ef906)), closes [#3731](https://github.com/vendure-ecommerce/vendure/issues/3731)
* **dashboard** Remove bulk actions display in asset picker ([55f71ab](https://github.com/vendure-ecommerce/vendure/commit/55f71ab))
* **dashboard** Remove vite plugin source code from package ([c3546c4](https://github.com/vendure-ecommerce/vendure/commit/c3546c4))
* **email-plugin** Escape recipient's HTML entities in dev mailbox (#3756) ([904baa9](https://github.com/vendure-ecommerce/vendure/commit/904baa9)), closes [#3756](https://github.com/vendure-ecommerce/vendure/issues/3756)
* **job-queue-plugin** Use SCAN instead of KEYS to clean indexed sets (#3743) ([1c9b00b](https://github.com/vendure-ecommerce/vendure/commit/1c9b00b)), closes [#3743](https://github.com/vendure-ecommerce/vendure/issues/3743)

## 3.4.0 (2025-08-01)


#### Fixes

* **cli** Standardise flag names ([a63ac07](https://github.com/vendure-ecommerce/vendure/commit/a63ac07))
* **core** Fix relation constraints in OrderModification ([87fc929](https://github.com/vendure-ecommerce/vendure/commit/87fc929))
* **core** Product by slug query filters on channel (#3591) ([78608cc](https://github.com/vendure-ecommerce/vendure/commit/78608cc)), closes [#3591](https://github.com/vendure-ecommerce/vendure/issues/3591)
* **dashboard** Add "ring offeset" padding on devmode on hover ring (#3707) ([a2e3a10](https://github.com/vendure-ecommerce/vendure/commit/a2e3a10)), closes [#3707](https://github.com/vendure-ecommerce/vendure/issues/3707)
* **dashboard** Add missing order property to nav menu items (#3705) ([6ffa048](https://github.com/vendure-ecommerce/vendure/commit/6ffa048)), closes [#3705](https://github.com/vendure-ecommerce/vendure/issues/3705)
* **dashboard** Fix detection of node_modules ([55e012b](https://github.com/vendure-ecommerce/vendure/commit/55e012b))
* **dashboard** Fix dev mode styling in dark mode ([092b432](https://github.com/vendure-ecommerce/vendure/commit/092b432))
* **dashboard** Fix editing of order history entries ([74f149a](https://github.com/vendure-ecommerce/vendure/commit/74f149a))
* **dashboard** Fix heading for collection contents ([971ecca](https://github.com/vendure-ecommerce/vendure/commit/971ecca))
* **dashboard** Fix intersecting borders and inconsistent rounded corners (#3717) ([ae7828f](https://github.com/vendure-ecommerce/vendure/commit/ae7828f)), closes [#3717](https://github.com/vendure-ecommerce/vendure/issues/3717)
* **dashboard** Improved facet value editing ([16c2e5e](https://github.com/vendure-ecommerce/vendure/commit/16c2e5e))
* **dashboard** Multiple style & functionality fixes ([cca25e2](https://github.com/vendure-ecommerce/vendure/commit/cca25e2))
* **dashboard** Remove use of crypto.randomUUID in option input (#3618) ([61bed48](https://github.com/vendure-ecommerce/vendure/commit/61bed48)), closes [#3618](https://github.com/vendure-ecommerce/vendure/issues/3618)
* **payments-plugin** improve order state transition handling for channel-specific contexts and default channel as a fallback (#3420) ([4f29f0a](https://github.com/vendure-ecommerce/vendure/commit/4f29f0a)), closes [#3420](https://github.com/vendure-ecommerce/vendure/issues/3420)

#### Features

* **cli** Non-interactive mode and new structure (#3606) ([7d9f03b](https://github.com/vendure-ecommerce/vendure/commit/7d9f03b)), closes [#3606](https://github.com/vendure-ecommerce/vendure/issues/3606)
* **core** Add `addItemsToOrder` mutation to add multiple items to cart (#3500) ([84a8cbe](https://github.com/vendure-ecommerce/vendure/commit/84a8cbe)), closes [#3500](https://github.com/vendure-ecommerce/vendure/issues/3500)
* **core** Add facetValue query to Admin API ([fae3c51](https://github.com/vendure-ecommerce/vendure/commit/fae3c51))
* **core** Add single facetValue create/update mutations to Admin API ([4db0d51](https://github.com/vendure-ecommerce/vendure/commit/4db0d51))
* **core** Add support for deprecating custom fields with @deprecated directive (#3582) ([6fb399f](https://github.com/vendure-ecommerce/vendure/commit/6fb399f)), closes [#3582](https://github.com/vendure-ecommerce/vendure/issues/3582)
* **core** Add trustProxy option to ApiOptions (#3567) ([f248719](https://github.com/vendure-ecommerce/vendure/commit/f248719)), closes [#3567](https://github.com/vendure-ecommerce/vendure/issues/3567)
* **core** Improve OrderEvent and publish for order modify (#3594) ([5a27b14](https://github.com/vendure-ecommerce/vendure/commit/5a27b14)), closes [#3594](https://github.com/vendure-ecommerce/vendure/issues/3594)
* **core** Merge custom fields on updating order lines (#3673) ([ead7bfa](https://github.com/vendure-ecommerce/vendure/commit/ead7bfa)), closes [#3673](https://github.com/vendure-ecommerce/vendure/issues/3673)
* **core** SettingsStore for global & scoped config settings (#3684) ([5aa01cc](https://github.com/vendure-ecommerce/vendure/commit/5aa01cc)), closes [#3684](https://github.com/vendure-ecommerce/vendure/issues/3684)
* **core** Throw error on taxSummary if surcharges relation is not loaded (#3569) ([068176c](https://github.com/vendure-ecommerce/vendure/commit/068176c)), closes [#3569](https://github.com/vendure-ecommerce/vendure/issues/3569)
* **dashboard** Add customizable login extensions API (#3704) ([866afcb](https://github.com/vendure-ecommerce/vendure/commit/866afcb)), closes [#3704](https://github.com/vendure-ecommerce/vendure/issues/3704)
* **dashboard** Add DashboardPlugin as part of dashboard package (#3711) ([49d449f](https://github.com/vendure-ecommerce/vendure/commit/49d449f)), closes [#3711](https://github.com/vendure-ecommerce/vendure/issues/3711)
* **dashboard** Add dev mode info to nav menu ([867655e](https://github.com/vendure-ecommerce/vendure/commit/867655e))
* **dashboard** Dashboard persistent settings (#3712) ([17c27ff](https://github.com/vendure-ecommerce/vendure/commit/17c27ff)), closes [#3712](https://github.com/vendure-ecommerce/vendure/issues/3712)
* **dashboard** Implement content language handling ([b635d23](https://github.com/vendure-ecommerce/vendure/commit/b635d23))
* **elasticsearch-plugin** Extend ElasticSearch to also support groupBySKU for multi-vendor store scenarios (#3528) ([ec1cc5e](https://github.com/vendure-ecommerce/vendure/commit/ec1cc5e)), closes [#3528](https://github.com/vendure-ecommerce/vendure/issues/3528)
* **payments-plugin** Export StripeService to support more payment flows (#3624) ([829ab2c](https://github.com/vendure-ecommerce/vendure/commit/829ab2c)), closes [#3624](https://github.com/vendure-ecommerce/vendure/issues/3624)
* **payments-plugin** Migrate Mollie to Payments API (#3603) ([d0db5cb](https://github.com/vendure-ecommerce/vendure/commit/d0db5cb)), closes [#3603](https://github.com/vendure-ecommerce/vendure/issues/3603)

#### Perf

* **core** Add indexes on date cols for orders & job items (#3614) ([ceb5279](https://github.com/vendure-ecommerce/vendure/commit/ceb5279)), closes [#3614](https://github.com/vendure-ecommerce/vendure/issues/3614)


### BREAKING CHANGE

* If you are using the `MolliePlugin`, you should install @mollie/api-client@4.3.3 as the plugin has been updated to use the latest Mollie features.
* Indexes have been added on the columns `orderPlacedAt` in the Order table, and `createdAt` in the JobItem table (for those using the DefaultJobQueuePlugin). This will require a non-destructive DB migration be performed to add these indexes to your schema. 
* With the introduction of the new SettingsStore feature, a non-destructive database migration will be required to set up the new table that will store the settings data.
## <small>3.3.8 (2025-08-01)</small>


#### Fixes

* **admin-ui** Fixed tracking code not showing in order history (#3402) ([6002c21](https://github.com/vendure-ecommerce/vendure/commit/6002c21)), closes [#3402](https://github.com/vendure-ecommerce/vendure/issues/3402)
* **cli** Replace regex solution with robust stirp-json-comments package (#3694) ([26a9e03](https://github.com/vendure-ecommerce/vendure/commit/26a9e03)), closes [#3694](https://github.com/vendure-ecommerce/vendure/issues/3694)
* **core** Account for refund status when calculating order coverage (#3719) ([1400bbc](https://github.com/vendure-ecommerce/vendure/commit/1400bbc)), closes [#3719](https://github.com/vendure-ecommerce/vendure/issues/3719) [#3670](https://github.com/vendure-ecommerce/vendure/issues/3670)
* **core** More reliable job subscriber timeout handling ([5e124d5](https://github.com/vendure-ecommerce/vendure/commit/5e124d5))
* **dashboard** Correct detection of tailwind classes in plugins ([86da88a](https://github.com/vendure-ecommerce/vendure/commit/86da88a))
* **dashboard** Fix custom field label ([45d4b3c](https://github.com/vendure-ecommerce/vendure/commit/45d4b3c))
* **dashboard** Fix custom fields in GlobalSettings detail ([bcd55b8](https://github.com/vendure-ecommerce/vendure/commit/bcd55b8))
* **dashboard** Fix npm package discovery ([1fc6f85](https://github.com/vendure-ecommerce/vendure/commit/1fc6f85))
* **dashboard** Fix plugin detection on Windows ([bbb8c48](https://github.com/vendure-ecommerce/vendure/commit/bbb8c48))
* **dashboard** Temporarily remove shadcn avatar ([10d5ebc](https://github.com/vendure-ecommerce/vendure/commit/10d5ebc))
* **email-plugin** Hydrate lines.featureAsset on order-confirmation email (#3690) ([20c05db](https://github.com/vendure-ecommerce/vendure/commit/20c05db)), closes [#3690](https://github.com/vendure-ecommerce/vendure/issues/3690)
* **payments-plugin** Include metadata in createPayment of Stripe handler (#3692) ([d415dd0](https://github.com/vendure-ecommerce/vendure/commit/d415dd0)), closes [#3692](https://github.com/vendure-ecommerce/vendure/issues/3692)

#### Features

* **dashboard** Full support for configurable operations UI (#3702) ([8e0c5b4](https://github.com/vendure-ecommerce/vendure/commit/8e0c5b4)), closes [#3702](https://github.com/vendure-ecommerce/vendure/issues/3702)
* **dashboard** Full support for custom fields in detail forms (#3695) ([38d6f73](https://github.com/vendure-ecommerce/vendure/commit/38d6f73)), closes [#3695](https://github.com/vendure-ecommerce/vendure/issues/3695)
* **dashboard** Implement add facet value ([4b24f24](https://github.com/vendure-ecommerce/vendure/commit/4b24f24))
* **dashboard** Implement delete facet value ([c7db965](https://github.com/vendure-ecommerce/vendure/commit/c7db965))
* **dashboard** Job list improvements ([d5c39cf](https://github.com/vendure-ecommerce/vendure/commit/d5c39cf))
* **dashboard** Update theme to use OKLCH color space and new shadcn theme (#3688) ([199cbd1](https://github.com/vendure-ecommerce/vendure/commit/199cbd1)), closes [#3688](https://github.com/vendure-ecommerce/vendure/issues/3688)

## <small>3.3.7 (2025-07-18)</small>


#### Fixes

* **core** Apply custom field defaults on entity creation (#3674) ([65804ba](https://github.com/vendure-ecommerce/vendure/commit/65804ba)), closes [#3674](https://github.com/vendure-ecommerce/vendure/issues/3674)
* **core** Correct unfulfilled quantity calc for multiple fulfillment lines per orderline (#3647) ([430dcb8](https://github.com/vendure-ecommerce/vendure/commit/430dcb8)), closes [#3647](https://github.com/vendure-ecommerce/vendure/issues/3647)
* **core** ID decoding in nested filter structures (#3677) ([b2c3bc9](https://github.com/vendure-ecommerce/vendure/commit/b2c3bc9)), closes [#3677](https://github.com/vendure-ecommerce/vendure/issues/3677)
* **dashboard** Fix handling of more types of path alias (#3678) ([c9f993f](https://github.com/vendure-ecommerce/vendure/commit/c9f993f)), closes [#3678](https://github.com/vendure-ecommerce/vendure/issues/3678)

## <small>3.3.6 (2025-07-14)</small>


#### Fixes

* **admin-ui** Better Spanish translation for "locale" (#3664) ([12b6a4d](https://github.com/vendure-ecommerce/vendure/commit/12b6a4d)), closes [#3664](https://github.com/vendure-ecommerce/vendure/issues/3664)
* **admin-ui** Respect visibility setting when creating a new collection (#3650) ([cda91df](https://github.com/vendure-ecommerce/vendure/commit/cda91df)), closes [#3650](https://github.com/vendure-ecommerce/vendure/issues/3650)
* **admin-ui** update button class for consistency in action bar (#3625) ([32c261a](https://github.com/vendure-ecommerce/vendure/commit/32c261a)), closes [#3625](https://github.com/vendure-ecommerce/vendure/issues/3625)
* **cli** Create new instance of entity before saving to db in generated Entity (#3623) ([8a2e679](https://github.com/vendure-ecommerce/vendure/commit/8a2e679)), closes [#3623](https://github.com/vendure-ecommerce/vendure/issues/3623)
* **core** Export missing common utilities in index files (#3665) ([4551eb9](https://github.com/vendure-ecommerce/vendure/commit/4551eb9)), closes [#3665](https://github.com/vendure-ecommerce/vendure/issues/3665)
* **core** Handle fs-capacitor readstream creation error (#3646) ([73902ee](https://github.com/vendure-ecommerce/vendure/commit/73902ee)), closes [#3646](https://github.com/vendure-ecommerce/vendure/issues/3646)
* **core** Remove unused variable in removeVariantFromChannel (#3661) ([8b28ae8](https://github.com/vendure-ecommerce/vendure/commit/8b28ae8)), closes [#3661](https://github.com/vendure-ecommerce/vendure/issues/3661)
* **dashboard** Correct import path for RichTextInput component ([462708a](https://github.com/vendure-ecommerce/vendure/commit/462708a))
* **dashboard** Fix bad imports ([9a43255](https://github.com/vendure-ecommerce/vendure/commit/9a43255))
* **dashboard** Fix creation of new entities using UUID ids ([b56cefe](https://github.com/vendure-ecommerce/vendure/commit/b56cefe)), closes [#3658](https://github.com/vendure-ecommerce/vendure/issues/3658)
* **dashboard** Fix dashboard bulk action hook imports (#3640) ([969e1a1](https://github.com/vendure-ecommerce/vendure/commit/969e1a1)), closes [#3640](https://github.com/vendure-ecommerce/vendure/issues/3640)
* **dashboard** Fix race condition causing customField error ([78555cb](https://github.com/vendure-ecommerce/vendure/commit/78555cb))
* **dashboard** Fix redirect after creating new product ([5ea9ad8](https://github.com/vendure-ecommerce/vendure/commit/5ea9ad8))
* **dashboard** Fix saving new entities when using UUIDs ([d880112](https://github.com/vendure-ecommerce/vendure/commit/d880112)), closes [#3616](https://github.com/vendure-ecommerce/vendure/issues/3616)
* **dashboard** Fix tanstack router config for utils dir ([40f1ca3](https://github.com/vendure-ecommerce/vendure/commit/40f1ca3))
* **dashboard** Form control rendering ([436c7b9](https://github.com/vendure-ecommerce/vendure/commit/436c7b9))
* **dashboard** Handle list relation custom fields properly ([622ed04](https://github.com/vendure-ecommerce/vendure/commit/622ed04))
* **dashboard** Improve single and multi-select handling in relation selector ([807d055](https://github.com/vendure-ecommerce/vendure/commit/807d055))
* **dashboard** Improve styling of bulk select dropdown (#3635) ([8efcaed](https://github.com/vendure-ecommerce/vendure/commit/8efcaed)), closes [#3635](https://github.com/vendure-ecommerce/vendure/issues/3635)
* **dashboard** Make variant detail breadcrumbs context-aware ([07c174c](https://github.com/vendure-ecommerce/vendure/commit/07c174c))
* **dashboard** Remove duplicate export ([c4ed056](https://github.com/vendure-ecommerce/vendure/commit/c4ed056))
* **dashboard** Update imports in hooks to fix typings ([cd450ed](https://github.com/vendure-ecommerce/vendure/commit/cd450ed))
* **dashboard** Update Money component to use 'currency' prop  (#3644) ([aa517a6](https://github.com/vendure-ecommerce/vendure/commit/aa517a6)), closes [#3644](https://github.com/vendure-ecommerce/vendure/issues/3644)
* **dashboard** Use dedicated @/vdb alias for imports (#3631) ([a3d7f05](https://github.com/vendure-ecommerce/vendure/commit/a3d7f05)), closes [#3631](https://github.com/vendure-ecommerce/vendure/issues/3631)

#### Features

* **dashboard** Add custom ID filtering and fetching for relation selector ([1bdc8cb](https://github.com/vendure-ecommerce/vendure/commit/1bdc8cb))
* **dashboard** Allow override of all detail form inputs (#3642) ([bce0ec9](https://github.com/vendure-ecommerce/vendure/commit/bce0ec9)), closes [#3642](https://github.com/vendure-ecommerce/vendure/issues/3642)
* **dashboard** Enhance detail forms extension API with input and display components  (#3626) ([e6def00](https://github.com/vendure-ecommerce/vendure/commit/e6def00)), closes [#3626](https://github.com/vendure-ecommerce/vendure/issues/3626)
* **dashboard** Implement API to extend detail page queries ([e83ad3b](https://github.com/vendure-ecommerce/vendure/commit/e83ad3b))
* **dashboard** Implement bulk actions for collections ([b85c7a5](https://github.com/vendure-ecommerce/vendure/commit/b85c7a5))
* **dashboard** Implement collection channel bulk actions ([332e6e2](https://github.com/vendure-ecommerce/vendure/commit/332e6e2))
* **dashboard** Implement extension of list query documents ([5190e4f](https://github.com/vendure-ecommerce/vendure/commit/5190e4f))
* **dashboard** Implement product variant bulk actions ([2f651b2](https://github.com/vendure-ecommerce/vendure/commit/2f651b2))
* **dashboard** Implement remaining bulk actions (#3627) ([13989b9](https://github.com/vendure-ecommerce/vendure/commit/13989b9)), closes [#3627](https://github.com/vendure-ecommerce/vendure/issues/3627)
* **dashboard** Move collections UI (#3629) ([a921e97](https://github.com/vendure-ecommerce/vendure/commit/a921e97)), closes [#3629](https://github.com/vendure-ecommerce/vendure/issues/3629)
* **dashboard** Order detail missing features (#3636) ([183b8f3](https://github.com/vendure-ecommerce/vendure/commit/183b8f3)), closes [#3636](https://github.com/vendure-ecommerce/vendure/issues/3636)
* **dashboard** Order modification (#3656) ([8a15d89](https://github.com/vendure-ecommerce/vendure/commit/8a15d89)), closes [#3656](https://github.com/vendure-ecommerce/vendure/issues/3656)
* **dashboard** Relation selector components (#3633) ([d648ac1](https://github.com/vendure-ecommerce/vendure/commit/d648ac1)), closes [#3633](https://github.com/vendure-ecommerce/vendure/issues/3633)
* **dashboard** Support compilation of external plugins (#3663) ([e445bdb](https://github.com/vendure-ecommerce/vendure/commit/e445bdb)), closes [#3663](https://github.com/vendure-ecommerce/vendure/issues/3663)

#### Perf

* **core** Optimize relation loading strategies for orders and order lines (#3652) ([a04b94a](https://github.com/vendure-ecommerce/vendure/commit/a04b94a)), closes [#3652](https://github.com/vendure-ecommerce/vendure/issues/3652)

## <small>3.3.5 (2025-06-27)</small>

#### Fixes

* **core** Only use shipping address for tax zone determination (#3367) ([8977d9f](https://github.com/vendure-ecommerce/vendure/commit/8977d9f)), closes [#3367](https://github.com/vendure-ecommerce/vendure/issues/3367)
* **cli** Allow comments in tsconfig for the migrate command (#3604) ([957c5e8](https://github.com/vendure-ecommerce/vendure/commit/957c5e8)), closes [#3604](https://github.com/vendure-ecommerce/vendure/issues/3604)
* **dashboard** Add order property to navigation items for improved sorting ([82a1b7f](https://github.com/vendure-ecommerce/vendure/commit/82a1b7f))
* **dashboard** Enable tailwind processing of dashboard extension files ([694d0dd](https://github.com/vendure-ecommerce/vendure/commit/694d0dd))
* **dashboard** Fix asset imports in built index.html ([3ad6634](https://github.com/vendure-ecommerce/vendure/commit/3ad6634))
* **dashboard** Fix bulk editing of product facet values ([943b71f](https://github.com/vendure-ecommerce/vendure/commit/943b71f))
* **dashboard** Fix extension loading on Windows ([bbaa3e9](https://github.com/vendure-ecommerce/vendure/commit/bbaa3e9)), closes [#3593](https://github.com/vendure-ecommerce/vendure/issues/3593)
* **dashboard** Fix handling of Vite base option ([f21a0b6](https://github.com/vendure-ecommerce/vendure/commit/f21a0b6))
* **dashboard** Fix plugin detection from barrel files ([aa12ac7](https://github.com/vendure-ecommerce/vendure/commit/aa12ac7))
* **dashboard** Improve data table loading UX ([2227598](https://github.com/vendure-ecommerce/vendure/commit/2227598))
* **dashboard** Only transform base path in build phase ([3a031b3](https://github.com/vendure-ecommerce/vendure/commit/3a031b3))
* **dashboard** Update Vite plugin output directory to 'dist' for consistency ([8526da9](https://github.com/vendure-ecommerce/vendure/commit/8526da9))
* **email-plugin** Fix Dynamic smtp config require server restart to reflect changes (#3282) ([d6d967d](https://github.com/vendure-ecommerce/vendure/commit/d6d967d)), closes [#3282](https://github.com/vendure-ecommerce/vendure/issues/3282)
* **job-queue-plugin** Correctly list running jobs ([391e314](https://github.com/vendure-ecommerce/vendure/commit/391e314))
* **job-queue-plugin** Do not throw on unknown job state ([bb91f26](https://github.com/vendure-ecommerce/vendure/commit/bb91f26))

#### Features

* **dashboard** Add entity prop to detail pages for improved context ([4c20cae](https://github.com/vendure-ecommerce/vendure/commit/4c20cae))
* **dashboard** Add relation field transformation (#3619) ([caa18ac](https://github.com/vendure-ecommerce/vendure/commit/caa18ac)), closes [#3619](https://github.com/vendure-ecommerce/vendure/issues/3619)
* **dashboard** Add support for monorepo setups ([76759d9](https://github.com/vendure-ecommerce/vendure/commit/76759d9))
* **dashboard** Confirmation on deletion from list views ([d88a0a7](https://github.com/vendure-ecommerce/vendure/commit/d88a0a7))
* **dashboard** Custom form components for custom fields (#3610) ([155f376](https://github.com/vendure-ecommerce/vendure/commit/155f376)), closes [#3610](https://github.com/vendure-ecommerce/vendure/issues/3610)
* **dashboard** Dashboard bulk actions (#3615) ([39edc18](https://github.com/vendure-ecommerce/vendure/commit/39edc18)), closes [#3615](https://github.com/vendure-ecommerce/vendure/issues/3615)
* **dashboard** Implement tabbed interface for custom fields in forms ([68af675](https://github.com/vendure-ecommerce/vendure/commit/68af675))
* **dashboard** Improve display of variant stock levels in lists ([1ce87ed](https://github.com/vendure-ecommerce/vendure/commit/1ce87ed))
* **dashboard** Respect base path of Vite config in router ([7716ece](https://github.com/vendure-ecommerce/vendure/commit/7716ece))

## <small>3.3.4 (2025-06-19)</small>

#### Fixes

* **core** Add missing peer deps and docs (#3595) ([36cf92b](https://github.com/vendure-ecommerce/vendure/commit/36cf92b)), closes [#3595](https://github.com/vendure-ecommerce/vendure/issues/3595)
* **core** Call OrderInterceptor `willRemoveItemFromOrder` on `removeAllItemsFromOrder` (#3578) (#3592) ([6c239bf](https://github.com/vendure-ecommerce/vendure/commit/6c239bf)), closes [#3578](https://github.com/vendure-ecommerce/vendure/issues/3578) [#3592](https://github.com/vendure-ecommerce/vendure/issues/3592)
* **core** Further stability improvement to default scheduler ([664b919](https://github.com/vendure-ecommerce/vendure/commit/664b919))
* **core** Improve fault-tolerance of default scheduler ([852cdce](https://github.com/vendure-ecommerce/vendure/commit/852cdce))
* **core** Improve ProductOptionGroup soft-delete handling (#3581) ([95d9417](https://github.com/vendure-ecommerce/vendure/commit/95d9417)), closes [#3581](https://github.com/vendure-ecommerce/vendure/issues/3581)
* **core** Product by slug query filters on channel (#3591) ([357de30](https://github.com/vendure-ecommerce/vendure/commit/357de30)), closes [#3591](https://github.com/vendure-ecommerce/vendure/issues/3591)
* **core** Safer access to queryRunner in transactions ([5beb2fe](https://github.com/vendure-ecommerce/vendure/commit/5beb2fe)), closes [#3565](https://github.com/vendure-ecommerce/vendure/issues/3565)
* **dashboard** Allow customization of custom field columns (#3597) ([f42085b](https://github.com/vendure-ecommerce/vendure/commit/f42085b)), closes [#3597](https://github.com/vendure-ecommerce/vendure/issues/3597)
* **dashboard** Fix bug preventing login screen from rendering ([cc77ddf](https://github.com/vendure-ecommerce/vendure/commit/cc77ddf))

#### Features

* **dashboard** Custom nav sections (#3598) ([cbc0409](https://github.com/vendure-ecommerce/vendure/commit/cbc0409)), closes [#3598](https://github.com/vendure-ecommerce/vendure/issues/3598)
* **dashboard** Enhance Vite plugin configuration for build output management ([257bc03](https://github.com/vendure-ecommerce/vendure/commit/257bc03))
* **dashboard** Support for custom fields in detail page component (#3599) ([32314cc](https://github.com/vendure-ecommerce/vendure/commit/32314cc)), closes [#3599](https://github.com/vendure-ecommerce/vendure/issues/3599)

#### Perf

* **job-queue-plugin** Optimize list query for BullMQJobQueuePlugin (#3590) ([208b87a](https://github.com/vendure-ecommerce/vendure/commit/208b87a)), closes [#3590](https://github.com/vendure-ecommerce/vendure/issues/3590)

## <small>3.3.3 (2025-06-06)</small>

#### Fixes

* **admin-ui** Make product / variant cols link to detail pages in order table (#3552) ([0fda452](https://github.com/vendure-ecommerce/vendure/commit/0fda452)), closes [#3552](https://github.com/vendure-ecommerce/vendure/issues/3552)
* **core** Export OrderableAsset (#3571) ([e17aaf6](https://github.com/vendure-ecommerce/vendure/commit/e17aaf6)), closes [#3571](https://github.com/vendure-ecommerce/vendure/issues/3571)
* **core** Include custom fields on `activePaymentMethods` and `activeShippingMethods` queries (#3513) ([bb4723d](https://github.com/vendure-ecommerce/vendure/commit/bb4723d)), closes [#3513](https://github.com/vendure-ecommerce/vendure/issues/3513)
* **core** Update @nestjs/* packages version constraint (#3577) ([1a8eece](https://github.com/vendure-ecommerce/vendure/commit/1a8eece)), closes [#3577](https://github.com/vendure-ecommerce/vendure/issues/3577)
* **dashboard** Do not throw on compilation errors by default ([b1df849](https://github.com/vendure-ecommerce/vendure/commit/b1df849))
* **dashboard** Fix admin auth & channel selection bugs (#3562) ([3b9c090](https://github.com/vendure-ecommerce/vendure/commit/3b9c090)), closes [#3562](https://github.com/vendure-ecommerce/vendure/issues/3562)
* **dashboard** Fix default channel list columns ([c552aa5](https://github.com/vendure-ecommerce/vendure/commit/c552aa5))
* **dashboard** Fix default column order ([1e1dc8e](https://github.com/vendure-ecommerce/vendure/commit/1e1dc8e))
* **dashboard** Fix default column visibility ([029dd31](https://github.com/vendure-ecommerce/vendure/commit/029dd31))
* **dashboard** Fix issue with form not being marked dirty until second interaction ([604cf4f](https://github.com/vendure-ecommerce/vendure/commit/604cf4f))
* **dashboard** Fix loading of server config on page refresh ([66a7977](https://github.com/vendure-ecommerce/vendure/commit/66a7977))
* **dashboard** Fix positioning of toasts ([38785e7](https://github.com/vendure-ecommerce/vendure/commit/38785e7))
* **dashboard** Fix render issues for asset & facet blocks ([e14c457](https://github.com/vendure-ecommerce/vendure/commit/e14c457))
* **dashboard** Improve responsiveness of form state ([21dc4bf](https://github.com/vendure-ecommerce/vendure/commit/21dc4bf))
* **dashboard** Improve styling of channel switcher ([829513c](https://github.com/vendure-ecommerce/vendure/commit/829513c))

#### Features

* **dashboard** Add reset button for data table columns ([5877ef5](https://github.com/vendure-ecommerce/vendure/commit/5877ef5))
* **dashboard** Implement adding new variants & product options ([7646a4a](https://github.com/vendure-ecommerce/vendure/commit/7646a4a))

## <small>3.3.2 (2025-05-28)</small>

#### Fixes

* **core** Create spans for method calls within same class (#3564) ([a2721d1](https://github.com/vendure-ecommerce/vendure/commit/a2721d1)), closes [#3564](https://github.com/vendure-ecommerce/vendure/issues/3564)
* **core** Enhance error handling for Error instances in logger (#3561) ([a580e88](https://github.com/vendure-ecommerce/vendure/commit/a580e88)), closes [#3561](https://github.com/vendure-ecommerce/vendure/issues/3561)
* **dashboard** Authenticated status race condition (#3554) ([58ac01b](https://github.com/vendure-ecommerce/vendure/commit/58ac01b)), closes [#3554](https://github.com/vendure-ecommerce/vendure/issues/3554)
* **dashboard** Fetch channel info on login ([81f6659](https://github.com/vendure-ecommerce/vendure/commit/81f6659))

## <small>3.3.1 (2025-05-20)</small>

#### Fixes

* **admin-ui** Improve Arabic translations (#3531) ([dbd3c65](https://github.com/vendure-ecommerce/vendure/commit/dbd3c65)), closes [#3531](https://github.com/vendure-ecommerce/vendure/issues/3531)
* **admin-ui** Update French translations from (#3525) ([d03bc2b](https://github.com/vendure-ecommerce/vendure/commit/d03bc2b)), closes [#3525](https://github.com/vendure-ecommerce/vendure/issues/3525)
* **core)** Use job alias for clean-jobs task by (#3537) https://github.com/vendure-ecommerce/vendure/pull/3537
* **core** Fix circular merge-deep stack overflow issue (#3549) ([bdc3438](https://github.com/vendure-ecommerce/vendure/commit/bdc3438)), closes [#3549](https://github.com/vendure-ecommerce/vendure/issues/3549)
* **dashboard** Fix padding on pages ([fc27608](https://github.com/vendure-ecommerce/vendure/commit/fc27608))
* **graphiql-plugin** Fix asset path for pnpm ([882a055](https://github.com/vendure-ecommerce/vendure/commit/882a055)), closes [#3499](https://github.com/vendure-ecommerce/vendure/issues/3499)
* **payments-plugin** Enable use of "klarna" payment via Mollie (#3538) ([6313d0f](https://github.com/vendure-ecommerce/vendure/commit/6313d0f)), closes [#3538](https://github.com/vendure-ecommerce/vendure/issues/3538)
* **telemetry-plugin** Fix compatibility range ([ac0528d](https://github.com/vendure-ecommerce/vendure/commit/ac0528d))
* **testing** Await outstanding jobs before populating test data (#3544) ([cc32ce7](https://github.com/vendure-ecommerce/vendure/commit/cc32ce7)), closes [#3544](https://github.com/vendure-ecommerce/vendure/issues/3544)

## 3.3.0 (2025-05-12)

#### Fixes

* **dashboard** Fix checkbox on DetailPage ([f32d66d](https://github.com/vendure-ecommerce/vendure/commit/f32d66d))
* **dashboard** Fix Page component not rendering when used externally ([3322fa1](https://github.com/vendure-ecommerce/vendure/commit/3322fa1))
* **dashboard** Fix some form validation issues ([e811e99](https://github.com/vendure-ecommerce/vendure/commit/e811e99))
* **dashboard** Fix some small issues with extensions, add docs ([7dca28c](https://github.com/vendure-ecommerce/vendure/commit/7dca28c))
* **dashboard** Fix types for dashboard extensions ([c6ade27](https://github.com/vendure-ecommerce/vendure/commit/c6ade27))
* **dashboard** Improve DetailPage component ([c4c93a0](https://github.com/vendure-ecommerce/vendure/commit/c4c93a0))
* **dashboard** Preserve Vite alias settings if set ([d79ea77](https://github.com/vendure-ecommerce/vendure/commit/d79ea77))
* **dashboard** Prevent navigation blocker on creating entity ([b5851d5](https://github.com/vendure-ecommerce/vendure/commit/b5851d5))

#### Features

* **telemetry-plugin** Add new `@vendure/telemetry-plugin` package
* **graphiql-plugin** Add new `@vendure/graphiql-plugin` package
* **admin-ui** Manual triggering of scheduled tasks ([76d74e1](https://github.com/vendure-ecommerce/vendure/commit/76d74e1)), closes [#1425](https://github.com/vendure-ecommerce/vendure/issues/1425)
* **core** Add scheduled task to clean up jobs from the DB ([ed28280](https://github.com/vendure-ecommerce/vendure/commit/ed28280))
* **core** Allow manual triggering of scheduled tasks ([2a89b2a](https://github.com/vendure-ecommerce/vendure/commit/2a89b2a)), closes [#1425](https://github.com/vendure-ecommerce/vendure/issues/1425)
* **core** Apply Instrumentation to all services & key helper classes ([4b3f526](https://github.com/vendure-ecommerce/vendure/commit/4b3f526))
* **core** Enhance cache service and SQL cache strategy with tracing support ([374db42](https://github.com/vendure-ecommerce/vendure/commit/374db42))
* **core** Enhance scheduled task execution with RequestContext ([c0b5902](https://github.com/vendure-ecommerce/vendure/commit/c0b5902))
* **core** Integrate tracing into ConfigService for enhanced custom fields logging ([195132f](https://github.com/vendure-ecommerce/vendure/commit/195132f))
* **core** Tracing for job-queue ([7a27428](https://github.com/vendure-ecommerce/vendure/commit/7a27428))
* **core** Update tracing in AppModule to enhance middleware configuration logging ([596846c](https://github.com/vendure-ecommerce/vendure/commit/596846c))
* **create** Update default tsconfig ([ee40c50](https://github.com/vendure-ecommerce/vendure/commit/ee40c50))
* **dashboard** Add refresh button to data tables ([891ff15](https://github.com/vendure-ecommerce/vendure/commit/891ff15))
* **dashboard** Implement alert system with customizable alerts ([13c8969](https://github.com/vendure-ecommerce/vendure/commit/13c8969))
* **dashboard** Manual triggering of scheduled tasks ([226730e](https://github.com/vendure-ecommerce/vendure/commit/226730e)), closes [#1425](https://github.com/vendure-ecommerce/vendure/issues/1425)

## <small>3.2.4 (2025-05-05)</small>

#### Fixes

* **admin-ui-plugin** Fix issue with sendFile and absolute paths (#3499) ([62664cb](https://github.com/vendure-ecommerce/vendure/commit/62664cb)), closes [#3499](https://github.com/vendure-ecommerce/vendure/issues/3499)
* **admin-ui-plugin** Fix proxy-middleware v2 to v3 issue (#3507) ([ae20be1](https://github.com/vendure-ecommerce/vendure/commit/ae20be1)), closes [#3507](https://github.com/vendure-ecommerce/vendure/issues/3507)
* **admin-ui-plugin** proxy target template string (#3514) ([8e6a991](https://github.com/vendure-ecommerce/vendure/commit/8e6a991)), closes [#3514](https://github.com/vendure-ecommerce/vendure/issues/3514)
* **admin-ui** Relax rxjs dependency version ([01b7375](https://github.com/vendure-ecommerce/vendure/commit/01b7375))
* **core** Detect circular reference in collection ancestor tree ([c427d8e](https://github.com/vendure-ecommerce/vendure/commit/c427d8e))
* **core** Enhance password validation strategy with maxLength option and set default maxLength ([fbd3a94](https://github.com/vendure-ecommerce/vendure/commit/fbd3a94))
* **core** Fix PaginatedList filtering by calculated property ([7966978](https://github.com/vendure-ecommerce/vendure/commit/7966978))
* **dashboard** Fix several issues related to login/logout ([7b3b917](https://github.com/vendure-ecommerce/vendure/commit/7b3b917))
* **dashboard** Fix some issues on order list/detail pages ([fe0ceb4](https://github.com/vendure-ecommerce/vendure/commit/fe0ceb4))
* **dashboard** Improve compatibility of config loading ([7cb3624](https://github.com/vendure-ecommerce/vendure/commit/7cb3624))

## <small>3.2.3 (2025-04-17)</small>

#### Fixes

* **admin-ui** Fix missing product variant list tab ([047eaa5](https://github.com/vendure-ecommerce/vendure/commit/047eaa5))
* **core** Align Express & types versions ([ba4111b](https://github.com/vendure-ecommerce/vendure/commit/ba4111b))
* **core** Relax some express typings to prevent v4/v5 types conflicts ([97e53d5](https://github.com/vendure-ecommerce/vendure/commit/97e53d5))

## <small>3.2.2 (2025-04-03)</small>

#### Fixes

* **dashboard** Fix dashboard plugin publishing ([65281e5f](https://github.com/vendure-ecommerce/vendure/commit/65281e5f))

## <small>3.2.1 (2025-04-03)</small>

#### Fixes

* **job-queue-plugin** Respect custom prefix for BullMQ Redis keys ([40f1cb8](https://github.com/vendure-ecommerce/vendure/commit/40f1cb8))
* **ui-devkit** Silence sass warnings during compilation ([724e849](https://github.com/vendure-ecommerce/vendure/commit/724e849))
* **ui-devkit** Update angular.json for v19 compatibility ([1ac69a7](https://github.com/vendure-ecommerce/vendure/commit/1ac69a7))

## 3.2.0 (2025-04-02)

#### Fixes

* **admin-ui** Fix build error ([fbbcc3e](https://github.com/vendure-ecommerce/vendure/commit/fbbcc3e))
* **admin-ui** Fix incorrect pagination range (#3404) ([1ee2d45](https://github.com/vendure-ecommerce/vendure/commit/1ee2d45)), closes [#3404](https://github.com/vendure-ecommerce/vendure/issues/3404)
* **core** Avoid variant options combination check on updateProductVariant mutation (#3361) ([c820f42](https://github.com/vendure-ecommerce/vendure/commit/c820f42)), closes [#3361](https://github.com/vendure-ecommerce/vendure/issues/3361)
* **core** Fix progress reporting for collection filters job ([3976148](https://github.com/vendure-ecommerce/vendure/commit/3976148))
* **core** Use correct precision for CacheItem.expiresAt ([12e2db0](https://github.com/vendure-ecommerce/vendure/commit/12e2db0))

#### Features

* **admin-ui** Add Japanese UI translations (#3400) ([d24964a](https://github.com/vendure-ecommerce/vendure/commit/d24964a)), closes [#3400](https://github.com/vendure-ecommerce/vendure/issues/3400)
* **common** Add exports field to package.json for module resolution ([5623c2b](https://github.com/vendure-ecommerce/vendure/commit/5623c2b))
* **core** Add two new queries to get public payment and shipping methods ([1aa75d5](https://github.com/vendure-ecommerce/vendure/commit/1aa75d5))
* **core** Add two new queries to get public payment and shipping methods ([5c7fe42](https://github.com/vendure-ecommerce/vendure/commit/5c7fe42))
* **core** Add updateProductVariant mutation ([0b854b4](https://github.com/vendure-ecommerce/vendure/commit/0b854b4))
* **core** Add verification token strategy (#3294) ([9375ba2](https://github.com/vendure-ecommerce/vendure/commit/9375ba2)), closes [#3294](https://github.com/vendure-ecommerce/vendure/issues/3294)
* **core** Update all major dependencies (#3445) ([d376d83](https://github.com/vendure-ecommerce/vendure/commit/d376d83)), closes [#3445](https://github.com/vendure-ecommerce/vendure/issues/3445)
* **harden-plugin** Allow skipping complexity check in Harden Plugin (#3340) ([0bef00b](https://github.com/vendure-ecommerce/vendure/commit/0bef00b)), closes [#3340](https://github.com/vendure-ecommerce/vendure/issues/3340)
* **job-queue-plugin** Add support for job options Priority ([90b5e05](https://github.com/vendure-ecommerce/vendure/commit/90b5e05))

#### Perf

* **core** Remove duplicated calls to promotion checks ([e3508f3](https://github.com/vendure-ecommerce/vendure/commit/e3508f3))

### BREAKING CHANGE

* If you are using the DefaultCachePlugin, then
  you should generate a migration that adds `precision(3)` to the
  `expiresAt` column. This will only affect cache records so no prod
  data will be affected by it.

## <small>3.1.8 (2025-03-31)</small>

#### Fixes

* **admin-ui** Fix product variant list location (#3410) ([5082cc9](https://github.com/vendure-ecommerce/vendure/commit/5082cc9)), closes [#3410](https://github.com/vendure-ecommerce/vendure/issues/3410)
* **core** Eligible payment methods must be enabled (#3406) ([45852ea](https://github.com/vendure-ecommerce/vendure/commit/45852ea)), closes [#3406](https://github.com/vendure-ecommerce/vendure/issues/3406)
* **job-queue-plugin** Fix ignored values from BullMQ workerOptions (#3440) ([a9aea24](https://github.com/vendure-ecommerce/vendure/commit/a9aea24)), closes [#3440](https://github.com/vendure-ecommerce/vendure/issues/3440)

## <small>3.1.7 (2025-03-06)</small>

#### Fixes

* **admin-ui** Fix broken Collection list & Order detail views ([6a5bb90](https://github.com/vendure-ecommerce/vendure/commit/6a5bb90)), fixes regression from [#3368](https://github.com/vendure-ecommerce/vendure/issues/3368)

## <small>3.1.6 (2025-03-06)</small>

#### Fixes

* **core** Fix FastImporterService when using stockOnHand ([f97484c](https://github.com/vendure-ecommerce/vendure/commit/f97484c)), fixes regression from [#3288](https://github.com/vendure-ecommerce/vendure/issues/3288)

## <small>3.1.5 (2025-03-06)</small>

#### Fixes

* **admin-ui** Fix incorrect tracking id on ProductOption's / ProductOption list per page switch (#3368) ([33cfea6](https://github.com/vendure-ecommerce/vendure/commit/33cfea6)), closes [#3368](https://github.com/vendure-ecommerce/vendure/issues/3368)
* **core** Fix fast-importer-service stock location (#3288) ([59d6447](https://github.com/vendure-ecommerce/vendure/commit/59d6447)), closes [#3288](https://github.com/vendure-ecommerce/vendure/issues/3288)
* **core** Fix order cancellation when shipping has tax (#3393) ([e753df9](https://github.com/vendure-ecommerce/vendure/commit/e753df9)), closes [#3393](https://github.com/vendure-ecommerce/vendure/issues/3393)
* **core** Fix server crash when subscribable job times out ([7f851c3](https://github.com/vendure-ecommerce/vendure/commit/7f851c3)), closes [#3397](https://github.com/vendure-ecommerce/vendure/issues/3397)

## <small>3.1.4 (2025-02-28)</small>

#### Fixes

* **admin-ui** Fix app crash when user has unknown locale ([a4c1de2](https://github.com/vendure-ecommerce/vendure/commit/a4c1de2)), closes [#3362](https://github.com/vendure-ecommerce/vendure/issues/3362)
* **core** Do not return deleted ProductOptionGroups (#3363) ([1df1b7f](https://github.com/vendure-ecommerce/vendure/commit/1df1b7f)), closes [#3363](https://github.com/vendure-ecommerce/vendure/issues/3363)
* **core** Fix progress reporting for collection filters job ([eaa8eb6](https://github.com/vendure-ecommerce/vendure/commit/eaa8eb6))
* **core** Fix struct custom field support on GlobalSettings ([50a90e7](https://github.com/vendure-ecommerce/vendure/commit/50a90e7)), closes [#3381](https://github.com/vendure-ecommerce/vendure/issues/3381)
* **core** Add missing "enabled" flag to CreateProductVariant input (#3377) ([f5a0f99](https://github.com/vendure-ecommerce/vendure/commit/f5a0f99)), closes [#3377](https://github.com/vendure-ecommerce/vendure/issues/3377)

#### Perf

* **core** Remove duplicated calls to promotion checks ([4407488](https://github.com/vendure-ecommerce/vendure/commit/4407488))

## <small>3.1.3 (2025-02-14)</small>

#### Fixes

* **admin-ui** Improve display of OrderLine custom fields in form ([4e92d85](https://github.com/vendure-ecommerce/vendure/commit/4e92d85))
* **core** Allow non-public customOrderLineFields in admin api (#3357) ([becfe9d](https://github.com/vendure-ecommerce/vendure/commit/becfe9d)), closes [#3357](https://github.com/vendure-ecommerce/vendure/issues/3357)
* **core** Fix undefined type issue with nested fragment spreads (#3351) ([d0c0454](https://github.com/vendure-ecommerce/vendure/commit/d0c0454)), closes [#3351](https://github.com/vendure-ecommerce/vendure/issues/3351)

#### Perf

* **core** Optimize payload of apply-collection-filters job ([4157033](https://github.com/vendure-ecommerce/vendure/commit/4157033))
* **core** Optimize payload size for buffered jobs in DB ([f81a908](https://github.com/vendure-ecommerce/vendure/commit/f81a908))
* **job-queue-plugin** Optimize payload size for buffered jobs in Redis ([7c72352](https://github.com/vendure-ecommerce/vendure/commit/7c72352))

## <small>3.1.2 (2025-01-22)</small>

#### Fixes

* **admin-ui** Add support for mac command key for selection manager (#3315) ([c1cfb737](https://github.com/vendure-ecommerce/vendure/commit/c1cfb737))
* **admin-ui** Add ProductVariantPrice custom fields ui inputs (#3327) ([0d22b25](https://github.com/vendure-ecommerce/vendure/commit/0d22b25)), closes [#3327](https://github.com/vendure-ecommerce/vendure/issues/3327)
* **admin-ui** Update Polish localization (#3309) ([82787cf](https://github.com/vendure-ecommerce/vendure/commit/82787cf)), closes [#3309](https://github.com/vendure-ecommerce/vendure/issues/3309)
* **common** Contract multiple sequential replacers to just one in normalizeString (#3289) ([f362a4b](https://github.com/vendure-ecommerce/vendure/commit/f362a4b)), closes [#3289](https://github.com/vendure-ecommerce/vendure/issues/3289)
* **core** Clear previous line adjustments before testing order item promotions (#3320) ([c970dea](https://github.com/vendure-ecommerce/vendure/commit/c970dea)), closes [#3320](https://github.com/vendure-ecommerce/vendure/issues/3320)
* **core** Fix schema error with readonly Address custom field ([1bddbcc](https://github.com/vendure-ecommerce/vendure/commit/1bddbcc)), closes [#3326](https://github.com/vendure-ecommerce/vendure/issues/3326)
* **core** Improvements to Redis cache plugin (#3303) ([b631781](https://github.com/vendure-ecommerce/vendure/commit/b631781)), closes [#3303](https://github.com/vendure-ecommerce/vendure/issues/3303)
* **core** Include variant custom fields when duplicating a product (#3203) ([69a1de0](https://github.com/vendure-ecommerce/vendure/commit/69a1de0)), closes [#3203](https://github.com/vendure-ecommerce/vendure/issues/3203)
* **create** Specify Typesense Docker image version ([fd6a9fd](https://github.com/vendure-ecommerce/vendure/commit/fd6a9fd))
* **elasticsearch-plugin** Improve search results (#3284) ([b8112be0](https://github.com/vendure-ecommerce/vendure/commit/b8112be0))
* **payments-plugin** Fix null access error in BraintreePlugin ([627d930](https://github.com/vendure-ecommerce/vendure/commit/627d930))
* **payments-plugin** Stripe plugin supports correct languageCode (#3298) ([4349ef8](https://github.com/vendure-ecommerce/vendure/commit/4349ef8)), closes [#3298](https://github.com/vendure-ecommerce/vendure/issues/3298)

## <small>3.1.1 (2024-12-17)</small>

#### Fixes

* **asset-server-plugin** Correctly handle EXIF rotation on source files (#3260) ([d606d7a](https://github.com/vendure-ecommerce/vendure/commit/d606d7a)), closes [#3260](https://github.com/vendure-ecommerce/vendure/issues/3260) [#3259](https://github.com/vendure-ecommerce/vendure/issues/3259)
* **core** Fix circular reference error in email sending job ([02bcdba](https://github.com/vendure-ecommerce/vendure/commit/02bcdba)), closes [#3277](https://github.com/vendure-ecommerce/vendure/issues/3277)
* **core** Fix serialization of ShippingMethod ([0c122bc](https://github.com/vendure-ecommerce/vendure/commit/0c122bc)), closes [#3277](https://github.com/vendure-ecommerce/vendure/issues/3277)

## 3.1.0 (2024-12-04)

#### Features

* **admin-ui** Improve facet selector with the code (#3175) ([35892a5](https://github.com/vendure-ecommerce/vendure/commit/35892a5)), closes [#3175](https://github.com/vendure-ecommerce/vendure/issues/3175)
* **admin-ui** Integrate Vendure Assets Picker with ProseMirror and add single image selection (#3033) ([18e5ab9](https://github.com/vendure-ecommerce/vendure/commit/18e5ab9)), closes [#3033](https://github.com/vendure-ecommerce/vendure/issues/3033)
* **admin-ui** Set default shipping and billing address for draft orders (#3196) ([dec72e7](https://github.com/vendure-ecommerce/vendure/commit/dec72e7)), closes [#3196](https://github.com/vendure-ecommerce/vendure/issues/3196) [#2342](https://github.com/vendure-ecommerce/vendure/issues/2342)
* **asset-server-plugin** Implement ImageTransformStrategy for improved control over image transformations (#3240) ([dde738d](https://github.com/vendure-ecommerce/vendure/commit/dde738d)), closes [#3240](https://github.com/vendure-ecommerce/vendure/issues/3240) [#3040](https://github.com/vendure-ecommerce/vendure/issues/3040)
* **core** Add custom field support for Payment, Refund, ShippingLine, StockLevel, StockMovement, Session, HistoryEntry ([1167102](https://github.com/vendure-ecommerce/vendure/commit/1167102)), closes [#3044](https://github.com/vendure-ecommerce/vendure/issues/3044)
* **core** Add means to selectively ignore plugin compatibility errors ([e362475](https://github.com/vendure-ecommerce/vendure/commit/e362475)), closes [#2958](https://github.com/vendure-ecommerce/vendure/issues/2958)
* **core** Add OrderInterceptor API (#3233) ([7706e35](https://github.com/vendure-ecommerce/vendure/commit/7706e35)), closes [#3233](https://github.com/vendure-ecommerce/vendure/issues/3233) [#2123](https://github.com/vendure-ecommerce/vendure/issues/2123)
* **core** Add replicationMode for ctx and getRepository (#2746) ([60cdae3](https://github.com/vendure-ecommerce/vendure/commit/60cdae3)), closes [#2746](https://github.com/vendure-ecommerce/vendure/issues/2746)
* **core** Add StockLocationEvent ([5cff832](https://github.com/vendure-ecommerce/vendure/commit/5cff832))
* **core** Allow unsetting of shipping and billing addresses (#3185) ([e0f2118](https://github.com/vendure-ecommerce/vendure/commit/e0f2118)), closes [#3185](https://github.com/vendure-ecommerce/vendure/issues/3185)
* **core** Create a user from external authentication (#3005) ([bb28d70](https://github.com/vendure-ecommerce/vendure/commit/bb28d70)), closes [#3005](https://github.com/vendure-ecommerce/vendure/issues/3005)
* **core** Create Cache class for a more convenient caching API ([a7ceb74](https://github.com/vendure-ecommerce/vendure/commit/a7ceb74)), closes [#3043](https://github.com/vendure-ecommerce/vendure/issues/3043)
* **core** Create PromotionLineAction (#2971) ([0ff8288](https://github.com/vendure-ecommerce/vendure/commit/0ff8288)), closes [#2971](https://github.com/vendure-ecommerce/vendure/issues/2971) [#2956](https://github.com/vendure-ecommerce/vendure/issues/2956)
* **core** Enable hydration of translations relation ([84710d5](https://github.com/vendure-ecommerce/vendure/commit/84710d5))
* **core** Implement bulk versions of order operations ([8d65219](https://github.com/vendure-ecommerce/vendure/commit/8d65219))
* **core** Implement cache invalidation by tags ([382e314](https://github.com/vendure-ecommerce/vendure/commit/382e314)), closes [#3043](https://github.com/vendure-ecommerce/vendure/issues/3043)
* **core** Implement CacheStrategy and CacheService ([489c9c0](https://github.com/vendure-ecommerce/vendure/commit/489c9c0)), closes [#3043](https://github.com/vendure-ecommerce/vendure/issues/3043)
* **core** Implement caching for FacetValueChecker ([3603b11](https://github.com/vendure-ecommerce/vendure/commit/3603b11)), closes [#3043](https://github.com/vendure-ecommerce/vendure/issues/3043)
* **core** Implement redis cache plugin ([9d99593](https://github.com/vendure-ecommerce/vendure/commit/9d99593)), closes [#3043](https://github.com/vendure-ecommerce/vendure/issues/3043)
* **core** Implement support for struct custom field type (#3178) ([dffd123](https://github.com/vendure-ecommerce/vendure/commit/dffd123)), closes [#3178](https://github.com/vendure-ecommerce/vendure/issues/3178)
* **core** Include address-based tax zone strategy (#3198) ([5547128](https://github.com/vendure-ecommerce/vendure/commit/5547128)), closes [#3198](https://github.com/vendure-ecommerce/vendure/issues/3198)
* **core** Initial DefaultCachePlugin implementation ([9c2433f](https://github.com/vendure-ecommerce/vendure/commit/9c2433f)), closes [#3043](https://github.com/vendure-ecommerce/vendure/issues/3043)
* **core** Introduce new default MultiChannelStockLocationStrategy ([62090c9](https://github.com/vendure-ecommerce/vendure/commit/62090c9)), closes [#2356](https://github.com/vendure-ecommerce/vendure/issues/2356)
* **email-plugin** Allow specifying metadata for EmailSendEvent (#2963) ([ac0baf9](https://github.com/vendure-ecommerce/vendure/commit/ac0baf9)), closes [#2963](https://github.com/vendure-ecommerce/vendure/issues/2963)
* **payments-plugin** Add option to StripePlugin to handle payment intent that doesn't have Vendure metadata (#3250) ([ec934dd](https://github.com/vendure-ecommerce/vendure/commit/ec934dd)), closes [#3250](https://github.com/vendure-ecommerce/vendure/issues/3250)
* **payments-plugin** Allow additional options on Stripe payment intent creation (#3194) ([3f66216](https://github.com/vendure-ecommerce/vendure/commit/3f66216)), closes [#3194](https://github.com/vendure-ecommerce/vendure/issues/3194)

#### Fixes

* **admin-ui** Only update facetValueIds if changed ([8f22ef8](https://github.com/vendure-ecommerce/vendure/commit/8f22ef8))
* **core** Fix error in FacetValueChecker on nullish input ([44aad49](https://github.com/vendure-ecommerce/vendure/commit/44aad49))
* **core** Fix error with new session cache when seeding data ([508f797](https://github.com/vendure-ecommerce/vendure/commit/508f797))
* **core** Update DefaultMoneyStrategy.round() Logic (#3023) ([f43c204](https://github.com/vendure-ecommerce/vendure/commit/f43c204)), closes [#3023](https://github.com/vendure-ecommerce/vendure/issues/3023)

#### Perf

* **core** Improve efficiency of order merge ([0a60ee9](https://github.com/vendure-ecommerce/vendure/commit/0a60ee9))

### BREAKING CHANGE

* A technically breaking change in this release is that we have corrected the default rounding logic:

```ts
// v3.0
return Math.round(value) * quantity;

// v3.1
return Math.round(value * quantity);
```

This makes order totals calculations much more "correct" as per most people's expectations, but it pointed out as a technically breaking change in the unlikely event that you rely on the old, less correct method of rounding.

* If you are using the `FacetValueChecker` utility class, you should
  update your code to get it via the `Injector` rather than directly instantiating it.

Existing code _will_ still work without changes, but by updating you will see improved
performance due to new caching techniques.

```diff
- facetValueChecker = new FacetValueChecker(injector.get(TransactionalConnection));
+ facetValueChecker = injector.get(FacetValueChecker);
```

## <small>3.0.8 (2024-12-03)</small>

#### Fixes

* **admin-ui** Fix adding country to zone dialog ([22eaf6c](https://github.com/vendure-ecommerce/vendure/commit/22eaf6c)), closes [#3212](https://github.com/vendure-ecommerce/vendure/issues/3212)

## <small>3.0.7 (2024-12-02)</small>

#### Fixes

* **admin-ui** Preset filters preserve query parameters (#3176) ([7a25bef](https://github.com/vendure-ecommerce/vendure/commit/7a25bef)), closes [#3176](https://github.com/vendure-ecommerce/vendure/issues/3176)
* **asset-server-plugin** Fix issues with s3/minio file retrieval ([8545267](https://github.com/vendure-ecommerce/vendure/commit/8545267)), closes [#3217](https://github.com/vendure-ecommerce/vendure/issues/3217)
* **core** Fixed wrong join statement for variant on ProductVariantPrice (#3230) (#3231) ([7798ddc](https://github.com/vendure-ecommerce/vendure/commit/7798ddc)), closes [#3230](https://github.com/vendure-ecommerce/vendure/issues/3230) [#3231](https://github.com/vendure-ecommerce/vendure/issues/3231)
* **core** Improve resolution of OrderLine.featuredAsset (#3177) ([4530c81](https://github.com/vendure-ecommerce/vendure/commit/4530c81)), closes [#3177](https://github.com/vendure-ecommerce/vendure/issues/3177)
* **payments-plugin** False positive error logging fix in MolliePlugin (#3245) ([adfbda6](https://github.com/vendure-ecommerce/vendure/commit/adfbda6)), closes [#3245](https://github.com/vendure-ecommerce/vendure/issues/3245)

## <small>3.0.6 (2024-11-15)</small>

#### Fixes

* **admin-ui** Fix collection product filter dark theme (#3172) ([9f4eb9e](https://github.com/vendure-ecommerce/vendure/commit/9f4eb9e)), closes [#3172](https://github.com/vendure-ecommerce/vendure/issues/3172)
* **admin-ui** Fix incorrect type when dealing with numeric value in list (#3094) ([76d66c6](https://github.com/vendure-ecommerce/vendure/commit/76d66c6)), closes [#3094](https://github.com/vendure-ecommerce/vendure/issues/3094) [#3093](https://github.com/vendure-ecommerce/vendure/issues/3093)
* **admin-ui** Fix variant detail quick-jump component (#3189) ([478989e](https://github.com/vendure-ecommerce/vendure/commit/478989e)), closes [#3189](https://github.com/vendure-ecommerce/vendure/issues/3189)
* **admin-ui** Make registerPageTab work on 'order-list' location (#3187) ([61d808b](https://github.com/vendure-ecommerce/vendure/commit/61d808b)), closes [#3187](https://github.com/vendure-ecommerce/vendure/issues/3187)
* **admin-ui** Refund order dialog is showing the wrong field for prorated unit price (#3151) ([3777555](https://github.com/vendure-ecommerce/vendure/commit/3777555)), closes [#3151](https://github.com/vendure-ecommerce/vendure/issues/3151)
* **admin-ui** Swedish translation adjustments (#3174) ([a21f129](https://github.com/vendure-ecommerce/vendure/commit/a21f129)), closes [#3174](https://github.com/vendure-ecommerce/vendure/issues/3174)
* **common** Allow null on idsAreEqual function (#3171) ([7bba907](https://github.com/vendure-ecommerce/vendure/commit/7bba907)), closes [#3171](https://github.com/vendure-ecommerce/vendure/issues/3171)
* **core** Added deprecation notices to the old refund input fields (#3119) ([7324bb3](https://github.com/vendure-ecommerce/vendure/commit/7324bb3)), closes [#3119](https://github.com/vendure-ecommerce/vendure/issues/3119)
* **core** Disallow deletion of default channel (#3181) ([2ed3211](https://github.com/vendure-ecommerce/vendure/commit/2ed3211)), closes [#3181](https://github.com/vendure-ecommerce/vendure/issues/3181)
* **core** Fix error on internal Administrator customFields (#3159) ([e03b7f0](https://github.com/vendure-ecommerce/vendure/commit/e03b7f0)), closes [#3159](https://github.com/vendure-ecommerce/vendure/issues/3159)
* **core** Fix merging order with conflicting products using UseGuestStrategy (#3155) ([f0607aa](https://github.com/vendure-ecommerce/vendure/commit/f0607aa)), closes [#3155](https://github.com/vendure-ecommerce/vendure/issues/3155)
* **core** Fix returning stale data in Role Update Event (#3154) ([71f85d2](https://github.com/vendure-ecommerce/vendure/commit/71f85d2)), closes [#3154](https://github.com/vendure-ecommerce/vendure/issues/3154)
* **payments-plugin** Check for eligibility of Mollie method (#3200) ([a12dedc](https://github.com/vendure-ecommerce/vendure/commit/a12dedc)), closes [#3200](https://github.com/vendure-ecommerce/vendure/issues/3200)
* **payments-plugin** prevent false positive logging (#3195) ([961297d](https://github.com/vendure-ecommerce/vendure/commit/961297d)), closes [#3195](https://github.com/vendure-ecommerce/vendure/issues/3195)
* **testing** Make test client's `fileUploadMutation` work for more input variable shapes (#3188) ([a8938f4](https://github.com/vendure-ecommerce/vendure/commit/a8938f4)), closes [#3188](https://github.com/vendure-ecommerce/vendure/issues/3188)

## <small>3.0.5 (2024-10-15)</small>

#### Fixes

* **asset-server-plugin** Fix local file read vulnerability when using the LocalAssetStorageStrategy ([e2ee0c4](https://github.com/vendure-ecommerce/vendure/commit/e2ee0c43159b3d13b51b78654481094fdd4850c5)). See the [security advisory](https://github.com/vendure-ecommerce/vendure/security/advisories/GHSA-r9mq-3c9r-fmjq)
* **admin-ui** Fix theme & ui language switcher ([c93589b](https://github.com/vendure-ecommerce/vendure/commit/c93589b)), closes [#3111](https://github.com/vendure-ecommerce/vendure/issues/3111)
* **core** Do not include deleted variants when indexing productInStock (#3110) ([73cb190](https://github.com/vendure-ecommerce/vendure/commit/73cb190)), closes [#3110](https://github.com/vendure-ecommerce/vendure/issues/3110) [#3109](https://github.com/vendure-ecommerce/vendure/issues/3109)
* **core** Fix coupon code validation across multiple channels ([e57cc1b](https://github.com/vendure-ecommerce/vendure/commit/e57cc1b)), closes [#2052](https://github.com/vendure-ecommerce/vendure/issues/2052)
* **core** Fix filtering on list queries of tree entities ([227da05](https://github.com/vendure-ecommerce/vendure/commit/227da05)), closes [#3107](https://github.com/vendure-ecommerce/vendure/issues/3107)
* **core** Improve error message on populating without tax rates ([7e36131](https://github.com/vendure-ecommerce/vendure/commit/7e36131)), closes [#1926](https://github.com/vendure-ecommerce/vendure/issues/1926)

#### Features

* **create** Improved getting started experience (#3128) ([adb4384](https://github.com/vendure-ecommerce/vendure/commit/adb4384)), closes [#3128](https://github.com/vendure-ecommerce/vendure/issues/3128)

## <small>3.0.4 (2024-10-04)</small>

#### Fixes

* **admin-ui-plugin** Implement rate limiting on static server ([9516c71](https://github.com/vendure-ecommerce/vendure/commit/9516c71))
* **admin-ui** Add padding to default relation custom field dropdown ([02e68e0](https://github.com/vendure-ecommerce/vendure/commit/02e68e0))
* **admin-ui** Add support for custom fields on CustomerGroup list ([7128a33](https://github.com/vendure-ecommerce/vendure/commit/7128a33))
* **admin-ui** Enable selective loading of custom fields ([9d7744b](https://github.com/vendure-ecommerce/vendure/commit/9d7744b)), closes [#3097](https://github.com/vendure-ecommerce/vendure/issues/3097)
* **admin-ui** Fix bad locale detection regex ([f336d7f](https://github.com/vendure-ecommerce/vendure/commit/f336d7f))
* **admin-ui** Lazy-load only selected custom fields in list views ([690dd0f](https://github.com/vendure-ecommerce/vendure/commit/690dd0f)), closes [#3097](https://github.com/vendure-ecommerce/vendure/issues/3097)
* **admin-ui** Unsubscribe from alerts when logging out (#3071) ([f38340b](https://github.com/vendure-ecommerce/vendure/commit/f38340b)), closes [#3071](https://github.com/vendure-ecommerce/vendure/issues/3071) [#2188](https://github.com/vendure-ecommerce/vendure/issues/2188)
* **asset-server-plugin** Do not return raw error message on error ([801980e](https://github.com/vendure-ecommerce/vendure/commit/801980e))
* **core** Correctly parse numeric sessionDuration and verificationTokenDuration values (#3080) ([98e4118](https://github.com/vendure-ecommerce/vendure/commit/98e4118)), closes [#3080](https://github.com/vendure-ecommerce/vendure/issues/3080)
* **core** Fix issues caused by f235249f ([5a4299a](https://github.com/vendure-ecommerce/vendure/commit/5a4299a))
* **core** Fix RequestContext race condition causing null activeOrder ([f235249](https://github.com/vendure-ecommerce/vendure/commit/f235249)), closes [#2097](https://github.com/vendure-ecommerce/vendure/issues/2097)
* **core** Handle empty state for product and variant id filter (#3064) ([9a03c84](https://github.com/vendure-ecommerce/vendure/commit/9a03c84)), closes [#3064](https://github.com/vendure-ecommerce/vendure/issues/3064)
* **core** Prevent theoretical polynomial regex attack ([9f4a814](https://github.com/vendure-ecommerce/vendure/commit/9f4a814))
* **core** Remove duplicate call in applyCouponCode resolver ([bffc58a](https://github.com/vendure-ecommerce/vendure/commit/bffc58a))
* **core** Replace insecure randomness with secure randomBytes ([cb556d8](https://github.com/vendure-ecommerce/vendure/commit/cb556d8))
* **payments-plugin** Use default channel in Stripe webhook calls to reach all orders (#3076) ([8434111](https://github.com/vendure-ecommerce/vendure/commit/8434111)), closes [#3076](https://github.com/vendure-ecommerce/vendure/issues/3076)

#### Perf

* **core** Fix performance when using FacetValue-based checks ([a735bdf](https://github.com/vendure-ecommerce/vendure/commit/a735bdf))
* **admin-ui** List views only load the visible custom fields, closes [#3097](https://github.com/vendure-ecommerce/vendure/issues/3097)

## <small>3.0.3 (2024-09-11)</small>

#### Fixes

* **admin-ui** Display up to 3 decimal places in OrderSummary tax rate ([13a1b21](https://github.com/vendure-ecommerce/vendure/commit/13a1b21)), closes [#3051](https://github.com/vendure-ecommerce/vendure/issues/3051)
* **core** Fix regression in correctly setting OrderLine.featuredAsset ([7d070f2](https://github.com/vendure-ecommerce/vendure/commit/7d070f2))

## <small>3.0.2 (2024-09-10)</small>

#### Fixes

* **admin-ui** Fix removing coupon code from draft order ([04340f1](https://github.com/vendure-ecommerce/vendure/commit/04340f1)), closes [#2969](https://github.com/vendure-ecommerce/vendure/issues/2969)
* **core** Fix search indexing issue when working with multiple channels (#3041) ([75ed6e1](https://github.com/vendure-ecommerce/vendure/commit/75ed6e1)), closes [#3041](https://github.com/vendure-ecommerce/vendure/issues/3041) [#3012](https://github.com/vendure-ecommerce/vendure/issues/3012)
* **core** Prevent exposure of private custom fields via JSON type ([042abdb](https://github.com/vendure-ecommerce/vendure/commit/042abdb)), closes [#3049](https://github.com/vendure-ecommerce/vendure/issues/3049)
* **elasticsearch-plugin** Fix search multichannel indexing issue ([9d6f9cf](https://github.com/vendure-ecommerce/vendure/commit/9d6f9cf)), closes [#3012](https://github.com/vendure-ecommerce/vendure/issues/3012)

#### Perf

* **core** Fix slow `order` query for postgres v16 ([1baa8e7](https://github.com/vendure-ecommerce/vendure/commit/1baa8e7)), closes [#3037](https://github.com/vendure-ecommerce/vendure/issues/3037)
* **core** Omit ID encode/decode step if default EntityIdStrategy used ([ad30b55](https://github.com/vendure-ecommerce/vendure/commit/ad30b55))
* **core** Optimizations to the addItemToOrder path ([70ad853](https://github.com/vendure-ecommerce/vendure/commit/70ad853))
* **core** Optimize order operations ([e3d6c21](https://github.com/vendure-ecommerce/vendure/commit/e3d6c21))
* **core** Optimize resolution of featuredAsset fields ([d7bd446](https://github.com/vendure-ecommerce/vendure/commit/d7bd446))
* **core** Optimize setting active order on session ([c591432](https://github.com/vendure-ecommerce/vendure/commit/c591432))

## <small>3.0.1 (2024-08-21)</small>

#### Fixes

* **admin-ui** Add missing and revise portuguese and brazilian portuguese translations (#3002) ([9b5911f](https://github.com/vendure-ecommerce/vendure/commit/9b5911f)), closes [#3002](https://github.com/vendure-ecommerce/vendure/issues/3002)
* **admin-ui** Fix overflow in channel assignment block (#2984) ([0f8bdb5](https://github.com/vendure-ecommerce/vendure/commit/0f8bdb5)), closes [#2984](https://github.com/vendure-ecommerce/vendure/issues/2984)
* **admin-ui** Make sku optional in create-product-variant-dialog (#3007) ([13fe069](https://github.com/vendure-ecommerce/vendure/commit/13fe069)), closes [#3007](https://github.com/vendure-ecommerce/vendure/issues/3007) [#2999](https://github.com/vendure-ecommerce/vendure/issues/2999)
* **admin-ui** Use correct 24hr format for locale in dates (#2972) ([f078b41](https://github.com/vendure-ecommerce/vendure/commit/f078b41)), closes [#2972](https://github.com/vendure-ecommerce/vendure/issues/2972) [#2970](https://github.com/vendure-ecommerce/vendure/issues/2970)
* **core** Allow fulfillment creation with deleted product variants (#2982) ([752c2b6](https://github.com/vendure-ecommerce/vendure/commit/752c2b6)), closes [#2982](https://github.com/vendure-ecommerce/vendure/issues/2982) [#2434](https://github.com/vendure-ecommerce/vendure/issues/2434)
* **core** Fix EntityHydrator error on long table names (#2959) ([bcfcf7d](https://github.com/vendure-ecommerce/vendure/commit/bcfcf7d)), closes [#2959](https://github.com/vendure-ecommerce/vendure/issues/2959) [#2899](https://github.com/vendure-ecommerce/vendure/issues/2899)
* **core** Fix NaN error thrown when modifying pro-rated discounted OrderLine to 0 (#3009) ([fa50770](https://github.com/vendure-ecommerce/vendure/commit/fa50770)), closes [#3009](https://github.com/vendure-ecommerce/vendure/issues/3009)
* **core** Make firstName and lastName required in CreateCustomerAndUser method (#2996) ([0d8054d](https://github.com/vendure-ecommerce/vendure/commit/0d8054d)), closes [#2996](https://github.com/vendure-ecommerce/vendure/issues/2996)
* **core** Resolve User.roles field in GraphQL APIs (#3011) ([8f99b2d](https://github.com/vendure-ecommerce/vendure/commit/8f99b2d)), closes [#3011](https://github.com/vendure-ecommerce/vendure/issues/3011)
* **core** Return type of collection breadcrumb was missing slug (#2960) ([620eeb1](https://github.com/vendure-ecommerce/vendure/commit/620eeb1)), closes [#2960](https://github.com/vendure-ecommerce/vendure/issues/2960)
* **create** Dynamically find open port if 3000 in use ([a40fbb1](https://github.com/vendure-ecommerce/vendure/commit/a40fbb1))
* **create** Fix typo (#2994) ([999e89e](https://github.com/vendure-ecommerce/vendure/commit/999e89e)), closes [#2994](https://github.com/vendure-ecommerce/vendure/issues/2994)
* **create** Update EmailPlugin config to use templateLoader API ([6708440](https://github.com/vendure-ecommerce/vendure/commit/6708440)), closes [#2981](https://github.com/vendure-ecommerce/vendure/issues/2981)
* **payments-plugin** Fix Mollie not calling webhook on updated orders (#3014) ([694845f](https://github.com/vendure-ecommerce/vendure/commit/694845f)), closes [#3014](https://github.com/vendure-ecommerce/vendure/issues/3014) [#2941](https://github.com/vendure-ecommerce/vendure/issues/2941)
* **payments-plugin** Mollie - add missing request when settled amount is 0 (#2993) ([afd6435](https://github.com/vendure-ecommerce/vendure/commit/afd6435)), closes [#2993](https://github.com/vendure-ecommerce/vendure/issues/2993)

#### Perf

* **core** Improve hydrator performance for customFields (#2961) ([f40761d](https://github.com/vendure-ecommerce/vendure/commit/f40761d)), closes [#2961](https://github.com/vendure-ecommerce/vendure/issues/2961)
* **core** Refactor applyCollectionFiltersInternal method to improve performance (#2978) ([6eeae1c](https://github.com/vendure-ecommerce/vendure/commit/6eeae1c)), closes [#2978](https://github.com/vendure-ecommerce/vendure/issues/2978)

## 3.0.0 (2024-07-17)

Note: the changes in this release are identical to v2.3.0.

#### Features

* **admin-ui** Add support for tabs on custom UI routes ([26b4ea5](https://github.com/vendure-ecommerce/vendure/commit/26b4ea5))
* **admin-ui** Enable useQuery hook to refetch on channel change (#2869) ([3d516ea](https://github.com/vendure-ecommerce/vendure/commit/3d516ea)), closes [#2869](https://github.com/vendure-ecommerce/vendure/issues/2869)
* **core** Add RefundEvent & publish on Refund creation (#2832) ([cb08427](https://github.com/vendure-ecommerce/vendure/commit/cb08427)), closes [#2832](https://github.com/vendure-ecommerce/vendure/issues/2832) [#2830](https://github.com/vendure-ecommerce/vendure/issues/2830)
* **core** Enable inherit resolvers from interfaces (#2800) ([1069b3b](https://github.com/vendure-ecommerce/vendure/commit/1069b3b)), closes [#2800](https://github.com/vendure-ecommerce/vendure/issues/2800)
* **core** Make Refund process configurable (#2942) ([c8f1d62](https://github.com/vendure-ecommerce/vendure/commit/c8f1d62)), closes [#2942](https://github.com/vendure-ecommerce/vendure/issues/2942)
* **core** Publish event when OrderLine cancelled (#2829) ([213a26b](https://github.com/vendure-ecommerce/vendure/commit/213a26b)), closes [#2829](https://github.com/vendure-ecommerce/vendure/issues/2829)
* **create** Support SSL enforced PostgreSQL databases (#2905) ([65b4f3c](https://github.com/vendure-ecommerce/vendure/commit/65b4f3c)), closes [#2905](https://github.com/vendure-ecommerce/vendure/issues/2905)
* **email-plugin** Add support for computed email subject (#2863) ([e546f24](https://github.com/vendure-ecommerce/vendure/commit/e546f24)), closes [#2863](https://github.com/vendure-ecommerce/vendure/issues/2863)
* **email-plugin** Support dynamic globalTemplateVars (#2950) ([cab67b6](https://github.com/vendure-ecommerce/vendure/commit/cab67b6)), closes [#2950](https://github.com/vendure-ecommerce/vendure/issues/2950) [#2933](https://github.com/vendure-ecommerce/vendure/issues/2933)
* **ui-devkit** Support pnpm to build UI extensions (#2877) ([37e6a35](https://github.com/vendure-ecommerce/vendure/commit/37e6a35)), closes [#2877](https://github.com/vendure-ecommerce/vendure/issues/2877)

#### Fixes

* **core** Add usage check of nested custom property filters in ListQueryBuilder (#2939) ([05cfc9d](https://github.com/vendure-ecommerce/vendure/commit/05cfc9d)), closes [#2939](https://github.com/vendure-ecommerce/vendure/issues/2939)
* **core** Copy tax category on product duplication (#2947) ([2f0521c](https://github.com/vendure-ecommerce/vendure/commit/2f0521c)), closes [#2947](https://github.com/vendure-ecommerce/vendure/issues/2947)
* **core** Update DefaultSearchPlugin indexer controller to avoid TypeORM memory leak (#2883) ([ee2c177](https://github.com/vendure-ecommerce/vendure/commit/ee2c177)), closes [#2883](https://github.com/vendure-ecommerce/vendure/issues/2883)

#### Perf

* **core** Improve performance of role query with many channels ([fe3e455](https://github.com/vendure-ecommerce/vendure/commit/fe3e455)), closes [#2910](https://github.com/vendure-ecommerce/vendure/issues/2910)

**BREAKING CHANGE:** All core Vendure packages are now licensed under the GPL v3.0 license. See [LICENSE.md](./LICENSE.md) and the
[License FAQ](./license/license-faq.md).

## <small>2.x</small>

Changelogs for versions prior to v3.0.0 can be found in the [CHANGELOG_v2.md](./CHANGELOG_v2.md) and [CHANGELOG_v1.md](./CHANGELOG_v1.md) files.
