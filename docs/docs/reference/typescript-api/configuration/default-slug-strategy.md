---
title: "DefaultSlugStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultSlugStrategy

<GenerationInfo sourceFile="packages/core/src/config/entity/default-slug-strategy.ts" sourceLine="25" packageName="@vendure/core" since="3.5.0" />

The default strategy for generating slugs. This strategy:
- Converts to lowercase
- Replaces spaces and special characters with hyphens
- Removes non-alphanumeric characters (except hyphens)
- Removes leading and trailing hyphens
- Collapses multiple hyphens into one

*Example*

```ts
const strategy = new DefaultSlugStrategy();
strategy.generate(ctx, { value: "Hello World!" }); // "hello-world"
strategy.generate(ctx, { value: "Café Français" }); // "cafe-francais"
strategy.generate(ctx, { value: "100% Natural" }); // "100-natural"
```

```ts title="Signature"
class DefaultSlugStrategy implements SlugStrategy {
    generate(ctx: RequestContext, params: SlugGenerateParams) => string;
}
```
* Implements: <code><a href='/reference/typescript-api/configuration/slug-strategy#slugstrategy'>SlugStrategy</a></code>



<div className="members-wrapper">

### generate

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, params: SlugGenerateParams) => string`}   />




</div>
