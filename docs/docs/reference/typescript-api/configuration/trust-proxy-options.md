---
title: "TrustProxyOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TrustProxyOptions

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="244" packageName="@vendure/core" since="3.4.0" />

Configures Express trust proxy settings when running behind a reverse proxy (usually the case with most hosting services).
Setting `trustProxy` allows you to retrieve the original IP address from the `X-Forwarded-For` header.

See the [express documentation](https://expressjs.com/en/guide/behind-proxies.html) for more details.

```ts title="Signature"
type TrustProxyOptions = boolean | number | string | string[] | ((ip: string) => boolean)
```
