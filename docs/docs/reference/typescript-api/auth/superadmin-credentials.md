---
title: "SuperadminCredentials"
weight: 10
date: 2023-07-20T13:56:14.893Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SuperadminCredentials

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="771" packageName="@vendure/core" />

These credentials will be used to create the Superadmin user & administrator
when Vendure first bootstraps.

```ts title="Signature"
interface SuperadminCredentials {
  identifier: string;
  password: string;
}
```

### identifier

<MemberInfo kind="property" type="string" default="'superadmin'"   />

The identifier to be used to create a superadmin account
### password

<MemberInfo kind="property" type="string" default="'superadmin'"   />

The password to be used to create a superadmin account
