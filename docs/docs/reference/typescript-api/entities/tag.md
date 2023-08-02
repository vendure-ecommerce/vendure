---
title: "Tag"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Tag

<GenerationInfo sourceFile="packages/core/src/entity/tag/tag.entity.ts" sourceLine="13" packageName="@vendure/core" />

A tag is an arbitrary label which can be applied to certain entities.
It is used to help organize and filter those entities.

```ts title="Signature"
class Tag extends VendureEntity {
    constructor(input?: DeepPartial<Tag>)
    @Column()
    value: string;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/tag#tag'>Tag</a>&#62;) => Tag`}   />


### value

<MemberInfo kind="property" type={`string`}   />




</div>
