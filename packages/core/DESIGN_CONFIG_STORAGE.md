Design doc created after some back and forth with Claude Code.

All the details are not 100%, but the general direction is there as a good basis:

## Core Components

### Settings Store Field definition

```ts
// Simplified field configuration for MVP
interface SettingsStoreFieldConfig {
    name: string;
    scope?: SettingsStoreScopeFunction; // Defaults to SettingsStoreScopes.global
    public?: boolean;      // Available via Shop API
    readonly?: boolean;    // Cannot be modified via GraphQL API
    requiresPermission?: Array<Permission | string> | Permission | string;
    validate?: (
        value: any,
        injector: Injector,
        ctx: RequestContext,
    ) => string | LocalizedString[] | void | Promise<string | LocalizedString[] | void>;
}

// Registration interface for plugins
interface SettingsStoreRegistration {
    namespace: string; // e.g., 'dashboard', 'payment', 'shipping'
    fields: SettingsStoreFieldConfig[];
}

// Scope function type - returns string to append to key for scoping
// E.g. to store settings for the active user
type SettingsStoreScopeFunction = (params: {
    key: string;
    value?: any;
    ctx: RequestContext;
}) => string;


// Pre-made scope functions
export const SettingsStoreScopes = {
    global: (): string => '',
    user: ({ ctx }: { ctx: RequestContext }): string => ctx.activeUserId || '',
    channel: ({ ctx }: { ctx: RequestContext }): string => ctx.channelId || '',
    userAndChannel: ({ ctx }: { ctx: RequestContext }): string =>
        `${ctx.activeUserId || ''}:${ctx.channelId || ''}`
};
```

### Storage

Single TypeORM entity handles all storage needs:

**Benefits:**

- ✅ Single table design - simple and efficient
- ✅ Built-in TypeORM integration with existing Vendure patterns
- ✅ Automatic unique constraint handling for scoped keys
- ✅ JSON serialization handled transparently
- ✅ Standard Vendure entity lifecycle (timestamps, etc.)
-

```typescript
// TypeORM Entity for storage
@Entity()
export class SettingsStoreEntry extends VendureEntity {

    @Index()
    @Column()
    key: string;

    @Column('json', { nullable: true })
    value: JSONCompatible<any> | null; // JSON-serialized value

    @Index()
    @Column({ nullable: true })
    scopeKey: string | null; // Result of scope function

    // Unique constraint for key + scopeKey combination
@Index('key_scope_unique', ['key', 'scopeKey'], { unique: true })
}
```

## 🔧 **API Design**

### Service Interface

Simplified service interface for MVP:

```typescript

@Injectable()
export class SettingsStoreService {
    /**
     * Register key-value fields (typically called during VendureConfig processing)
     */
    register(registration: SettingsStoreRegistration): void;

    /**
     * Get value with automatic scoping and permission check
     * Returns undefined if key doesn't exist or user lacks permission
     */
    async get<T = any>(key: string, ctx: RequestContext): Promise<T | undefined>;

    /**
     * Set value with automatic scoping and permission check
     * Value must be JSON-serializable
     */
    async set<T = any>(key: string, value: T, ctx: RequestContext): Promise<void>;

    /**
     * Get multiple values efficiently
     */
    async getMany(keys: string[], ctx: RequestContext): Promise<Record<string, any>>;

    /**
     * Set multiple values in a transaction
     */
    async setMany(values: Record<string, any>, ctx: RequestContext): Promise<void>;

    /**
     * Get field definition for a key
     */
    getFieldDefinition(key: string): SettingsStoreFieldConfig | undefined;

    /**
     * Validate a value against its field definition
     */
    async validateValue(
        key: string,
        value: any,
        ctx: RequestContext
    ): Promise<string | LocalizedString[] | void>;
}
```

### Plugin Integration

Plugin registration via VendureConfig:

```typescript
// Dashboard plugin registration for user-specific UI settings
@VendurePlugin({
    // ... other plugin config
    configuration: (config: VendureConfig) => {
        // Register key-value fields via main VendureConfig
        config.settingsStoreFields = {
            ...config.settingsStoreFields,
            dashboard: [
                {
                    name: 'theme',
                    scope: SettingsStoreScopes.user,
                    public: true,
                    requiresPermission: [Permission.Authenticated],
                    validate: (value) => {
                        if (!['light', 'dark', 'auto'].includes(value)) {
                            return 'Theme must be light, dark, or auto';
                        }
                    }
                },
                {
                    name: 'tableFilters',
                    scope: SettingsStoreScopes.userAndChannel, // User-specific per channel
                    public: true,
                    requiresPermission: [Permission.Authenticated]
                },
                {
                    name: 'visibleColumns',
                    scope: SettingsStoreScopes.user,
                    public: true,
                    requiresPermission: [Permission.Authenticated]
                },
                {
                    name: 'notifications',
                    scope: SettingsStoreScopes.user,
                    public: true,
                    requiresPermission: [Permission.Authenticated]
                }
            ]
        };
        return config;
    }
})
export class DashboardPlugin {
    // Plugin implementation...
}
```

### GraphQL Schema

Simplified generic GraphQL schema:

```graphql
# Simplified field definition for MVP
type SettingsStoreFieldDefinition {
    name: String!
    public: Boolean!
    readonly: Boolean!
    requiresPermission: [Permission!]
}

# Generic input/output types using JSON
input SettingsStoreInput {
    key: String!
    value: JSON!
}

# Generic queries and mutations
extend type Query {
    """
    Get value for a specific key (automatically scoped)
    """
    getSettingsStoreValue(key: String!): JSON

    """
    Get multiple settings store pairs (each automatically scoped)
    """
    getSettingsStoreValues(keys: [String!]!): JSON
}

extend type Mutation {
    """
    Set a single settings store pair (automatically scoped)
    """
    setSettingsStoreValue(input: SettingsStoreInput!): Boolean!

    """
    Set multiple settings store pairs in a transaction (each automatically scoped)
    """
    setSettingsStoreValues(inputs: [SettingsStoreInput!]!): Boolean!
}
```

### Plugin Usage with Generic GraphQL API

Any plugin can use these generic operations:

```typescript
// Save user preference - automatically scoped to user
const SAVE_THEME = gql`
    mutation SaveTheme($key: String!, $value: JSON!) {
        setSettingsStoreValue(input: { key: $key, value: $value })
    }
`;

await adminClient.query(SAVE_THEME, {
    variables: { key: 'dashboard.theme', value: 'dark' }
});

// Get multiple settings efficiently
const GET_SETTINGS = gql`
    query GetSettings($keys: [String!]!) {
        getSettingsStoreValues(keys: $keys)
    }
`;

const result = await adminClient.query(GET_SETTINGS, {
    variables: { keys: ['dashboard.theme', 'dashboard.tableFilters'] }
});

// Result: { dashboard.theme: 'dark', dashboard.tableFilters: {...} }
```

## 🔒 **Security & Permissions**

### Permission Model

Simplified permission checking for MVP:

```typescript
// Permission checking based on field configuration (similar to custom fields)
export function userHasSettingsStorePermission(
    ctx: RequestContext,
    fieldDef: SettingsStoreFieldConfig
): boolean {
    // Shop API: only public fields
    if (ctx.apiType === 'shop' && fieldDef.public === true) {
        return true;
    }

    // Admin API: check required permissions
    const requiredPermissions = fieldDef.requiresPermission ?? [];
    if (requiredPermissions.length > 0) {
        return ctx.userHasPermissions(requiredPermissions);
    }

    // For fields without explicit permissions, require basic authentication
    // More granular permission logic can be implemented based on scope function behavior
    return ctx.isAuthorized();
}
```

## 🚀 **Implementation Plan**

### MVP (v3.4.0) - Core Settings Store

- [x] Create `SettingsStoreEntry` TypeORM entity with `scope` column
- [x] Implement `SettingsStoreService` with basic CRUD operations
- [x] Add flexible scoping logic using scope functions
- [x] Implement pre-made scope functions (`global`, `user`, `channel`, `userAndChannel`)
- [x] Add permission checking with `requiresPermission` support
- [x] Create GraphQL schema and resolvers
- [x] Add `settingsStoreFields` property to VendureConfig
- [x] Process `settingsStoreFields` during config initialization
- [x] JSON serialization/deserialization
- [x] Basic validation support

### Future Enhancements

- [ ] Type safe inputs and return types, like with custom fields
- [ ] Admin UI components
- [ ] Advanced validation and type safety

## 🎨 **Usage Examples**

### User-Specific Dashboard Settings

```typescript
// 1. Register dashboard fields via VendureConfig
const config: VendureConfig = {
    // ... other config
    settingsStoreFields: {
        dashboard: [
            {
                name: 'theme',
                scope: SettingsStoreScopes.user,
                public: true,
                requiresPermission: [Permission.Authenticated],
                validate: (value) => {
                    if (!['light', 'dark', 'auto'].includes(value)) {
                        return 'Theme must be light, dark, or auto';
                    }
                }
            }
        ]
    }
};

// 2. Save user preference - automatically scoped to current user
await settingsStoreService.set('dashboard.theme', 'dark', ctx);

// 3. Retrieve on dashboard load - automatically scoped to current user  
const userTheme = await settingsStoreService.get('dashboard.theme', ctx);

// 4. Update via generic GraphQL mutation
mutation
{
    setSettingsStoreValue(input
:
    {
        key: "dashboard.theme"
        value: "dark"
    }
)
}
```

### Complex Data Storage

```typescript
// Save complex JSON data - all JSON-serializable
const tableFilters = {
    productList: {
        categories: ['electronics'],
        priceRange: { min: 100, max: 500 },
        inStock: true
    },
    orderList: {
        status: ['PaymentSettled', 'PartiallyFulfilled'],
        dateRange: { start: '2024-01-01', end: '2024-12-31' }
    }
};

await settingsStoreService.set('dashboard.tableFilters', tableFilters, ctx);

// Retrieve complex data
const savedFilters = await settingsStoreService.get<typeof tableFilters>('dashboard.tableFilters', ctx);
```

### Mixed Scoping Example

```typescript
// Register fields with different scopes via VendureConfig
const config: VendureConfig = {
    settingsStoreFields: {
        app: [
            {
                name: 'userTheme',
                scope: SettingsStoreScopes.user,
                public: true,
                requiresPermission: [Permission.Authenticated]
            },
            {
                name: 'channelCurrency',
                scope: SettingsStoreScopes.channel,
                public: false,
                requiresPermission: [Permission.ReadSettings]
            },
            {
                name: 'maintenanceMode',
                scope: SettingsStoreScopes.global,
                public: false,
                requiresPermission: [Permission.SuperAdmin]
            }
        ]
    }
};

// Each key is automatically scoped when accessed
const userTheme = await settingsStoreService.get('app.userTheme', ctx);         // User-scoped
const currency = await settingsStoreService.get('app.channelCurrency', ctx);    // Channel-scoped  
const maintenance = await settingsStoreService.get('app.maintenanceMode', ctx); // Global
```

### Advanced Scoping Examples

```typescript
// User AND channel specific settings (same user, different channels)
const config: VendureConfig = {
    settingsStoreFields: {
        dashboard: [
            {
                name: 'tableFilters',
                scope: SettingsStoreScopes.userAndChannel, // User-specific per channel
                public: true,
                requiresPermission: [Permission.Authenticated]
            }
        ]
    }
};

// Custom scope function example
const customDateBasedScope: SettingsStoreScopeFunction = ({ ctx }) => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    return `${ctx.activeUserId || ''}:${now.getFullYear()}Q${quarter}`;
};

// Register field with custom scoping
const config: VendureConfig = {
    settingsStoreFields: {
        analytics: [
            {
                name: 'quarterlyTargets',
                scope: customDateBasedScope, // Custom quarterly user-specific scope
                public: false,
                requiresPermission: [Permission.UpdateSettings]
            }
        ]
    }
};
```
