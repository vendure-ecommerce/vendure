---
title: "Administrators & Roles"
---

# Administrators & Roles

An **administrator** is a staff member who has access to the Admin UI, and is able to view and modify some or all of the items and settings.

The exact permissions of _what_ a given administrator may view and modify is defined by which **roles** are assigned to that administrator.

## Defining a Role

The role detail page allows you to create a new role or edit an existing one. A role can be thought of as a list of permissions. Permissions are usually divided into four types:

* **Create** allows you to create new items, e.g. "CreateProduct" will allow one to create a new product.
* **Read** allows you to view items, but not modify or delete them.
* **Update** allows you to make changes to existing items, but not to create new ones.
* **Delete** allows you to delete items.

Vendure comes with a few pre-defined roles for commonly-needed tasks, but you are free to modify these or create your own.

In general, it is advisable to create roles with the fewest amount of privileges needed for the staff member to do their jobs. For example, a marketing manager would need to be able to create, read, update and delete promotions, but probably doesn't need to be able to update or delete payment methods.

### The SuperAdmin role

This is a special role which cannot be deleted or modified. This role grants _all permissions_ and is used to set up the store initially, and make certain special changes (such as creating new Channels).

## Creating Administrators

For each individual that needs to log in to the Admin UI, you should create a new administrator account. 

Apart from filling in their details and selecting a strong password, you then need to assign at least one role. Roles "add together", meaning that when more than one role is assigned, the combined set of permissions of all assigned roles is granted to that administrator. 

Thus, it is possible to create a set of specific roles "Inventory Manager", "Order Manager", "Customer Services", "Marketing Manager", and _compose_ them together as needed.
