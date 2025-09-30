---
title: "EntitySlugService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## EntitySlugService

<GenerationInfo sourceFile="packages/core/src/service/helpers/entity-slug.service.ts" sourceLine="41" packageName="@vendure/core" since="3.5.0" />

A service that handles slug generation for entities, ensuring uniqueness
and handling conflicts by appending numbers.

```ts title="Signature"
class EntitySlugService {
    constructor(slugService: SlugService, connection: TransactionalConnection)
    generateSlugFromInput(ctx: RequestContext, params: GenerateSlugFromInputParams) => Promise<string>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(slugService: <a href='/reference/typescript-api/services/slug-service#slugservice'>SlugService</a>, connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>) => EntitySlugService`}   />


### generateSlugFromInput

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, params: GenerateSlugFromInputParams) => Promise&#60;string&#62;`}   />

Generates a slug from input value for an entity, ensuring uniqueness.
Automatically detects if the field exists on the base entity or its translation entity.


</div>
