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
* **admin-ui** Add padding to default relation custom field  dropdown ([02e68e0](https://github.com/vendure-ecommerce/vendure/commit/02e68e0))
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
