import { Inject, OnApplicationBootstrap } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { EventBus, Injector, PluginCommonModule, VendurePlugin } from '@vendure/core';
import { buffer, debounceTime } from 'rxjs/operators';

import { shopApiExtensions } from './api/api-extensions';
import { SearchResponseFieldResolver } from './api/search-response.resolver';
import { STELLATE_PLUGIN_OPTIONS } from './constants';
import { StellateService } from './service/stellate.service';
import { StellatePluginOptions } from './types';

const StellateOptionsProvider = {
    provide: STELLATE_PLUGIN_OPTIONS,
    useFactory: () => StellatePlugin.options,
};

/**
 * @description
 * A plugin to integrate the [Stellate](https://stellate.co/) GraphQL caching service with your Vendure server.
 * The main purpose of this plugin is to ensure that cached data gets correctly purged in
 * response to events inside Vendure. For example, changes to a Product's description should
 * purge any associated record for that Product in Stellate's cache.
 *
 * ## Pre-requisites
 *
 * You will first need to [set up a free Stellate account](https://stellate.co/signup).
 *
 * You will also need to generate an **API token** for the Stellate Purging API. For instructions on how to generate the token,
 * see the [Stellate Purging API docs](https://docs.stellate.co/docs/purging-api#authentication).
 *
 * ## Installation
 *
 * ```
 * npm install \@vendure/stellate-plugin
 * ```
 *
 * ## Configuration
 *
 * The plugin is configured via the `StellatePlugin.init()` method. This method accepts an options object
 * which defines the Stellate service name and API token, as well as an array of {@link PurgeRule}s which
 * define how the plugin will respond to Vendure events in order to trigger calls to the
 * Stellate [Purging API](https://stellate.co/docs/graphql-edge-cache/purging-api).
 *
 * @example
 * ```ts
 * import { StellatePlugin, defaultPurgeRules } from '\@vendure/stellate-plugin';
 * import { VendureConfig } from '\@vendure/core';
 *
 * export const config: VendureConfig = {
 *    // ...
 *    plugins: [
 *        StellatePlugin.init({
 *            // The Stellate service name, i.e. `<serviceName>.stellate.sh`
 *            serviceName: 'my-service',
 *            // The API token for the Stellate Purging API. See the "pre-requisites" section above.
 *            apiToken: process.env.STELLATE_PURGE_API_TOKEN,
 *            devMode: !isProd || process.env.STELLATE_DEBUG_MODE ? true : false,
 *            debugLogging: process.env.STELLATE_DEBUG_MODE ? true : false,
 *            purgeRules: [
 *                ...defaultPurgeRules,
 *                // custom purge rules can be added here
 *            ],
 *        }),
 *    ],
 * };
 * ```
 *
 * In your Stellate dashboard, you can use the following configuration example as a sensible default for a
 * Vendure application:
 *
 * @example
 * ```ts
 * import { Config } from "stellate";
 *
 * const config: Config = {
 *   config: {
 *     name: "my-vendure-server",
 *     originUrl: "https://my-vendure-server.com/shop-api",
 *     ignoreOriginCacheControl: true,
 *     passThroughOnly: false,
 *     scopes: {
 *       SESSION_BOUND: "header:authorization|cookie:session",
 *     },
 *     headers: {
 *       "access-control-expose-headers": "vendure-auth-token",
 *     },
 *     rootTypeNames: {
 *       query: "Query",
 *       mutation: "Mutation",
 *     },
 *     keyFields: {
 *       types: {
 *         SearchResult: ["productId"],
 *         SearchResponseCacheIdentifier: ["collectionSlug"],
 *       },
 *     },
 *     rules: [
 *       {
 *         types: [
 *           "Product",
 *           "Collection",
 *           "ProductVariant",
 *           "SearchResponse",
 *         ],
 *         maxAge: 900,
 *         swr: 900,
 *         description: "Cache Products & Collections",
 *       },
 *       {
 *         types: ["Channel"],
 *         maxAge: 9000,
 *         swr: 9000,
 *         description: "Cache active channel",
 *       },
 *       {
 *         types: ["Order", "Customer", "User"],
 *         maxAge: 0,
 *         swr: 0,
 *         description: "Do not cache user data",
 *       },
 *     ],
 *   },
 * };
 * export default config;
 * ```
 *
 * ## Storefront setup
 *
 * In your storefront, you should point your GraphQL client to the Stellate GraphQL API endpoint, which is
 * `https://<service-name>.stellate.sh`.
 *
 * Wherever you are using the `search` query (typically in product listing & search pages), you should also add the
 * `cacheIdentifier` field to the query. This will ensure that the Stellate cache is correctly purged when
 * a Product or Collection is updated.
 *
 * @example
 * ```ts
 * import { graphql } from '../generated/gql';
 *
 * export const searchProductsDocument = graphql(`
 *     query SearchProducts($input: SearchInput!) {
 *         search(input: $input) {
 *             // highlight-start
 *             cacheIdentifier {
 *                 collectionSlug
 *             }
 *             // highlight-end
 *             items {
 *                # ...
 *             }
 *         }
 *     }
 * }`);
 * ```
 *
 * ## Custom PurgeRules
 *
 * The configuration above only accounts for caching of some of the built-in Vendure entity types. If you have
 * custom entity types, you may well want to add them to the Stellate cache. In this case, you'll also need a way to
 * purge those entities from the cache when they are updated. This is where the {@link PurgeRule} comes in.
 *
 * Let's imagine that you have built a simple CMS plugin for Vendure which exposes an `Article` entity in your Shop API, and
 * you have added this to your Stellate configuration:
 *
 * @example
 * ```ts
 * import { Config } from "stellate";
 *
 * const config: Config = {
 *     config: {
 *         // ...
 *         rules: [
 *             // ...
 *             {
 *                 types: ["Article"],
 *                 maxAge: 900,
 *                 swr: 900,
 *                 description: "Cache Articles",
 *             },
 *         ],
 *     },
 *     // ...
 * };
 * export default config;
 * ```
 *
 * You can then add a custom {@link PurgeRule} to the StellatePlugin configuration:
 *
 * @example
 * ```ts
 * import { StellatePlugin, defaultPurgeRules } from "\@vendure/stellate-plugin";
 * import { VendureConfig } from "\@vendure/core";
 * import { ArticleEvent } from "./plugins/cms/events/article-event";
 *
 * export const config: VendureConfig = {
 *     // ...
 *     plugins: [
 *         StellatePlugin.init({
 *             // ...
 *             purgeRules: [
 *                 ...defaultPurgeRules,
 *                 new PurgeRule({
 *                     eventType: ArticleEvent,
 *                     handler: async ({ events, stellateService }) => {
 *                         const articleIds = events.map((e) => e.article.id);
 *                         stellateService.purge("Article", articleIds);
 *                     },
 *                 }),
 *             ],
 *         }),
 *     ],
 * };
 * ```
 *
 * ## DevMode & Debug Logging
 *
 * In development, you can set `devMode: true`, which will prevent any calls being made to the Stellate Purging API.
 *
 * If you want to log the calls that _would_ be made to the Stellate Purge API when in devMode, you can set `debugLogging: true`.
 * Note that debugLogging generates a lot of debug-level logging, so it is recommended to only enable this when needed.
 *
 * @example
 * ```ts
 * import { StellatePlugin, defaultPurgeRules } from '\@vendure/stellate-plugin';
 * import { VendureConfig } from '\@vendure/core';
 *
 * export const config: VendureConfig = {
 *    // ...
 *    plugins: [
 *        StellatePlugin.init({
 *            // ...
 *            devMode: !process.env.PRODUCTION,
 *            debugLogging: process.env.STELLATE_DEBUG_MODE ? true : false,
 *            purgeRules: [
 *                ...defaultPurgeRules,
 *            ],
 *        }),
 *    ],
 * };
 * ```
 *
 *
 * @since 2.1.5
 * @docsCategory core plugins/StellatePlugin
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [StellateOptionsProvider, StellateService],
    shopApiExtensions: {
        schema: shopApiExtensions,
        resolvers: [SearchResponseFieldResolver],
    },
    compatibility: '^2.0.0',
})
export class StellatePlugin implements OnApplicationBootstrap {
    static options: StellatePluginOptions;

    static init(options: StellatePluginOptions) {
        this.options = options;
        return this;
    }

    constructor(
        @Inject(STELLATE_PLUGIN_OPTIONS) private options: StellatePluginOptions,
        private eventBus: EventBus,
        private stellateService: StellateService,
        private moduleRef: ModuleRef,
    ) {}

    onApplicationBootstrap() {
        const injector = new Injector(this.moduleRef);

        for (const purgeRule of this.options.purgeRules ?? []) {
            const source$ = this.eventBus.ofType(purgeRule.eventType);
            source$
                .pipe(
                    buffer(
                        source$.pipe(
                            debounceTime(purgeRule.bufferTimeMs ?? this.options.defaultBufferTimeMs ?? 2000),
                        ),
                    ),
                )
                .subscribe(events =>
                    purgeRule.handle({ events, injector, stellateService: this.stellateService }),
                );
        }
    }
}
