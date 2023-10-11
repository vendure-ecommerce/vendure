---
title: "TranslatableSaver"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TranslatableSaver

<GenerationInfo sourceFile="packages/core/src/service/helpers/translatable-saver/translatable-saver.ts" sourceLine="57" packageName="@vendure/core" />

A helper which contains methods for creating and updating entities which implement the <a href='/reference/typescript-api/entities/interfaces#translatable'>Translatable</a> interface.

*Example*

```ts
export class MyService {
  constructor(private translatableSaver: TranslatableSaver) {}

  async create(ctx: RequestContext, input: CreateFacetInput): Promise<Translated<Facet>> {
    const facet = await this.translatableSaver.create({
      ctx,
      input,
      entityType: Facet,
      translationType: FacetTranslation,
      beforeSave: async f => {
          f.code = await this.ensureUniqueCode(ctx, f.code);
      },
    });
    return facet;
  }

  // ...
}
```

```ts title="Signature"
class TranslatableSaver {
    constructor(connection: TransactionalConnection)
    create(options: CreateTranslatableOptions<T>) => Promise<T>;
    update(options: UpdateTranslatableOptions<T>) => Promise<T>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>) => TranslatableSaver`}   />


### create

<MemberInfo kind="method" type={`(options: CreateTranslatableOptions&#60;T&#62;) => Promise&#60;T&#62;`}   />

Create a translatable entity, including creating any translation entities according
to the `translations` array.
### update

<MemberInfo kind="method" type={`(options: UpdateTranslatableOptions&#60;T&#62;) => Promise&#60;T&#62;`}   />

Update a translatable entity. Performs a diff of the `translations` array in order to
perform the correct operation on the translations.


</div>
