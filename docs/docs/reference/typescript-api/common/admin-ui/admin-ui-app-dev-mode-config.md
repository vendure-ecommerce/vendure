---
title: "AdminUiAppDevModeConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AdminUiAppDevModeConfig

<GenerationInfo sourceFile="packages/common/src/shared-types.ts" sourceLine="377" packageName="@vendure/common" />

Information about the Admin UI app dev server.

```ts title="Signature"
interface AdminUiAppDevModeConfig {
    sourcePath: string;
    port: number;
    route?: string;
    compile: () => Promise<void>;
}
```

<div className="members-wrapper">

### sourcePath

<MemberInfo kind="property" type={`string`}   />

The path to the uncompiled UI app source files. This path should contain the `vendure-ui-config.json` file.
### port

<MemberInfo kind="property" type={`number`}   />

The port on which the dev server is listening. Overrides the value set by `AdminUiOptions.port`.
### route

<MemberInfo kind="property" type={`string`} default={`'admin'`}   />

Specifies the url route to the Admin UI app.
### compile

<MemberInfo kind="property" type={`() =&#62; Promise&#60;void&#62;`}   />

The function which will be invoked to start the app compilation process.


</div>
