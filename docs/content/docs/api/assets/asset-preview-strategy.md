---
title: "AssetPreviewStrategy"
weight: 10
generated: true
---
<!-- This file was generated from the Vendure TypeScript source. Do not modify. Instead, re-run "generate-docs" -->


# AssetPreviewStrategy

The AssetPreviewStrategy determines how preview images for assets are created. For imageassets, this would usually typically involve resizing to sensible dimensions. Other file typescould be previewed in a variety of ways, e.g.:- waveform images generated for audio files- preview images generated for pdf documents- watermarks added to preview images

### generatePreviewImage

{{< member-info type="(mimeType: string, data: Buffer) => Promise&#60;Buffer&#62;" >}}



