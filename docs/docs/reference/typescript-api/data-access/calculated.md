---
title: "Calculated"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Calculated

<GenerationInfo sourceFile="packages/core/src/common/calculated-decorator.ts" sourceLine="43" packageName="@vendure/core" />

Used to define calculated entity getters. The decorator simply attaches an array of "calculated"
property names to the entity's prototype. This array is then used by the <a href='/reference/typescript-api/data-access/calculated-property-subscriber#calculatedpropertysubscriber'>CalculatedPropertySubscriber</a>
to transfer the getter function from the prototype to the entity instance.

```ts title="Signature"
function Calculated(queryInstruction?: CalculatedColumnQueryInstruction): MethodDecorator
```
Parameters

### queryInstruction

<MemberInfo kind="parameter" type={`<a href='/reference/typescript-api/data-access/calculated#calculatedcolumnqueryinstruction'>CalculatedColumnQueryInstruction</a>`} />



## CalculatedColumnQueryInstruction

<GenerationInfo sourceFile="packages/core/src/common/calculated-decorator.ts" sourceLine="17" packageName="@vendure/core" />

Optional metadata used to tell the <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a> & <a href='/reference/typescript-api/request/relations-decorator#relations'>Relations</a> decorator how to deal with
calculated columns when sorting, filtering and deriving required relations from GraphQL operations.

```ts title="Signature"
interface CalculatedColumnQueryInstruction {
    relations?: string[];
    query?: (qb: SelectQueryBuilder<any>) => void;
    expression?: string;
}
```

<div className="members-wrapper">

### relations

<MemberInfo kind="property" type={`string[]`}   />

If the calculated property depends on one or more relations being present
on the entity (e.g. an `Order` entity calculating the `totalQuantity` by adding
up the quantities of each `OrderLine`), then those relations should be defined here.
### query

<MemberInfo kind="property" type={`(qb: SelectQueryBuilder&#60;any&#62;) =&#62; void`}   />


### expression

<MemberInfo kind="property" type={`string`}   />




</div>
