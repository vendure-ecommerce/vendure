---
title: "TypedBaseDetailComponent"
weight: 10
date: 2023-07-20T13:56:17.765Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TypedBaseDetailComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/common/base-detail.component.ts" sourceLine="179" packageName="@vendure/admin-ui" />

A version of the <a href='/admin-ui-api/list-detail-views/base-detail-component#basedetailcomponent'>BaseDetailComponent</a> which is designed to be used with a
[TypedDocumentNode](https://the-guild.dev/graphql/codegen/plugins/typescript/typed-document-node).

```ts title="Signature"
class TypedBaseDetailComponent<T extends TypedDocumentNode<any, any>, Field extends keyof ResultOf<T>> extends BaseDetailComponent<NonNullable<ResultOf<T>[Field]>> {
  protected protected result$: Observable<ResultOf<T>>;
  protected protected entity: ResultOf<T>[Field];
  constructor()
  override init() => ;
}
```
Extends

 * <a href='/admin-ui-api/list-detail-views/base-detail-component#basedetailcomponent'>BaseDetailComponent</a>&#60;NonNullable&#60;ResultOf&#60;T&#62;[Field]&#62;&#62;



### result$

<MemberInfo kind="property" type="Observable&#60;ResultOf&#60;T&#62;&#62;"   />


### entity

<MemberInfo kind="property" type="ResultOf&#60;T&#62;[Field]"   />


### constructor

<MemberInfo kind="method" type="() => TypedBaseDetailComponent"   />


### init

<MemberInfo kind="method" type="() => "   />


