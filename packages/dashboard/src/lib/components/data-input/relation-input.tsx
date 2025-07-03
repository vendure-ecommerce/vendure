import { graphql } from '@/vdb/graphql/graphql.js';
import { createRelationSelectorConfig, RelationSelector } from './relation-selector.js';

// Re-export for convenience
export { createRelationSelectorConfig };

/**
 * Single relation input component
 */
export interface SingleRelationInputProps<T = any> {
    value: string;
    onChange: (value: string) => void;
    config: Parameters<typeof createRelationSelectorConfig<T>>[0];
    disabled?: boolean;
    className?: string;
}

export function SingleRelationInput<T>({
    value,
    onChange,
    config,
    disabled,
    className,
}: Readonly<SingleRelationInputProps<T>>) {
    const singleConfig = createRelationSelectorConfig<T>({
        ...config,
        multiple: false,
    });

    return (
        <RelationSelector
            config={singleConfig}
            value={value}
            onChange={newValue => onChange(newValue as string)}
            disabled={disabled}
            className={className}
        />
    );
}

/**
 * Multi relation input component
 */
export interface MultiRelationInputProps<T = any> {
    value: string[];
    onChange: (value: string[]) => void;
    config: Parameters<typeof createRelationSelectorConfig<T>>[0];
    disabled?: boolean;
    className?: string;
}

export function MultiRelationInput<T>({
    value,
    onChange,
    config,
    disabled,
    className,
}: Readonly<MultiRelationInputProps<T>>) {
    const multiConfig = createRelationSelectorConfig<T>({
        ...config,
        multiple: true,
    });

    return (
        <RelationSelector
            config={multiConfig}
            value={value}
            onChange={newValue => onChange(newValue as string[])}
            disabled={disabled}
            className={className}
        />
    );
}

// Example configurations for common entities

/**
 * Product relation selector configuration
 */
export const productRelationConfig = createRelationSelectorConfig({
    listQuery: graphql(`
        query GetProductsForRelationSelector($options: ProductListOptions) {
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
    `),
    idKey: 'id' as const,
    labelKey: 'name' as const,
    placeholder: 'Search products...',
    buildSearchFilter: (term: string) => ({
        name: { contains: term },
    }),
});

/**
 * Customer relation selector configuration
 */
export const customerRelationConfig = createRelationSelectorConfig({
    listQuery: graphql(`
        query GetCustomersForRelationSelector($options: CustomerListOptions) {
            customers(options: $options) {
                items {
                    id
                    firstName
                    lastName
                    emailAddress
                }
                totalItems
            }
        }
    `),
    idKey: 'id' as const,
    labelKey: 'emailAddress' as const,
    placeholder: 'Search customers...',
    buildSearchFilter: (term: string) => ({
        emailAddress: { contains: term },
    }),
});

/**
 * Collection relation selector configuration
 */
export const collectionRelationConfig = createRelationSelectorConfig({
    listQuery: graphql(`
        query GetCollectionsForRelationSelector($options: CollectionListOptions) {
            collections(options: $options) {
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
    `),
    idKey: 'id' as const,
    labelKey: 'name' as const,
    placeholder: 'Search collections...',
    buildSearchFilter: (term: string) => ({
        name: { contains: term },
    }),
});
