---
title: 'Relation Selectors'
---

Relation selector components provide a powerful way to select related entities in your dashboard forms. They support both single and multi-selection modes with built-in search, infinite scroll pagination, and complete TypeScript type safety.

## Features

- **Real-time Search**: Debounced search with customizable filters
- **Infinite Scroll**: Automatic pagination loading 25 items by default
- **Single/Multi Select**: Easy toggle between selection modes
- **Type Safe**: Full TypeScript support with generic types
- **Customizable**: Pass your own GraphQL queries and field mappings
- **Accessible**: Built with Radix UI primitives

## Components Overview

The relation selector system consists of three main components:

- **`RelationSelector`**: The abstract base component that handles all core functionality
- **`SingleRelationInput`**: Convenient wrapper for single entity selection
- **`MultiRelationInput`**: Convenient wrapper for multiple entity selection

## Basic Usage

### Single Selection

```tsx title="src/plugins/my-plugin/dashboard/components/product-selector.tsx"
import { SingleRelationInput, createRelationSelectorConfig, graphql, ResultOf } from '@vendure/dashboard';

// Define your GraphQL query
const productListQuery = graphql(`
    query GetProductsForSelection($options: ProductListOptions) {
        products(options: $options) {
            items {
                id
                name
                slug
                featuredAsset {
                    id
                    preview
                }
            }
            totalItems
        }
    }
`);

// Create the configuration
const productConfig = createRelationSelectorConfig({
    listQuery: productListQuery,
    idKey: 'id',
    labelKey: 'name',
    placeholder: 'Search products...',
    buildSearchFilter: (term: string) => ({
        name: { contains: term },
    }),
});

export function ProductSelectorComponent({ value, onChange, disabled }: CustomFormComponentInputProps) {
    return (
        <SingleRelationInput value={value} onChange={onChange} config={productConfig} disabled={disabled} />
    );
}
```

### Multi Selection

```tsx title="src/plugins/my-plugin/dashboard/components/product-multi-selector.tsx"
import { MultiRelationInput } from '@vendure/dashboard';

export function ProductMultiSelectorComponent({ value, onChange, disabled }: CustomFormComponentInputProps) {
    return (
        <MultiRelationInput
            value={value || []}
            onChange={onChange}
            config={productConfig} // Same config as above
            disabled={disabled}
        />
    );
}
```

## Configuration Options

The `createRelationSelectorConfig` function accepts these options:

```tsx
interface RelationSelectorConfig<T> {
    /** The GraphQL query document for fetching items */
    listQuery: DocumentNode;
    /** The property key for the entity ID */
    idKey: keyof T;
    /** The property key for the display label */
    labelKey: keyof T;
    /** Number of items to load per page (default: 25) */
    pageSize?: number;
    /** Placeholder text for the search input */
    placeholder?: string;
    /** Whether to enable multi-select mode */
    multiple?: boolean;
    /** Custom filter function for search */
    buildSearchFilter?: (searchTerm: string) => any;
}
```

## Advanced Examples

### Custom Entity with Complex Search

```tsx title="src/plugins/review-plugin/dashboard/components/review-selector.tsx"
import { SingleRelationInput, createRelationSelectorConfig, graphql, ResultOf } from '@vendure/dashboard';

const reviewFragment = graphql(`
    fragment ReviewForSelector on ProductReview {
        id
        title
        rating
        summary
        state
        product {
            name
        }
    }
`);

const reviewListQuery = graphql(
    `
        query GetReviewsForSelection($options: ProductReviewListOptions) {
            productReviews(options: $options) {
                items {
                    ...ReviewForSelector
                }
                totalItems
            }
        }
    `,
    [reviewFragment],
);

const reviewConfig = createRelationSelectorConfig<ResultOf<typeof reviewFragment>>({
    listQuery: reviewListQuery,
    idKey: 'id',
    labelKey: 'title',
    placeholder: 'Search reviews by title or summary...',
    pageSize: 20, // Custom page size
    buildSearchFilter: (term: string) => ({
        // Search across multiple fields
        or: [
            { title: { contains: term } },
            { summary: { contains: term } },
            { product: { name: { contains: term } } },
        ],
    }),
});

export function ReviewSelectorComponent({ value, onChange }: CustomFormComponentInputProps) {
    return <SingleRelationInput value={value} onChange={onChange} config={reviewConfig} />;
}
```

### Asset Selector with Type Filtering

```tsx title="src/plugins/my-plugin/dashboard/components/image-selector.tsx"
import { graphql, createRelationSelectorConfig, SingleRelationInput } from '@vendure/dashboard';

const assetListQuery = graphql(`
    query GetAssetsForSelection($options: AssetListOptions) {
        assets(options: $options) {
            items {
                id
                name
                preview
                type
                fileSize
            }
            totalItems
        }
    }
`);

const imageAssetConfig = createRelationSelectorConfig({
    listQuery: assetListQuery,
    idKey: 'id',
    labelKey: 'name',
    placeholder: 'Search images...',
    buildSearchFilter: (term: string) => ({
        and: [
            { type: { eq: 'IMAGE' } }, // Only show images
            {
                or: [{ name: { contains: term } }, { preview: { contains: term } }],
            },
        ],
    }),
});

export function ImageSelectorComponent({ value, onChange }: CustomFormComponentInputProps) {
    return <SingleRelationInput value={value} onChange={onChange} config={imageAssetConfig} />;
}
```

### Multi-Select with Status Filtering

```tsx title="src/plugins/my-plugin/dashboard/components/active-customer-selector.tsx"
import { MultiRelationInput, createRelationSelectorConfig, graphql } from '@vendure/dashboard';

const customerListQuery = graphql(`
    query GetCustomersForSelection($options: CustomerListOptions) {
        customers(options: $options) {
            items {
                id
                firstName
                lastName
                emailAddress
                user {
                    verified
                }
            }
            totalItems
        }
    }
`);

const activeCustomerConfig = createRelationSelectorConfig({
    listQuery: customerListQuery,
    idKey: 'id',
    labelKey: 'emailAddress',
    placeholder: 'Search verified customers...',
    pageSize: 30,
    buildSearchFilter: (term: string) => ({
        and: [
            { user: { verified: { eq: true } } }, // Only verified customers
            {
                or: [
                    { emailAddress: { contains: term } },
                    { firstName: { contains: term } },
                    { lastName: { contains: term } },
                ],
            },
        ],
    }),
});

export function ActiveCustomerSelectorComponent({ value, onChange }: CustomFormComponentInputProps) {
    return <MultiRelationInput value={value || []} onChange={onChange} config={activeCustomerConfig} />;
}
```

## Registration

Register your relation selector components in your dashboard extension:

```tsx title="src/plugins/my-plugin/dashboard/index.tsx"
import { defineDashboardExtension } from '@vendure/dashboard';
import {
    ProductSelectorComponent,
    ReviewSelectorComponent,
    ImageSelectorComponent,
    ActiveCustomerSelectorComponent,
} from './components';

export default defineDashboardExtension({
    detailForms: [
        {
            pageId: 'product-detail',
            inputs: [
                {
                    blockId: 'product-form',
                    field: 'featuredProductId',
                    component: ProductSelectorComponent,
                },
                {
                    blockId: 'product-form',
                    field: 'relatedCustomerIds',
                    component: ActiveCustomerSelectorComponent,
                },
            ],
        },
        {
            pageId: 'collection-detail',
            inputs: [
                {
                    blockId: 'collection-form',
                    field: 'featuredImageId',
                    component: ImageSelectorComponent,
                },
                {
                    blockId: 'collection-form',
                    field: 'featuredReviewId',
                    component: ReviewSelectorComponent,
                },
            ],
        },
    ],
});
```

## Built-in Configurations

The relation selector package includes pre-configured setups for common Vendure entities:

```tsx
import {
    productRelationConfig,
    customerRelationConfig,
    collectionRelationConfig,
    SingleRelationInput,
    MultiRelationInput,
} from '@vendure/dashboard';

// Use pre-built configurations
export function QuickProductSelector({ value, onChange }: CustomFormComponentInputProps) {
    return <SingleRelationInput value={value} onChange={onChange} config={productRelationConfig} />;
}

export function QuickCustomerMultiSelector({ value, onChange }: CustomFormComponentInputProps) {
    return <MultiRelationInput value={value || []} onChange={onChange} config={customerRelationConfig} />;
}
```

## Best Practices

### Query Optimization

1. **Select only needed fields**: Include only the fields you actually use to improve performance
2. **Use fragments**: Create reusable fragments for consistent data fetching
3. **Optimize search filters**: Use database indexes for the fields you search on

```tsx
// Good: Minimal required fields
const productListQuery = graphql(`
    query GetProductsForSelection($options: ProductListOptions) {
        products(options: $options) {
            items {
                id
                name
                # Only include what you need
            }
            totalItems
        }
    }
`);

// Avoid: Over-fetching unnecessary data
const productListQuery = graphql(`
    query GetProductsForSelection($options: ProductListOptions) {
        products(options: $options) {
            items {
                id
                name
                description
                featuredAsset { ... } # Only if you display it
                variants { ... }      # Usually not needed for selection
                # etc.
            }
            totalItems
        }
    }
`);
```

### Performance Tips

1. **Appropriate page sizes**: Balance between fewer requests and faster initial loads
2. **Debounced search**: The default 300ms debounce prevents excessive API calls
3. **Caching**: Queries are automatically cached by TanStack Query

```tsx
const config = createRelationSelectorConfig({
    listQuery: myQuery,
    idKey: 'id',
    labelKey: 'name',
    pageSize: 25, // Good default, adjust based on your data
    buildSearchFilter: (term: string) => ({
        // Use indexed fields for better performance
        name: { contains: term },
    }),
});
```

### Type Safety

Leverage TypeScript generics for full type safety:

```tsx
interface MyEntity {
    id: string;
    title: string;
    status: 'ACTIVE' | 'INACTIVE';
}

const myEntityConfig = createRelationSelectorConfig<MyEntity>({
    listQuery: myEntityQuery,
    idKey: 'id', // ✅ TypeScript knows this must be a key of MyEntity
    labelKey: 'title', // ✅ TypeScript validates this field exists
    buildSearchFilter: (term: string) => ({
        title: { contains: term }, // ✅ Auto-completion and validation
    }),
});
```

## Troubleshooting

### Common Issues

**1. "Cannot query field X on type Query"**

```
Error: Cannot query field "myEntities" on type "Query"
```

**Solution**: Ensure your GraphQL query field name matches your schema definition exactly.

**2. Empty results despite data existing**

```tsx
// Problem: Wrong field used for search
buildSearchFilter: (term: string) => ({
    wrongField: { contains: term }, // This field doesn't exist
});

// Solution: Use correct field names
buildSearchFilter: (term: string) => ({
    name: { contains: term }, // Correct field name
});
```

**3. TypeScript errors with config**

```tsx
// Problem: Missing type parameter
const config = createRelationSelectorConfig({
    // TypeScript can't infer the entity type
});

// Solution: Provide explicit type or use proper typing
const config = createRelationSelectorConfig<MyEntityType>({
    // Now TypeScript knows the shape of your entity
});
```

### Performance Issues

If you experience slow loading:

1. **Check your GraphQL query**: Ensure it's optimized and uses appropriate filters
2. **Verify database indexes**: Make sure searched fields are indexed
3. **Adjust page size**: Try smaller page sizes for faster initial loads
4. **Optimize buildSearchFilter**: Use efficient query patterns

```tsx
// Efficient search filter
buildSearchFilter: (term: string) => ({
    name: { contains: term }, // Simple, indexed field
});

// Less efficient
buildSearchFilter: (term: string) => ({
    or: [
        { name: { contains: term } },
        { description: { contains: term } },
        { deepNestedField: { someComplexFilter: term } }, // Avoid deep nesting
    ],
});
```
