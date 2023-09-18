---
title: "ProductOptionService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductOptionService

<GenerationInfo sourceFile="packages/core/src/service/services/product-option.service.ts" sourceLine="32" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/product-option#productoption'>ProductOption</a> entities.

```ts title="Signature"
class ProductOptionService {
    constructor(connection: TransactionalConnection, translatableSaver: TranslatableSaver, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus, translator: TranslatorService)
    findAll(ctx: RequestContext) => Promise<Array<Translated<ProductOption>>>;
    findOne(ctx: RequestContext, id: ID) => Promise<Translated<ProductOption> | undefined>;
    create(ctx: RequestContext, group: ProductOptionGroup | ID, input: CreateGroupOptionInput | CreateProductOptionInput) => Promise<Translated<ProductOption>>;
    update(ctx: RequestContext, input: UpdateProductOptionInput) => Promise<Translated<ProductOption>>;
    delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, translatableSaver: <a href='/reference/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, customFieldRelationService: CustomFieldRelationService, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, translator: <a href='/reference/typescript-api/service-helpers/translator-service#translatorservice'>TranslatorService</a>) => ProductOptionService`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-option#productoption'>ProductOption</a>&#62;&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-option#productoption'>ProductOption</a>&#62; | undefined&#62;`}   />


### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, group: <a href='/reference/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a> | <a href='/reference/typescript-api/common/id#id'>ID</a>, input: CreateGroupOptionInput | CreateProductOptionInput) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-option#productoption'>ProductOption</a>&#62;&#62;`}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateProductOptionInput) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-option#productoption'>ProductOption</a>&#62;&#62;`}   />


### delete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;`}   />

Deletes a ProductOption.

- If the ProductOption is used by any ProductVariants, the deletion will fail.
- If the ProductOption is used only by soft-deleted ProductVariants, the option will itself
  be soft-deleted.
- If the ProductOption is not used by any ProductVariant at all, it will be hard-deleted.


</div>
