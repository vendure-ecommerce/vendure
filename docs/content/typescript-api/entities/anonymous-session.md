---
title: "AnonymousSession"
weight: 10
date: 2023-07-14T16:57:49.990Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AnonymousSession
<div class="symbol">


# AnonymousSession

{{< generation-info sourceFile="packages/core/src/entity/session/anonymous-session.entity.ts" sourceLine="16" packageName="@vendure/core">}}

An anonymous session is created when a unauthenticated user interacts with restricted operations,
such as calling the `activeOrder` query in the Shop API. Anonymous sessions allow a guest Customer
to maintain an order without requiring authentication and a registered account beforehand.

## Signature

```TypeScript
class AnonymousSession extends Session {
  constructor(input: DeepPartial<AnonymousSession>)
}
```
## Extends

 * <a href='/typescript-api/entities/session#session'>Session</a>


## Members

### constructor

{{< member-info kind="method" type="(input: DeepPartial&#60;<a href='/typescript-api/entities/anonymous-session#anonymoussession'>AnonymousSession</a>&#62;) => AnonymousSession"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
