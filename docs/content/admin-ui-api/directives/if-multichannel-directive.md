---
title: "IfMultichannelDirective"
weight: 10
date: 2023-07-14T16:57:51.263Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# IfMultichannelDirective
<div class="symbol">


# IfMultichannelDirective

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/directives/if-multichannel.directive.ts" sourceLine="21" packageName="@vendure/admin-ui">}}

Structural directive that displays the given element if the Vendure instance has multiple channels
configured.

*Example*

```html
<div *vdrIfMultichannel class="channel-selector">
  <!-- ... -->
</ng-container>
```

## Signature

```TypeScript
class IfMultichannelDirective extends IfDirectiveBase<[]> {
  constructor(_viewContainer: ViewContainerRef, templateRef: TemplateRef<any>, dataService: DataService)
}
```
## Extends

 * IfDirectiveBase&#60;[]&#62;


## Members

### constructor

{{< member-info kind="method" type="(_viewContainer: ViewContainerRef, templateRef: TemplateRef&#60;any&#62;, dataService: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>) => IfMultichannelDirective"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
