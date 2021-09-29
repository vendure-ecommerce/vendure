import { BrandingOptions, StaticAssetDefinition, StaticAssetExtension } from './types';

/**
 * @description
 * A helper function to simplify the process of setting custom branding images.
 *
 * @example
 * ```TypeScript
 * compileUiExtensions({
 *   outputPath: path.join(__dirname, '../admin-ui'),
 *   extensions: [
 *     setBranding({
 *       smallLogoPath: path.join(__dirname, 'images/my-logo-sm.png'),
 *       largeLogoPath: path.join(__dirname, 'images/my-logo-lg.png'),
 *       faviconPath: path.join(__dirname, 'images/my-favicon.ico'),
 *     }),
 *   ],
 * });
 * ```
 *
 * @docsCategory UiDevkit
 * @docsPage helpers
 */
export function setBranding(options: BrandingOptions): StaticAssetExtension {
    const staticAssets: StaticAssetDefinition[] = [];
    if (options.smallLogoPath) {
        staticAssets.push({
            path: options.smallLogoPath,
            rename: 'logo-75px.png',
        });
    }
    if (options.largeLogoPath) {
        staticAssets.push({
            path: options.largeLogoPath,
            rename: 'logo-300px.png',
        });
    }
    if (options.faviconPath) {
        staticAssets.push({
            path: options.faviconPath,
            rename: 'favicon.ico',
        });
    }
    return { staticAssets };
}
