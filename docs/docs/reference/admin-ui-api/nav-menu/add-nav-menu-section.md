---
title: "AddNavMenuSection"
weight: 10
date: 2023-07-28T12:05:26.361Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## addNavMenuSection

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder.service.ts" sourceLine="44" packageName="@vendure/admin-ui" />

Add a section to the main nav menu. Providing the `before` argument will
move the section before any existing section with the specified id. If
omitted (or if the id is not found) the section will be appended to the
existing set of sections.
This should be used in the NgModule `providers` array of your ui extension module.

*Example*

```ts
@NgModule({
  imports: [SharedModule],
  providers: [
    addNavMenuSection({
      id: 'reports',
      label: 'Reports',
      items: [{
          // ...
      }],
    },
    'settings'),
  ],
})
export class MyUiExtensionModule {}
```

```ts title="Signature"
function addNavMenuSection(config: NavMenuSection, before?: string): Provider
```
Parameters

### config

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/nav-menu/nav-menu-section#navmenusection'>NavMenuSection</a>`} />

### before

<MemberInfo kind="parameter" type={`string`} />

