---
title: 'Component Targeting Guide'
---

Input and display components use a three-tier targeting system to precisely control where they appear in the dashboard. Understanding this system is crucial for correctly placing your custom components.

## Targeting System Overview

The targeting system uses three identifiers:

1. **pageId** - The specific page in the dashboard
2. **blockId** - The section or component within that page
3. **field** - The specific field to replace

```tsx
{
    pageId: 'product-detail',    // Which page
    blockId: 'product-form',     // Which section of the page
    field: 'price',              // Which field in that section
    component: YourComponent,    // Your custom component
}
```

## Page IDs

Page IDs correspond to the main routes and views in the dashboard:

### Product Management

```tsx
'product-list'; // /catalog/products
'product-detail'; // /catalog/products/:id
'product-create'; // /catalog/products/create
```

### Customer Management

```tsx
'customer-list'; // /customers
'customer-detail'; // /customers/:id
'customer-create'; // /customers/create
```

### Order Management

```tsx
'order-list'; // /orders
'order-detail'; // /orders/:id
```

### Catalog Management

```tsx
'collection-list'; // /catalog/collections
'collection-detail'; // /catalog/collections/:id
'facet-list'; // /catalog/facets
'facet-detail'; // /catalog/facets/:id
```

### Settings Pages

```tsx
'settings-general'; // /settings/general
'settings-channels'; // /settings/channels
'settings-zones'; // /settings/zones
'settings-taxes'; // /settings/taxes
'settings-shipping'; // /settings/shipping-methods
'settings-payment'; // /settings/payment-methods
```

## Block IDs

Block IDs identify specific sections within a page. Different pages have different available blocks:

### Product Pages

**Product Detail (`product-detail`)**

```tsx
'product-form'; // Main product information form
'product-variants'; // Product variants section
'product-assets'; // Product images and assets
'product-seo'; // SEO settings
'product-channels'; // Channel assignments
```

**Product List (`product-list`)**

```tsx
'product-table'; // Main products data table
'product-filters'; // Search and filter controls
```

### Customer Pages

**Customer Detail (`customer-detail`)**

```tsx
'customer-info'; // Basic customer information
'customer-addresses'; // Customer addresses
'customer-orders'; // Customer order history
'customer-groups'; // Customer group assignments
```

**Customer List (`customer-list`)**

```tsx
'customer-table'; // Main customers data table
'customer-filters'; // Search and filter controls
```

### Order Pages

**Order Detail (`order-detail`)**

```tsx
'order-summary'; // Order basic information
'order-items'; // Order line items
'order-payments'; // Payment information
'order-fulfillment'; // Shipping and fulfillment
'order-history'; // Order state changes
```

**Order List (`order-list`)**

```tsx
'order-table'; // Main orders data table
'order-filters'; // Search and filter controls
```

## Field Names

Field names correspond to the actual data fields being displayed or edited. These vary by entity type:

### Product Fields

```tsx
// Basic information
'name'; // Product name
'slug'; // URL slug
'description'; // Product description
'sku'; // Stock keeping unit
'price'; // Product price
'enabled'; // Active status

// Variants
'variantName'; // Variant name
'variantSku'; // Variant SKU
'variantPrice'; // Variant price
'stockOnHand'; // Stock quantity

// SEO
'metaTitle'; // SEO title
'metaDescription'; // SEO description
```

### Customer Fields

```tsx
// Personal information
'firstName'; // Customer first name
'lastName'; // Customer last name
'emailAddress'; // Email address
'phoneNumber'; // Phone number
'title'; // Title (Mr, Mrs, etc.)

// Address fields
'streetLine1'; // Address line 1
'streetLine2'; // Address line 2
'city'; // City
'province'; // State/Province
'postalCode'; // ZIP/Postal code
'country'; // Country
```

### Order Fields

```tsx
// Order information
'code'; // Order number
'state'; // Order status
'total'; // Order total amount
'subtotal'; // Subtotal amount
'shipping'; // Shipping cost
'tax'; // Tax amount
'orderPlacedAt'; // Order date
'customerEmail'; // Customer email
'shippingAddress'; // Shipping address
'billingAddress'; // Billing address
```

## Discovery Methods

If you're unsure about the exact targeting values, here are ways to discover them:

### 1. Browser Developer Tools

Inspect the DOM to find targeting attributes:

```html
<!-- Look for these attributes on form elements -->
<div data-page-id="product-detail">
    <form data-block-id="product-form">
        <input name="price" data-field="price" />
    </form>
</div>
```

### 2. Console Logging

Add temporary console logs to see what's available:

```tsx
export function DebugComponent({ value, ...props }: any) {
    console.log('Component props:', props);
    console.log('Current context:', {
        pageId: props.pageId,
        blockId: props.blockId,
        fieldName: props.fieldName,
    });

    return <div>Debug: {JSON.stringify(value)}</div>;
}
```

### 3. Network Inspector

Look at GraphQL queries to understand field names:

```graphql
query GetProduct($id: ID!) {
    product(id: $id) {
        id
        name # Field: 'name'
        slug # Field: 'slug'
        description # Field: 'description'
        # ... other fields
    }
}
```

## Targeting Examples

### Example 1: Enhanced Price Input for Products

```tsx
{
    pageId: 'product-detail',
    blockId: 'product-form',
    field: 'price',
    component: EnhancedPriceInput,
}
```

This will replace the price input field in the product detail form.

### Example 2: Status Badge for Order List

```tsx
{
    pageId: 'order-list',
    blockId: 'order-table',
    field: 'state',
    component: OrderStatusBadge,
}
```

This will replace how order status is displayed in the orders table.

### Example 3: Custom Email Input for Customers

```tsx
{
    pageId: 'customer-detail',
    blockId: 'customer-info',
    field: 'emailAddress',
    component: ValidatedEmailInput,
}
```

This will replace the email input in the customer information form.

## Multiple Targeting

You can target the same component to multiple locations:

```tsx
// Use the same component in multiple places
const dateTimeDisplays = [
    {
        pageId: 'order-list',
        blockId: 'order-table',
        field: 'orderPlacedAt',
        component: DateTimeDisplay,
    },
    {
        pageId: 'order-detail',
        blockId: 'order-summary',
        field: 'orderPlacedAt',
        component: DateTimeDisplay,
    },
    {
        pageId: 'customer-list',
        blockId: 'customer-table',
        field: 'createdAt',
        component: DateTimeDisplay,
    },
];
```

## Hierarchical Targeting

The system supports hierarchical targeting where you can be more or less specific:

### Most Specific (Exact Match)

```tsx
{
    pageId: 'product-detail',
    blockId: 'product-form',
    field: 'price',
    component: PriceInput,
}
```

Only applies to the price field in the product form on the product detail page.

### Page + Field (Cross-Block)

```tsx
{
    pageId: 'product-detail',
    field: 'price',  // blockId omitted
    component: PriceInput,
}
```

Applies to any price field on the product detail page, regardless of block.

### Field Only (Global)

```tsx
{
    field: 'price',  // pageId and blockId omitted
    component: PriceInput,
}
```

Applies to any price field anywhere in the dashboard.

## Targeting Best Practices

1. **Be as specific as necessary**: Start with exact targeting and broaden only if needed
2. **Test thoroughly**: Always verify your components appear in the expected locations
3. **Document your targets**: Keep track of which components target which locations
4. **Consider context**: The same field might need different components in different contexts

```tsx
// Good: Specific targeting for different contexts
const components = [
    // Compact display for table
    {
        pageId: 'product-list',
        blockId: 'product-table',
        field: 'price',
        component: CompactPriceDisplay,
    },
    // Rich input for detail form
    {
        pageId: 'product-detail',
        blockId: 'product-form',
        field: 'price',
        component: RichPriceInput,
    },
];
```

## Troubleshooting

### Component Not Appearing

1. **Check targeting specificity**: Try broader targeting to see if the issue is specificity
2. **Verify IDs**: Use browser dev tools to confirm pageId, blockId, and field values
3. **Check console**: Look for errors or warnings about component registration
4. **Test with simple component**: Use a basic component to verify targeting works

### Component Appearing in Wrong Place

1. **Make targeting more specific**: Add pageId or blockId to narrow the scope
2. **Check for multiple registrations**: Ensure you're not registering the same target twice
3. **Verify field names**: Make sure you're targeting the correct field name

### Multiple Components Conflicting

1. **Use hierarchical targeting**: More specific targets override less specific ones
2. **Check registration order**: Later registrations may override earlier ones
3. **Use unique components**: Don't reuse the same component instance

:::tip
When in doubt, start with very specific targeting (all three IDs) and then broaden as needed. This helps avoid unexpected behavior.
:::

:::warning
Field names are case-sensitive and must match exactly. Use browser dev tools to verify the exact field names used in forms.
:::

## Related Guides

- **[Custom Form Elements Overview](./index)** - Learn about the unified system for custom field components, input components, and display components
- **[Input Components](./input-components)** - Create custom input controls for forms with specialized functionality
- **[Display Components](./display-components)** - Create custom readonly data visualizations for tables, detail views, and forms
