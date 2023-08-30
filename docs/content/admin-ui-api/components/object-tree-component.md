---
title: "ObjectTreeComponent"
weight: 10
date: 2023-07-14T16:57:51.235Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ObjectTreeComponent
<div class="symbol">


# ObjectTreeComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/components/object-tree/object-tree.component.ts" sourceLine="22" packageName="@vendure/admin-ui">}}

This component displays a plain JavaScript object as an expandable tree.

*Example*

```HTML
<vdr-object-tree [value]="payment.metadata"></vdr-object-tree>
```

## Signature

```TypeScript
class ObjectTreeComponent implements OnChanges {
  @Input() @Input() value: { [key: string]: any } | string;
  @Input() @Input() isArrayItem = false;
  depth: number;
  expanded: boolean;
  valueIsArray: boolean;
  entries: Array<{ key: string; value: any }>;
  constructor(parent: ObjectTreeComponent)
  ngOnChanges() => ;
  isObject(value: any) => boolean;
}
```
## Implements

 * OnChanges


## Members

### value

{{< member-info kind="property" type="{ [key: string]: any } | string"  >}}

{{< member-description >}}{{< /member-description >}}

### isArrayItem

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### depth

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### expanded

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### valueIsArray

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### entries

{{< member-info kind="property" type="Array&#60;{ key: string; value: any }&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(parent: <a href='/admin-ui-api/components/object-tree-component#objecttreecomponent'>ObjectTreeComponent</a>) => ObjectTreeComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnChanges

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### isObject

{{< member-info kind="method" type="(value: any) => boolean"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
