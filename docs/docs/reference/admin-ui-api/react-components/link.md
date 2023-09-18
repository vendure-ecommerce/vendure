---
title: "Link"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Link

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/react-components/Link.tsx" sourceLine="22" packageName="@vendure/admin-ui" />

A React component which renders an anchor tag and navigates to the specified route when clicked.
This is useful when you want to use a React component in a Vendure UI plugin which navigates to
a route in the admin-ui.

*Example*

```ts
import { Link } from '@vendure/admin-ui/react';

export const MyReactComponent = () => {
    return <Link href="/extensions/my-extension">Go to my extension</Link>;
}
```

```ts title="Signature"
function Link(props: PropsWithChildren<{ href: string; [props: string]: any }>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`PropsWithChildren&#60;{ href: string; [props: string]: any }&#62;`} />

