---
title: "ChipComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ChipComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/components/chip/chip.component.ts" sourceLine="16" packageName="@vendure/admin-ui" />

A chip component for displaying a label with an optional action icon.

*Example*

```HTML
<vdr-chip [colorFrom]="item.value"
          icon="close"
          (iconClick)="clear(item)">
{{ item.value }}</vdr-chip>
```

```ts title="Signature"
class ChipComponent {
    @Input() icon: string;
    @Input() invert = false;
    @Input() colorFrom = '';
    @Input() colorType: 'error' | 'success' | 'warning';
    @Output() iconClick = new EventEmitter<MouseEvent>();
}
```

<div className="members-wrapper">

### icon

<MemberInfo kind="property" type={`string`}   />

The icon should be the name of one of the available Clarity icons: https://clarity.design/foundation/icons/shapes/
### invert

<MemberInfo kind="property" type={``}   />


### colorFrom

<MemberInfo kind="property" type={``}   />

If set, the chip will have an auto-generated background
color based on the string value passed in.
### colorType

<MemberInfo kind="property" type={`'error' | 'success' | 'warning'`}   />

The color of the chip can also be one of the standard status colors.
### iconClick

<MemberInfo kind="property" type={``}   />




</div>
