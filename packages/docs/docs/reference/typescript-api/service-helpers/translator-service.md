---
title: "TranslatorService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TranslatorService

<GenerationInfo sourceFile="packages/core/src/service/helpers/translator/translator.service.ts" sourceLine="42" packageName="@vendure/core" />

The TranslatorService is used to translate entities into the current language.

*Example*

```ts
import { Injectable } from '@nestjs/common';
import { ID, Product, RequestContext, TransactionalConnection, TranslatorService } from '@vendure/core';

@Injectable()
export class ProductService {

    constructor(private connection: TransactionalConnection,
                private translator: TranslatorService){}

    async findOne(ctx: RequestContext, productId: ID): Promise<Product | undefined> {
        const product = await this.connection.findOneInChannel(ctx, Product, productId, ctx.channelId, {
            relations: {
                 facetValues: {
                     facet: true,
                 }
            }
        });
        if (!product) {
            return;
        }
        return this.translator.translate(product, ctx, ['facetValues', ['facetValues', 'facet']]);
    }
}
```

```ts title="Signature"
class TranslatorService {
    constructor(configService: ConfigService)
    translate(translatable: T, ctx: RequestContext, translatableRelations: DeepTranslatableRelations<T> = []) => ;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(configService: ConfigService) => TranslatorService`}   />


### translate

<MemberInfo kind="method" type={`(translatable: T, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, translatableRelations: DeepTranslatableRelations&#60;T&#62; = []) => `}   />




</div>
