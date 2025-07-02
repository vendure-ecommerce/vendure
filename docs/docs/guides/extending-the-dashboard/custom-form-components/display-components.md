---
title: 'Display Components'
---

Display components allow you to customize how data is displayed in readonly contexts throughout the dashboard. They are used in tables, detail views, form previews, and other places where data needs to be visualized but not edited.

## How Display Components Work

Display components are targeted to specific locations using the same targeting system as input components:

- **pageId**: The page where the component should appear (e.g., 'product-detail', 'order-list')
- **blockId**: The specific section within that page (e.g., 'product-info', 'order-table')
- **field**: The field whose display should be customized (e.g., 'status', 'price', 'createdAt')

When data for a matching field is displayed, your custom display component will be used instead of the default text display.

## Basic Display Component

Display components receive the `value` to display and may receive additional context:

```tsx title="src/plugins/my-plugin/dashboard/components/status-badge.tsx"
import { Badge, DataDisplayComponentProps } from '@vendure/dashboard';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

export function StatusBadgeComponent({ value }: DataDisplayComponentProps) {
    const getStatusConfig = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'approved':
            case 'completed':
                return {
                    variant: 'default' as const,
                    icon: CheckCircle,
                    className: 'bg-green-100 text-green-800 border-green-200',
                };
            case 'pending':
            case 'processing':
                return {
                    variant: 'secondary' as const,
                    icon: Clock,
                    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                };
            case 'cancelled':
            case 'rejected':
                return {
                    variant: 'destructive' as const,
                    icon: XCircle,
                    className: 'bg-red-100 text-red-800 border-red-200',
                };
            default:
                return {
                    variant: 'outline' as const,
                    icon: AlertCircle,
                    className: 'bg-gray-100 text-gray-800 border-gray-200',
                };
        }
    };

    const config = getStatusConfig(value);
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className={`flex items-center gap-1 ${config.className}`}>
            <Icon className="h-3 w-3" />
            {value || 'Unknown'}
        </Badge>
    );
}
```

## Registration and Targeting

Register your display component and specify where it should be used:

```tsx title="src/plugins/my-plugin/dashboard/index.tsx"
import { defineDashboardExtension } from '@vendure/dashboard';
import { StatusBadgeComponent } from './components/status-badge';
import { PriceDisplayComponent } from './components/price-display';
import { DateTimeDisplayComponent } from './components/datetime-display';

export default defineDashboardExtension({
    customFormComponents: {
        displays: [
            {
                pageId: 'order-detail',
                blockId: 'order-summary',
                field: 'state',
                component: StatusBadgeComponent,
            },
            {
                pageId: 'product-list',
                blockId: 'product-table',
                field: 'price',
                component: PriceDisplayComponent,
            },
            {
                pageId: 'order-list',
                blockId: 'order-table',
                field: 'orderPlacedAt',
                component: DateTimeDisplayComponent,
            },
        ],
    },
});
```

## Advanced Examples

### Enhanced Price Display

```tsx title="src/plugins/my-plugin/dashboard/components/price-display.tsx"
import { Badge, DataDisplayComponentProps } from '@vendure/dashboard';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriceDisplayProps extends DataDisplayComponentProps {
    // Additional context that might be passed
    currency?: string;
    originalPrice?: number;
    comparisonPrice?: number;
}

export function PriceDisplayComponent({
    value,
    currency = 'USD',
    originalPrice,
    comparisonPrice,
}: PriceDisplayProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(price / 100); // Assuming prices are stored in cents
    };

    const getDiscountInfo = () => {
        if (!originalPrice || originalPrice <= value) return null;

        const discountPercent = Math.round(((originalPrice - value) / originalPrice) * 100);
        return {
            percent: discountPercent,
            amount: originalPrice - value,
        };
    };

    const getTrendInfo = () => {
        if (!comparisonPrice) return null;

        const change = value - comparisonPrice;
        const changePercent = Math.round((change / comparisonPrice) * 100);

        return {
            change,
            changePercent,
            trend: change > 0 ? 'up' : change < 0 ? 'down' : 'same',
        };
    };

    const discount = getDiscountInfo();
    const trend = getTrendInfo();

    return (
        <div className="flex items-center gap-2">
            <span className="font-medium">{formatPrice(value)}</span>

            {discount && (
                <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(originalPrice!)}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                        -{discount.percent}%
                    </Badge>
                </div>
            )}

            {trend && trend.trend !== 'same' && (
                <Badge
                    variant={trend.trend === 'up' ? 'default' : 'secondary'}
                    className={`flex items-center gap-1 text-xs ${
                        trend.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                    {trend.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3" />
                    ) : (
                        <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(trend.changePercent)}%
                </Badge>
            )}
        </div>
    );
}
```

### Rich Date/Time Display

```tsx title="src/plugins/my-plugin/dashboard/components/datetime-display.tsx"
import { Badge, DataDisplayComponentProps } from '@vendure/dashboard';
import { Calendar, Clock, Users } from 'lucide-react';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';

interface DateTimeDisplayProps extends DataDisplayComponentProps {
    showRelative?: boolean;
    showTime?: boolean;
    showTimezone?: boolean;
}

export function DateTimeDisplayComponent({
    value,
    showRelative = true,
    showTime = true,
    showTimezone = false,
}: DateTimeDisplayProps) {
    if (!value) return <span className="text-muted-foreground">-</span>;

    const date = value instanceof Date ? value : new Date(value);

    // Handle invalid dates
    if (isNaN(date.getTime())) {
        return <span className="text-destructive">Invalid date</span>;
    }

    const formatAbsolute = () => {
        if (showTime) {
            return format(date, showTimezone ? 'MMM d, yyyy HH:mm zzz' : 'MMM d, yyyy HH:mm');
        }
        return format(date, 'MMM d, yyyy');
    };

    const formatRelative = () => {
        if (isToday(date)) {
            return `Today at ${format(date, 'HH:mm')}`;
        }
        if (isYesterday(date)) {
            return `Yesterday at ${format(date, 'HH:mm')}`;
        }
        return formatDistanceToNow(date, { addSuffix: true });
    };

    const getDateBadge = () => {
        const now = new Date();
        const diffHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffHours < 1) {
            return { label: 'Just now', variant: 'default' as const, icon: Clock };
        }
        if (diffHours < 24) {
            return { label: 'Recent', variant: 'secondary' as const, icon: Clock };
        }
        if (diffHours < 168) {
            // 1 week
            return { label: 'This week', variant: 'outline' as const, icon: Calendar };
        }
        return null;
    };

    const badge = getDateBadge();

    return (
        <div className="flex items-center gap-2">
            <div className="flex flex-col">
                <span className="text-sm font-medium">
                    {showRelative ? formatRelative() : formatAbsolute()}
                </span>
                {showRelative && <span className="text-xs text-muted-foreground">{formatAbsolute()}</span>}
            </div>

            {badge && (
                <Badge variant={badge.variant} className="flex items-center gap-1 text-xs">
                    <badge.icon className="h-3 w-3" />
                    {badge.label}
                </Badge>
            )}
        </div>
    );
}
```

### Image/Avatar Display

```tsx title="src/plugins/my-plugin/dashboard/components/avatar-display.tsx"
import { Avatar, AvatarFallback, AvatarImage, Badge, DataDisplayComponentProps } from '@vendure/dashboard';
import { User, Users, Building } from 'lucide-react';

interface AvatarDisplayProps extends DataDisplayComponentProps {
    name?: string;
    type?: 'user' | 'customer' | 'admin' | 'system';
    size?: 'sm' | 'md' | 'lg';
    showStatus?: boolean;
    isOnline?: boolean;
}

export function AvatarDisplayComponent({
    value,
    name,
    type = 'user',
    size = 'md',
    showStatus = false,
    isOnline = false,
}: AvatarDisplayProps) {
    const getInitials = (name?: string) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'h-6 w-6 text-xs';
            case 'lg':
                return 'h-12 w-12 text-lg';
            default:
                return 'h-8 w-8 text-sm';
        }
    };

    const getTypeIcon = () => {
        switch (type) {
            case 'admin':
                return Users;
            case 'system':
                return Building;
            default:
                return User;
        }
    };

    const TypeIcon = getTypeIcon();

    return (
        <div className="flex items-center gap-2">
            <div className="relative">
                <Avatar className={getSizeClasses()}>
                    <AvatarImage src={value} alt={name || 'Avatar'} />
                    <AvatarFallback>
                        {name ? getInitials(name) : <TypeIcon className="h-4 w-4" />}
                    </AvatarFallback>
                </Avatar>

                {showStatus && (
                    <div
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
                            isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                    />
                )}
            </div>

            {name && (
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{name}</span>
                    {type !== 'user' && (
                        <Badge variant="outline" className="text-xs w-fit">
                            {type}
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
```

### Progress/Percentage Display

```tsx title="src/plugins/my-plugin/dashboard/components/progress-display.tsx"
import { Progress, Badge, DataDisplayComponentProps } from '@vendure/dashboard';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface ProgressDisplayProps extends DataDisplayComponentProps {
    total?: number;
    current?: number;
    label?: string;
    showPercent?: boolean;
}

export function ProgressDisplayComponent({
    value,
    total,
    current,
    label,
    showPercent = true,
}: ProgressDisplayProps) {
    const percentage = Math.max(0, Math.min(100, value));

    const getStatusConfig = (percent: number) => {
        if (percent >= 100) {
            return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-500' };
        }
        if (percent >= 75) {
            return { icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-500' };
        }
        if (percent >= 25) {
            return { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
        }
        return { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-500' };
    };

    const status = getStatusConfig(percentage);
    const Icon = status.icon;

    return (
        <div className="flex items-center gap-3 min-w-[200px]">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                        <Icon className={`h-3 w-3 ${status.color}`} />
                        {label && <span className="text-xs text-muted-foreground">{label}</span>}
                    </div>
                    <div className="text-xs font-medium">
                        {showPercent && `${Math.round(percentage)}%`}
                        {total && current && ` (${current}/${total})`}
                    </div>
                </div>
                <Progress value={percentage} className="h-2" />
            </div>

            {percentage >= 100 && (
                <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                    Complete
                </Badge>
            )}
        </div>
    );
}
```

## Common Display Patterns

### Table Display Components

For data table contexts, keep components compact and scannable:

```tsx
// Good: Compact status indicator
<Badge variant="outline" className="text-xs">Active</Badge>

// Good: Abbreviated date
<span className="text-xs text-muted-foreground">
    {format(date, 'MMM d')}
</span>

// Avoid: Large, complex components in table cells
```

### Detail View Components

For detail pages, you can use richer, more informative displays:

```tsx
// Good: Rich information display
<div className="space-y-2">
    <div className="flex items-center gap-2">
        <StatusIcon />
        <span className="font-medium">{status}</span>
        <Badge>{category}</Badge>
    </div>
    <p className="text-sm text-muted-foreground">{description}</p>
</div>
```

### List Item Components

For list contexts, balance information density with readability:

```tsx
// Good: Inline information with clear hierarchy
<div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
        <Avatar size="sm" />
        <span>{name}</span>
    </div>
    <Badge variant="outline">{status}</Badge>
</div>
```

## Component Props

Display components receive these standard props through the `DataDisplayComponentProps` interface:

```tsx
import { DataDisplayComponentProps } from '@vendure/dashboard';

// The DataDisplayComponentProps interface provides:
interface DataDisplayComponentProps {
    value: any; // The value to display
    [key: string]: any; // Additional props that may be passed
}

// Common additional props that may be available:
// - fieldName?: string         // The name of the field
// - entityType?: string        // Type of entity being displayed
// - entityId?: string          // ID of the entity
// - compact?: boolean          // Whether to show compact version
// - interactive?: boolean      // Whether component should be interactive
// - metadata?: Record<string, any> // Additional data for complex displays
```

## Best Practices

1. **Keep it readable**: Display components should enhance readability, not complicate it
2. **Use appropriate sizing**: Match the context (table cell vs detail view vs list item)
3. **Handle null/undefined values**: Always provide fallbacks for missing data
4. **Use dashboard design tokens**: Stick to the established color palette and spacing
5. **Consider loading states**: Show skeletons or placeholders when data is loading
6. **Make it accessible**: Use proper ARIA labels and semantic HTML
7. **Optimize for scanning**: In table contexts, make information quickly scannable

## Finding Display Contexts

Common contexts where display components are used:

### Data Tables

```tsx
pageId: 'product-list';
blockId: 'product-table';
// Fields: name, sku, price, stock, status, createdAt
```

### Detail Views

```tsx
pageId: 'order-detail';
blockId: 'order-summary';
// Fields: code, state, total, customer, orderPlacedAt
```

### List Components

```tsx
pageId: 'customer-list';
blockId: 'customer-list';
// Fields: name, email, totalOrders, lastOrderDate
```

:::tip Performance
Display components may be rendered many times in table contexts. Keep them lightweight and avoid expensive calculations or API calls in the render function.
:::

:::note Interactivity
Display components are primarily for data visualization. If you need interactive elements, consider whether an input component or action bar item might be more appropriate.
:::

:::warning Context Awareness
Display components should adapt to their context. A component used in a table should be more compact than the same component used in a detail view.
:::

## Related Guides

- **[Custom Form Elements Overview](./index)** - Learn about the unified system for custom field components, input components, and display components
- **[Input Components](./input-components)** - Create custom input controls for forms with specialized functionality
- **[Component Targeting Guide](./targeting-guide)** - Master the targeting system to precisely control where your components appear
