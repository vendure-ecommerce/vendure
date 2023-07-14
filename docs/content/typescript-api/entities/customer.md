---
title: "Customer"
weight: 10
date: 2023-07-14T16:57:49.864Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Customer
<div class="symbol">


# Customer

{{< generation-info sourceFile="packages/core/src/entity/customer/customer.entity.ts" sourceLine="22" packageName="@vendure/core">}}

This entity represents a customer of the store, typically an individual person. A Customer can be
a guest, in which case it has no associated <a href='/typescript-api/entities/user#user'>User</a>. Customers with registered account will
have an associated User entity.

## Signature

```TypeScript
class Customer extends VendureEntity implements ChannelAware, HasCustomFields, SoftDeletable {
  constructor(input?: DeepPartial<Customer>)
  @Column({ type: Date, nullable: true }) @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
  @Column({ nullable: true }) @Column({ nullable: true })
    title: string;
  @Column() @Column() firstName: string;
  @Column() @Column() lastName: string;
  @Column({ nullable: true }) @Column({ nullable: true })
    phoneNumber: string;
  @Column() @Column()
    emailAddress: string;
  @ManyToMany(type => CustomerGroup, group => group.customers) @JoinTable() @ManyToMany(type => CustomerGroup, group => group.customers)
    @JoinTable()
    groups: CustomerGroup[];
  @OneToMany(type => Address, address => address.customer) @OneToMany(type => Address, address => address.customer)
    addresses: Address[];
  @OneToMany(type => Order, order => order.customer) @OneToMany(type => Order, order => order.customer)
    orders: Order[];
  @OneToOne(type => User, { eager: true }) @JoinColumn() @OneToOne(type => User, { eager: true })
    @JoinColumn()
    user?: User;
  @Column(type => CustomCustomerFields) @Column(type => CustomCustomerFields)
    customFields: CustomCustomerFields;
  @ManyToMany(type => Channel) @JoinTable() @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>
 * HasCustomFields
 * <a href='/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/customer#customer'>Customer</a>&#62;) => Customer"  >}}

{{< member-description >}}{{< /member-description >}}

### deletedAt

{{< member-info kind="property" type="Date | null"  >}}

{{< member-description >}}{{< /member-description >}}

### title

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### firstName

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### lastName

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### phoneNumber

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### emailAddress

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### groups

{{< member-info kind="property" type="<a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### addresses

{{< member-info kind="property" type="<a href='/typescript-api/entities/address#address'>Address</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### orders

{{< member-info kind="property" type="<a href='/typescript-api/entities/order#order'>Order</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### user

{{< member-info kind="property" type="<a href='/typescript-api/entities/user#user'>User</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomCustomerFields"  >}}

{{< member-description >}}{{< /member-description >}}

### channels

{{< member-info kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
