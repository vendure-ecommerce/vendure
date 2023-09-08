## <small>2.0.7 (2023-09-08)</small>


#### Fixes

* **admin-ui** Add custom field support to Customer list ([298e90c](https://github.com/vendure-ecommerce/vendure/commit/298e90c))
* **admin-ui** Added and improved Italian translations (#2371) ([19292a8](https://github.com/vendure-ecommerce/vendure/commit/19292a8)), closes [#2371](https://github.com/vendure-ecommerce/vendure/issues/2371)
* **admin-ui** Correct handling of ID filters in data tables ([52ddd96](https://github.com/vendure-ecommerce/vendure/commit/52ddd96))
* **admin-ui** Data table filters react to page navigation ([2471350](https://github.com/vendure-ecommerce/vendure/commit/2471350))
* **admin-ui** Fix alignment of facet value chip ([7eb43ef](https://github.com/vendure-ecommerce/vendure/commit/7eb43ef))
* **admin-ui** Fix channel switcher icon style ([6e70794](https://github.com/vendure-ecommerce/vendure/commit/6e70794))
* **admin-ui** Fix filter shortcut triggering from rich text component ([e6f95b3](https://github.com/vendure-ecommerce/vendure/commit/e6f95b3)), closes [#2384](https://github.com/vendure-ecommerce/vendure/issues/2384)
* **admin-ui** Fix styling of custom field tabs ([ef3d2f9](https://github.com/vendure-ecommerce/vendure/commit/ef3d2f9))
* **admin-ui** Reinstate multi-deletion of Assets ([a203e50](https://github.com/vendure-ecommerce/vendure/commit/a203e50)), closes [#380](https://github.com/vendure-ecommerce/vendure/issues/380)
* **admin-ui** Use appropriate default values for custom fields ([85a8866](https://github.com/vendure-ecommerce/vendure/commit/85a8866)), closes [#2362](https://github.com/vendure-ecommerce/vendure/issues/2362)
* **admin-ui** Aligns items horizontally in the Chip component ([19d3e51](https://github.com/vendure-ecommerce/vendure/commit/19d3e51))
* **admin-ui** Add price field on variation dialog modal (#2378) ([5b99bae](https://github.com/vendure-ecommerce/vendure/commit/5b99bae)), closes [#2378](https://github.com/vendure-ecommerce/vendure/issues/2378)
* **core** Fix channel association on promotion update (#2376) ([47e688d](https://github.com/vendure-ecommerce/vendure/commit/47e688d)), closes [#2376](https://github.com/vendure-ecommerce/vendure/issues/2376)

## <small>2.0.6 (2023-08-11)</small>


#### Fixes

* **admin-ui** Apply max dimensions to relation asset preview ([8169c4e](https://github.com/vendure-ecommerce/vendure/commit/8169c4e)), closes [#2320](https://github.com/vendure-ecommerce/vendure/issues/2320)
* **admin-ui** Correctly display decimal tax rate in order summary ([1f507fa](https://github.com/vendure-ecommerce/vendure/commit/1f507fa)), closes [#2339](https://github.com/vendure-ecommerce/vendure/issues/2339)
* **admin-ui** Correctly display widget titles in dropdown ([59a1d5d](https://github.com/vendure-ecommerce/vendure/commit/59a1d5d)), closes [#2334](https://github.com/vendure-ecommerce/vendure/issues/2334)
* **admin-ui** Fix error when saving multiple new variant options ([e5ad0ee](https://github.com/vendure-ecommerce/vendure/commit/e5ad0ee)), closes [#2326](https://github.com/vendure-ecommerce/vendure/issues/2326)
* **admin-ui** Fix header overlap on empty data tables ([ada153e](https://github.com/vendure-ecommerce/vendure/commit/ada153e)), closes [#2323](https://github.com/vendure-ecommerce/vendure/issues/2323) [#2325](https://github.com/vendure-ecommerce/vendure/issues/2325)
* **admin-ui** Fix updating variant tax category ([ff29e9a](https://github.com/vendure-ecommerce/vendure/commit/ff29e9a)), closes [#2336](https://github.com/vendure-ecommerce/vendure/issues/2336)
* **admin-ui** Fix width of affixed inputs ([75d51ed](https://github.com/vendure-ecommerce/vendure/commit/75d51ed))
* **admin-ui** Fulfillment button takes existing state into account ([ef357cd](https://github.com/vendure-ecommerce/vendure/commit/ef357cd))
* **admin-ui** Fulfillment dialog enforces max quantity ([571b157](https://github.com/vendure-ecommerce/vendure/commit/571b157)), closes [#2329](https://github.com/vendure-ecommerce/vendure/issues/2329)
* **admin-ui** Prevent product creation without variants ([3364559](https://github.com/vendure-ecommerce/vendure/commit/3364559)), closes [#2337](https://github.com/vendure-ecommerce/vendure/issues/2337)
* **core** Fix entity hydration of nested array entities ([55009a5](https://github.com/vendure-ecommerce/vendure/commit/55009a5)), closes [#2013](https://github.com/vendure-ecommerce/vendure/issues/2013)
* **core** Fix logic relating to partial fulfillments ([6f48ee2](https://github.com/vendure-ecommerce/vendure/commit/6f48ee2)), closes [#2324](https://github.com/vendure-ecommerce/vendure/issues/2324) [#2191](https://github.com/vendure-ecommerce/vendure/issues/2191)
* **core** Prevent fulfillments with too great a quantity ([579459a](https://github.com/vendure-ecommerce/vendure/commit/579459a)), closes [#2329](https://github.com/vendure-ecommerce/vendure/issues/2329)

## <small>2.0.5 (2023-07-27)</small>


#### Fixes

* **admin-ui** Add channelTokenKey to AdminUiConfig (#2307) ([5162d0c](https://github.com/vendure-ecommerce/vendure/commit/5162d0c)), closes [#2307](https://github.com/vendure-ecommerce/vendure/issues/2307)
* **admin-ui** Add custom detail component locationId and action bar items to draft order detail (#2286) ([27c9ae7](https://github.com/vendure-ecommerce/vendure/commit/27c9ae7)), closes [#2286](https://github.com/vendure-ecommerce/vendure/issues/2286)
* **admin-ui** Add missing Russian translation strings (#2309) ([9524add](https://github.com/vendure-ecommerce/vendure/commit/9524add)), closes [#2309](https://github.com/vendure-ecommerce/vendure/issues/2309)
* **admin-ui** Add product variant name filter in product variant list (#2271) ([b17494d](https://github.com/vendure-ecommerce/vendure/commit/b17494d)), closes [#2271](https://github.com/vendure-ecommerce/vendure/issues/2271)
* **admin-ui** Allow period in slug ([7c9d110](https://github.com/vendure-ecommerce/vendure/commit/7c9d110)), closes [#2304](https://github.com/vendure-ecommerce/vendure/issues/2304)
* **admin-ui** Fix creation of zero tax rates ([5f898b4](https://github.com/vendure-ecommerce/vendure/commit/5f898b4)), closes [#2312](https://github.com/vendure-ecommerce/vendure/issues/2312)
* **core** Do not publish CollectionModificationEvent if no changes ([75f6dec](https://github.com/vendure-ecommerce/vendure/commit/75f6dec))
* **core** Export missing search plugin types ([23af791](https://github.com/vendure-ecommerce/vendure/commit/23af791))
* **core** Fix createRefund amount on cancelled OrderLines ([2b49edf](https://github.com/vendure-ecommerce/vendure/commit/2b49edf)), closes [#2302](https://github.com/vendure-ecommerce/vendure/issues/2302)
* **core** Fix incorrect allocation logic in default fulfillment process ([f6881bf](https://github.com/vendure-ecommerce/vendure/commit/f6881bf)), closes [#2306](https://github.com/vendure-ecommerce/vendure/issues/2306)
* **core** Fix startup error with readonly Administrator custom fields ([cae55a6](https://github.com/vendure-ecommerce/vendure/commit/cae55a6))
* **core** Fix typo in option searchStrategy (#2305) ([8cd15e1](https://github.com/vendure-ecommerce/vendure/commit/8cd15e1)), closes [#2305](https://github.com/vendure-ecommerce/vendure/issues/2305)
* **core** Improved CockroachDB compatibility for DefaultSearchPlugin ([b8d8dec](https://github.com/vendure-ecommerce/vendure/commit/b8d8dec))
* **core** Publish AccountRegistrationEvent when creating Customer via admin ([e0bd036](https://github.com/vendure-ecommerce/vendure/commit/e0bd036))
* **core** Use MoneyStrategy in Surcharges (#2294) ([efee8ec](https://github.com/vendure-ecommerce/vendure/commit/efee8ec)), closes [#2294](https://github.com/vendure-ecommerce/vendure/issues/2294)
* **payments-plugin**: Only find payment methods in the current channel ([bbea69](https://github.com/vendure-ecommerce/vendure/commit/bbea69)), closes [#2308](https://github.com/vendure-ecommerce/vendure/issues/2308)

#### Features

Note: although we now have complete translations for Arabic & Hebrew, the right-to-left layout support is still in progress,
so if you use these languages you will encounter layout issues.

* **admin-ui** all Arabic tokens translated (100%) (#2287) ([83ecec9](https://github.com/vendure-ecommerce/vendure/commit/83ecec9)), closes [#2287](https://github.com/vendure-ecommerce/vendure/issues/2287)
* **admin-ui** Hebrew support (#2313) ([2814142](https://github.com/vendure-ecommerce/vendure/commit/2814142)), closes [#2313](https://github.com/vendure-ecommerce/vendure/issues/2313)

## <small>2.0.4 (2023-07-13)</small>


#### Fixes

* **admin-ui** Allow target attribute on `<a>` tags in rich text editor ([8f72e1e](https://github.com/vendure-ecommerce/vendure/commit/8f72e1e)), closes [#2281](https://github.com/vendure-ecommerce/vendure/issues/2281)
* **admin-ui** Display custom fields in StockLocation detail view ([d36ac84](https://github.com/vendure-ecommerce/vendure/commit/d36ac84))
* **admin-ui** Fix display of Address custom fields in customer detail view ([189e714](https://github.com/vendure-ecommerce/vendure/commit/189e714)), closes [#2272](https://github.com/vendure-ecommerce/vendure/issues/2272)
* **admin-ui** Fix layout of select customer dropdown items ([3f8a1da](https://github.com/vendure-ecommerce/vendure/commit/3f8a1da))
* **admin-ui** Fix top left logo when using setBranding ([120a0bb](https://github.com/vendure-ecommerce/vendure/commit/120a0bb)), closes [#2225](https://github.com/vendure-ecommerce/vendure/issues/2225)
* **admin-ui** Prevent list filter hotkey F firing from input elements ([c426f8d](https://github.com/vendure-ecommerce/vendure/commit/c426f8d))
* **asset-server-plugin** Better handling of malformed images ([593e0e2](https://github.com/vendure-ecommerce/vendure/commit/593e0e2)), closes [#2275](https://github.com/vendure-ecommerce/vendure/issues/2275)
* **core** Add timeout logic to session cache handling ([a817a1a](https://github.com/vendure-ecommerce/vendure/commit/a817a1a))
* **core** Correctly update StockLocation custom fields ([1cb676a](https://github.com/vendure-ecommerce/vendure/commit/1cb676a))
* **core** Fix admin authentication when no native auth in shop API ([8fb9719](https://github.com/vendure-ecommerce/vendure/commit/8fb9719)), closes [#2282](https://github.com/vendure-ecommerce/vendure/issues/2282)
* **core** Fix draft orders not getting correctly placed ([4d01ab5](https://github.com/vendure-ecommerce/vendure/commit/4d01ab5)), closes [#2105](https://github.com/vendure-ecommerce/vendure/issues/2105)
* **core** Add currencyCode option to RequestContextService.create (#2277) ([2f336a7](https://github.com/vendure-ecommerce/vendure/commit/2f336a7)), closes [#2277](https://github.com/vendure-ecommerce/vendure/issues/2277)

## <small>2.0.3 (2023-07-04)</small>


#### Fixes

* **admin-ui-plugin** Enable metricsSummary query without serving UI app ([fba0739](https://github.com/vendure-ecommerce/vendure/commit/fba0739)), closes [#2261](https://github.com/vendure-ecommerce/vendure/issues/2261)
* **admin-ui** 100% brazilian portuguese translation coverage (#2262) ([0d76b10](https://github.com/vendure-ecommerce/vendure/commit/0d76b10)), closes [#2262](https://github.com/vendure-ecommerce/vendure/issues/2262)
* **admin-ui** 100% german translation coverage (#2248) ([60c9e86](https://github.com/vendure-ecommerce/vendure/commit/60c9e86)), closes [#2248](https://github.com/vendure-ecommerce/vendure/issues/2248)
* **admin-ui** Add missing permission to metrics widget ([3353c6e](https://github.com/vendure-ecommerce/vendure/commit/3353c6e))
* **admin-ui** Add missing search index rebuild trigger ([92f35d0](https://github.com/vendure-ecommerce/vendure/commit/92f35d0))
* **admin-ui** Allow vertical resize of textarea ([86853ec](https://github.com/vendure-ecommerce/vendure/commit/86853ec)), closes [#2255](https://github.com/vendure-ecommerce/vendure/issues/2255)
* **admin-ui** Correct location id for product-variant-detail action bar ([ebaff3a](https://github.com/vendure-ecommerce/vendure/commit/ebaff3a))
* **admin-ui** Correctly sort customer orders in detail view ([86a17af](https://github.com/vendure-ecommerce/vendure/commit/86a17af))
* **admin-ui** Fix description layout on shipping method detail page ([9b9119c](https://github.com/vendure-ecommerce/vendure/commit/9b9119c))
* **admin-ui** Fix low limit of facet value selector component ([1b13e7a](https://github.com/vendure-ecommerce/vendure/commit/1b13e7a)), closes [#2251](https://github.com/vendure-ecommerce/vendure/issues/2251)
* **admin-ui** Fix position of main nav status badge ([8669ef4](https://github.com/vendure-ecommerce/vendure/commit/8669ef4))
* **admin-ui** Fix product multi select form input ([b5947ec](https://github.com/vendure-ecommerce/vendure/commit/b5947ec)), closes [#2249](https://github.com/vendure-ecommerce/vendure/issues/2249)
* **admin-ui** Fix quantity label in order table (#2259) ([bb4c9e5](https://github.com/vendure-ecommerce/vendure/commit/bb4c9e5)), closes [#2259](https://github.com/vendure-ecommerce/vendure/issues/2259)
* **admin-ui** Fix query filter option in order list component (#2258) ([7b56942](https://github.com/vendure-ecommerce/vendure/commit/7b56942)), closes [#2258](https://github.com/vendure-ecommerce/vendure/issues/2258) [#2257](https://github.com/vendure-ecommerce/vendure/issues/2257)
* **admin-ui** Fix updating product variant asset ([b590bdd](https://github.com/vendure-ecommerce/vendure/commit/b590bdd))
* **admin-ui** Improve keyboard controls for data table filters ([00f0155](https://github.com/vendure-ecommerce/vendure/commit/00f0155))
* **admin-ui** Make dropdowns keyboard-accessible ([d9c6cdd](https://github.com/vendure-ecommerce/vendure/commit/d9c6cdd))
* **admin-ui** Set page to 1 when changing list filters ([f2f60c3](https://github.com/vendure-ecommerce/vendure/commit/f2f60c3))
* **admin-ui** Style improvements to chip & ng-select ([bcffd9c](https://github.com/vendure-ecommerce/vendure/commit/bcffd9c))
* **admin-ui** Styling improvements to custom field relation controls ([fb8aca6](https://github.com/vendure-ecommerce/vendure/commit/fb8aca6))
* **admin-ui** Update es translation (#2260) ([fbc4dff](https://github.com/vendure-ecommerce/vendure/commit/fbc4dff)), closes [#2260](https://github.com/vendure-ecommerce/vendure/issues/2260)
* **admin-ui** Use SKU to filter product variant list ([52a09a4](https://github.com/vendure-ecommerce/vendure/commit/52a09a4))
* **admin-ui** Prevent XSS attack vector in rich text editor ([GHSA-gm68-572p-q28r](https://github.com/vendure-ecommerce/vendure/security/advisories/GHSA-gm68-572p-q28r))
* **core** Correctly set currencyCode when assigning variants to channel ([5e13b0e](https://github.com/vendure-ecommerce/vendure/commit/5e13b0e)), closes [#2228](https://github.com/vendure-ecommerce/vendure/issues/2228)
* **core** Delete user sessions & token upon user-deletion (#2241) ([b989607](https://github.com/vendure-ecommerce/vendure/commit/b989607)), closes [#2241](https://github.com/vendure-ecommerce/vendure/issues/2241)
* **core** Disable graphql playground according to apiOptions setting ([b9a0200](https://github.com/vendure-ecommerce/vendure/commit/b9a0200)), closes [#2246](https://github.com/vendure-ecommerce/vendure/issues/2246)
* **core** Fix Asset.tags resolution in Shop API ([555666c](https://github.com/vendure-ecommerce/vendure/commit/555666c)), closes [#1754](https://github.com/vendure-ecommerce/vendure/issues/1754)
* **core** Fix issue updating customer email address when no native auth ([79aab66](https://github.com/vendure-ecommerce/vendure/commit/79aab66))
* **core** Fix null reference error when hydrating entity ([5a2b2b7](https://github.com/vendure-ecommerce/vendure/commit/5a2b2b7)), closes [#2264](https://github.com/vendure-ecommerce/vendure/issues/2264)
* **core** Update variants when changing channel defaultCurrencyCode ([2303328](https://github.com/vendure-ecommerce/vendure/commit/2303328)), closes [#2190](https://github.com/vendure-ecommerce/vendure/issues/2190)
* **core** Use more secure default for cookie sameSite option ([4a10d67](https://github.com/vendure-ecommerce/vendure/commit/4a10d67))
* **email-plugin** Add warning when running devMode with transport ([7498901](https://github.com/vendure-ecommerce/vendure/commit/7498901)), closes [#2253](https://github.com/vendure-ecommerce/vendure/issues/2253)
* **payments-plugin** Add compatibility metadata to payment plugins ([2dbfa2b](https://github.com/vendure-ecommerce/vendure/commit/2dbfa2b))

#### Perf

* **core** Improve performance of Product.facetValues resolver (#2239) ([a0e891a](https://github.com/vendure-ecommerce/vendure/commit/a0e891a)), closes [#2239](https://github.com/vendure-ecommerce/vendure/issues/2239)

#### Features

* **admin-ui** Add product variant bulk actions (assign/delete channel, delete) (#2238) ([b25ddcd](https://github.com/vendure-ecommerce/vendure/commit/b25ddcd)), closes [#2238](https://github.com/vendure-ecommerce/vendure/issues/2238)

## <small>2.0.2 (2023-06-19)</small>


#### Fixes

* **admin-ui** Allow collections to be moved to root ([23b3f05](https://github.com/vendure-ecommerce/vendure/commit/23b3f05)), closes [#2236](https://github.com/vendure-ecommerce/vendure/issues/2236)
* **admin-ui** Allow options to be passed to ChartComponent ([161b757](https://github.com/vendure-ecommerce/vendure/commit/161b757))
* **admin-ui** Fix channel creation when pricesIncludeTax is false ([36fe1a5](https://github.com/vendure-ecommerce/vendure/commit/36fe1a5)), closes [#2217](https://github.com/vendure-ecommerce/vendure/issues/2217)
* **admin-ui** Fix mobile layout for asset list ([5f7ac8c](https://github.com/vendure-ecommerce/vendure/commit/5f7ac8c)), closes [#2206](https://github.com/vendure-ecommerce/vendure/issues/2206)
* **admin-ui** Fix routerLink to the order overview (#2235) ([cb37b3e](https://github.com/vendure-ecommerce/vendure/commit/cb37b3e)), closes [#2235](https://github.com/vendure-ecommerce/vendure/issues/2235)
* **admin-ui** Fix styling for very long breadcrumbs ([44c2c88](https://github.com/vendure-ecommerce/vendure/commit/44c2c88))
* **admin-ui** Update fr translation (#2232) ([e12770e](https://github.com/vendure-ecommerce/vendure/commit/e12770e)), closes [#2232](https://github.com/vendure-ecommerce/vendure/issues/2232)
* **core** Channel cache can handle more than 1000 channels ([2218d42](https://github.com/vendure-ecommerce/vendure/commit/2218d42)), closes [#2233](https://github.com/vendure-ecommerce/vendure/issues/2233)

## <small>2.0.1 (2023-06-13)</small>


#### Fixes

* **admin-ui** Add missing primary button states ([93d2285](https://github.com/vendure-ecommerce/vendure/commit/93d2285))
* **admin-ui** Allow setting tab route config ([3fb170e](https://github.com/vendure-ecommerce/vendure/commit/3fb170e))
* **admin-ui** Fix customers breadcrumb link (#2218) ([edaa867](https://github.com/vendure-ecommerce/vendure/commit/edaa867)), closes [#2218](https://github.com/vendure-ecommerce/vendure/issues/2218)
* **admin-ui** Fix pagination on options editor view ([dda5e67](https://github.com/vendure-ecommerce/vendure/commit/dda5e67))
* **admin-ui** Fix styling of address card component ([ea92bd1](https://github.com/vendure-ecommerce/vendure/commit/ea92bd1))
* **admin-ui** Fix tab label for product detail component ([cb81848](https://github.com/vendure-ecommerce/vendure/commit/cb81848))
* **admin-ui** Improve feedback on attempting to create variant ([e50b271](https://github.com/vendure-ecommerce/vendure/commit/e50b271)), closes [#2210](https://github.com/vendure-ecommerce/vendure/issues/2210)
* **admin-ui** Improve readability of role permissions table ([95dabdc](https://github.com/vendure-ecommerce/vendure/commit/95dabdc)), closes [#2224](https://github.com/vendure-ecommerce/vendure/issues/2224)
* **admin-ui** List newly-created customers ([6483aad](https://github.com/vendure-ecommerce/vendure/commit/6483aad)), closes [#2213](https://github.com/vendure-ecommerce/vendure/issues/2213)
* **admin-ui** Preserve ui language settings after refresh ([dcae0d9](https://github.com/vendure-ecommerce/vendure/commit/dcae0d9)), closes [#2211](https://github.com/vendure-ecommerce/vendure/issues/2211)
* **admin-ui** Prevent duplicate order state change on manual payment ([eadc479](https://github.com/vendure-ecommerce/vendure/commit/eadc479)), closes [#2204](https://github.com/vendure-ecommerce/vendure/issues/2204)
* **admin-ui** Redirect to the right page on forbidden errors if an internal `loginUrl` is provided (#2175) ([c0630fb](https://github.com/vendure-ecommerce/vendure/commit/c0630fb)), closes [#2175](https://github.com/vendure-ecommerce/vendure/issues/2175)
* **admin-ui** Small style fixes ([33eee17](https://github.com/vendure-ecommerce/vendure/commit/33eee17))
* **asset-server-plugin** Update Sharp to fix macOS 10.13+ support ([043c7ff](https://github.com/vendure-ecommerce/vendure/commit/043c7ff))
* **core** Add missing SellerEvent and correctly update relations ([4f421d3](https://github.com/vendure-ecommerce/vendure/commit/4f421d3)), closes [#2216](https://github.com/vendure-ecommerce/vendure/issues/2216)
* **core** Correctly update Seller custom fields ([4a4691d](https://github.com/vendure-ecommerce/vendure/commit/4a4691d))
* **core** Expose the `topLevelOnly` collections option in Shop API ([ed28743](https://github.com/vendure-ecommerce/vendure/commit/ed28743))
* **core** Fix channel creation with defaultCurrencyCode field ([3aa72ab](https://github.com/vendure-ecommerce/vendure/commit/3aa72ab)), closes [#2217](https://github.com/vendure-ecommerce/vendure/issues/2217)
* **core** Fix order state change from default payment process ([0e5129e](https://github.com/vendure-ecommerce/vendure/commit/0e5129e)), closes [#2204](https://github.com/vendure-ecommerce/vendure/issues/2204)
* **job-queue-plugin** Fix graceful shutdown for BullMQJobQueueStrategy ([7c51eab](https://github.com/vendure-ecommerce/vendure/commit/7c51eab)), closes [#2222](https://github.com/vendure-ecommerce/vendure/issues/2222)

## <small>2.0.0 (2023-06-07)</small>


#### Fixes

* **asset-server-plugin** Change image format with no other transforms (#2104) ([6cf1608](https://github.com/vendure-ecommerce/vendure/commit/6cf1608)), closes [#2104](https://github.com/vendure-ecommerce/vendure/issues/2104)
* **core** Correctly remove invalid promotion couponCodes from Order ([7a1c127](https://github.com/vendure-ecommerce/vendure/commit/7a1c127))
* **core** Fix concurrent order address update edge case ([f4ca9b2](https://github.com/vendure-ecommerce/vendure/commit/f4ca9b2))
* **core** Fix updating channel currencyCode ([7e01ecf](https://github.com/vendure-ecommerce/vendure/commit/7e01ecf)), closes [#2114](https://github.com/vendure-ecommerce/vendure/issues/2114)
* **core** Translatable fields default to empty string if falsy ([e119154](https://github.com/vendure-ecommerce/vendure/commit/e119154))
* **core** Fix error messages containing colon char ([2cfc874](https://github.com/vendure-ecommerce/vendure/commit/2cfc874)), closes [#2153](https://github.com/vendure-ecommerce/vendure/issues/2153)
* **core** Fix issues with Promotion & PaymentMethod null descriptions ([7b407de](https://github.com/vendure-ecommerce/vendure/commit/7b407de))
* **create** Use "create" version for all Vendure dependencies ([844b9ba](https://github.com/vendure-ecommerce/vendure/commit/844b9ba))
* **payments-plugin** Make peer dependencies optional ([98c764c](https://github.com/vendure-ecommerce/vendure/commit/98c764c))
* **testing** More graceful shutdown ([aa91bd0](https://github.com/vendure-ecommerce/vendure/commit/aa91bd0))
* **ui-devkit** Fix baseHref configuration ([c7836b2](https://github.com/vendure-ecommerce/vendure/commit/c7836b2)), closes [#1794](https://github.com/vendure-ecommerce/vendure/issues/1794)


#### Features

* **admin-ui** Rename vdr-product-selector ([9d9275c](https://github.com/vendure-ecommerce/vendure/commit/9d9275c))
* **admin-ui** Add filter inheritance control to Collection detail view ([7f1b01e](https://github.com/vendure-ecommerce/vendure/commit/7f1b01e)), closes [#1382](https://github.com/vendure-ecommerce/vendure/issues/1382)
* **admin-ui** Update collection preview on filter inheritance toggle ([1a4aced](https://github.com/vendure-ecommerce/vendure/commit/1a4aced))
* **admin-ui** Add support for translatable PaymentMethods ([06efc50](https://github.com/vendure-ecommerce/vendure/commit/06efc50)), closes [#1184](https://github.com/vendure-ecommerce/vendure/issues/1184)
* **admin-ui** Add support for translatable Promotions ([00bd433](https://github.com/vendure-ecommerce/vendure/commit/00bd433)), closes [#1990](https://github.com/vendure-ecommerce/vendure/issues/1990)
* **admin-ui** New app layout with updated nav menu ([e6f8584](https://github.com/vendure-ecommerce/vendure/commit/e6f8584)), closes [#1645](https://github.com/vendure-ecommerce/vendure/issues/1645)
* **admin-ui** Update to Angular v16.x ([0c503b4](https://github.com/vendure-ecommerce/vendure/commit/0c503b4))
* **admin-ui** Implement custom fields updating of ProductOptionGroup and ProductOption entities ([d2a0824](https://github.com/vendure-ecommerce/vendure/commit/d2a0824))
* **admin-ui-plugin** Add simple metrics support via new metricSummary query ([717d265](https://github.com/vendure-ecommerce/vendure/commit/717d265)). Thanks to @martijnvdbrug for providing the initial implementation, on which this is based!
* **asset-server-plugin** Update to Sharp v0.31
* **asset-server-plugin** Update s3 asset storage strategy to use AWS sdk v3 (#2102) ([d628659](https://github.com/vendure-ecommerce/vendure/commit/d628659)), closes [#2102](https://github.com/vendure-ecommerce/vendure/issues/2102)
* **core** Update all major dependencies to NestJS v8, Apollo Server v3, GraphQL v16
* **core** Update to TypeScript v4.9.5 ([99da585](https://github.com/vendure-ecommerce/vendure/commit/99da585))
* **core** Added a unique index to Order.code ([aa6025d](https://github.com/vendure-ecommerce/vendure/commit/aa6025d))
* **core** Collections can control inheritance of filters ([5d4206f](https://github.com/vendure-ecommerce/vendure/commit/5d4206f)), closes [#1382](https://github.com/vendure-ecommerce/vendure/issues/1382)
* **core** Update codegen errors plugin to use object inputs ([6b9b2a4](https://github.com/vendure-ecommerce/vendure/commit/6b9b2a4))
* **core** Add currencyCode to variant price model ([24e558b](https://github.com/vendure-ecommerce/vendure/commit/24e558b)), closes [#1691](https://github.com/vendure-ecommerce/vendure/issues/1691)
* **core** Add ProductVariantPriceSelectionStrategy ([efe23d1](https://github.com/vendure-ecommerce/vendure/commit/efe23d1)), closes [#1691](https://github.com/vendure-ecommerce/vendure/issues/1691)
* **core** Implement Admin API operations for stock location, e2e tests ([7913b9a](https://github.com/vendure-ecommerce/vendure/commit/7913b9a)), closes [#1545](https://github.com/vendure-ecommerce/vendure/issues/1545)
* **core** Implement data model & APIs for multi-location stock ([905c1df](https://github.com/vendure-ecommerce/vendure/commit/905c1df)), closes [#1545](https://github.com/vendure-ecommerce/vendure/issues/1545)
* **core** Implement GuestCheckoutStrategy ([7e0f1d1](https://github.com/vendure-ecommerce/vendure/commit/7e0f1d1)), closes [#911](https://github.com/vendure-ecommerce/vendure/issues/911) [#762](https://github.com/vendure-ecommerce/vendure/issues/762)
* **core** Implement localeText custom field type ([6a3c61f](https://github.com/vendure-ecommerce/vendure/commit/6a3c61f)), closes [#2000](https://github.com/vendure-ecommerce/vendure/issues/2000)
* **core** Implement MoneyStrategy ([61ac041](https://github.com/vendure-ecommerce/vendure/commit/61ac041)), closes [#1835](https://github.com/vendure-ecommerce/vendure/issues/1835)
* **core** Make PaymentMethod entity translatable ([2a4b3bc](https://github.com/vendure-ecommerce/vendure/commit/2a4b3bc)), closes [#1184](https://github.com/vendure-ecommerce/vendure/issues/1184)
* **core** Make Promotion entity translatable, add description ([dada243](https://github.com/vendure-ecommerce/vendure/commit/dada243)), closes [#1990](https://github.com/vendure-ecommerce/vendure/issues/1990)
* **core** Normalize email addresses for native auth ([ad7eab8](https://github.com/vendure-ecommerce/vendure/commit/ad7eab8)), closes [#1515](https://github.com/vendure-ecommerce/vendure/issues/1515)
* **core** Collection preview handles filter inheritance ([3d2c0fb](https://github.com/vendure-ecommerce/vendure/commit/3d2c0fb))
* **core** Add support for PromotionAction side effects ([1a4a117](https://github.com/vendure-ecommerce/vendure/commit/1a4a117)), closes [#1798](https://github.com/vendure-ecommerce/vendure/issues/1798)
* **core** Add filter method to EventBus (#1930) ([7eabaa7](https://github.com/vendure-ecommerce/vendure/commit/7eabaa7)), closes [#1930](https://github.com/vendure-ecommerce/vendure/issues/1930)
* **core** Expose tags on Assets for shop api (#1754) ([d9316df](https://github.com/vendure-ecommerce/vendure/commit/d9316df)), closes [#1754](https://github.com/vendure-ecommerce/vendure/issues/1754)
* **core** Create underlying APIs to support multivendor Orders ([3d9f7e8](https://github.com/vendure-ecommerce/vendure/commit/3d9f7e8)), closes [#1329](https://github.com/vendure-ecommerce/vendure/issues/1329)
* **core** Extract hard-coded fulfillment state & process ([cdb2b75](https://github.com/vendure-ecommerce/vendure/commit/cdb2b75))
* **core** Extract hard-coded order state & process ([cff3b91](https://github.com/vendure-ecommerce/vendure/commit/cff3b91))
* **core** Extract hard-coded payment state & process ([4c5c946](https://github.com/vendure-ecommerce/vendure/commit/4c5c946))
* **core** Add `compatibility` check to VendurePlugin metadata ([d18d350](https://github.com/vendure-ecommerce/vendure/commit/d18d350)), closes [#1471](https://github.com/vendure-ecommerce/vendure/issues/1471)
* **core** Add quantity arg to OrderItemPriceCalculationStrategy ([02a0864](https://github.com/vendure-ecommerce/vendure/commit/02a0864)), closes [#1920](https://github.com/vendure-ecommerce/vendure/issues/1920)
* **core** Export VENDURE_VERSION constant ([b2a910a](https://github.com/vendure-ecommerce/vendure/commit/b2a910a)), closes [#1471](https://github.com/vendure-ecommerce/vendure/issues/1471)
* **core** Implement Regions & support for Provinces ([7b8f5bf](https://github.com/vendure-ecommerce/vendure/commit/7b8f5bf)), closes [#76](https://github.com/vendure-ecommerce/vendure/issues/76)
* **core** Allow specifying transaction isolation level (#2116) ([bf2b1f5](https://github.com/vendure-ecommerce/vendure/commit/bf2b1f5)), closes [#2116](https://github.com/vendure-ecommerce/vendure/issues/2116)
* **core** Add `topLevelOnly` filter to collection list query ([66b8c75](https://github.com/vendure-ecommerce/vendure/commit/66b8c75))
* **core** Add bulk delete mutations ([2f5e096](https://github.com/vendure-ecommerce/vendure/commit/2f5e096))
* **core** Add facetValueId filter to products/variants list queries ([00b8268](https://github.com/vendure-ecommerce/vendure/commit/00b8268))
* **core** Allow variant options to be added & removed ([8cb9b27](https://github.com/vendure-ecommerce/vendure/commit/8cb9b27))
* **core** Channels mutation now returns PaginatedList ([d7a3447](https://github.com/vendure-ecommerce/vendure/commit/d7a3447))
* **core** ChannelService.findAll() returns PaginatedList ([53fa2a0](https://github.com/vendure-ecommerce/vendure/commit/53fa2a0))
* **core** Move global stock & language settings into Channel ([2748a6e](https://github.com/vendure-ecommerce/vendure/commit/2748a6e))
* **core** TaxCategories query now returns PaginatedList ([ddcd0fc](https://github.com/vendure-ecommerce/vendure/commit/ddcd0fc))
* **core** Zones query now returns PaginatedList ([afbb408](https://github.com/vendure-ecommerce/vendure/commit/afbb408))
* **email-plugin** Add support for dynamic templates & SMTP settings ([c6686cd](https://github.com/vendure-ecommerce/vendure/commit/c6686cd)), closes [#2043](https://github.com/vendure-ecommerce/vendure/issues/2043) [#2044](https://github.com/vendure-ecommerce/vendure/issues/2044)
* **job-queue-plugin** Update bullmq & redis dependencies (#2020) ([eb0b73f](https://github.com/vendure-ecommerce/vendure/commit/eb0b73f)), closes [#2020](https://github.com/vendure-ecommerce/vendure/issues/2020)
* **payments-plugin** Make Mollie plugin `redirecturl` dynamic (#2094) ([b452419](https://github.com/vendure-ecommerce/vendure/commit/b452419)), closes [#2094](https://github.com/vendure-ecommerce/vendure/issues/2094) [#2093](https://github.com/vendure-ecommerce/vendure/issues/2093)
* **payments-plugin** Make Stripe plugin channel-aware (#2058) ([3b88702](https://github.com/vendure-ecommerce/vendure/commit/3b88702)), closes [#2058](https://github.com/vendure-ecommerce/vendure/issues/2058)
* **testing** Turn productsCsvPath into an optional property for test server initialization (#2038) ([4c2b118](https://github.com/vendure-ecommerce/vendure/commit/4c2b118)), closes [#2038](https://github.com/vendure-ecommerce/vendure/issues/2038)
* **ui-devkit** Add "exclude" option to UI extensions (#2009) ([dd6eee3](https://github.com/vendure-ecommerce/vendure/commit/dd6eee3)), closes [#2009](https://github.com/vendure-ecommerce/vendure/issues/2009)
* **ui-devkit** Support module path mappings for UI extensions (#1994) ([6d57c86](https://github.com/vendure-ecommerce/vendure/commit/6d57c86)), closes [#1994](https://github.com/vendure-ecommerce/vendure/issues/1994)

#### Performance

* **core** Re-architect Order model for massive perf improvement on large orders, closes [#1981](https://github.com/vendure-ecommerce/vendure/issues/1981)
* **core** Add indices to many-to-one relations ([01e369f](https://github.com/vendure-ecommerce/vendure/commit/01e369f)), closes [#1502](https://github.com/vendure-ecommerce/vendure/issues/1502)
* **core** Add indexes to Product & Collection slugs ([937cf67](https://github.com/vendure-ecommerce/vendure/commit/937cf67))

#### BREAKING CHANGES

When updating from v1.x, please see the [Migration Guide](https://docs.vendure.io/migrating-from-v1/).

* The Admin UI app has been refreshed, including upgrading to Angular v16 as well as a host of style, layout & functional improvements. 
   If you have ui extensions, they should still work but the layout will look somewhat broken. A full upgrade guide will be published with the final v2 release, but for now, wrapping all your custom pages in `<vdr-page-block>` (or `<div class="page-block">`) will improve things.
* If you use any of the scoped method of the Admin UI `DataService`, you might find that some no longer exist. They are now deprecated and will eventually be removed. Use the `dataService.query()` and `dataService.mutation()` methods only, passing your own GraphQL documents.
* ChannelService.findAll() will now return a PaginatedList<Channel> instead of a Channel[]
* The `channels` mutation now returns a PaginatedList rather than a simple array of Channels.
* The `taxCategories` mutation now returns a PaginatedList rather than a simple array of TaxCategory objects.
* The `zones` query now returns a PaginatedList rather than a simple array of `Zone` objects. Likewise, the `ZoneService.findAll()` method also returns a paginated list.
The old behaviour of `ZoneService.findAll()` (all Zones, cached for rapid access) can now be found under the new `ZoneService.getAllWithMembers()` method.
* The Admin UI component `vdr-product-selector` has been renamed to `vdr-product-variant-selector` to more accurately represent what it does. If you are using `vdr-product-selector` if any ui extensions code, update it to use the new selector.
* There's a breaking change you'll need to handle if you are using a `CustomOrderProcess`, `CustomFulfillmentProcess` or `CustomPaymentProcess`. Details in the migration guide.
* The `Channel.currencyCode` field has been renamed to `defaultCurrencyCode`, and a new `currencyCode` field has been added to the `ProductVariantPrice` entity. 
* The introduction of the new MoneyStrategy includes a new GraphQL `Money` scalar, which replaces `Int` used in v1.x. In practice, this is still a `number` type and should not
break any client applications. One point to note is that `Money` is based on the `Float` scalar and therefore can represent decimal values, allowing fractions of cents to be represented.
* The minimum Redis recommended version is 6.2.0
* The Promotion entity is now translatable, which means existing promotions will need to be migrated to the new DB schema and care taken to preserve the name data. Also the GraphQL API for creating and updating Promotions, as well as the corresponding PromotionService methods have changed to take a `translations` array for setting the `name` and `description` in a given language.
* A new `Region` entity has been introduced, which is a base class for `Country` and the new `Province` entity. The `Zone.members` property is now an array of `Region` rather than `Country`, since Zones may now be composed of both countries and provinces. If you have defined any custom fields on `Country`, you'll need to change it to `Region` in your custom fields config.
* If you are using the s3 storage strategy of the AssetServerPlugin, it has been updated to use v3 of the AWS SDKs. This update introduces [an improved modular architecture to the AWS sdk](https://aws.amazon.com/blogs/developer/modular-packages-in-aws-sdk-for-javascript/), resulting in smaller bundle sizes. You need to install the `@aws-sdk/client-s3` & `@aws-sdk/lib-storage` packages, and can remove the `aws-sdk` package.
* The Stripe plugin has been made channel aware. This means your api key and webhook secret are now stored in the database, per channel, instead of environment variables. Details are in the migration guide.


## <small>1.x</small>

Changelogs for versions prior to v2.0.0 can be found in the [CHANGELOG_v1.md](./CHANGELOG_v1.md) file.
