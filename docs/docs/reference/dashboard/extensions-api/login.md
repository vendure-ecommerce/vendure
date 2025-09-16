---
title: "Login"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardLoginExtensions

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/login.ts" sourceLine="76" packageName="@vendure/dashboard" since="3.4.0" />

Defines all available login page extensions.

```ts title="Signature"
interface DashboardLoginExtensions {
    logo?: LoginLogoExtension;
    beforeForm?: LoginBeforeFormExtension;
    afterForm?: LoginAfterFormExtension;
    loginImage?: LoginImageExtension;
}
```

<div className="members-wrapper">

### logo

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/login#loginlogoextension'>LoginLogoExtension</a>`}   />

Custom logo component to replace the default Vendure logo.
### beforeForm

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/login#loginbeforeformextension'>LoginBeforeFormExtension</a>`}   />

Component to render before the login form.
### afterForm

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/login#loginafterformextension'>LoginAfterFormExtension</a>`}   />

Component to render after the login form.
### loginImage

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/login#loginimageextension'>LoginImageExtension</a>`}   />

Custom login image component to replace the default image panel.


</div>


## LoginLogoExtension

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/login.ts" sourceLine="11" packageName="@vendure/dashboard" since="3.4.0" />

Defines a custom logo component for the login page.

```ts title="Signature"
interface LoginLogoExtension {
    component: React.ComponentType;
}
```

<div className="members-wrapper">

### component

<MemberInfo kind="property" type={`React.ComponentType`}   />

A React component that will replace the default Vendure logo.


</div>


## LoginBeforeFormExtension

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/login.ts" sourceLine="27" packageName="@vendure/dashboard" since="3.4.0" />

Defines content to display before the login form.

```ts title="Signature"
interface LoginBeforeFormExtension {
    component: React.ComponentType;
}
```

<div className="members-wrapper">

### component

<MemberInfo kind="property" type={`React.ComponentType`}   />

A React component that will be rendered before the login form.


</div>


## LoginAfterFormExtension

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/login.ts" sourceLine="43" packageName="@vendure/dashboard" since="3.4.0" />

Defines content to display after the login form.

```ts title="Signature"
interface LoginAfterFormExtension {
    component: React.ComponentType;
}
```

<div className="members-wrapper">

### component

<MemberInfo kind="property" type={`React.ComponentType`}   />

A React component that will be rendered after the login form.


</div>


## LoginImageExtension

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/login.ts" sourceLine="59" packageName="@vendure/dashboard" since="3.4.0" />

Defines a custom login image component that replaces the default image panel.

```ts title="Signature"
interface LoginImageExtension {
    component: React.ComponentType;
}
```

<div className="members-wrapper">

### component

<MemberInfo kind="property" type={`React.ComponentType`}   />

A React component that will replace the default login image panel.


</div>
