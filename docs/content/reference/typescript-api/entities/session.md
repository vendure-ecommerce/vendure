---
title: "Session"
weight: 10
date: 2023-07-14T16:57:49.992Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Session
<div class="symbol">


# Session

{{< generation-info sourceFile="packages/core/src/entity/session/session.entity.ts" sourceLine="18" packageName="@vendure/core">}}

A Session is created when a user makes a request to restricted API operations. A Session can be an <a href='/typescript-api/entities/anonymous-session#anonymoussession'>AnonymousSession</a>
in the case of un-authenticated users, otherwise it is an <a href='/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a>.

## Signature

```TypeScript
class Session extends VendureEntity {
  @Index({ unique: true }) @Column() @Index({ unique: true })
    @Column()
    token: string;
  @Column() @Column() expires: Date;
  @Column() @Column() invalidated: boolean;
  @EntityId({ nullable: true }) @EntityId({ nullable: true })
    activeOrderId?: ID;
  @Index() @ManyToOne(type => Order) @Index()
    @ManyToOne(type => Order)
    activeOrder: Order | null;
  @EntityId({ nullable: true }) @EntityId({ nullable: true })
    activeChannelId?: ID;
  @Index() @ManyToOne(type => Channel) @Index()
    @ManyToOne(type => Channel)
    activeChannel: Channel | null;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Members

### token

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### expires

{{< member-info kind="property" type="Date"  >}}

{{< member-description >}}{{< /member-description >}}

### invalidated

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### activeOrderId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### activeOrder

{{< member-info kind="property" type="<a href='/typescript-api/entities/order#order'>Order</a> | null"  >}}

{{< member-description >}}{{< /member-description >}}

### activeChannelId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### activeChannel

{{< member-info kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a> | null"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
