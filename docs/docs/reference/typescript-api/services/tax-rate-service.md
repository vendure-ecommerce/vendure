---
title: "TaxRateService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TaxRateService

<GenerationInfo sourceFile="packages/core/src/service/services/tax-rate.service.ts" sourceLine="35" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a> entities.

```ts title="Signature"
class TaxRateService {
    constructor(connection: TransactionalConnection, eventBus: EventBus, listQueryBuilder: ListQueryBuilder, configService: ConfigService, customFieldRelationService: CustomFieldRelationService)
    findAll(ctx: RequestContext, options?: ListQueryOptions<TaxRate>, relations?: RelationPaths<TaxRate>) => Promise<PaginatedList<TaxRate>>;
    findOne(ctx: RequestContext, taxRateId: ID, relations?: RelationPaths<TaxRate>) => Promise<TaxRate | undefined>;
    create(ctx: RequestContext, input: CreateTaxRateInput) => Promise<TaxRate>;
    update(ctx: RequestContext, input: UpdateTaxRateInput) => Promise<TaxRate>;
    delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
    getApplicableTaxRate(ctx: RequestContext, zone: Zone, taxCategory: TaxCategory) => Promise<TaxRate>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, configService: ConfigService, customFieldRelationService: CustomFieldRelationService) => TaxRateService`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>&#62;, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, taxRateId: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a> | undefined&#62;`}   />


### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateTaxRateInput) => Promise&#60;<a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>&#62;`}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateTaxRateInput) => Promise&#60;<a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>&#62;`}   />


### delete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;`}   />


### getApplicableTaxRate

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, zone: <a href='/reference/typescript-api/entities/zone#zone'>Zone</a>, taxCategory: <a href='/reference/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>) => Promise&#60;<a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>&#62;`}   />

Returns the applicable TaxRate based on the specified Zone and TaxCategory. Used when calculating Order
prices.


</div>
