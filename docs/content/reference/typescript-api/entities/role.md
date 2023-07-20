---
title: "Role"
weight: 10
date: 2023-07-14T16:57:49.985Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Role
<div class="symbol">


# Role

{{< generation-info sourceFile="packages/core/src/entity/role/role.entity.ts" sourceLine="16" packageName="@vendure/core">}}

A Role represents a collection of permissions which determine the authorization
level of a <a href='/typescript-api/entities/user#user'>User</a> on a given set of <a href='/typescript-api/entities/channel#channel'>Channel</a>s.

## Signature

```TypeScript
class Role extends VendureEntity implements ChannelAware {
  constructor(input?: DeepPartial<Role>)
  @Column() @Column() code: string;
  @Column() @Column() description: string;
  @Column('simple-array') @Column('simple-array') permissions: Permission[];
  @ManyToMany(type => Channel) @JoinTable() @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;) => Role"  >}}

{{< member-description >}}{{< /member-description >}}

### code

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### description

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### permissions

{{< member-info kind="property" type="<a href='/typescript-api/common/permission#permission'>Permission</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### channels

{{< member-info kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
