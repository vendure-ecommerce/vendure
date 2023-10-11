---
title: "UsePageMetadata"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## usePageMetadata

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/react-hooks/use-page-metadata.ts" sourceLine="31" packageName="@vendure/admin-ui" />

Provides functions for setting the current page title and breadcrumb.

*Example*

```ts
import { usePageMetadata } from '@vendure/admin-ui/react';
import { useEffect } from 'react';

export const MyComponent = () => {
    const { setTitle, setBreadcrumb } = usePageMetadata();
    useEffect(() => {
        setTitle('My Page');
        setBreadcrumb([
            { link: ['./parent'], label: 'Parent Page' },
            { link: ['./'], label: 'This Page' },
        ]);
    }, []);
    // ...
    return <div>...</div>;
}
```

```ts title="Signature"
function usePageMetadata(): void
```
