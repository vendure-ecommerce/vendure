---
title: "DropdownComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DropdownComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/components/dropdown/dropdown.component.ts" sourceLine="28" packageName="@vendure/admin-ui" />

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

```ts title="Signature"
class DropdownComponent {
    isOpen = false;
    public trigger: ElementRef;
    @Input() manualToggle = false;
    onClick() => ;
    toggleOpen() => ;
    onOpenChange(callback: (isOpen: boolean) => void) => ;
    setTriggerElement(elementRef: ElementRef) => ;
}
```

<div className="members-wrapper">

### isOpen

<MemberInfo kind="property" type={``}   />


### trigger

<MemberInfo kind="property" type={`ElementRef`}   />


### manualToggle

<MemberInfo kind="property" type={``}   />


### onClick

<MemberInfo kind="method" type={`() => `}   />


### toggleOpen

<MemberInfo kind="method" type={`() => `}   />


### onOpenChange

<MemberInfo kind="method" type={`(callback: (isOpen: boolean) =&#62; void) => `}   />


### setTriggerElement

<MemberInfo kind="method" type={`(elementRef: ElementRef) => `}   />




</div>
