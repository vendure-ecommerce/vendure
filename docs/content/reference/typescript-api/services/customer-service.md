---
title: "CustomerService"
weight: 10
date: 2023-07-14T16:57:50.347Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# CustomerService
<div class="symbol">


# CustomerService

{{< generation-info sourceFile="packages/core/src/service/services/customer.service.ts" sourceLine="79" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/customer#customer'>Customer</a> entities.

## Signature

```TypeScript
class CustomerService {
  constructor(connection: TransactionalConnection, configService: ConfigService, userService: UserService, countryService: CountryService, listQueryBuilder: ListQueryBuilder, eventBus: EventBus, historyService: HistoryService, channelService: ChannelService, customFieldRelationService: CustomFieldRelationService, translator: TranslatorService)
  findAll(ctx: RequestContext, options: ListQueryOptions<Customer> | undefined, relations: RelationPaths<Customer> = []) => Promise<PaginatedList<Customer>>;
  findOne(ctx: RequestContext, id: ID, relations: RelationPaths<Customer> = []) => Promise<Customer | undefined>;
  findOneByUserId(ctx: RequestContext, userId: ID, filterOnChannel:  = true) => Promise<Customer | undefined>;
  findAddressesByCustomerId(ctx: RequestContext, customerId: ID) => Promise<Address[]>;
  async getCustomerGroups(ctx: RequestContext, customerId: ID) => Promise<CustomerGroup[]>;
  async create(ctx: RequestContext, input: CreateCustomerInput, password?: string) => Promise<ErrorResultUnion<CreateCustomerResult, Customer>>;
  async update(ctx: RequestContext, input: UpdateCustomerShopInput & { id: ID }) => Promise<Customer>;
  async update(ctx: RequestContext, input: UpdateCustomerInput) => Promise<ErrorResultUnion<UpdateCustomerResult, Customer>>;
  async update(ctx: RequestContext, input: UpdateCustomerInput | (UpdateCustomerShopInput & { id: ID })) => Promise<ErrorResultUnion<UpdateCustomerResult, Customer>>;
  async registerCustomerAccount(ctx: RequestContext, input: RegisterCustomerInput) => Promise<RegisterCustomerAccountResult | EmailAddressConflictError | PasswordValidationError>;
  async refreshVerificationToken(ctx: RequestContext, emailAddress: string) => Promise<void>;
  async verifyCustomerEmailAddress(ctx: RequestContext, verificationToken: string, password?: string) => Promise<ErrorResultUnion<VerifyCustomerAccountResult, Customer>>;
  async requestPasswordReset(ctx: RequestContext, emailAddress: string) => Promise<void>;
  async resetPassword(ctx: RequestContext, passwordResetToken: string, password: string) => Promise<
        User | PasswordResetTokenExpiredError | PasswordResetTokenInvalidError | PasswordValidationError
    >;
  async requestUpdateEmailAddress(ctx: RequestContext, userId: ID, newEmailAddress: string) => Promise<boolean | EmailAddressConflictError>;
  async updateEmailAddress(ctx: RequestContext, token: string) => Promise<boolean | IdentifierChangeTokenInvalidError | IdentifierChangeTokenExpiredError>;
  async createOrUpdate(ctx: RequestContext, input: Partial<CreateCustomerInput> & { emailAddress: string }, errorOnExistingUser: boolean = false) => Promise<Customer | EmailAddressConflictError>;
  async createAddress(ctx: RequestContext, customerId: ID, input: CreateAddressInput) => Promise<Address>;
  async updateAddress(ctx: RequestContext, input: UpdateAddressInput) => Promise<Address>;
  async deleteAddress(ctx: RequestContext, id: ID) => Promise<boolean>;
  async softDelete(ctx: RequestContext, customerId: ID) => Promise<DeletionResponse>;
  async createAddressesForNewCustomer(ctx: RequestContext, order: Order) => ;
  async addNoteToCustomer(ctx: RequestContext, input: AddNoteToCustomerInput) => Promise<Customer>;
  async updateCustomerNote(ctx: RequestContext, input: UpdateCustomerNoteInput) => Promise<HistoryEntry>;
  async deleteCustomerNote(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, userService: <a href='/typescript-api/services/user-service#userservice'>UserService</a>, countryService: <a href='/typescript-api/services/country-service#countryservice'>CountryService</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, historyService: <a href='/typescript-api/services/history-service#historyservice'>HistoryService</a>, channelService: <a href='/typescript-api/services/channel-service#channelservice'>ChannelService</a>, customFieldRelationService: CustomFieldRelationService, translator: TranslatorService) => CustomerService"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options: ListQueryOptions&#60;<a href='/typescript-api/entities/customer#customer'>Customer</a>&#62; | undefined, relations: RelationPaths&#60;<a href='/typescript-api/entities/customer#customer'>Customer</a>&#62; = []) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/customer#customer'>Customer</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>, relations: RelationPaths&#60;<a href='/typescript-api/entities/customer#customer'>Customer</a>&#62; = []) => Promise&#60;<a href='/typescript-api/entities/customer#customer'>Customer</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOneByUserId

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/typescript-api/common/id#id'>ID</a>, filterOnChannel:  = true) => Promise&#60;<a href='/typescript-api/entities/customer#customer'>Customer</a> | undefined&#62;"  >}}

{{< member-description >}}Returns the Customer entity associated with the given userId, if one exists.
Setting `filterOnChannel` to `true` will limit the results to Customers which are assigned
to the current active Channel only.{{< /member-description >}}

### findAddressesByCustomerId

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customerId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/address#address'>Address</a>[]&#62;"  >}}

{{< member-description >}}Returns all <a href='/typescript-api/entities/address#address'>Address</a> entities associated with the specified Customer.{{< /member-description >}}

### getCustomerGroups

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customerId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>[]&#62;"  >}}

{{< member-description >}}Returns a list of all <a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a> entities.{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateCustomerInput, password?: string) => Promise&#60;ErrorResultUnion&#60;CreateCustomerResult, <a href='/typescript-api/entities/customer#customer'>Customer</a>&#62;&#62;"  >}}

{{< member-description >}}Creates a new Customer, including creation of a new User with the special `customer` Role.

If the `password` argument is specified, the Customer will be immediately verified. If not,
then an <a href='/typescript-api/events/event-types#accountregistrationevent'>AccountRegistrationEvent</a> is published, so that the customer can have their
email address verified and set their password in a later step using the `verifyCustomerEmailAddress()`
method.

This method is intended to be used in admin-created Customer flows.{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateCustomerShopInput &#38; { id: <a href='/typescript-api/common/id#id'>ID</a> }) => Promise&#60;<a href='/typescript-api/entities/customer#customer'>Customer</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateCustomerInput) => Promise&#60;ErrorResultUnion&#60;UpdateCustomerResult, <a href='/typescript-api/entities/customer#customer'>Customer</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateCustomerInput | (UpdateCustomerShopInput &#38; { id: <a href='/typescript-api/common/id#id'>ID</a> })) => Promise&#60;ErrorResultUnion&#60;UpdateCustomerResult, <a href='/typescript-api/entities/customer#customer'>Customer</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### registerCustomerAccount

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RegisterCustomerInput) => Promise&#60;RegisterCustomerAccountResult | EmailAddressConflictError | PasswordValidationError&#62;"  >}}

{{< member-description >}}Registers a new Customer account with the <a href='/typescript-api/auth/native-authentication-strategy#nativeauthenticationstrategy'>NativeAuthenticationStrategy</a> and starts
the email verification flow (unless <a href='/typescript-api/auth/auth-options#authoptions'>AuthOptions</a> `requireVerification` is set to `false`)
by publishing an <a href='/typescript-api/events/event-types#accountregistrationevent'>AccountRegistrationEvent</a>.

This method is intended to be used in storefront Customer-creation flows.{{< /member-description >}}

### refreshVerificationToken

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, emailAddress: string) => Promise&#60;void&#62;"  >}}

{{< member-description >}}Refreshes a stale email address verification token by generating a new one and
publishing a <a href='/typescript-api/events/event-types#accountregistrationevent'>AccountRegistrationEvent</a>.{{< /member-description >}}

### verifyCustomerEmailAddress

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, verificationToken: string, password?: string) => Promise&#60;ErrorResultUnion&#60;VerifyCustomerAccountResult, <a href='/typescript-api/entities/customer#customer'>Customer</a>&#62;&#62;"  >}}

{{< member-description >}}Given a valid verification token which has been published in an <a href='/typescript-api/events/event-types#accountregistrationevent'>AccountRegistrationEvent</a>, this
method is used to set the Customer as `verified` as part of the account registration flow.{{< /member-description >}}

### requestPasswordReset

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, emailAddress: string) => Promise&#60;void&#62;"  >}}

{{< member-description >}}Publishes a new <a href='/typescript-api/events/event-types#passwordresetevent'>PasswordResetEvent</a> for the given email address. This event creates
a token which can be used in the `resetPassword()` method.{{< /member-description >}}

### resetPassword

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, passwordResetToken: string, password: string) => Promise&#60;         <a href='/typescript-api/entities/user#user'>User</a> | PasswordResetTokenExpiredError | PasswordResetTokenInvalidError | PasswordValidationError     &#62;"  >}}

{{< member-description >}}Given a valid password reset token created by a call to the `requestPasswordReset()` method,
this method will change the Customer's password to that given as the `password` argument.{{< /member-description >}}

### requestUpdateEmailAddress

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/typescript-api/common/id#id'>ID</a>, newEmailAddress: string) => Promise&#60;boolean | EmailAddressConflictError&#62;"  >}}

{{< member-description >}}Publishes a <a href='/typescript-api/events/event-types#identifierchangerequestevent'>IdentifierChangeRequestEvent</a> for the given User. This event contains a token
which is then used in the `updateEmailAddress()` method to change the email address of the User &
Customer.{{< /member-description >}}

### updateEmailAddress

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, token: string) => Promise&#60;boolean | IdentifierChangeTokenInvalidError | IdentifierChangeTokenExpiredError&#62;"  >}}

{{< member-description >}}Given a valid email update token published in a <a href='/typescript-api/events/event-types#identifierchangerequestevent'>IdentifierChangeRequestEvent</a>, this method
will update the Customer & User email address.{{< /member-description >}}

### createOrUpdate

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: Partial&#60;CreateCustomerInput&#62; &#38; { emailAddress: string }, errorOnExistingUser: boolean = false) => Promise&#60;<a href='/typescript-api/entities/customer#customer'>Customer</a> | EmailAddressConflictError&#62;"  >}}

{{< member-description >}}For guest checkouts, we assume that a matching email address is the same customer.{{< /member-description >}}

### createAddress

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customerId: <a href='/typescript-api/common/id#id'>ID</a>, input: CreateAddressInput) => Promise&#60;<a href='/typescript-api/entities/address#address'>Address</a>&#62;"  >}}

{{< member-description >}}Creates a new <a href='/typescript-api/entities/address#address'>Address</a> for the given Customer.{{< /member-description >}}

### updateAddress

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateAddressInput) => Promise&#60;<a href='/typescript-api/entities/address#address'>Address</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### deleteAddress

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;boolean&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### softDelete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customerId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### createAddressesForNewCustomer

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => "  >}}

{{< member-description >}}If the Customer associated with the given Order does not yet have any Addresses,
this method will create new Address(es) based on the Order's shipping & billing
addresses.{{< /member-description >}}

### addNoteToCustomer

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AddNoteToCustomerInput) => Promise&#60;<a href='/typescript-api/entities/customer#customer'>Customer</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### updateCustomerNote

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateCustomerNoteInput) => Promise&#60;<a href='/typescript-api/entities/history-entry#historyentry'>HistoryEntry</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### deleteCustomerNote

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
