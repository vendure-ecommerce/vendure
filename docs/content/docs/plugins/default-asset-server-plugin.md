---
title: "DefaultAssetServerPlugin"
---

# DefaultAssetServerPlugin

The `DefaultAssetServerPlugin` serves assets (images and other files) from the local file system. It can also perform on-the-fly image transformations and caches the results for subsequent calls.

```ts
const config: VendureConfig = {
  // Add an instance of the plugin to the plugins array
  plugins: [
    new DefaultAssetServerPlugin({
      route: 'assets',
      assetUploadDir: path.join(__dirname, 'assets'),
      port: 4000,
    }),
  ],
};
```

The full configuration is documented at [DefaultAssetServerOptions]({{< relref "default-asset-server-options" >}})

## Image transformation

Asset preview images can be transformed (resized & cropped) on the fly by appending query parameters to the url:

`http://localhost:3000/assets/some-asset.jpg?w=500&h=300&mode=resize`

The above URL will return `some-asset.jpg`, resized to fit in the bounds of a 500px x 300px rectangle.

### Preview mode

The `mode` parameter can be either `crop` or `resize`. See the [ImageTransformMode]({{< relref "image-transform-mode" >}}) docs for details.

### Transform presets

Presets can be defined which allow a single preset name to be used instead of specifying the width, height and mode. Presets are configured via the DefaultAssetServerOptions [presets property]({{< relref "default-asset-server-options" >}}#presets).

For example, defining the following preset:

```ts
new DefaultAssetServerPlugin({
  // ...
  presets: [
    { name: 'my-preset', width: 85, height: 85, mode: 'crop' },
  ],
}),
```

means that a request to:

`http://localhost:3000/assets/some-asset.jpg?preset=my-preset`

is equivalent to:

`http://localhost:3000/assets/some-asset.jpg?w=85&h=85&mode=crop`

The DefaultAssetServerPlugin comes pre-configured with the following presets:

name | width | height | mode
-----|-------|--------|-----
tiny | 50px | 50px | crop
thumb | 150px | 150px | crop
small | 300px | 300px | resize
medium | 500px | 500px | resize
large | 800px | 800px | resize
