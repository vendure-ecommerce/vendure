---
title: "SearchService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SearchService

<GenerationInfo sourceFile="packages/core/src/service/services/search.service.ts" sourceLine="15" packageName="@vendure/core" />

This service allows a concrete search service to override its behaviour
by passing itself to the `adopt()` method.

```ts title="Signature"
class SearchService {
    adopt(override: Pick<SearchService, 'reindex'>) => ;
    reindex(ctx: RequestContext) => Promise<Job>;
}
```

<div className="members-wrapper">

### adopt

<MemberInfo kind="method" type={`(override: Pick&#60;<a href='/reference/typescript-api/services/search-service#searchservice'>SearchService</a>, 'reindex'&#62;) => `}   />

Adopt a concrete search service implementation to pass through the
calls to.
### reindex

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#62;`}   />




</div>
