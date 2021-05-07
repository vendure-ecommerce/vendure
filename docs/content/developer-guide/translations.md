---
title: "Translation"
showtoc: true
---

# Translation

Using [`addTranslation`]({{< relref "i18n-service" >}}#addtranslation) inside the `onApplicationBootstrap` ([Nestjs lifecycle hooks](https://docs.nestjs.com/fundamentals/lifecycle-events)) of a Plugin is the easiest way to add new translations.
While vendure is only using `error`, `errorResult` and `message` resource keys you are free to use your own.

## Translatable Error
This example shows how to create a custom translatable error
```typescript
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

## Use translations

Vendures uses the internationalization-framework [i18next](https://www.i18next.com/).

Therefore you are free to use the i18next translate function to [access keys](https://www.i18next.com/translation-function/essentials#accessing-keys) \
`i18next.t('error.any-message');`
