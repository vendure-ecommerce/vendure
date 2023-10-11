---
title: "OrderStateLabelComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OrderStateLabelComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/components/order-state-label/order-state-label.component.ts" sourceLine="13" packageName="@vendure/admin-ui" />

Displays the state of an order in a colored chip.

*Example*

```HTML
<vdr-order-state-label [state]="order.state"></vdr-order-state-label>
```

```ts title="Signature"
class OrderStateLabelComponent {
    @Input() state: string;
    chipColorType: void
}
```

<div className="members-wrapper">

### state

<MemberInfo kind="property" type={`string`}   />


### chipColorType

<MemberInfo kind="property" type={``}   />




</div>
