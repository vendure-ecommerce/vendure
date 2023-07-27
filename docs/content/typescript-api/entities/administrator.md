---
title: "Administrator"
weight: 10
date: 2023-07-14T16:57:49.829Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Administrator
<div class="symbol">


# Administrator

{{< generation-info sourceFile="packages/core/src/entity/administrator/administrator.entity.ts" sourceLine="18" packageName="@vendure/core">}}

An administrative user who has access to the Admin UI and Admin API. The
specific permissions of the Administrator are determined by the assigned
<a href='/typescript-api/entities/role#role'>Role</a>s.

## Signature

```TypeScript
class Administrator extends VendureEntity implements SoftDeletable, HasCustomFields {
  constructor(input?: DeepPartial<Administrator>)
  @Column({ type: Date, nullable: true }) @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
  @Column() @Column() firstName: string;
  @Column() @Column() lastName: string;
  @Column({ unique: true }) @Column({ unique: true })
    emailAddress: string;
  @OneToOne(type => User) @JoinColumn() @OneToOne(type => User)
    @JoinColumn()
    user: User;
  @Column(type => CustomAdministratorFields) @Column(type => CustomAdministratorFields)
    customFields: CustomAdministratorFields;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * <a href='/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a>
 * HasCustomFields


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;) => Administrator"  >}}

{{< member-description >}}{{< /member-description >}}

### deletedAt

{{< member-info kind="property" type="Date | null"  >}}

{{< member-description >}}{{< /member-description >}}

### firstName

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### lastName

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### emailAddress

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### user

{{< member-info kind="property" type="<a href='/typescript-api/entities/user#user'>User</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomAdministratorFields"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
