---
title: "AdminUiAppConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AdminUiAppConfig

<GenerationInfo sourceFile="packages/common/src/shared-types.ts" sourceLine="349" packageName="@vendure/common" />

Configures the path to a custom-build of the Admin UI app.

```ts title="Signature"
interface AdminUiAppConfig {
    path: string;
    route?: string;
    compile?: () => Promise<void>;
}
```

<div className="members-wrapper">

### path

<MemberInfo kind="property" type={`string`}   />

The path to the compiled admin UI app files. If not specified, an internal
default build is used. This path should contain the `vendure-ui-config.json` file,
index.html, the compiled js bundles etc.
### route

<MemberInfo kind="property" type={`string`} default={`'admin'`}   />

Specifies the url route to the Admin UI app.
### compile

<MemberInfo kind="property" type={`() =&#62; Promise&#60;void&#62;`}   />

The function which will be invoked to start the app compilation process.


</div>
