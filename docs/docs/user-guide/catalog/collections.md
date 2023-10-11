---
title: "Collections"
weight: 2
---

# Collections

Collections allow you to group ProductVariants together by various criteria. A typical use of Collections is to create a hierarchical category tree which can be used in a navigation menu in your storefront.

## Populating Collections

Collections are _dynamic_, which means that you define a set of rules, and Vendure will automatically populate the Collection with ProductVariants according to those rules.

The rules are defined by **filters**. A Collection can define multiple filters, for example:

* Include all ProductVariants with a certain FacetValue
* Include all ProductVariants whose name includes the word "sale"

## Nesting Collections

Collections can be nested inside one another, as many levels deep as needed.

When populating a nested Collection, its own filters _plus the filters of all Collections above it_ are used to calculate the contents.

## Public vs Private Collections

A Collection can be made private, meaning that it will not be available in the storefront. This can be useful when you need to organize your inventory for internal purposes.
