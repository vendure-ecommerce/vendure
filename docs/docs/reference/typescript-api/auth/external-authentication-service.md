---
title: "ExternalAuthenticationService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ExternalAuthenticationService

<GenerationInfo sourceFile="packages/core/src/service/helpers/external-authentication/external-authentication.service.ts" sourceLine="24" packageName="@vendure/core" />

This is a helper service which exposes methods related to looking up and creating Users based on an
external <a href='/reference/typescript-api/auth/authentication-strategy#authenticationstrategy'>AuthenticationStrategy</a>.

```ts title="Signature"
class ExternalAuthenticationService {
    constructor(connection: TransactionalConnection, roleService: RoleService, historyService: HistoryService, customerService: CustomerService, administratorService: AdministratorService, channelService: ChannelService)
    findCustomerUser(ctx: RequestContext, strategy: string, externalIdentifier: string, checkCurrentChannelOnly:  = true) => Promise<User | undefined>;
    findAdministratorUser(ctx: RequestContext, strategy: string, externalIdentifier: string) => Promise<User | undefined>;
    createCustomerAndUser(ctx: RequestContext, config: {
            strategy: string;
            externalIdentifier: string;
            verified: boolean;
            emailAddress: string;
            firstName?: string;
            lastName?: string;
        }) => Promise<User>;
    createAdministratorAndUser(ctx: RequestContext, config: {
            strategy: string;
            externalIdentifier: string;
            identifier: string;
            emailAddress?: string;
            firstName?: string;
            lastName?: string;
            roles: Role[];
        }) => ;
    findUser(ctx: RequestContext, strategy: string, externalIdentifier: string) => Promise<User | undefined>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, roleService: <a href='/reference/typescript-api/services/role-service#roleservice'>RoleService</a>, historyService: <a href='/reference/typescript-api/services/history-service#historyservice'>HistoryService</a>, customerService: <a href='/reference/typescript-api/services/customer-service#customerservice'>CustomerService</a>, administratorService: <a href='/reference/typescript-api/services/administrator-service#administratorservice'>AdministratorService</a>, channelService: <a href='/reference/typescript-api/services/channel-service#channelservice'>ChannelService</a>) => ExternalAuthenticationService`}   />


### findCustomerUser

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, strategy: string, externalIdentifier: string, checkCurrentChannelOnly:  = true) => Promise&#60;<a href='/reference/typescript-api/entities/user#user'>User</a> | undefined&#62;`}   />

Looks up a User based on their identifier from an external authentication
provider, ensuring this User is associated with a Customer account.

By default, only customers in the currently-active Channel will be checked.
By passing `false` as the `checkCurrentChannelOnly` argument, _all_ channels
will be checked.
### findAdministratorUser

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, strategy: string, externalIdentifier: string) => Promise&#60;<a href='/reference/typescript-api/entities/user#user'>User</a> | undefined&#62;`}   />

Looks up a User based on their identifier from an external authentication
provider, ensuring this User is associated with an Administrator account.
### createCustomerAndUser

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, config: {             strategy: string;             externalIdentifier: string;             verified: boolean;             emailAddress: string;             firstName?: string;             lastName?: string;         }) => Promise&#60;<a href='/reference/typescript-api/entities/user#user'>User</a>&#62;`}   />

If a customer has been successfully authenticated by an external authentication provider, yet cannot
be found using `findCustomerUser`, then we need to create a new User and
Customer record in Vendure for that user. This method encapsulates that logic as well as additional
housekeeping such as adding a record to the Customer's history.
### createAdministratorAndUser

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, config: {             strategy: string;             externalIdentifier: string;             identifier: string;             emailAddress?: string;             firstName?: string;             lastName?: string;             roles: <a href='/reference/typescript-api/entities/role#role'>Role</a>[];         }) => `}   />

If an administrator has been successfully authenticated by an external authentication provider, yet cannot
be found using `findAdministratorUser`, then we need to create a new User and
Administrator record in Vendure for that user.
### findUser

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, strategy: string, externalIdentifier: string) => Promise&#60;<a href='/reference/typescript-api/entities/user#user'>User</a> | undefined&#62;`}   />




</div>
