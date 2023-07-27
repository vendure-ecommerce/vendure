---
title: "SuperadminCredentials"
weight: 10
date: 2023-07-14T16:57:49.762Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# SuperadminCredentials
<div class="symbol">


# SuperadminCredentials

{{< generation-info sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="771" packageName="@vendure/core">}}

These credentials will be used to create the Superadmin user & administrator
when Vendure first bootstraps.

## Signature

```TypeScript
interface SuperadminCredentials {
  identifier: string;
  password: string;
}
```
## Members

### identifier

{{< member-info kind="property" type="string" default="'superadmin'"  >}}

{{< member-description >}}The identifier to be used to create a superadmin account{{< /member-description >}}

### password

{{< member-info kind="property" type="string" default="'superadmin'"  >}}

{{< member-description >}}The password to be used to create a superadmin account{{< /member-description >}}


</div>
