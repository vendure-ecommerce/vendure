import { graphql } from '@/vdb/graphql/graphql.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { RelationCustomFieldConfig } from '@vendure/common/lib/generated-types';
import { ControllerRenderProps } from 'react-hook-form';
import { MultiRelationInput, SingleRelationInput } from './relation-input.js';
import { createRelationSelectorConfig } from './relation-selector.js';

interface PlaceholderIconProps {
    letter: string;
    className?: string;
    rounded?: boolean;
}

function PlaceholderIcon({ letter, className = '', rounded = false }: Readonly<PlaceholderIconProps>) {
    return (
        <div
            className={`w-full h-full bg-muted flex items-center justify-center border rounded text-muted-foreground ${rounded ? 'text-sm font-medium' : 'text-xs'} ${className}`}
        >
            {letter}
        </div>
    );
}

// Entity type mappings from the dev-config.ts - using functions to generate configs
const createEntityConfigs = (i18n: any) => ({
    Product: createRelationSelectorConfig({
        listQuery: graphql(`
            query GetProductsForRelationSelector($options: ProductListOptions) {
                products(options: $options) {
                    items {
                        id
                        name
                        slug
                        enabled
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
        placeholder: i18n.t('Search products...'),
        buildSearchFilter: (term: string) => ({
            name: { contains: term },
        }),
        label: (item: any) => (
            <div className="flex items-center gap-3 w-full" title={`${item.name} (${item.slug})`}>
                <div className="w-8 h-8 rounded overflow-hidden bg-muted flex-shrink-0">
                    {item.featuredAsset?.preview ? (
                        <img
                            src={item.featuredAsset.preview + '?preset=thumb'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <PlaceholderIcon letter="P" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.name}</div>
                    <div className="text-sm text-muted-foreground truncate">
                        {item.slug} {!item.enabled && '• Disabled'}
                    </div>
                </div>
            </div>
        ),
    }),

    Customer: createRelationSelectorConfig({
        listQuery: graphql(`
            query GetCustomersForRelationSelector($options: CustomerListOptions) {
                customers(options: $options) {
                    items {
                        id
                        firstName
                        lastName
                        emailAddress
                        phoneNumber
                        user {
                            verified
                        }
                    }
                    totalItems
                }
            }
        `),
        idKey: 'id' as const,
        labelKey: 'emailAddress' as const,
        placeholder: i18n.t('Search customers...'),
        buildSearchFilter: (term: string) => ({
            emailAddress: { contains: term },
        }),
        label: (item: any) => (
            <div className="flex items-center gap-3 w-full" title={`${item.firstName} ${item.lastName} (${item.emailAddress})`}>
                <div className="w-8 h-8 rounded-full flex-shrink-0">
                    <PlaceholderIcon
                        letter={
                            item.firstName?.[0]?.toUpperCase() || item.emailAddress?.[0]?.toUpperCase() || 'U'
                        }
                        rounded
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                        {item.firstName} {item.lastName}
                        {!item.user?.verified && (
                            <span className="ml-2 text-orange-600 text-xs">• Unverified</span>
                        )}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                        {item.emailAddress}
                        {item.phoneNumber && ` • ${item.phoneNumber}`}
                    </div>
                </div>
            </div>
        ),
    }),

    ProductVariant: createRelationSelectorConfig({
        listQuery: graphql(`
            query GetProductVariantsForRelationSelector($options: ProductVariantListOptions) {
                productVariants(options: $options) {
                    items {
                        id
                        name
                        sku
                        enabled
                        stockOnHand
                        product {
                            name
                            featuredAsset {
                                id
                                preview
                            }
                        }
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
        placeholder: i18n.t('Search product variants...'),
        buildSearchFilter: (term: string) => ({
            name: { contains: term },
        }),
        label: (item: any) => (
            <div className="flex items-center gap-3 w-full" title={`${item.product.name} - ${item.name} (SKU: ${item.sku})`}>
                <div className="w-8 h-8 rounded overflow-hidden bg-muted flex-shrink-0">
                    {item.featuredAsset?.preview || item.product.featuredAsset?.preview ? (
                        <img
                            src={
                                (item.featuredAsset?.preview || item.product.featuredAsset?.preview) +
                                '?preset=thumb'
                            }
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <PlaceholderIcon letter="V" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                        {item.product.name} - {item.name}
                        {!item.enabled && <span className="ml-2 text-orange-600 text-xs">• Disabled</span>}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                        SKU: {item.sku} • Stock: {item.stockOnHand ?? 0}
                    </div>
                </div>
            </div>
        ),
    }),

    Collection: createRelationSelectorConfig({
        listQuery: graphql(`
            query GetCollectionsForRelationSelector($options: CollectionListOptions) {
                collections(options: $options) {
                    items {
                        id
                        name
                        slug
                        isPrivate
                        position
                        productVariants {
                            totalItems
                        }
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
        placeholder: i18n.t('Search collections...'),
        buildSearchFilter: (term: string) => ({
            name: { contains: term },
        }),
        label: (item: any) => (
            <div className="flex items-center gap-3 w-full" title={`${item.name} (${item.slug})`}>
                <div className="w-8 h-8 rounded overflow-hidden bg-muted flex-shrink-0">
                    {item.featuredAsset?.preview ? (
                        <img
                            src={item.featuredAsset.preview + '?preset=thumb'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <PlaceholderIcon letter="C" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                        {item.name}
                        {item.isPrivate && <span className="ml-2 text-orange-600 text-xs">• Private</span>}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                        {item.slug} • {item.productVariants?.totalItems || 0} products
                    </div>
                </div>
            </div>
        ),
    }),

    Facet: createRelationSelectorConfig({
        listQuery: graphql(`
            query GetFacetsForRelationSelector($options: FacetListOptions) {
                facets(options: $options) {
                    items {
                        id
                        name
                        code
                        isPrivate
                        valueList {
                            totalItems
                        }
                    }
                    totalItems
                }
            }
        `),
        idKey: 'id' as const,
        labelKey: 'name' as const,
        placeholder: i18n.t('Search facets...'),
        buildSearchFilter: (term: string) => ({
            name: { contains: term },
        }),
        label: (item: any) => (
            <div className="flex items-center gap-3 w-full" title={`${item.name} (${item.code})`}>
                <div className="w-8 h-8 rounded flex-shrink-0">
                    <PlaceholderIcon letter="F" rounded />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                        {item.name}
                        {item.isPrivate && <span className="ml-2 text-orange-600 text-xs">• Private</span>}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                        {item.code} • {item.valueList?.totalItems || 0} values
                    </div>
                </div>
            </div>
        ),
    }),

    FacetValue: createRelationSelectorConfig({
        listQuery: graphql(`
            query GetFacetValuesForRelationSelector($options: FacetValueListOptions) {
                facetValues(options: $options) {
                    items {
                        id
                        name
                        code
                        facet {
                            name
                            code
                        }
                    }
                    totalItems
                }
            }
        `),
        idKey: 'id' as const,
        labelKey: 'name' as const,
        placeholder: i18n.t('Search facet values...'),
        buildSearchFilter: (term: string) => ({
            name: { contains: term },
        }),
        label: (item: any) => (
            <div className="flex items-center gap-3 w-full" title={`${item.facet.name}: ${item.name} (${item.code})`}>
                <div className="w-8 h-8 rounded flex-shrink-0">
                    <PlaceholderIcon letter="FV" rounded />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.name}</div>
                    <div className="text-sm text-muted-foreground truncate">
                        {item.facet.name} • {item.code}
                    </div>
                </div>
            </div>
        ),
    }),

    Asset: createRelationSelectorConfig({
        listQuery: graphql(`
            query GetAssetsForRelationSelector($options: AssetListOptions) {
                assets(options: $options) {
                    items {
                        id
                        name
                        preview
                        source
                        mimeType
                        fileSize
                        width
                        height
                    }
                    totalItems
                }
            }
        `),
        idKey: 'id' as const,
        labelKey: 'name' as const,
        placeholder: i18n.t('Search assets...'),
        buildSearchFilter: (term: string) => ({
            name: { contains: term },
        }),
        label: (item: any) => (
            <div className="flex items-center gap-3 w-full" title={`${item.name} (${item.mimeType}${item.width && item.height ? `, ${item.width}×${item.height}` : ''}${item.fileSize ? `, ${Math.round(item.fileSize / 1024)}KB` : ''})`}>
                <div className="w-8 h-8 rounded overflow-hidden bg-muted flex-shrink-0">
                    <img
                        src={item.preview + '?preset=thumb'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.name}</div>
                    <div className="text-sm text-muted-foreground truncate">
                        {item.mimeType}
                        {item.width && item.height && ` • ${item.width}×${item.height}`}
                        {item.fileSize && ` • ${Math.round(item.fileSize / 1024)}KB`}
                    </div>
                </div>
            </div>
        ),
    }),

    Order: createRelationSelectorConfig({
        listQuery: graphql(`
            query GetOrdersForRelationSelector($options: OrderListOptions) {
                orders(options: $options) {
                    items {
                        id
                        code
                        state
                        totalWithTax
                        currencyCode
                        orderPlacedAt
                        customer {
                            firstName
                            lastName
                            emailAddress
                        }
                    }
                    totalItems
                }
            }
        `),
        idKey: 'id' as const,
        labelKey: 'code' as const,
        placeholder: i18n.t('Search orders...'),
        buildSearchFilter: (term: string) => ({
            code: { contains: term },
        }),
        label: (item: any) => (
            <div className="flex items-center gap-3 w-full" title={`${item.code} - ${item.customer?.firstName} ${item.customer?.lastName} (${item.totalWithTax / 100} ${item.currencyCode})`}>
                <div className="w-8 h-8 rounded flex-shrink-0">
                    <PlaceholderIcon letter="O" rounded />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                        {item.code}
                        <span
                            className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                                item.state === 'Delivered'
                                    ? 'bg-green-100 text-green-700'
                                    : item.state === 'Cancelled'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-blue-100 text-blue-700'
                            }`}
                        >
                            {item.state}
                        </span>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                        {item.customer?.firstName} {item.customer?.lastName} • {item.totalWithTax / 100}{' '}
                        {item.currencyCode}
                    </div>
                </div>
            </div>
        ),
    }),

    // OrderLine: Not available as a list query in the admin API, fallback to basic input

    ShippingMethod: createRelationSelectorConfig({
        listQuery: graphql(`
            query GetShippingMethodsForRelationSelector($options: ShippingMethodListOptions) {
                shippingMethods(options: $options) {
                    items {
                        id
                        name
                        code
                        description
                        fulfillmentHandlerCode
                    }
                    totalItems
                }
            }
        `),
        idKey: 'id' as const,
        labelKey: 'name' as const,
        placeholder: i18n.t('Search shipping methods...'),
        buildSearchFilter: (term: string) => ({
            name: { contains: term },
        }),
        label: (item: any) => (
            <div className="flex items-center gap-3 w-full" title={`${item.name} (${item.code})`}>
                <div className="w-8 h-8 rounded flex-shrink-0">
                    <PlaceholderIcon letter="S" rounded />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.name}</div>
                    <div className="text-sm text-muted-foreground truncate">
                        {item.code} • {item.fulfillmentHandlerCode}
                    </div>
                </div>
            </div>
        ),
    }),

    PaymentMethod: createRelationSelectorConfig({
        listQuery: graphql(`
            query GetPaymentMethodsForRelationSelector($options: PaymentMethodListOptions) {
                paymentMethods(options: $options) {
                    items {
                        id
                        name
                        code
                        description
                        enabled
                        handler {
                            code
                        }
                    }
                    totalItems
                }
            }
        `),
        idKey: 'id' as const,
        labelKey: 'name' as const,
        placeholder: i18n.t('Search payment methods...'),
        buildSearchFilter: (term: string) => ({
            name: { contains: term },
        }),
        label: (item: any) => (
            <div className="flex items-center gap-3 w-full" title={`${item.name} (${item.code})`}>
                <div className="w-8 h-8 rounded flex-shrink-0">
                    <PlaceholderIcon letter="P" rounded />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                        {item.name}
                        {!item.enabled && <span className="ml-2 text-orange-600 text-xs">• Disabled</span>}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                        {item.code} • {item.handler?.code}
                    </div>
                </div>
            </div>
        ),
    }),

    Channel: createRelationSelectorConfig({
        listQuery: graphql(`
            query GetChannelsForRelationSelector($options: ChannelListOptions) {
                channels(options: $options) {
                    items {
                        id
                        code
                        token
                        defaultLanguageCode
                        currencyCode
                        pricesIncludeTax
                    }
                    totalItems
                }
            }
        `),
        idKey: 'id' as const,
        labelKey: 'code' as const,
        placeholder: i18n.t('Search channels...'),
        buildSearchFilter: (term: string) => ({
            code: { contains: term },
        }),
        label: (item: any) => (
            <div className="flex items-center gap-3 w-full" title={`${item.code} (${item.defaultLanguageCode}, ${item.currencyCode})`}>
                <div className="w-8 h-8 rounded flex-shrink-0">
                    <PlaceholderIcon letter="CH" rounded />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.code}</div>
                    <div className="text-sm text-muted-foreground truncate">
                        {item.defaultLanguageCode} • {item.currencyCode} •{' '}
                        {item.pricesIncludeTax ? 'Inc. Tax' : 'Ex. Tax'}
                    </div>
                </div>
            </div>
        ),
    }),

    Promotion: createRelationSelectorConfig({
        listQuery: graphql(`
            query GetPromotionsForRelationSelector($options: PromotionListOptions) {
                promotions(options: $options) {
                    items {
                        id
                        name
                        couponCode
                        enabled
                        startsAt
                        endsAt
                    }
                    totalItems
                }
            }
        `),
        idKey: 'id' as const,
        labelKey: 'name' as const,
        placeholder: i18n.t('Search promotions...'),
        buildSearchFilter: (term: string) => ({
            name: { contains: term },
        }),
        label: (item: any) => (
            <div className="flex items-center gap-3 w-full" title={`${item.name}${item.couponCode ? ` (${item.couponCode})` : ''}`}>
                <div className="w-8 h-8 rounded flex-shrink-0">
                    <PlaceholderIcon letter="PR" rounded />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                        {item.name}
                        {!item.enabled && <span className="ml-2 text-orange-600 text-xs">• Disabled</span>}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                        {item.couponCode && `${item.couponCode} • `}
                        {item.startsAt && `Starts: ${new Date(item.startsAt).toLocaleDateString()}`}
                        {item.endsAt && ` • Ends: ${new Date(item.endsAt).toLocaleDateString()}`}
                    </div>
                </div>
            </div>
        ),
    }),
});

interface DefaultRelationInputProps {
    fieldDef: RelationCustomFieldConfig;
    field: ControllerRenderProps<any, any>;
    disabled?: boolean;
}

export function DefaultRelationInput({ fieldDef, field, disabled }: DefaultRelationInputProps) {
    const { i18n } = useLingui();
    const entityName = fieldDef.entity;
    const ENTITY_CONFIGS = createEntityConfigs(i18n);
    const config = ENTITY_CONFIGS[entityName as keyof typeof ENTITY_CONFIGS];

    if (!config) {
        // Fallback to plain input if entity type not found
        console.warn(`No relation selector config found for entity: ${entityName}`);
        return (
            <input
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                name={field.name}
                disabled={disabled}
                placeholder={`Enter ${entityName} ID`}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
        );
    }

    const isList = fieldDef.list ?? false;

    if (isList) {
        return (
            <MultiRelationInput
                value={field.value ?? []}
                onChange={field.onChange}
                config={config}
                disabled={disabled}
                selectorLabel={<Trans>Select {entityName.toLowerCase()}s</Trans>}
            />
        );
    } else {
        return (
            <SingleRelationInput
                value={field.value ?? ''}
                onChange={field.onChange}
                config={config}
                disabled={disabled}
                selectorLabel={<Trans>Select {entityName.toLowerCase()}</Trans>}
            />
        );
    }
}
