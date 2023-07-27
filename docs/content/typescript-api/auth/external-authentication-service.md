---
title: "ExternalAuthenticationService"
weight: 10
date: 2023-07-14T16:57:50.228Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ExternalAuthenticationService
<div class="symbol">


# ExternalAuthenticationService

{{< generation-info sourceFile="packages/core/src/service/helpers/external-authentication/external-authentication.service.ts" sourceLine="24" packageName="@vendure/core">}}

This is a helper service which exposes methods related to looking up and creating Users based on an
external <a href='/typescript-api/auth/authentication-strategy#authenticationstrategy'>AuthenticationStrategy</a>.

## Signature

```TypeScript
class ExternalAuthenticationService {
  constructor(connection: TransactionalConnection, roleService: RoleService, historyService: HistoryService, customerService: CustomerService, administratorService: AdministratorService, channelService: ChannelService)
  async findCustomerUser(ctx: RequestContext, strategy: string, externalIdentifier: string, checkCurrentChannelOnly:  = true) => Promise<User | undefined>;
  async findAdministratorUser(ctx: RequestContext, strategy: string, externalIdentifier: string) => Promise<User | undefined>;
  async createCustomerAndUser(ctx: RequestContext, config: {
            strategy: string;
            externalIdentifier: string;
            verified: boolean;
            emailAddress: string;
            firstName?: string;
            lastName?: string;
        }) => Promise<User>;
  async createAdministratorAndUser(ctx: RequestContext, config: {
            strategy: string;
            externalIdentifier: string;
            identifier: string;
            emailAddress?: string;
            firstName?: string;
            lastName?: string;
            roles: Role[];
        }) => ;
  async findUser(ctx: RequestContext, strategy: string, externalIdentifier: string) => Promise<User | undefined>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, roleService: <a href='/typescript-api/services/role-service#roleservice'>RoleService</a>, historyService: <a href='/typescript-api/services/history-service#historyservice'>HistoryService</a>, customerService: <a href='/typescript-api/services/customer-service#customerservice'>CustomerService</a>, administratorService: <a href='/typescript-api/services/administrator-service#administratorservice'>AdministratorService</a>, channelService: <a href='/typescript-api/services/channel-service#channelservice'>ChannelService</a>) => ExternalAuthenticationService"  >}}

{{< member-description >}}{{< /member-description >}}

### findCustomerUser

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, strategy: string, externalIdentifier: string, checkCurrentChannelOnly:  = true) => Promise&#60;<a href='/typescript-api/entities/user#user'>User</a> | undefined&#62;"  >}}

{{< member-description >}}Looks up a User based on their identifier from an external authentication
provider, ensuring this User is associated with a Customer account.

By default, only customers in the currently-active Channel will be checked.
By passing `false` as the `checkCurrentChannelOnly` argument, _all_ channels
will be checked.{{< /member-description >}}

### findAdministratorUser

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, strategy: string, externalIdentifier: string) => Promise&#60;<a href='/typescript-api/entities/user#user'>User</a> | undefined&#62;"  >}}

{{< member-description >}}Looks up a User based on their identifier from an external authentication
provider, ensuring this User is associated with an Administrator account.{{< /member-description >}}

### createCustomerAndUser

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, config: {             strategy: string;             externalIdentifier: string;             verified: boolean;             emailAddress: string;             firstName?: string;             lastName?: string;         }) => Promise&#60;<a href='/typescript-api/entities/user#user'>User</a>&#62;"  >}}

{{< member-description >}}If a customer has been successfully authenticated by an external authentication provider, yet cannot
be found using `findCustomerUser`, then we need to create a new User and
Customer record in Vendure for that user. This method encapsulates that logic as well as additional
housekeeping such as adding a record to the Customer's history.{{< /member-description >}}

### createAdministratorAndUser

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, config: {             strategy: string;             externalIdentifier: string;             identifier: string;             emailAddress?: string;             firstName?: string;             lastName?: string;             roles: <a href='/typescript-api/entities/role#role'>Role</a>[];         }) => "  >}}

{{< member-description >}}If an administrator has been successfully authenticated by an external authentication provider, yet cannot
be found using `findAdministratorUser`, then we need to create a new User and
Administrator record in Vendure for that user.{{< /member-description >}}

### findUser

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, strategy: string, externalIdentifier: string) => Promise&#60;<a href='/typescript-api/entities/user#user'>User</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
