---
title: 'Input Components'
---

Input components allow you to replace specific input fields in existing dashboard forms with custom implementations. They provide a way to enhance the user experience by offering specialized input controls for particular data types or use cases.

## How Input Components Work

Input components are targeted to specific locations in the dashboard using three identifiers:

- **pageId**: The page where the component should appear (e.g., 'product-detail', 'customer-detail')
- **blockId**: The form block within that page (e.g., 'product-form', 'customer-info')
- **field**: The specific field to replace (e.g., 'price', 'email', 'description')

When a form renders a field that matches these criteria, your custom input component will be used instead of the default input.

## Registration Method

Input components are registered by co-locating them with detail form definitions. This approach is consistent and avoids repeating the `pageId`. You can also include display components in the same definition:

```tsx title="src/plugins/my-plugin/dashboard/index.tsx"
import { defineDashboardExtension } from '@vendure/dashboard';
import {
    DescriptionInputComponent,
    PriceInputComponent,
    SlugInputComponent,
    StatusDisplay,
} from './components';

export default defineDashboardExtension({
    detailForms: [
        {
            pageId: 'product-variant-detail',
            inputs: [
                {
                    blockId: 'main-form',
                    field: 'description',
                    component: DescriptionInputComponent,
                },
            ],
            displays: [
                {
                    blockId: 'main-form',
                    field: 'status',
                    component: StatusDisplay,
                },
            ],
        },
        {
            pageId: 'product-detail',
            inputs: [
                {
                    blockId: 'product-form',
                    field: 'price',
                    component: PriceInputComponent,
                },
                {
                    blockId: 'product-form',
                    field: 'slug',
                    component: SlugInputComponent,
                },
            ],
        },
    ],
});
```

## Basic Input Component

Input components receive standard input props with `value`, `onChange`, and other common properties:

```tsx title="src/plugins/my-plugin/dashboard/components/email-input.tsx"
import { Input, Button, DataInputComponentProps } from '@vendure/dashboard';
import { Mail, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function EmailInputComponent({ value, onChange, disabled, placeholder }: DataInputComponentProps) {
    const [isValid, setIsValid] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    useEffect(() => {
        if (value) {
            setIsValid(validateEmail(value));
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        setIsValid(validateEmail(newValue));
    };

    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Mail className="h-4 w-4 text-muted-foreground" />
            </div>

            <Input
                type="email"
                value={value || ''}
                onChange={handleChange}
                disabled={disabled}
                placeholder={placeholder || 'Enter email address'}
                className="pl-10 pr-10"
            />

            {value && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isValid ? (
                        <Check className="h-4 w-4 text-green-500" />
                    ) : (
                        <X className="h-4 w-4 text-red-500" />
                    )}
                </div>
            )}
        </div>
    );
}
```

## Advanced Examples

### Multi-Currency Price Input

```tsx title="src/plugins/my-plugin/dashboard/components/price-input.tsx"
import {
    Input,
    Button,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    DataInputComponentProps,
} from '@vendure/dashboard';
import { useState } from 'react';
import { DollarSign, Euro, Pound, Yen } from 'lucide-react';

export function PriceInputComponent({ value, onChange, disabled }: DataInputComponentProps) {
    const [currency, setCurrency] = useState('USD');

    const currencies = [
        { code: 'USD', symbol: '$', icon: DollarSign, rate: 1 },
        { code: 'EUR', symbol: '€', icon: Euro, rate: 0.85 },
        { code: 'GBP', symbol: '£', icon: Pound, rate: 0.73 },
        { code: 'JPY', symbol: '¥', icon: Yen, rate: 110 },
    ];

    const selectedCurrency = currencies.find(c => c.code === currency) || currencies[0];
    const Icon = selectedCurrency.icon;

    // Convert price based on exchange rate
    const displayValue = value ? (value * selectedCurrency.rate).toFixed(2) : '';

    const handleChange = (displayValue: string) => {
        const numericValue = parseFloat(displayValue) || 0;
        // Convert back to base currency (USD) for storage
        const baseValue = numericValue / selectedCurrency.rate;
        onChange(baseValue);
    };

    return (
        <div className="flex space-x-2">
            <Select value={currency} onValueChange={setCurrency} disabled={disabled}>
                <SelectTrigger className="w-24">
                    <SelectValue>
                        <div className="flex items-center gap-1">
                            <Icon className="h-4 w-4" />
                            {currency}
                        </div>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {currencies.map(curr => {
                        const CurrIcon = curr.icon;
                        return (
                            <SelectItem key={curr.code} value={curr.code}>
                                <div className="flex items-center gap-2">
                                    <CurrIcon className="h-4 w-4" />
                                    {curr.code}
                                </div>
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>

            <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    {selectedCurrency.symbol}
                </span>
                <Input
                    type="number"
                    value={displayValue}
                    onChange={e => handleChange(e.target.value)}
                    disabled={disabled}
                    className="pl-8"
                    placeholder="0.00"
                    step="0.01"
                />
            </div>
        </div>
    );
}
```

### Auto-generating Slug Input

```tsx title="src/plugins/my-plugin/dashboard/components/slug-input.tsx"
import { Input, Button, Switch, DataInputComponentProps } from '@vendure/dashboard';
import { useState, useEffect } from 'react';
import { RefreshCw, Lock, Unlock } from 'lucide-react';

interface SlugInputProps extends DataInputComponentProps {
    // Additional context that might be passed
    formData?: { name?: string; title?: string };
}

export function SlugInputComponent({ value, onChange, disabled, formData }: SlugInputProps) {
    const [autoGenerate, setAutoGenerate] = useState(!value);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim('-'); // Remove leading/trailing hyphens
    };

    useEffect(() => {
        if (autoGenerate && formData?.name) {
            const newSlug = generateSlug(formData.name);
            if (newSlug !== value) {
                onChange(newSlug);
            }
        }
    }, [formData?.name, autoGenerate, onChange, value]);

    const handleManualGenerate = async () => {
        if (!formData?.name) return;

        setIsGenerating(true);
        // Simulate API call for slug validation/generation
        await new Promise(resolve => setTimeout(resolve, 500));

        const newSlug = generateSlug(formData.name);
        onChange(newSlug);
        setIsGenerating(false);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <Input
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    disabled={disabled || autoGenerate}
                    placeholder="product-slug"
                    className="flex-1"
                />

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={disabled || !formData?.name || isGenerating}
                    onClick={handleManualGenerate}
                >
                    <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <Switch checked={autoGenerate} onCheckedChange={setAutoGenerate} disabled={disabled} />
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    {autoGenerate ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    <span>Auto-generate from name</span>
                </div>
            </div>
        </div>
    );
}
```

### Rich Text Input with Toolbar

```tsx title="src/plugins/my-plugin/dashboard/components/rich-text-input.tsx"
import { Button, Card, CardContent, DataInputComponentProps } from '@vendure/dashboard';
import { useState, useRef } from 'react';
import { Bold, Italic, Underline, Link, List, ListOrdered } from 'lucide-react';

export function RichTextInputComponent({ value, onChange, disabled, placeholder }: DataInputComponentProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const formatText = (command: string, value?: string) => {
        if (disabled) return;

        document.execCommand(command, false, value);
        editorRef.current?.focus();

        // Update the value
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const toolbarItems = [
        { command: 'bold', icon: Bold, label: 'Bold' },
        { command: 'italic', icon: Italic, label: 'Italic' },
        { command: 'underline', icon: Underline, label: 'Underline' },
        { command: 'insertUnorderedList', icon: List, label: 'Bullet List' },
        { command: 'insertOrderedList', icon: ListOrdered, label: 'Numbered List' },
    ];

    return (
        <Card className={`${isFocused ? 'ring-2 ring-ring ring-offset-2' : ''}`}>
            {/* Toolbar */}
            <div className="border-b bg-muted/50 p-2 flex space-x-1">
                {toolbarItems.map(item => {
                    const Icon = item.icon;
                    return (
                        <Button
                            key={item.command}
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={disabled}
                            onClick={() => formatText(item.command)}
                            title={item.label}
                        >
                            <Icon className="h-4 w-4" />
                        </Button>
                    );
                })}

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={disabled}
                    onClick={() => {
                        const url = prompt('Enter URL:');
                        if (url) formatText('createLink', url);
                    }}
                    title="Add Link"
                >
                    <Link className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor */}
            <CardContent className="p-0">
                <div
                    ref={editorRef}
                    contentEditable={!disabled}
                    className="min-h-[120px] p-3 focus:outline-none"
                    dangerouslySetInnerHTML={{ __html: value || '' }}
                    onInput={handleInput}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    data-placeholder={placeholder}
                    style={
                        {
                            '--placeholder-color': 'hsl(var(--muted-foreground))',
                        } as React.CSSProperties
                    }
                />
            </CardContent>
        </Card>
    );
}
```

## Finding Page and Block IDs

To target your input components correctly, you need to know the `pageId` and `blockId` values. Here are some common ones:

### Product Pages

```tsx
// Product detail page
pageId: 'product-detail';
blockId: 'product-form';
// Common fields: name, slug, description, price, sku, enabled

// Product list page
pageId: 'product-list';
blockId: 'product-table';
// Common fields: name, sku, price, enabled, createdAt
```

### Customer Pages

```tsx
// Customer detail page
pageId: 'customer-detail';
blockId: 'customer-info';
// Common fields: firstName, lastName, emailAddress, phoneNumber

// Customer list page
pageId: 'customer-list';
blockId: 'customer-table';
// Common fields: firstName, lastName, emailAddress, customerSince
```

### Order Pages

```tsx
// Order detail page
pageId: 'order-detail';
blockId: 'order-form';
// Common fields: code, state, orderPlacedAt, customerEmail

// Order list page
pageId: 'order-list';
blockId: 'order-table';
// Common fields: code, state, total, orderPlacedAt
```

:::tip Finding IDs
If you're unsure about the exact `pageId` or `blockId`, you can inspect the DOM in your browser's developer tools. Look for `data-page-id` and `data-block-id` attributes on form elements.
:::

## Component Props

Input components receive these standard props through the `DataInputComponentProps` interface:

```tsx
import { DataInputComponentProps } from '@vendure/dashboard';

// The DataInputComponentProps interface provides:
interface DataInputComponentProps {
    value: any; // Current field value
    onChange: (value: any) => void; // Function to update the value
    [key: string]: any; // Additional props that may be passed
}

// Common additional props that may be available:
// - disabled?: boolean          // Whether the input is disabled
// - placeholder?: string        // Placeholder text
// - required?: boolean         // Whether the field is required
// - readOnly?: boolean         // Whether the field is read-only
// - fieldName?: string         // The name of the field
// - formData?: Record<string, any> // Other form data for context
```

## Best Practices

1. **Follow standard input patterns**: Use `value` and `onChange` props consistently
2. **Handle disabled states**: Always respect the `disabled` prop
3. **Provide visual feedback**: Show loading states, validation status, etc.
4. **Use dashboard components**: Import from `@vendure/dashboard` for consistency
5. **Consider accessibility**: Add proper ARIA labels and keyboard navigation
6. **Test thoroughly**: Ensure your component works in different contexts and with various data types

:::note
Input components completely replace the default input for the targeted field. Make sure your component handles all the data types and scenarios that the original input would have handled.
:::

:::warning
Input components should be focused and specific. If you need to customize multiple fields in a form, consider using custom form components or page blocks instead.
:::

## Related Guides

- **[Custom Form Elements Overview](./)** - Learn about the unified system for custom field components, input components, and display components
- **[Display Components](./display-components)** - Create custom readonly data visualizations for tables, detail views, and forms
