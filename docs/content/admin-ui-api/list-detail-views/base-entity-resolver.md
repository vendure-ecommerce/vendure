---
title: "BaseEntityResolver"
weight: 10
date: 2023-07-14T16:57:51.047Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# BaseEntityResolver
<div class="symbol">


# BaseEntityResolver

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/common/base-entity-resolver.ts" sourceLine="49" packageName="@vendure/admin-ui">}}

A base resolver for an entity detail route. Resolves to an observable of the given entity, or a "blank"
version if the route id equals "create". Should be used together with details views which extend the
<a href='/admin-ui-api/list-detail-views/base-detail-component#basedetailcomponent'>BaseDetailComponent</a>.

*Example*

```TypeScript
@Injectable({
  providedIn: 'root',
})
export class MyEntityResolver extends BaseEntityResolver<MyEntityFragment> {
  constructor(router: Router, dataService: DataService) {
    super(
      router,
      {
        __typename: 'MyEntity',
        id: '',
        createdAt: '',
        updatedAt: '',
        name: '',
      },
      id => dataService.query(GET_MY_ENTITY, { id }).mapStream(data => data.myEntity),
    );
  }
}
```

## Signature

```TypeScript
class BaseEntityResolver<T> {
  constructor(router: Router, emptyEntity: T, entityStream: (id: string) => Observable<T | null | undefined>)
}
```
## Members

### constructor

{{< member-info kind="method" type="(router: Router, emptyEntity: T, entityStream: (id: string) =&#62; Observable&#60;T | null | undefined&#62;) => BaseEntityResolver"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
