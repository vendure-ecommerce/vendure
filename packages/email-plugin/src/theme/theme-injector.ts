import { Injector, RequestContext } from '@vendure/core';

/**
 * @description
 * Allows you to create a global "theme" object containing arbitray values that can be loaded sync or async.
 *
 * @example
 * ```ts
 * import { EmailPlugin, ThemeInjector } from '\@vendure/email-plugin';
 *
 * class MyChannelThemeInjector implements ThemeInjector {
 *      async injectTheme(injector, ctx) {
 *          const myAsyncService = injector.get(MyAsyncService);
 *          const asyncValue = await myAsyncService.get(ctx);
 *          const channel = ctx.channel;
 *          const { primaryColor, secondaryColor, streetAddress, city } = channel.customFields.theme;
 *          const theme = {
 *              primaryColor,
 *              secondaryColor,
 *              streetAddress,
 *              city,
 *              asyncValue,
 *          };
 *          return { theme };
 *      }
 * }
 *
 * // In vendure-config.ts:
 * ...
 * EmailPlugin.init({
 *     themeInjector: new MyChannelThemeInjector()
 *     ...
 * })
 * ```
 *
 * @docsCategory core plugins/EmailPlugin
 * @docsPage EmailThemeInjector
 * @docsWeight 0
 */
export interface EmailThemeInjector {
    /**
     * @description
     * Create global theme settings
     */
    injectTheme(
        injector: Injector,
        ctx: RequestContext,
    ): Promise<{ [key: string]: any; theme: any }> | { [key: string]: any; theme: any };
}
