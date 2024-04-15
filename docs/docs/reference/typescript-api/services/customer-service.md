---
title: "CustomerService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CustomerService

<GenerationInfo sourceFile="packages/core/src/service/services/customer.service.ts" sourceLine="80" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/customer#customer'>Customer</a> entities.

```ts title="Signature"
class CustomerService {
    constructor(connection: TransactionalConnection, configService: ConfigService, userService: UserService, countryService: CountryService, listQueryBuilder: ListQueryBuilder, eventBus: EventBus, historyService: HistoryService, channelService: ChannelService, customFieldRelationService: CustomFieldRelationService, translator: TranslatorService)
    findAll(ctx: RequestContext, options: ListQueryOptions<Customer> | undefined, relations: RelationPaths<Customer> = []) => Promise<PaginatedList<Customer>>;
    findOne(ctx: RequestContext, id: ID, relations: RelationPaths<Customer> = []) => Promise<Customer | undefined>;
    findOneByUserId(ctx: RequestContext, userId: ID, filterOnChannel:  = true) => Promise<Customer | undefined>;
    findAddressesByCustomerId(ctx: RequestContext, customerId: ID) => Promise<Address[]>;
    getCustomerGroups(ctx: RequestContext, customerId: ID) => Promise<CustomerGroup[]>;
    create(ctx: RequestContext, input: CreateCustomerInput, password?: string) => Promise<ErrorResultUnion<CreateCustomerResult, Customer>>;
    update(ctx: RequestContext, input: UpdateCustomerShopInput & { id: ID }) => Promise<Customer>;
    update(ctx: RequestContext, input: UpdateCustomerInput) => Promise<ErrorResultUnion<UpdateCustomerResult, Customer>>;
    update(ctx: RequestContext, input: UpdateCustomerInput | (UpdateCustomerShopInput & { id: ID })) => Promise<ErrorResultUnion<UpdateCustomerResult, Customer>>;
    registerCustomerAccount(ctx: RequestContext, input: RegisterCustomerInput) => Promise<RegisterCustomerAccountResult | EmailAddressConflictError | PasswordValidationError>;
    refreshVerificationToken(ctx: RequestContext, emailAddress: string) => Promise<void>;
    verifyCustomerEmailAddress(ctx: RequestContext, verificationToken: string, password?: string) => Promise<ErrorResultUnion<VerifyCustomerAccountResult, Customer>>;
    requestPasswordReset(ctx: RequestContext, emailAddress: string) => Promise<void>;
    resetPassword(ctx: RequestContext, passwordResetToken: string, password: string) => Promise<
        User | PasswordResetTokenExpiredError | PasswordResetTokenInvalidError | PasswordValidationError
    >;
    requestUpdateEmailAddress(ctx: RequestContext, userId: ID, newEmailAddress: string) => Promise<boolean | EmailAddressConflictError>;
    updateEmailAddress(ctx: RequestContext, token: string) => Promise<boolean | IdentifierChangeTokenInvalidError | IdentifierChangeTokenExpiredError>;
    createOrUpdate(ctx: RequestContext, input: Partial<CreateCustomerInput> & { emailAddress: string }, errorOnExistingUser: boolean = false) => Promise<Customer | EmailAddressConflictError>;
    createAddress(ctx: RequestContext, customerId: ID, input: CreateAddressInput) => Promise<Address>;
    updateAddress(ctx: RequestContext, input: UpdateAddressInput) => Promise<Address>;
    deleteAddress(ctx: RequestContext, id: ID) => Promise<boolean>;
    softDelete(ctx: RequestContext, customerId: ID) => Promise<DeletionResponse>;
    createAddressesForNewCustomer(ctx: RequestContext, order: Order) => ;
    addNoteToCustomer(ctx: RequestContext, input: AddNoteToCustomerInput) => Promise<Customer>;
    updateCustomerNote(ctx: RequestContext, input: UpdateCustomerNoteInput) => Promise<HistoryEntry>;
    deleteCustomerNote(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, userService: <a href='/reference/typescript-api/services/user-service#userservice'>UserService</a>, countryService: <a href='/reference/typescript-api/services/country-service#countryservice'>CountryService</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, historyService: <a href='/reference/typescript-api/services/history-service#historyservice'>HistoryService</a>, channelService: <a href='/reference/typescript-api/services/channel-service#channelservice'>ChannelService</a>, customFieldRelationService: CustomFieldRelationService, translator: <a href='/reference/typescript-api/service-helpers/translator-service#translatorservice'>TranslatorService</a>) => CustomerService`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/customer#customer'>Customer</a>&#62; | undefined, relations: RelationPaths&#60;<a href='/reference/typescript-api/entities/customer#customer'>Customer</a>&#62; = []) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/customer#customer'>Customer</a>&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations: RelationPaths&#60;<a href='/reference/typescript-api/entities/customer#customer'>Customer</a>&#62; = []) => Promise&#60;<a href='/reference/typescript-api/entities/customer#customer'>Customer</a> | undefined&#62;`}   />


### findOneByUserId

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/reference/typescript-api/common/id#id'>ID</a>, filterOnChannel:  = true) => Promise&#60;<a href='/reference/typescript-api/entities/customer#customer'>Customer</a> | undefined&#62;`}   />

Returns the Customer entity associated with the given userId, if one exists.
Setting `filterOnChannel` to `true` will limit the results to Customers which are assigned
to the current active Channel only.
### findAddressesByCustomerId

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customerId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/address#address'>Address</a>[]&#62;`}   />

Returns all <a href='/reference/typescript-api/entities/address#address'>Address</a> entities associated with the specified Customer.
### getCustomerGroups

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customerId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>[]&#62;`}   />

Returns a list of all <a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a> entities.
### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateCustomerInput, password?: string) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;CreateCustomerResult, <a href='/reference/typescript-api/entities/customer#customer'>Customer</a>&#62;&#62;`}   />

Creates a new Customer, including creation of a new User with the special `customer` Role.

If the `password` argument is specified, the Customer will be immediately verified. If not,
then an <a href='/reference/typescript-api/events/event-types#accountregistrationevent'>AccountRegistrationEvent</a> is published, so that the customer can have their
email address verified and set their password in a later step using the `verifyCustomerEmailAddress()`
method.

This method is intended to be used in admin-created Customer flows.
### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateCustomerShopInput &#38; { id: <a href='/reference/typescript-api/common/id#id'>ID</a> }) => Promise&#60;<a href='/reference/typescript-api/entities/customer#customer'>Customer</a>&#62;`}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateCustomerInput) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;UpdateCustomerResult, <a href='/reference/typescript-api/entities/customer#customer'>Customer</a>&#62;&#62;`}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateCustomerInput | (UpdateCustomerShopInput &#38; { id: <a href='/reference/typescript-api/common/id#id'>ID</a> })) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;UpdateCustomerResult, <a href='/reference/typescript-api/entities/customer#customer'>Customer</a>&#62;&#62;`}   />


### registerCustomerAccount

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RegisterCustomerInput) => Promise&#60;RegisterCustomerAccountResult | EmailAddressConflictError | PasswordValidationError&#62;`}   />

Registers a new Customer account with the <a href='/reference/typescript-api/auth/native-authentication-strategy#nativeauthenticationstrategy'>NativeAuthenticationStrategy</a> and starts
the email verification flow (unless <a href='/reference/typescript-api/auth/auth-options#authoptions'>AuthOptions</a> `requireVerification` is set to `false`)
by publishing an <a href='/reference/typescript-api/events/event-types#accountregistrationevent'>AccountRegistrationEvent</a>.

This method is intended to be used in storefront Customer-creation flows.
### refreshVerificationToken

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, emailAddress: string) => Promise&#60;void&#62;`}   />

Refreshes a stale email address verification token by generating a new one and
publishing a <a href='/reference/typescript-api/events/event-types#accountregistrationevent'>AccountRegistrationEvent</a>.
### verifyCustomerEmailAddress

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, verificationToken: string, password?: string) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;VerifyCustomerAccountResult, <a href='/reference/typescript-api/entities/customer#customer'>Customer</a>&#62;&#62;`}   />

Given a valid verification token which has been published in an <a href='/reference/typescript-api/events/event-types#accountregistrationevent'>AccountRegistrationEvent</a>, this
method is used to set the Customer as `verified` as part of the account registration flow.
### requestPasswordReset

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, emailAddress: string) => Promise&#60;void&#62;`}   />

Publishes a new <a href='/reference/typescript-api/events/event-types#passwordresetevent'>PasswordResetEvent</a> for the given email address. This event creates
a token which can be used in the `resetPassword()` method.
### resetPassword

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, passwordResetToken: string, password: string) => Promise&#60;         <a href='/reference/typescript-api/entities/user#user'>User</a> | PasswordResetTokenExpiredError | PasswordResetTokenInvalidError | PasswordValidationError     &#62;`}   />

Given a valid password reset token created by a call to the `requestPasswordReset()` method,
this method will change the Customer's password to that given as the `password` argument.
### requestUpdateEmailAddress

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/reference/typescript-api/common/id#id'>ID</a>, newEmailAddress: string) => Promise&#60;boolean | EmailAddressConflictError&#62;`}   />

Publishes a <a href='/reference/typescript-api/events/event-types#identifierchangerequestevent'>IdentifierChangeRequestEvent</a> for the given User. This event contains a token
which is then used in the `updateEmailAddress()` method to change the email address of the User &
Customer.
### updateEmailAddress

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, token: string) => Promise&#60;boolean | IdentifierChangeTokenInvalidError | IdentifierChangeTokenExpiredError&#62;`}   />

Given a valid email update token published in a <a href='/reference/typescript-api/events/event-types#identifierchangerequestevent'>IdentifierChangeRequestEvent</a>, this method
will update the Customer & User email address.
### createOrUpdate

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: Partial&#60;CreateCustomerInput&#62; &#38; { emailAddress: string }, errorOnExistingUser: boolean = false) => Promise&#60;<a href='/reference/typescript-api/entities/customer#customer'>Customer</a> | EmailAddressConflictError&#62;`}   />

For guest checkouts, we assume that a matching email address is the same customer.
### createAddress

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customerId: <a href='/reference/typescript-api/common/id#id'>ID</a>, input: CreateAddressInput) => Promise&#60;<a href='/reference/typescript-api/entities/address#address'>Address</a>&#62;`}   />

Creates a new <a href='/reference/typescript-api/entities/address#address'>Address</a> for the given Customer.
### updateAddress

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateAddressInput) => Promise&#60;<a href='/reference/typescript-api/entities/address#address'>Address</a>&#62;`}   />


### deleteAddress

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;boolean&#62;`}   />


### softDelete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customerId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;`}   />


### createAddressesForNewCustomer

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => `}   />

If the Customer associated with the given Order does not yet have any Addresses,
this method will create new Address(es) based on the Order's shipping & billing
addresses.
### addNoteToCustomer

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AddNoteToCustomerInput) => Promise&#60;<a href='/reference/typescript-api/entities/customer#customer'>Customer</a>&#62;`}   />


### updateCustomerNote

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateCustomerNoteInput) => Promise&#60;<a href='/reference/typescript-api/entities/history-entry#historyentry'>HistoryEntry</a>&#62;`}   />


### deleteCustomerNote

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;`}   />




</div>
