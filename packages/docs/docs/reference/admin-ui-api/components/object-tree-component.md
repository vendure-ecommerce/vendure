---
title: "ObjectTreeComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ObjectTreeComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/components/object-tree/object-tree.component.ts" sourceLine="22" packageName="@vendure/admin-ui" />

This component displays a plain JavaScript object as an expandable tree.

*Example*

```HTML
<vdr-object-tree [value]="payment.metadata"></vdr-object-tree>
```

```ts title="Signature"
class ObjectTreeComponent implements OnChanges {
    @Input() value: { [key: string]: any } | string;
    @Input() isArrayItem = false;
    depth: number;
    expanded: boolean;
    valueIsArray: boolean;
    entries: Array<{ key: string; value: any }>;
    constructor(parent: ObjectTreeComponent)
    ngOnChanges() => ;
    isObject(value: any) => boolean;
}
```
* Implements: <code>OnChanges</code>



<div className="members-wrapper">

### value

<MemberInfo kind="property" type={`{ [key: string]: any } | string`}   />


### isArrayItem

<MemberInfo kind="property" type={``}   />


### depth

<MemberInfo kind="property" type={`number`}   />


### expanded

<MemberInfo kind="property" type={`boolean`}   />


### valueIsArray

<MemberInfo kind="property" type={`boolean`}   />


### entries

<MemberInfo kind="property" type={`Array&#60;{ key: string; value: any }&#62;`}   />


### constructor

<MemberInfo kind="method" type={`(parent: <a href='/reference/admin-ui-api/components/object-tree-component#objecttreecomponent'>ObjectTreeComponent</a>) => ObjectTreeComponent`}   />


### ngOnChanges

<MemberInfo kind="method" type={`() => `}   />


### isObject

<MemberInfo kind="method" type={`(value: any) => boolean`}   />




</div>
