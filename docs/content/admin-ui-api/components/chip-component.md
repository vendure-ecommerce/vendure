---
title: "ChipComponent"
weight: 10
date: 2023-07-14T16:57:51.149Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ChipComponent
<div class="symbol">


# ChipComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/components/chip/chip.component.ts" sourceLine="16" packageName="@vendure/admin-ui">}}

A chip component for displaying a label with an optional action icon.

*Example*

```HTML
<vdr-chip [colorFrom]="item.value"
          icon="close"
          (iconClick)="clear(item)">
{{ item.value }}</vdr-chip>
```

## Signature

```TypeScript
class ChipComponent {
  @Input() @Input() icon: string;
  @Input() @Input() invert = false;
  @Input() @Input() colorFrom = '';
  @Input() @Input() colorType: 'error' | 'success' | 'warning';
  @Output() @Output() iconClick = new EventEmitter<MouseEvent>();
}
```
## Members

### icon

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The icon should be the name of one of the available Clarity icons: https://clarity.design/foundation/icons/shapes/{{< /member-description >}}

### invert

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### colorFrom

{{< member-info kind="property" type=""  >}}

{{< member-description >}}If set, the chip will have an auto-generated background
color based on the string value passed in.{{< /member-description >}}

### colorType

{{< member-info kind="property" type="'error' | 'success' | 'warning'"  >}}

{{< member-description >}}The color of the chip can also be one of the standard status colors.{{< /member-description >}}

### iconClick

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}


</div>
