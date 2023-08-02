---
title: "TestConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## testConfig

<GenerationInfo sourceFile="packages/testing/src/config/test-config.ts" sourceLine="42" packageName="@vendure/testing" />

A <a href='/reference/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a> object used for e2e tests. This configuration uses sqljs as the database
and configures some special settings which are optimized for e2e tests:

* `entityIdStrategy: new TestingEntityIdStrategy()` This ID strategy uses auto-increment IDs but encodes all IDs
to be prepended with the string `'T_'`, so ID `1` becomes `'T_1'`.
* `logger: new NoopLogger()` Do no output logs by default
* `assetStorageStrategy: new TestingAssetStorageStrategy()` This strategy does not actually persist any binary data to disk.
* `assetPreviewStrategy: new TestingAssetPreviewStrategy()` This strategy is a no-op.

## Logging
By default, the testConfig does not output any log messages. This is most desirable to keep a clean CI output.
However, for debugging purposes, it can make it hard to figure out why tests fail.

You can enable default logging behaviour with the environment variable `LOG`:

```
LOG=true yarn e2e
```

