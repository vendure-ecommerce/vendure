---
title: "AdminUiConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AdminUiConfig

<GenerationInfo sourceFile="packages/common/src/shared-types.ts" sourceLine="214" packageName="@vendure/common" />

This interface describes JSON config file (vendure-ui-config.json) used by the Admin UI.
The values are loaded at run-time by the Admin UI app, and allow core configuration to be
managed without the need to re-build the application.

```ts title="Signature"
interface AdminUiConfig {
    apiHost: string | 'auto';
    apiPort: number | 'auto';
    adminApiPath: string;
    tokenMethod: 'cookie' | 'bearer';
    authTokenHeaderKey: string;
    channelTokenKey: string;
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

<div className="members-wrapper">

### apiHost

<MemberInfo kind="property" type={`string | 'auto'`} default="'http://localhost'"   />

The hostname of the Vendure server which the admin UI will be making API calls
to. If set to "auto", the Admin UI app will determine the hostname from the
current location (i.e. `window.location.hostname`).
### apiPort

<MemberInfo kind="property" type={`number | 'auto'`} default="3000"   />

The port of the Vendure server which the admin UI will be making API calls
to. If set to "auto", the Admin UI app will determine the port from the
current location (i.e. `window.location.port`).
### adminApiPath

<MemberInfo kind="property" type={`string`} default="'admin-api'"   />

The path to the GraphQL Admin API.
### tokenMethod

<MemberInfo kind="property" type={`'cookie' | 'bearer'`} default="'cookie'"   />

Whether to use cookies or bearer tokens to track sessions.
Should match the setting of in the server's `tokenMethod` config
option.
### authTokenHeaderKey

<MemberInfo kind="property" type={`string`} default="'vendure-auth-token'"   />

The header used when using the 'bearer' auth method. Should match the
setting of the server's `authOptions.authTokenHeaderKey` config option.
### channelTokenKey

<MemberInfo kind="property" type={`string`} default="'vendure-token'"   />

The name of the header which contains the channel token. Should match the
setting of the server's `apiOptions.channelTokenKey` config option.
### defaultLanguage

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>`} default="<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>.en"   />

The default language for the Admin UI. Must be one of the
items specified in the `availableLanguages` property.
### defaultLocale

<MemberInfo kind="property" type={`string`}   />

The default locale for the Admin UI. The locale affects the formatting of
currencies & dates.

If not set, the browser default locale will be used.
### availableLanguages

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>[]`}   />

An array of languages for which translations exist for the Admin UI.
### loginUrl

<MemberInfo kind="property" type={`string`}   />

If you are using an external <a href='/reference/typescript-api/auth/authentication-strategy#authenticationstrategy'>AuthenticationStrategy</a> for the Admin API, you can configure
a custom URL for the login page with this option. On logging out or redirecting an unauthenticated
user, the Admin UI app will redirect the user to this URL rather than the default username/password
screen.
### brand

<MemberInfo kind="property" type={`string`}   />

The custom brand name.
### hideVendureBranding

<MemberInfo kind="property" type={`boolean`} default="false"   />

Option to hide vendure branding.
### hideVersion

<MemberInfo kind="property" type={`boolean`} default="false"   />

Option to hide version.
### loginImageUrl

<MemberInfo kind="property" type={`string`}  since="1.9.0"  />

A url of a custom image to be used on the login screen, to override the images provided by Vendure's login image server.
### cancellationReasons

<MemberInfo kind="property" type={`string[]`} default="['order.cancel-reason-customer-request', 'order.cancel-reason-not-available']"  since="1.5.0"  />

Allows you to provide default reasons for a refund or cancellation. This will be used in the
refund/cancel dialog. The values can be literal strings (e.g. "Not in stock") or translation
tokens (see [Adding Admin UI Translations](/guides/extending-the-admin-ui/adding-ui-translations/)).


</div>
