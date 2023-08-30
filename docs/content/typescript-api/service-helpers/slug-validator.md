---
title: "SlugValidator"
weight: 10
date: 2023-07-14T16:57:50.265Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# SlugValidator
<div class="symbol">


# SlugValidator

{{< generation-info sourceFile="packages/core/src/service/helpers/slug-validator/slug-validator.ts" sourceLine="44" packageName="@vendure/core">}}

Used to validate slugs to ensure they are URL-safe and unique. Designed to be used with translatable
entities such as <a href='/typescript-api/entities/product#product'>Product</a> and <a href='/typescript-api/entities/collection#collection'>Collection</a>.

## Signature

```TypeScript
class SlugValidator {
  constructor(connection: TransactionalConnection)
  async validateSlugs(ctx: RequestContext, input: T, translationEntity: Type<E>) => Promise<T>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>) => SlugValidator"  >}}

{{< member-description >}}{{< /member-description >}}

### validateSlugs

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: T, translationEntity: Type&#60;E&#62;) => Promise&#60;T&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# InputWithSlug

{{< generation-info sourceFile="packages/core/src/service/helpers/slug-validator/slug-validator.ts" sourceLine="16" packageName="@vendure/core">}}



## Signature

```TypeScript
type InputWithSlug = {
  id?: ID | null;
  translations?: Array<{
        id?: ID | null;
        languageCode: LanguageCode;
        slug?: string | null;
    }> | null;
}
```
## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a> | null"  >}}

{{< member-description >}}{{< /member-description >}}

### translations

{{< member-info kind="property" type="Array&#60;{         id?: <a href='/typescript-api/common/id#id'>ID</a> | null;         languageCode: <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>;         slug?: string | null;     }&#62; | null"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# TranslationEntity

{{< generation-info sourceFile="packages/core/src/service/helpers/slug-validator/slug-validator.ts" sourceLine="29" packageName="@vendure/core">}}



## Signature

```TypeScript
type TranslationEntity = VendureEntity & {
    id: ID;
    languageCode: LanguageCode;
    slug: string;
    base: any;
}
```
</div>
