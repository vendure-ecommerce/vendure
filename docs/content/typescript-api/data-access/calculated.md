---
title: "Calculated"
weight: 10
date: 2023-07-14T16:57:49.416Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Calculated
<div class="symbol">


# Calculated

{{< generation-info sourceFile="packages/core/src/common/calculated-decorator.ts" sourceLine="43" packageName="@vendure/core">}}

Used to define calculated entity getters. The decorator simply attaches an array of "calculated"
property names to the entity's prototype. This array is then used by the {@link CalculatedPropertySubscriber}to transfer the getter function from the prototype to the entity instance.

## Signature

```TypeScript
function Calculated(queryInstruction?: CalculatedColumnQueryInstruction): MethodDecorator
```
## Parameters

### queryInstruction

{{< member-info kind="parameter" type="<a href='/typescript-api/data-access/calculated#calculatedcolumnqueryinstruction'>CalculatedColumnQueryInstruction</a>" >}}

</div>
<div class="symbol">


# CalculatedColumnQueryInstruction

{{< generation-info sourceFile="packages/core/src/common/calculated-decorator.ts" sourceLine="17" packageName="@vendure/core">}}

Optional metadata used to tell the <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a> & <a href='/typescript-api/request/relations-decorator#relations'>Relations</a> decorator how to deal with
calculated columns when sorting, filtering and deriving required relations from GraphQL operations.

## Signature

```TypeScript
interface CalculatedColumnQueryInstruction {
  relations?: string[];
  query?: (qb: SelectQueryBuilder<any>) => void;
  expression?: string;
}
```
## Members

### relations

{{< member-info kind="property" type="string[]"  >}}

{{< member-description >}}If the calculated property depends on one or more relations being present
on the entity (e.g. an `Order` entity calculating the `totalQuantity` by adding
up the quantities of each `OrderLine`), then those relations should be defined here.{{< /member-description >}}

### query

{{< member-info kind="property" type="(qb: SelectQueryBuilder&#60;any&#62;) =&#62; void"  >}}

{{< member-description >}}{{< /member-description >}}

### expression

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
