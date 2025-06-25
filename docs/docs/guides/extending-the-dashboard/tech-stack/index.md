---
title: 'Tech Stack'
---

The Vendure Dashboard is built on a modern stack of technologies that provide a great developer experience and powerful capabilities for building custom extensions.

## Core Technologies

### React 19

The dashboard is built with React 19, giving you access to all the latest React features including:

- React Compiler optimizations
- Improved concurrent features
- Actions and form handling improvements
- Enhanced automatic batching
- Better TypeScript support
- New hooks like `useOptimistic` and `useFormStatus`

```tsx
import { useOptimistic, useFormStatus } from 'react';

function OptimisticUpdateExample() {
    const [optimisticState, addOptimistic] = useOptimistic(state, (currentState, optimisticValue) => {
        // Return new state with optimistic update
        return [...currentState, optimisticValue];
    });

    return (
        <div>
            {optimisticState.map(item => (
                <div key={item.id}>{item.name}</div>
            ))}
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Save'}
        </button>
    );
}
```

### TypeScript

Full TypeScript support throughout the dashboard provides:

- Type safety for your custom components
- IntelliSense and autocomplete in your IDE
- Compile-time error checking
- Generated types from your GraphQL schema

### Vite 6

Vite 6 powers the development experience with:

- Lightning-fast hot module replacement (HMR)
- Optimized build process with Rollup 4
- Modern ES modules support
- Rich plugin ecosystem
- Environment API for better multi-environment support

## UI Framework

### Tailwind CSS v4

The dashboard uses Tailwind CSS v4 for styling:

- Utility-first CSS framework
- Improved performance with Rust-based engine
- Enhanced CSS-first configuration
- Responsive design system
- Built-in dark mode support
- Customizable design tokens

```tsx
// Example using Tailwind classes
function MyComponent() {
    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Custom Component</h2>
        </div>
    );
}
```

### Shadcn/ui

Built on top of Radix UI primitives, Shadcn/ui provides:

- Accessible components out of the box
- Consistent design system
- Customizable component library
- Copy-and-paste component approach

```tsx
import { Button, Input, Card } from '@vendure/dashboard';

function MyForm() {
    return (
        <Card className="p-6">
            <Input placeholder="Enter your text" />
            <Button className="mt-4">Submit</Button>
        </Card>
    );
}
```

## State Management

### TanStack Query v5

TanStack Query v5 handles all server state management:

- Automatic caching and synchronization
- Background updates
- Optimistic updates
- Error handling and retry logic

```tsx
import { useQuery } from '@tanstack/react-query';
import { graphql } from '@/gql';

const getProductsQuery = graphql(`
    query GetProducts {
        products {
            items {
                id
                name
                slug
            }
        }
    }
`);

function ProductList() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: () => client.request(getProductsQuery),
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <ul>
            {data.products.items.map(product => (
                <li key={product.id}>{product.name}</li>
            ))}
        </ul>
    );
}
```

## Routing

### TanStack Router v1

Type-safe routing with:

- File-based routing
- 100% type-safe navigation
- Automatic route validation
- Search params handling
- Built-in caching and preloading
- Route-level code splitting

```tsx
import { Link, useNavigate } from '@tanstack/react-router';

function Navigation() {
    const navigate = useNavigate();

    return (
        <div>
            <Link to="/products">Products</Link>
            <button onClick={() => navigate({ to: '/customers' })}>Go to Customers</button>
        </div>
    );
}
```

## Forms

### React Hook Form

Powerful form handling with:

- Minimal re-renders
- Built-in validation
- TypeScript support
- Easy integration with UI libraries

```tsx
import { useForm } from 'react-hook-form';
import { FormFieldWrapper, Input, Button } from '@vendure/dashboard';

interface FormData {
    name: string;
    email: string;
}

function MyForm() {
    const form = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        console.log(data);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormFieldWrapper
                control={form.control}
                name="name"
                label="Name"
                render={({ field }) => <Input {...field} />}
            />
            <FormFieldWrapper
                control={form.control}
                name="email"
                label="Email"
                render={({ field }) => <Input type="email" {...field} />}
            />
            <Button type="submit">Submit</Button>
        </form>
    );
}
```

## GraphQL Integration

### gql.tada

Type-safe GraphQL with:

- Generated TypeScript types
- IntelliSense for queries and mutations
- Compile-time validation
- Schema introspection

```tsx
import { graphql } from '@/gql';
import { useMutation } from '@tanstack/react-query';

const createProductMutation = graphql(`
    mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
            id
            name
            slug
        }
    }
`);

function CreateProductForm() {
    const mutation = useMutation({
        mutationFn: (input: CreateProductInput) => client.request(createProductMutation, { input }),
    });

    // TypeScript knows the exact shape of the input and response
    const handleSubmit = (data: CreateProductInput) => {
        mutation.mutate(data);
    };

    return (
        // Form implementation
        <div>Create Product Form</div>
    );
}
```

## Notifications

### Sonner

Toast notifications with:

- Beautiful animations
- Customizable appearance
- Promise-based notifications
- Stacking support

```tsx
import { toast } from 'sonner';

function MyComponent() {
    const handleSave = async () => {
        try {
            await saveData();
            toast.success('Data saved successfully!');
        } catch (error) {
            toast.error('Failed to save data', {
                description: error.message,
            });
        }
    };

    // Promise-based toasts
    const handleAsyncAction = () => {
        toast.promise(performAsyncAction(), {
            loading: 'Saving...',
            success: 'Saved successfully!',
            error: 'Failed to save',
        });
    };

    return (
        <div>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleAsyncAction}>Async Save</button>
        </div>
    );
}
```

## Icons

### Lucide React

Beautiful, customizable icons:

- Consistent design
- Tree-shakeable
- Customizable size and color
- Accessible by default

```tsx
import { ShoppingCartIcon, UserIcon, SettingsIcon } from 'lucide-react';

function Navigation() {
    return (
        <nav className="flex space-x-4">
            <a href="/products" className="flex items-center">
                <ShoppingCartIcon className="mr-2 h-4 w-4" />
                Products
            </a>
            <a href="/customers" className="flex items-center">
                <UserIcon className="mr-2 h-4 w-4" />
                Customers
            </a>
            <a href="/settings" className="flex items-center">
                <SettingsIcon className="mr-2 h-4 w-4" />
                Settings
            </a>
        </nav>
    );
}
```

## Animations

### Motion

Smooth animations powered by Motion (successor to Framer Motion):

- High-performance animations
- Declarative API
- Spring-based animations
- Layout animations
- Gesture support

```tsx
import { motion } from 'motion/react';

function AnimatedCard({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-lg shadow"
        >
            {children}
        </motion.div>
    );
}
```

## Internationalization

### Lingui

Powerful i18n solution for React:

- ICU MessageFormat support
- Automatic message extraction
- TypeScript integration
- Pluralization support
- Compile-time optimization

```tsx
import { Trans, useLingui } from '@/lib/trans.js';

function MyComponent() {
    const { t } = useLingui();

    return (
        <div>
            <h1>
                <Trans>Welcome to Dashboard</Trans>
            </h1>
            <p>{t`Click here to continue`}</p>
        </div>
    );
}
```

## Development Tools

### ESLint & Prettier

Code quality and formatting:

- Consistent code style
- Error prevention
- Automatic formatting
- TypeScript support

### Hot Module Replacement

Development experience:

- Instant updates without page refresh
- Preserves component state
- Error overlay
- Fast development cycle

## Best Practices

### Component Composition

Build reusable components:

```tsx
import { Card, Button } from '@vendure/dashboard';

function ProductCard({ product, onEdit, onDelete }) {
    return (
        <Card className="p-4">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
            <div className="flex space-x-2 mt-4">
                <Button variant="outline" onClick={() => onEdit(product)}>
                    Edit
                </Button>
                <Button variant="destructive" onClick={() => onDelete(product)}>
                    Delete
                </Button>
            </div>
        </Card>
    );
}
```

### Custom Hooks

Extract reusable logic:

```tsx
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

function useProduct(productId: string) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['product', productId],
        queryFn: () => fetchProduct(productId),
    });

    return {
        product: data,
        isLoading,
        error,
    };
}

function ProductDetail({ productId }: { productId: string }) {
    const { product, isLoading, error } = useProduct(productId);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <div>{product.name}</div>;
}
```

## Performance Considerations

1. **React.memo()** for expensive components
2. **useMemo()** and **useCallback()** for expensive calculations
3. **React Query caching** for server state
4. **Code splitting** with dynamic imports
5. **Image optimization** with proper formats and sizes

The dashboard's modern tech stack provides a solid foundation for building powerful, maintainable extensions while ensuring a great developer experience.
