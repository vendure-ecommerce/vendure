---
title: "SearchService"
weight: 10
date: 2023-07-14T16:57:50.569Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# SearchService
<div class="symbol">


# SearchService

{{< generation-info sourceFile="packages/core/src/service/services/search.service.ts" sourceLine="15" packageName="@vendure/core">}}

This service allows a concrete search service to override its behaviour
by passing itself to the `adopt()` method.

## Signature

```TypeScript
class SearchService {
  adopt(override: Pick<SearchService, 'reindex'>) => ;
  async reindex(ctx: RequestContext) => Promise<Job>;
}
```
## Members

### adopt

{{< member-info kind="method" type="(override: Pick&#60;<a href='/typescript-api/services/search-service#searchservice'>SearchService</a>, 'reindex'&#62;) => "  >}}

{{< member-description >}}Adopt a concrete search service implementation to pass through the
calls to.{{< /member-description >}}

### reindex

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
