---
title: "AssetPreviewStrategy"
weight: 10
date: 2019-01-30T10:57:03.701Z
generated: true
---
<!-- This file was generated from the Vendure TypeScript source. Do not modify. Instead, re-run "generate-docs" -->


# AssetPreviewStrategy

{{< generation-info source="/server/src/config/asset-preview-strategy/asset-preview-strategy.ts">}}

The AssetPreviewStrategy determines how preview images for assets are created. For imageassets, this would usually typically involve resizing to sensible dimensions. Other file typescould be previewed in a variety of ways, e.g.:- waveform images generated for audio files- preview images generated for pdf documents- watermarks added to preview images

### generatePreviewImage

{{< member-info kind="method" type="(mimeType: string, data: Buffer) => Promise&#60;Buffer&#62;" >}}



