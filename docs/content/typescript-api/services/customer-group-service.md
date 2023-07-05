---
title: "CustomerGroupService"
weight: 10
date: 2023-07-04T11:02:13.101Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# CustomerGroupService
<div class="symbol">


# CustomerGroupService

{{< generation-info sourceFile="packages/core/src/service/services/customer-group.service.ts" sourceLine="37" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a> entities.

## Signature

```TypeScript
class CustomerGroupService {
  constructor(connection: TransactionalConnection, listQueryBuilder: ListQueryBuilder, historyService: HistoryService, eventBus: EventBus, customFieldRelationService: CustomFieldRelationService)
  findAll(ctx: RequestContext, options?: CustomerGroupListOptions, relations: RelationPaths<CustomerGroup> = []) => Promise<PaginatedList<CustomerGroup>>;
  findOne(ctx: RequestContext, customerGroupId: ID, relations: RelationPaths<CustomerGroup> = []) => Promise<CustomerGroup | undefined>;
  getGroupCustomers(ctx: RequestContext, customerGroupId: ID, options?: CustomerListOptions) => Promise<PaginatedList<Customer>>;
  async create(ctx: RequestContext, input: CreateCustomerGroupInput) => Promise<CustomerGroup>;
  async update(ctx: RequestContext, input: UpdateCustomerGroupInput) => Promise<CustomerGroup>;
  async delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
  async addCustomersToGroup(ctx: RequestContext, input: MutationAddCustomersToGroupArgs) => Promise<CustomerGroup>;
  async removeCustomersFromGroup(ctx: RequestContext, input: MutationRemoveCustomersFromGroupArgs) => Promise<CustomerGroup>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, historyService: <a href='/typescript-api/services/history-service#historyservice'>HistoryService</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, customFieldRelationService: CustomFieldRelationService) => CustomerGroupService"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: CustomerGroupListOptions, relations: RelationPaths&#60;<a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>&#62; = []) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customerGroupId: <a href='/typescript-api/common/id#id'>ID</a>, relations: RelationPaths&#60;<a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>&#62; = []) => Promise&#60;<a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getGroupCustomers

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customerGroupId: <a href='/typescript-api/common/id#id'>ID</a>, options?: CustomerListOptions) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/customer#customer'>Customer</a>&#62;&#62;"  >}}

{{< member-description >}}Returns a <a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a> of all the Customers in the group.{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateCustomerGroupInput) => Promise&#60;<a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateCustomerGroupInput) => Promise&#60;<a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### delete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### addCustomersToGroup

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: MutationAddCustomersToGroupArgs) => Promise&#60;<a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### removeCustomersFromGroup

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: MutationRemoveCustomersFromGroupArgs) => Promise&#60;<a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
