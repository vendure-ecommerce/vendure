---
title: "Asset Options"
weight: 1
---

# Asset Options

The `AssetOptions` define how assets (images and other files) are named and stored, and how preview images are generated.


## AssetNamingStrategy

This class defines how the asset file will be named when being stored after upload, including how to deal with naming conflicts with existing files. 

By default the `DefaultAssetNamingStrategy` is used, which normalizes the original file name and in the case of conflicts, appends a number to the end.

## AssetStorageStrategy

This defines how the asset files are stored to disk and retrieved. For example, if you wish to store assets on a cloud server such as Amazon S3, you can create a strategy for that.

{{% alert warning %}}
By default, the `NoAssetStorageStrategy` is used, which simply throws an error whenever an operation is attempted. Therefore, a valid strategy *must* be set in order to work with assets. The simplest way to do this is to use the `DefaultAssetServerPlugin`.
{{% /alert %}}

## AssetPreviewStrategy

This defines how preview images of assets are generated. Typically, a preview image would be a scaled-down version of the original file, so that if the source image is a 2MB, 3000 x 4000 pixel photo, the preview could be limited to some maximum dimensions. Additionally, non-image assets (e.g. pdfs, audio files) require preview images.

A use-case for writing a custom `AssetPreviewStrategy` could be the case of a business selling royalty-free music samples. In this case, the asset would be an audio file, and the custom strategy could include code which generates a visual waveform representation of the audio.

{{% alert warning %}}
By default, the `NoAssetPreviewStrategy` is used, which simply throws an error whenever an operation is attempted. Therefore, a valid strategy *must* be set in order to work with assets. The simplest way to do this is to use the `DefaultAssetServerPlugin`.
{{% /alert %}}

## uploadMaxFileSize

Sets the max file size in bytes for uploaded assets. Defaults to 20,971,520 bytes (20MiB).
