---
title: "BaseEntityResolver"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## BaseEntityResolver

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/common/base-entity-resolver.ts" sourceLine="55" packageName="@vendure/admin-ui" />

A base resolver for an entity detail route. Resolves to an observable of the given entity, or a "blank"
version if the route id equals "create". Should be used together with details views which extend the
<a href='/reference/admin-ui-api/list-detail-views/base-detail-component#basedetailcomponent'>BaseDetailComponent</a>.

*Example*

```ts
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

```ts title="Signature"
class BaseEntityResolver<T> {
    constructor(router: Router, emptyEntity: T, entityStream: (id: string) => Observable<T | null | undefined>)
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(router: Router, emptyEntity: T, entityStream: (id: string) =&#62; Observable&#60;T | null | undefined&#62;) => BaseEntityResolver`}   />




</div>
