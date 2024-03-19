---
title: "ProductOptionGroupService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductOptionGroupService

<GenerationInfo sourceFile="packages/core/src/service/services/product-option-group.service.ts" sourceLine="34" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a> entities.

```ts title="Signature"
class ProductOptionGroupService {
    constructor(connection: TransactionalConnection, translatableSaver: TranslatableSaver, customFieldRelationService: CustomFieldRelationService, productOptionService: ProductOptionService, eventBus: EventBus, translator: TranslatorService)
    findAll(ctx: RequestContext, filterTerm?: string, relations?: RelationPaths<ProductOptionGroup>) => Promise<Array<Translated<ProductOptionGroup>>>;
    findOne(ctx: RequestContext, id: ID, relations?: RelationPaths<ProductOptionGroup>) => Promise<Translated<ProductOptionGroup> | undefined>;
    getOptionGroupsByProductId(ctx: RequestContext, id: ID) => Promise<Array<Translated<ProductOptionGroup>>>;
    create(ctx: RequestContext, input: Omit<CreateProductOptionGroupInput, 'options'>) => Promise<Translated<ProductOptionGroup>>;
    update(ctx: RequestContext, input: UpdateProductOptionGroupInput) => Promise<Translated<ProductOptionGroup>>;
    deleteGroupAndOptionsFromProduct(ctx: RequestContext, id: ID, productId: ID) => ;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, translatableSaver: <a href='/reference/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, customFieldRelationService: CustomFieldRelationService, productOptionService: <a href='/reference/typescript-api/services/product-option-service#productoptionservice'>ProductOptionService</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, translator: <a href='/reference/typescript-api/service-helpers/translator-service#translatorservice'>TranslatorService</a>) => ProductOptionGroupService`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, filterTerm?: string, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62;) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62;&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62;) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62; | undefined&#62;`}   />


### getOptionGroupsByProductId

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62;&#62;&#62;`}   />


### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: Omit&#60;CreateProductOptionGroupInput, 'options'&#62;) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62;&#62;`}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateProductOptionGroupInput) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62;&#62;`}   />


### deleteGroupAndOptionsFromProduct

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>, productId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => `}   />

Deletes the ProductOptionGroup and any associated ProductOptions. If the ProductOptionGroup
is still referenced by a soft-deleted Product, then a soft-delete will be used to preserve
referential integrity. Otherwise a hard-delete will be performed.


</div>
