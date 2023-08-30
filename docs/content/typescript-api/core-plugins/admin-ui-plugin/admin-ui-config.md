---
title: "AdminUiConfig"
weight: 10
date: 2023-07-14T16:57:50.664Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AdminUiConfig
<div class="symbol">


# AdminUiConfig

{{< generation-info sourceFile="packages/common/src/shared-types.ts" sourceLine="214" packageName="@vendure/common">}}

This interface describes JSON config file (vendure-ui-config.json) used by the Admin UI.
The values are loaded at run-time by the Admin UI app, and allow core configuration to be
managed without the need to re-build the application.

## Signature

```TypeScript
interface AdminUiConfig {
  apiHost: string | 'auto';
  apiPort: number | 'auto';
  adminApiPath: string;
  tokenMethod: 'cookie' | 'bearer';
  authTokenHeaderKey: string;
  defaultLanguage: LanguageCode;
  defaultLocale?: string;
  availableLanguages: LanguageCode[];
  loginUrl?: string;
  brand?: string;
  hideVendureBranding?: boolean;
  hideVersion?: boolean;
  loginImageUrl?: string;
  cancellationReasons?: string[];
}
```
## Members

### apiHost

{{< member-info kind="property" type="string | 'auto'" default="'http://localhost'"  >}}

{{< member-description >}}The hostname of the Vendure server which the admin UI will be making API calls
to. If set to "auto", the Admin UI app will determine the hostname from the
current location (i.e. `window.location.hostname`).{{< /member-description >}}

### apiPort

{{< member-info kind="property" type="number | 'auto'" default="3000"  >}}

{{< member-description >}}The port of the Vendure server which the admin UI will be making API calls
to. If set to "auto", the Admin UI app will determine the port from the
current location (i.e. `window.location.port`).{{< /member-description >}}

### adminApiPath

{{< member-info kind="property" type="string" default="'admin-api'"  >}}

{{< member-description >}}The path to the GraphQL Admin API.{{< /member-description >}}

### tokenMethod

{{< member-info kind="property" type="'cookie' | 'bearer'" default="'cookie'"  >}}

{{< member-description >}}Whether to use cookies or bearer tokens to track sessions.
Should match the setting of in the server's `tokenMethod` config
option.{{< /member-description >}}

### authTokenHeaderKey

{{< member-info kind="property" type="string" default="'vendure-auth-token'"  >}}

{{< member-description >}}The header used when using the 'bearer' auth method. Should match the
setting of the server's `authOptions.authTokenHeaderKey` config
option.{{< /member-description >}}

### channelTokenKey

{{< member-info kind="property" type="string" default="'vendure-token'"  >}}

{{< member-description >}}The name of the header which contains the channel token. Should match the
setting of the server's `apiOptions.channelTokenKey` config option.{{< /member-description >}}

### defaultLanguage

{{< member-info kind="property" type="<a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>" default="<a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>.en"  >}}

{{< member-description >}}The default language for the Admin UI. Must be one of the
items specified in the `availableLanguages` property.{{< /member-description >}}

### defaultLocale

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The default locale for the Admin UI. The locale affects the formatting of
currencies & dates.

If not set, the browser default locale will be used.{{< /member-description >}}

### availableLanguages

{{< member-info kind="property" type="<a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>[]"  >}}

{{< member-description >}}An array of languages for which translations exist for the Admin UI.{{< /member-description >}}

### loginUrl

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}If you are using an external <a href='/typescript-api/auth/authentication-strategy#authenticationstrategy'>AuthenticationStrategy</a> for the Admin API, you can configure
a custom URL for the login page with this option. On logging out or redirecting an unauthenticated
user, the Admin UI app will redirect the user to this URL rather than the default username/password
screen.{{< /member-description >}}

### brand

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The custom brand name.{{< /member-description >}}

### hideVendureBranding

{{< member-info kind="property" type="boolean" default="false"  >}}

{{< member-description >}}Option to hide vendure branding.{{< /member-description >}}

### hideVersion

{{< member-info kind="property" type="boolean" default="false"  >}}

{{< member-description >}}Option to hide version.{{< /member-description >}}

### loginImageUrl

{{< member-info kind="property" type="string"  since="1.9.0" >}}

{{< member-description >}}A url of a custom image to be used on the login screen, to override the images provided by Vendure's login image server.{{< /member-description >}}

### cancellationReasons

{{< member-info kind="property" type="string[]" default="['order.cancel-reason-customer-request', 'order.cancel-reason-not-available']"  since="1.5.0" >}}

{{< member-description >}}Allows you to provide default reasons for a refund or cancellation. This will be used in the
refund/cancel dialog. The values can be literal strings (e.g. "Not in stock") or translation
tokens (see [Adding Admin UI Translations](/docs/plugins/extending-the-admin-ui/adding-ui-translations/)).{{< /member-description >}}


</div>
