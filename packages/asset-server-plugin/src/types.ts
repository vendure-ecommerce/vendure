import { AssetNamingStrategy, AssetStorageStrategy, RequestContext } from '@vendure/core';

/**
 * @description
 * Specifies the way in which an asset preview image will be resized to fit in the
 * proscribed dimensions:
 *
 * * crop: crops the image to cover both provided dimensions
 * * resize: Preserving aspect ratio, resizes the image to be as large as possible
 * while ensuring its dimensions are less than or equal to both those specified.
 *
 * @docsCategory AssetServerPlugin
 */

export type ImageTransformMode = 'crop' | 'resize';

/**
 * @description
 * A configuration option for an image size preset for the AssetServerPlugin.
 *
 * Presets allow a shorthand way to generate a thumbnail preview of an asset. For example,
 * the built-in "tiny" preset generates a 50px x 50px cropped preview, which can be accessed
 * by appending the string `preset=tiny` to the asset url:
 *
 * `http://localhost:3000/assets/some-asset.jpg?preset=tiny`
 *
 * is equivalent to:
 *
 * `http://localhost:3000/assets/some-asset.jpg?w=50&h=50&mode=crop`
 *
 * @docsCategory AssetServerPlugin
 */
export interface ImageTransformPreset {
    name: string;
    width: number;
    height: number;
    mode: ImageTransformMode;
}

/**
 * @description
 * The configuration options for the AssetServerPlugin.
 *
 * @docsCategory AssetServerPlugin
 */
export interface AssetServerOptions {
    /**
     * @description
     * The route to the asset server.
     */
    route: string;
    /**
     * @description
     * The local directory to which assets will be uploaded when using the {@link LocalAssetStorageStrategy}.
     */
    assetUploadDir: string; // TODO: this is strategy-specific and should be moved out of the global options
    /**
     * @description
     * The complete URL prefix of the asset files. For example, "https://demo.vendure.io/assets/". A
     * function can also be provided to handle more complex cases, such as serving multiple domains
     * from a single server. In this case, the function should return a string url prefix.
     *
     * If not provided, the plugin will attempt to guess based off the incoming
     * request and the configured route. However, in all but the simplest cases,
     * this guess may not yield correct results.
     */
    assetUrlPrefix?: string | ((ctx: RequestContext, identifier: string) => string);
    /**
     * @description
     * The max width in pixels of a generated preview image.
     *
     * @default 1600
     */
    previewMaxWidth?: number;
    /**
     * @description
     * The max height in pixels of a generated preview image.
     *
     * @default 1600
     */
    previewMaxHeight?: number;
    /**
     * @description
     * An array of additional {@link ImageTransformPreset} objects.
     */
    presets?: ImageTransformPreset[];
    /**
     * @description
     * Defines how asset files and preview images are named before being saved.
     *
     * @default HashedAssetNamingStrategy
     */
    namingStrategy?: AssetNamingStrategy;
    /**
     * @description
     * A function which can be used to configure an {@link AssetStorageStrategy}. This is useful e.g. if you wish to store your assets
     * using a cloud storage provider. By default, the {@link LocalAssetStorageStrategy} is used.
     *
     * @default () => LocalAssetStorageStrategy
     */
    storageStrategyFactory?: (
        options: AssetServerOptions,
    ) => AssetStorageStrategy | Promise<AssetStorageStrategy>;
}
