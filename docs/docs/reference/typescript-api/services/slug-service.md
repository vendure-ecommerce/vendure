---
title: "SlugService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SlugService

<GenerationInfo sourceFile="packages/core/src/service/helpers/slug.service.ts" sourceLine="13" packageName="@vendure/core" since="3.5.0" />

A service that handles slug generation using the configured SlugStrategy.

```ts title="Signature"
class SlugService {
    constructor(configService: ConfigService)
    generate(ctx: RequestContext, params: SlugGenerateParams) => Promise<string>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(configService: ConfigService) => SlugService`}   />


### generate

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, params: SlugGenerateParams) => Promise&#60;string&#62;`}   />

Generates a slug from the input string using the configured SlugStrategy.


</div>
