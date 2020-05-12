# Vendure Admin UI

This is the administration interface for Vendure.

It is an Angular application built with the Angular CLI.

The UI is powered by the [Clarity Design System](https://vmware.github.io/clarity/).

## Structure

### Library

The Admin UI is structured as an Angular library conforming to the [ng-packagr format](https://github.com/ng-packagr/ng-packagr). This library is what is published to npm as `@vendure/admin-ui`. The libary consists
of a set of modules which are accessible from consuming applications as sub-packages:

* `@vendure/admin-ui/core`
* `@vendure/admin-ui/catalog`
* `@vendure/admin-ui/orders`

etc. These library packages are located at [./src/lib](./src/lib)

When built with `yarn build`, the output will be located in the `./package` sub directory. This is also the root of the published npm package.

### Application

In addition to the library, there is also a full application located at [./src/app](./src/app). This application is used both during development of the Admin UI, and also as the "default" Admin UI without any UI extensions, as provided as the default by the [admin-ui-plugin](../admin-ui-plugin).

## Localization

Localization of UI strings is handled by [ngx-translate](http://www.ngx-translate.com/). The translation strings should use the [ICU MessageFormat](http://userguide.icu-project.org/formatparse/messages).

Translation keys are automatically extracted by running:
```
yarn extract-translations
```
This will add any new translation keys to the default language file located in [`./src/lib/static/i18n-messages/en.json`](./src/lib/static/i18n-messages/en.json).

To extract translations into other language, run the same command as specified in the `extract-translations` npm script, but substitute the "en" in "en.json" with the [ISO 639-1 2-character language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) for that language.
