---
title: "DropdownComponent"
weight: 10
date: 2023-07-14T16:57:51.220Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DropdownComponent
<div class="symbol">


# DropdownComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/components/dropdown/dropdown.component.ts" sourceLine="28" packageName="@vendure/admin-ui">}}

Used for building dropdown menus.

*Example*

```HTML
<vdr-dropdown>
  <button class="btn btn-outline" vdrDropdownTrigger>
      <clr-icon shape="plus"></clr-icon>
      Select type
  </button>
  <vdr-dropdown-menu vdrPosition="bottom-left">
    <button
      *ngFor="let typeName of allTypes"
      type="button"
      vdrDropdownItem
      (click)="selectType(typeName)"
    >
      typeName
    </button>
  </vdr-dropdown-menu>
</vdr-dropdown>
```

## Signature

```TypeScript
class DropdownComponent {
  isOpen = false;
  public public trigger: ElementRef;
  @Input() @Input() manualToggle = false;
  onClick() => ;
  toggleOpen() => ;
  onOpenChange(callback: (isOpen: boolean) => void) => ;
  setTriggerElement(elementRef: ElementRef) => ;
}
```
## Members

### isOpen

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### trigger

{{< member-info kind="property" type="ElementRef"  >}}

{{< member-description >}}{{< /member-description >}}

### manualToggle

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### onClick

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### toggleOpen

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### onOpenChange

{{< member-info kind="method" type="(callback: (isOpen: boolean) =&#62; void) => "  >}}

{{< member-description >}}{{< /member-description >}}

### setTriggerElement

{{< member-info kind="method" type="(elementRef: ElementRef) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
