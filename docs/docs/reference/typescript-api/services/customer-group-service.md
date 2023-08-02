---
title: "CustomerGroupService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CustomerGroupService

<GenerationInfo sourceFile="packages/core/src/service/services/customer-group.service.ts" sourceLine="37" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a> entities.

```ts title="Signature"
class CustomerGroupService {
    constructor(connection: TransactionalConnection, listQueryBuilder: ListQueryBuilder, historyService: HistoryService, eventBus: EventBus, customFieldRelationService: CustomFieldRelationService)
    findAll(ctx: RequestContext, options?: CustomerGroupListOptions, relations: RelationPaths<CustomerGroup> = []) => Promise<PaginatedList<CustomerGroup>>;
    findOne(ctx: RequestContext, customerGroupId: ID, relations: RelationPaths<CustomerGroup> = []) => Promise<CustomerGroup | undefined>;
    getGroupCustomers(ctx: RequestContext, customerGroupId: ID, options?: CustomerListOptions) => Promise<PaginatedList<Customer>>;
    create(ctx: RequestContext, input: CreateCustomerGroupInput) => Promise<CustomerGroup>;
    update(ctx: RequestContext, input: UpdateCustomerGroupInput) => Promise<CustomerGroup>;
    delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
    addCustomersToGroup(ctx: RequestContext, input: MutationAddCustomersToGroupArgs) => Promise<CustomerGroup>;
    removeCustomersFromGroup(ctx: RequestContext, input: MutationRemoveCustomersFromGroupArgs) => Promise<CustomerGroup>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, historyService: <a href='/reference/typescript-api/services/history-service#historyservice'>HistoryService</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, customFieldRelationService: CustomFieldRelationService) => CustomerGroupService`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: CustomerGroupListOptions, relations: RelationPaths&#60;<a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>&#62; = []) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customerGroupId: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations: RelationPaths&#60;<a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>&#62; = []) => Promise&#60;<a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a> | undefined&#62;`}   />


### getGroupCustomers

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customerGroupId: <a href='/reference/typescript-api/common/id#id'>ID</a>, options?: CustomerListOptions) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/customer#customer'>Customer</a>&#62;&#62;`}   />

Returns a <a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a> of all the Customers in the group.
### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateCustomerGroupInput) => Promise&#60;<a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>&#62;`}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateCustomerGroupInput) => Promise&#60;<a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>&#62;`}   />


### delete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;`}   />


### addCustomersToGroup

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: MutationAddCustomersToGroupArgs) => Promise&#60;<a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>&#62;`}   />


### removeCustomersFromGroup

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: MutationRemoveCustomersFromGroupArgs) => Promise&#60;<a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>&#62;`}   />




</div>
