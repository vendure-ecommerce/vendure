---
title: "TranslatableSaver"
weight: 10
date: 2023-07-14T16:57:50.268Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TranslatableSaver
<div class="symbol">


# TranslatableSaver

{{< generation-info sourceFile="packages/core/src/service/helpers/translatable-saver/translatable-saver.ts" sourceLine="57" packageName="@vendure/core">}}

A helper which contains methods for creating and updating entities which implement the <a href='/typescript-api/entities/interfaces#translatable'>Translatable</a> interface.

*Example*

```TypeScript
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

## Signature

```TypeScript
class TranslatableSaver {
  constructor(connection: TransactionalConnection)
  async create(options: CreateTranslatableOptions<T>) => Promise<T>;
  async update(options: UpdateTranslatableOptions<T>) => Promise<T>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>) => TranslatableSaver"  >}}

{{< member-description >}}{{< /member-description >}}

### create

{{< member-info kind="method" type="(options: CreateTranslatableOptions&#60;T&#62;) => Promise&#60;T&#62;"  >}}

{{< member-description >}}Create a translatable entity, including creating any translation entities according
to the `translations` array.{{< /member-description >}}

### update

{{< member-info kind="method" type="(options: UpdateTranslatableOptions&#60;T&#62;) => Promise&#60;T&#62;"  >}}

{{< member-description >}}Update a translatable entity. Performs a diff of the `translations` array in order to
perform the correct operation on the translations.{{< /member-description >}}


</div>
