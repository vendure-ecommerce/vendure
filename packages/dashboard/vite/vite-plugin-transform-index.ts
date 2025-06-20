import { Plugin, ResolvedConfig } from 'vite';

/**
 * @description
 * This Vite plugin handles the scenario where the `base` path is set in the Vite config.
 * The default Vite behavior is to prepend the `base` path to all `href` and `src` attributes in the HTML,
 * but this causes the Vendure Dashboard not to load its assets correctly.
 *
 * This plugin removes the `base` path from all `href` and `src` attributes in the HTML,
 * and adds a `<base>` tag to the `<head>` of the HTML document.
 */
export function transformIndexHtmlPlugin(): Plugin {
    let config: ResolvedConfig;
    return {
        name: 'vendure:vite-config-transform-index-html',
        configResolved(resolvedConfig) {
            // store the resolved config
            config = resolvedConfig;
        },
        transformIndexHtml(html) {
            if (config.base && config.base !== '/') {
                // Remove the base path from hrefs and srcs
                const basePath = config.base.replace(/\/$/, ''); // Remove trailing slash

                // Single regex to handle both href and src attributes with any quote type
                const attributeRegex = new RegExp(`(href|src)=(["'])${basePath}`, 'g');
                let transformedHtml = html.replace(attributeRegex, '$1=$2');

                // Add base tag to head
                const baseTag = `        <base href="${config.base}">\n`;
                transformedHtml = transformedHtml.replace(/<head>/, `<head>\n${baseTag}`);

                return transformedHtml;
            }
            return html;
        },
    };
}
