---
title: "PaymentMethodService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PaymentMethodService

<GenerationInfo sourceFile="packages/core/src/service/services/payment-method.service.ts" sourceLine="46" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a> entities.

```ts title="Signature"
class PaymentMethodService {
    constructor(connection: TransactionalConnection, configService: ConfigService, roleService: RoleService, listQueryBuilder: ListQueryBuilder, eventBus: EventBus, configArgService: ConfigArgService, channelService: ChannelService, customFieldRelationService: CustomFieldRelationService, translatableSaver: TranslatableSaver, translator: TranslatorService)
    findAll(ctx: RequestContext, options?: ListQueryOptions<PaymentMethod>, relations: RelationPaths<PaymentMethod> = []) => Promise<PaginatedList<PaymentMethod>>;
    findOne(ctx: RequestContext, paymentMethodId: ID, relations: RelationPaths<PaymentMethod> = []) => Promise<PaymentMethod | undefined>;
    create(ctx: RequestContext, input: CreatePaymentMethodInput) => Promise<PaymentMethod>;
    update(ctx: RequestContext, input: UpdatePaymentMethodInput) => Promise<PaymentMethod>;
    delete(ctx: RequestContext, paymentMethodId: ID, force: boolean = false) => Promise<DeletionResponse>;
    assignPaymentMethodsToChannel(ctx: RequestContext, input: AssignPaymentMethodsToChannelInput) => Promise<Array<Translated<PaymentMethod>>>;
    removePaymentMethodsFromChannel(ctx: RequestContext, input: RemovePaymentMethodsFromChannelInput) => Promise<Array<Translated<PaymentMethod>>>;
    getPaymentMethodEligibilityCheckers(ctx: RequestContext) => ConfigurableOperationDefinition[];
    getPaymentMethodHandlers(ctx: RequestContext) => ConfigurableOperationDefinition[];
    getEligiblePaymentMethods(ctx: RequestContext, order: Order) => Promise<PaymentMethodQuote[]>;
    getMethodAndOperations(ctx: RequestContext, method: string) => Promise<{
        paymentMethod: PaymentMethod;
        handler: PaymentMethodHandler;
        checker: PaymentMethodEligibilityChecker | null;
    }>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, roleService: <a href='/reference/typescript-api/services/role-service#roleservice'>RoleService</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, configArgService: ConfigArgService, channelService: <a href='/reference/typescript-api/services/channel-service#channelservice'>ChannelService</a>, customFieldRelationService: CustomFieldRelationService, translatableSaver: <a href='/reference/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, translator: <a href='/reference/typescript-api/service-helpers/translator-service#translatorservice'>TranslatorService</a>) => PaymentMethodService`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>&#62;, relations: RelationPaths&#60;<a href='/reference/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>&#62; = []) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, paymentMethodId: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations: RelationPaths&#60;<a href='/reference/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>&#62; = []) => Promise&#60;<a href='/reference/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a> | undefined&#62;`}   />


### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreatePaymentMethodInput) => Promise&#60;<a href='/reference/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>&#62;`}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdatePaymentMethodInput) => Promise&#60;<a href='/reference/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>&#62;`}   />


### delete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, paymentMethodId: <a href='/reference/typescript-api/common/id#id'>ID</a>, force: boolean = false) => Promise&#60;DeletionResponse&#62;`}   />


### assignPaymentMethodsToChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AssignPaymentMethodsToChannelInput) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>&#62;&#62;&#62;`}   />


### removePaymentMethodsFromChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RemovePaymentMethodsFromChannelInput) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>&#62;&#62;&#62;`}   />


### getPaymentMethodEligibilityCheckers

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => ConfigurableOperationDefinition[]`}   />


### getPaymentMethodHandlers

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => ConfigurableOperationDefinition[]`}   />


### getEligiblePaymentMethods

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => Promise&#60;PaymentMethodQuote[]&#62;`}   />


### getMethodAndOperations

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, method: string) => Promise&#60;{         paymentMethod: <a href='/reference/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>;         handler: <a href='/reference/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a>;         checker: <a href='/reference/typescript-api/payment/payment-method-eligibility-checker#paymentmethodeligibilitychecker'>PaymentMethodEligibilityChecker</a> | null;     }&#62;`}   />




</div>
