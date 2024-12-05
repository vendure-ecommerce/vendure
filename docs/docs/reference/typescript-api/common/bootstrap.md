---
title: "Bootstrap"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## bootstrap

<GenerationInfo sourceFile="packages/core/src/bootstrap.ts" sourceLine="159" packageName="@vendure/core" />

Bootstraps the Vendure server. This is the entry point to the application.

*Example*

```ts
import { bootstrap } from '@vendure/core';
import { config } from './vendure-config';

bootstrap(config).catch(err => {
  console.log(err);
  process.exit(1);
});
```

### Passing additional options

Since v2.2.0, you can pass additional options to the NestJs application via the `options` parameter.
For example, to integrate with the [Nest Devtools](https://docs.nestjs.com/devtools/overview), you need to
pass the `snapshot` option:

```ts
import { bootstrap } from '@vendure/core';
import { config } from './vendure-config';

bootstrap(config, {
  // highlight-start
  nestApplicationOptions: {
    snapshot: true,
  }
  // highlight-end
}).catch(err => {
  console.log(err);
  process.exit(1);
});
```

### Ignoring compatibility errors for plugins

Since v3.1.0, you can ignore compatibility errors for specific plugins by passing the `ignoreCompatibilityErrorsForPlugins` option.

This should be used with caution, only if you are sure that the plugin will still work as expected with the current version of Vendure.

*Example*

```ts
import { bootstrap } from '@vendure/core';
import { config } from './vendure-config';
import { MyPlugin } from './plugins/my-plugin';

bootstrap(config, {
  // Let's say that `MyPlugin` is not yet compatible with the current version of Vendure
  // but we know that it will still work as expected, and we are not able to publish
  // a new version of the plugin right now.
  ignoreCompatibilityErrorsForPlugins: [MyPlugin],
});
```

```ts title="Signature"
function bootstrap(userConfig: Partial<VendureConfig>, options?: BootstrapOptions): Promise<INestApplication>
```
Parameters

### userConfig

<MemberInfo kind="parameter" type={`Partial&#60;<a href='/reference/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>&#62;`} />

### options

<MemberInfo kind="parameter" type={`<a href='/reference/typescript-api/common/bootstrap#bootstrapoptions'>BootstrapOptions</a>`} />



## BootstrapOptions

<GenerationInfo sourceFile="packages/core/src/bootstrap.ts" sourceLine="41" packageName="@vendure/core" since="2.2.0" />

Additional options that can be used to configure the bootstrap process of the
Vendure server.

```ts title="Signature"
interface BootstrapOptions {
    nestApplicationOptions?: NestApplicationOptions;
    ignoreCompatibilityErrorsForPlugins?: Array<DynamicModule | Type<any>>;
}
```

<div className="members-wrapper">

### nestApplicationOptions

<MemberInfo kind="property" type={`NestApplicationOptions`}   />

These options get passed directly to the `NestFactory.create()` method.
### ignoreCompatibilityErrorsForPlugins

<MemberInfo kind="property" type={`Array&#60;DynamicModule | Type&#60;any&#62;&#62;`} default={`[]`}  since="3.1.0"  />

By default, if a plugin specifies a compatibility range which does not include the current
Vendure version, the bootstrap process will fail. This option allows you to ignore compatibility
errors for specific plugins.

This setting should be used with caution, only if you are sure that the plugin will still
work as expected with the current version of Vendure.

*Example*

```ts
import { bootstrap } from '@vendure/core';
import { config } from './vendure-config';
import { MyPlugin } from './plugins/my-plugin';

bootstrap(config, {
 ignoreCompatibilityErrorsForPlugins: [MyPlugin],
});
```


</div>
