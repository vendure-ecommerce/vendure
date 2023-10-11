---
title: "Translations"
showtoc: true
---

The following items in Vendure can be translated:

- Entities which implement the [`Translatable`](/reference/typescript-api/entities/interfaces/#translatable) interface.
- Admin UI text labels and messages
- Server error message

## Translatable entities

The following entities implement the `Translatable` interface:

- [Collection](/reference/typescript-api/entities/collection/)
- [Country](/reference/typescript-api/entities/country/)
- [Facet](/reference/typescript-api/entities/facet/)
- [FacetValue](/reference/typescript-api/entities/facet-value/)
- [PaymentMethod](/reference/typescript-api/entities/payment-method/)
- [Product](/reference/typescript-api/entities/product/)
- [ProductOption](/reference/typescript-api/entities/product-option/)
- [ProductOptionGroup](/reference/typescript-api/entities/product-option-group/)
- [ProductVariant](/reference/typescript-api/entities/product-variant/)
- [Promotion](/reference/typescript-api/entities/promotion/)
- [Province](/reference/typescript-api/entities/province/)
- [Region](/reference/typescript-api/entities/region/)
- [ShippingMethod](/reference/typescript-api/entities/shipping-method/)

To understand how translatable entities are implemented, let's take a look at a simplified version of the `Facet` entity:

```ts
@Entity()
export class Facet extends VendureEntity implements Translatable {
    
    // highlight-next-line
    name: LocaleString;

    @Column({ unique: true })
    code: string;

    // highlight-next-line
    @OneToMany(type => FacetTranslation, translation => translation.base, { eager: true })
    // highlight-next-line
    translations: Array<Translation<Facet>>;
}
```

All translatable entities have a `translations` field which is a relation to the translations. Any fields that are to be translated are of type `LocaleString`, and **do note have a `@Column()` decorator**. This is because the `name` field here does not in fact exist in the database in the `facet` table. Instead, it belongs to the `facet_translations` table, which brings us to the `FacetTranslation` entity (again simplified for clarity):

```ts
@Entity()
export class FacetTranslation extends VendureEntity implements Translation<Facet> {

    @Column('varchar') languageCode: LanguageCode;

    // highlight-next-line
    @Column() name: string;

    @Index()
    @ManyToOne(type => Facet, base => base.translations, { onDelete: 'CASCADE' })
    base: Facet;
}
```

Thus there is a one-to-many relation between `Facet` and `FacetTranslation`, which allows Vendure to handle multiple translations of the same entity. The `FacetTranslation` entity also implements the `Translation` interface, which requires the `languageCode` field and a reference to the base entity.

### Loading translatable entities

If your plugin needs to load a translatable entity, you will need to use the [`TranslatorService`](/reference/typescript-api/service-helpers/translator-service/) to hydrate all the `LocaleString` fields will the actual translated values from the correct translation.

For example, if you are loading a `Facet` entity, you would do the following:

```ts
import { Facet } from '@vendure/core';
import { LanguageCode, RequestContext, TranslatorService, TransactionalConnection } from '@vendure/core';

@Injectable()
export class MyService {
    
    constructor(private connection: TransactionalConnection, private translator: TranslatorService) {}

    async getFacet(ctx: RequestContext, id: ID): Promise<Facet | undefined> {
        const facet = await this.connection.getRepository(ctx, Facet).findOne(id);
        if (facet) {
            // highlight-next-line
            return this.translatorService.translate(facet, ctx);
        }
    }
    
    async getFacets(ctx: RequestContext): Promise<Facet[]> {
        // highlight-next-line
        const facets = await this.connection.getRepository(ctx, Facet).find();
        // highlight-next-line
        return Promise.all(facets.map(facet => this.translatorService.translate(facet, ctx)));
    }
}
```
## Admin UI translations

See the [Adding Admin UI Translations guide](/guides/extending-the-admin-ui/adding-ui-translations/).

## Server message translations

Let's say you've implemented some custom server-side functionality as part of a plugin. You may be returning custom errors or other messages. Here's how you can
provide these messages in multiple languages.

Using [`addTranslation`](/reference/typescript-api/common/i18n-service/#addtranslation) inside the `onApplicationBootstrap` ([Nestjs lifecycle hooks](https://docs.nestjs.com/fundamentals/lifecycle-events)) of a Plugin is the easiest way to add new translations.
While Vendure is only using `error`, `errorResult` and `message` resource keys you are free to use your own.

### Translatable Error
This example shows how to create a custom translatable error
```ts
/**
 * Custom error class
 */
class CustomError extends ErrorResult {
    readonly __typename = 'CustomError';
    readonly errorCode = 'CUSTOM_ERROR';
    readonly message = 'CUSTOM_ERROR'; //< looks up errorResult.CUSTOM_ERROR
}

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [I18nService],
    // ...
})
export class TranslationTestPlugin implements OnApplicationBootstrap {

    constructor(private i18nService: I18nService) {

    }

    onApplicationBootstrap(): any {
        this.i18nService.addTranslation('en', {
            errorResult: {
                CUSTOM_ERROR: 'A custom error message',
            },
            anything: {
                foo: 'bar'
            }
        });

        this.i18nService.addTranslation('de', {
            errorResult: {
                CUSTOM_ERROR: 'Eine eigene Fehlermeldung',
            },
            anything: {
                foo: 'bar'
            }
        });

    }
}
```

To receive an error in a specific language you need to use the `languageCode` query parameter
`query(QUERY_WITH_ERROR_RESULT, { variables }, { languageCode: LanguageCode.de });`

### Use translations

Vendure uses the internationalization-framework [i18next](https://www.i18next.com/).

Therefore you are free to use the i18next translate function to [access keys](https://www.i18next.com/translation-function/essentials#accessing-keys) \
`i18next.t('error.any-message');`
