---
title: "HistoryService"
weight: 10
date: 2023-07-14T16:57:50.403Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# HistoryService
<div class="symbol">


# HistoryService

{{< generation-info sourceFile="packages/core/src/service/services/history.service.ts" sourceLine="241" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/history-entry#historyentry'>HistoryEntry</a> entities. Histories are timelines of actions
related to a particular Customer or Order, recording significant events such as creation, state changes,
notes, etc.

## Custom History Entry Types

Since Vendure v1.9.0, it is possible to define custom HistoryEntry types.

Let's take an example where we have some Customers who are businesses. We want to verify their
tax ID in order to allow them wholesale rates. As part of this verification, we'd like to add
an entry into the Customer's history with data about the tax ID verification.

First of all we'd extend the GraphQL `HistoryEntryType` enum for our new type as part of a plugin

*Example*

```TypeScript
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { VerificationService } from './verification.service';

@VendurePlugin({
  imports: [PluginCommonModule],
  adminApiExtensions: {
    schema: gql`
      extend enum HistoryEntryType {
        CUSTOMER_TAX_ID_VERIFICATION
      }
    `,
  },
  providers: [VerificationService],
})
export class TaxIDVerificationPlugin {}
```

Next we need to create a TypeScript type definition file where we extend the `CustomerHistoryEntryData` interface. This is done
via TypeScript's [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces)
and [ambient modules](https://www.typescriptlang.org/docs/handbook/modules.html#ambient-modules) features.

*Example*

```TypeScript
// types.ts
import { CustomerHistoryEntryData } from '@vendure/core';

export const CUSTOMER_TAX_ID_VERIFICATION = 'CUSTOMER_TAX_ID_VERIFICATION';

declare module '@vendure/core' {
  interface CustomerHistoryEntryData {
    [CUSTOMER_TAX_ID_VERIFICATION]: {
      taxId: string;
      valid: boolean;
      name?: string;
      address?: string;
    };
  }
}
```

Note: it works exactly the same way if we wanted to add a custom type for Order history, except in that case we'd extend the
`OrderHistoryEntryData` interface instead.

Now that we have our types set up, we can use the HistoryService to add a new HistoryEntry in a type-safe manner:

*Example*

```TypeScript
// verification.service.ts
import { Injectable } from '@nestjs/common';
import { RequestContext } from '@vendure/core';
import { CUSTOMER_TAX_ID_VERIFICATION } from './types';

@Injectable()
export class VerificationService {
  constructor(private historyService: HistoryService) {}

  async verifyTaxId(ctx: RequestContext, customerId: ID, taxId: string) {
    const result = await someTaxIdCheckingService(taxId);

    await this.historyService.createHistoryEntryForCustomer({
      customerId,
      ctx,
      type: CUSTOMER_TAX_ID_VERIFICATION,
      data: {
        taxId,
        valid: result.isValid,
        name: result.companyName,
        address: result.registeredAddress,
      },
    });
  }
}
```
{{% alert %}}
It is also possible to define a UI component to display custom history entry types. See the
[Custom History Timeline Components guide]({{< relref "custom-timeline-components" >}}).
{{% /alert %}}

## Signature

```TypeScript
class HistoryService {
  constructor(connection: TransactionalConnection, administratorService: AdministratorService, listQueryBuilder: ListQueryBuilder, eventBus: EventBus)
  async getHistoryForOrder(ctx: RequestContext, orderId: ID, publicOnly: boolean, options?: HistoryEntryListOptions) => Promise<PaginatedList<OrderHistoryEntry>>;
  async createHistoryEntryForOrder(args: CreateOrderHistoryEntryArgs<T>, isPublic:  = true) => Promise<OrderHistoryEntry>;
  async getHistoryForCustomer(ctx: RequestContext, customerId: ID, publicOnly: boolean, options?: HistoryEntryListOptions) => Promise<PaginatedList<CustomerHistoryEntry>>;
  async createHistoryEntryForCustomer(args: CreateCustomerHistoryEntryArgs<T>, isPublic:  = false) => Promise<CustomerHistoryEntry>;
  async updateOrderHistoryEntry(ctx: RequestContext, args: UpdateOrderHistoryEntryArgs<T>) => ;
  async deleteOrderHistoryEntry(ctx: RequestContext, id: ID) => Promise<void>;
  async updateCustomerHistoryEntry(ctx: RequestContext, args: UpdateCustomerHistoryEntryArgs<T>) => ;
  async deleteCustomerHistoryEntry(ctx: RequestContext, id: ID) => Promise<void>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, administratorService: <a href='/typescript-api/services/administrator-service#administratorservice'>AdministratorService</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>) => HistoryService"  >}}

{{< member-description >}}{{< /member-description >}}

### getHistoryForOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>, publicOnly: boolean, options?: HistoryEntryListOptions) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/order-history-entry#orderhistoryentry'>OrderHistoryEntry</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### createHistoryEntryForOrder

{{< member-info kind="method" type="(args: CreateOrderHistoryEntryArgs&#60;T&#62;, isPublic:  = true) => Promise&#60;<a href='/typescript-api/entities/order-history-entry#orderhistoryentry'>OrderHistoryEntry</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getHistoryForCustomer

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customerId: <a href='/typescript-api/common/id#id'>ID</a>, publicOnly: boolean, options?: HistoryEntryListOptions) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/customer-history-entry#customerhistoryentry'>CustomerHistoryEntry</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### createHistoryEntryForCustomer

{{< member-info kind="method" type="(args: CreateCustomerHistoryEntryArgs&#60;T&#62;, isPublic:  = false) => Promise&#60;<a href='/typescript-api/entities/customer-history-entry#customerhistoryentry'>CustomerHistoryEntry</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### updateOrderHistoryEntry

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, args: UpdateOrderHistoryEntryArgs&#60;T&#62;) => "  >}}

{{< member-description >}}{{< /member-description >}}

### deleteOrderHistoryEntry

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;void&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### updateCustomerHistoryEntry

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, args: UpdateCustomerHistoryEntryArgs&#60;T&#62;) => "  >}}

{{< member-description >}}{{< /member-description >}}

### deleteCustomerHistoryEntry

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;void&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
