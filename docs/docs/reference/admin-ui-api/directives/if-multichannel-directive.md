---
title: "IfMultichannelDirective"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## IfMultichannelDirective

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/directives/if-multichannel.directive.ts" sourceLine="21" packageName="@vendure/admin-ui" />

Structural directive that displays the given element if the Vendure instance has multiple channels
configured.

*Example*

```html
<div *vdrIfMultichannel class="channel-selector">
  <!-- ... -->
</ng-container>
```

```ts title="Signature"
class IfMultichannelDirective extends IfDirectiveBase<[]> {
    constructor(_viewContainer: ViewContainerRef, templateRef: TemplateRef<any>, dataService: DataService)
}
```
* Extends: <code>IfDirectiveBase&#60;[]&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(_viewContainer: ViewContainerRef, templateRef: TemplateRef&#60;any&#62;, dataService: <a href='/reference/admin-ui-api/services/data-service#dataservice'>DataService</a>) => IfMultichannelDirective`}   />




</div>
