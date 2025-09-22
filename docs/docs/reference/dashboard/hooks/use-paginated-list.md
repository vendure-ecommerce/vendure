---
title: "UsePaginatedList"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## usePaginatedList

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/paginated-list-data-table.tsx" sourceLine="162" packageName="@vendure/dashboard" since="3.4.0" />

Returns the context for the paginated list data table. Must be used within a PaginatedListDataTable.

*Example*

```ts
const { refetchPaginatedList } = usePaginatedList();

const mutation = useMutation({
    mutationFn: api.mutate(updateFacetValueDocument),
    onSuccess: () => {
        refetchPaginatedList();
    },
});
```

```ts title="Signature"
function usePaginatedList(): void
```
