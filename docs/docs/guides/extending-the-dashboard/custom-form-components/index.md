---
title: 'Custom Form Elements'
---

The dashboard allows you to create custom form elements that provide complete control over how data is rendered and how users interact with forms. This includes:

- **Custom Field Components** - For custom fields with specialized input requirements
- **Input Components** - For targeted input controls in detail forms and other pages
- **Display Components** - For custom data visualization and readonly displays

:::important React Hook Form Integration
Custom form components are heavily bound to the workflow of React Hook Form. The component props interface essentially passes React Hook Form render props (`field`, `fieldState`, `formState`) directly to your component, providing seamless integration with the form state management system.
:::

## Unified Registration System

All custom form elements are registered through the unified `customFormComponents` property in your dashboard extension:

```tsx title="src/plugins/my-plugin/dashboard/index.tsx"
import { defineDashboardExtension } from '@vendure/dashboard';
import { ColorPickerComponent } from './components/color-picker';
import { RichTextEditorComponent } from './components/rich-text-editor';
import { TagsInputComponent } from './components/tags-input';
import { PriceInputComponent } from './components/price-input';
import { StatusBadgeComponent } from './components/status-badge';

export default defineDashboardExtension({
    customFormComponents: {
        // Custom field components for custom fields
        customFields: [
            {
                id: 'color-picker',
                component: ColorPickerComponent,
            },
            {
                id: 'rich-text-editor',
                component: RichTextEditorComponent,
            },
            {
                id: 'tags-input',
                component: TagsInputComponent,
            },
        ],

        // Input components for specific form fields
        inputs: [
            {
                pageId: 'product-detail',
                blockId: 'product-form',
                field: 'price',
                component: PriceInputComponent,
            },
        ],

        // Display components for readonly data
        displays: [
            {
                pageId: 'order-detail',
                blockId: 'order-summary',
                field: 'status',
                component: StatusBadgeComponent,
            },
        ],
    },
    // ... other extension properties
});
```

## Custom Field Components

Custom field components are React components used specifically for custom fields. They receive React Hook Form render props and use the dashboard's Shadcn UI design system.

### Basic Custom Field Component

```tsx title="src/plugins/my-plugin/dashboard/components/color-picker.tsx"
import { CustomFormComponentInputProps, Input, Button, Card, CardContent } from '@vendure/dashboard';
import { useState } from 'react';

export function ColorPickerComponent({ field, fieldState }: CustomFormComponentInputProps) {
    const [isOpen, setIsOpen] = useState(false);

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'];

    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 border-2 border-gray-300 p-0"
                    style={{ backgroundColor: field.value || '#ffffff' }}
                    onClick={() => setIsOpen(!isOpen)}
                />
                <Input
                    value={field.value || ''}
                    onChange={e => field.onChange(e.target.value)}
                    placeholder="#ffffff"
                />
            </div>

            {isOpen && (
                <Card>
                    <CardContent className="grid grid-cols-4 gap-2 p-2">
                        {colors.map(color => (
                            <Button
                                key={color}
                                type="button"
                                variant="outline"
                                size="icon"
                                className="w-8 h-8 border-2 border-gray-300 hover:border-gray-500 p-0"
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                    field.onChange(color);
                                    setIsOpen(false);
                                }}
                            />
                        ))}
                    </CardContent>
                </Card>
            )}

            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
        </div>
    );
}
```

### Using Custom Field Components

Once registered, reference your custom field components in your custom field definitions:

```ts title="src/plugins/my-plugin/my-plugin.ts"
import { PluginCommonModule, VendurePlugin } from '@vendure/core';

@VendurePlugin({
    imports: [PluginCommonModule],
    configuration: config => {
        config.customFields.Product.push(
            {
                name: 'brandColor',
                type: 'string',
                label: [{ languageCode: LanguageCode.en, value: 'Brand Color' }],
                description: [
                    { languageCode: LanguageCode.en, value: 'Primary brand color for this product' },
                ],
                ui: {
                    component: 'color-picker', // References our registered component
                },
            },
            {
                name: 'description',
                type: 'text',
                label: [{ languageCode: LanguageCode.en, value: 'Rich Description' }],
                ui: {
                    component: 'rich-text-editor',
                },
            },
            {
                name: 'tags',
                type: 'string',
                label: [{ languageCode: LanguageCode.en, value: 'Product Tags' }],
                ui: {
                    component: 'tags-input',
                },
            },
        );
        return config;
    },
    dashboard: './dashboard/index.tsx',
})
export class MyPlugin {}
```

## Input Components

Input components allow you to replace specific input fields in existing dashboard forms with custom implementations. They are targeted to specific pages, blocks, and fields.

### Basic Input Component

```tsx title="src/plugins/my-plugin/dashboard/components/price-input.tsx"
import { Input, Button } from '@vendure/dashboard';
import { useState } from 'react';
import { DollarSign, Euro, Pound } from 'lucide-react';

interface PriceInputProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

export function PriceInputComponent({ value, onChange, disabled }: PriceInputProps) {
    const [currency, setCurrency] = useState('USD');

    const currencies = [
        { code: 'USD', symbol: '$', icon: DollarSign },
        { code: 'EUR', symbol: '€', icon: Euro },
        { code: 'GBP', symbol: '£', icon: Pound },
    ];

    const selectedCurrency = currencies.find(c => c.code === currency) || currencies[0];
    const Icon = selectedCurrency.icon;

    return (
        <div className="flex items-center space-x-2">
            <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={() => {
                    const currentIndex = currencies.findIndex(c => c.code === currency);
                    const nextIndex = (currentIndex + 1) % currencies.length;
                    setCurrency(currencies[nextIndex].code);
                }}
                className="flex items-center gap-1"
            >
                <Icon className="h-4 w-4" />
                {selectedCurrency.code}
            </Button>

            <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    {selectedCurrency.symbol}
                </span>
                <Input
                    type="number"
                    value={value || ''}
                    onChange={e => onChange(parseFloat(e.target.value) || 0)}
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

### Targeting Input Components

Input components are targeted using three properties:

- **pageId**: The ID of the page (e.g., 'product-detail', 'customer-detail')
- **blockId**: The ID of the form block (e.g., 'product-form', 'customer-info')
- **field**: The name of the field to replace (e.g., 'price', 'email')

```tsx
inputs: [
    {
        pageId: 'product-detail',
        blockId: 'product-form',
        field: 'price',
        component: PriceInputComponent,
    },
    {
        pageId: 'customer-detail',
        blockId: 'customer-info',
        field: 'email',
        component: EmailInputComponent,
    },
];
```

## Display Components

Display components are used for readonly data visualization, replacing how specific data is displayed in forms, tables, and detail views.

### Basic Display Component

```tsx title="src/plugins/my-plugin/dashboard/components/status-badge.tsx"
import { Badge } from '@vendure/dashboard';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
    value: string;
}

export function StatusBadgeComponent({ value }: StatusBadgeProps) {
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

### Targeting Display Components

Display components use the same targeting system as input components:

```tsx
displays: [
    {
        pageId: 'order-detail',
        blockId: 'order-summary',
        field: 'status',
        component: StatusBadgeComponent,
    },
    {
        pageId: 'product-list',
        blockId: 'product-table',
        field: 'availability',
        component: AvailabilityIndicatorComponent,
    },
];
```

## Component Props Interfaces

### Custom Field Component Props

Custom field components receive React Hook Form render props:

```tsx
interface CustomFormComponentInputProps {
    // React Hook Form field controller (render prop)
    field: {
        name: string; // Field name
        value: any; // Current field value
        onChange: (value: any) => void; // Update field value
        onBlur: () => void; // Handle field blur
        ref: React.Ref; // Field reference
    };

    // React Hook Form field validation state (render prop)
    fieldState: {
        invalid: boolean; // Whether field has validation errors
        isTouched: boolean; // Whether field has been interacted with
        isDirty: boolean; // Whether field value has changed
        error?: {
            // Validation error details
            type: string;
            message: string;
        };
    };

    // React Hook Form overall form state (render prop)
    formState: {
        isDirty: boolean; // Whether any form field has changed
        isValid: boolean; // Whether form passes validation
        isSubmitting: boolean; // Whether form is being submitted
        // ... other React Hook Form state properties
    };
}
```

### Input Component Props

Input components receive standard input props through the `DataInputComponentProps` interface:

```tsx
import { DataInputComponentProps } from '@vendure/dashboard';

// The DataInputComponentProps interface provides:
interface DataInputComponentProps {
    value: any;
    onChange: (value: any) => void;
    [key: string]: any; // Additional props that may be passed
}
```

### Display Component Props

Display components receive the value and any additional context through the `DataDisplayComponentProps` interface:

```tsx
import { DataDisplayComponentProps } from '@vendure/dashboard';

// The DataDisplayComponentProps interface provides:
interface DataDisplayComponentProps {
    value: any;
    [key: string]: any; // Additional props that may be passed
}
```

## Advanced Examples

### Rich Text Editor Component

```tsx title="src/plugins/my-plugin/dashboard/components/rich-text-editor.tsx"
import { CustomFormComponentInputProps, Button, Card, CardContent } from '@vendure/dashboard';
import { useState, useEffect } from 'react';
import { Bold, Italic, Underline } from 'lucide-react';

export function RichTextEditorComponent({ field, fieldState }: CustomFormComponentInputProps) {
    const [editorContent, setEditorContent] = useState(field.value || '');

    useEffect(() => {
        setEditorContent(field.value || '');
    }, [field.value]);

    const handleContentChange = (content: string) => {
        setEditorContent(content);
        field.onChange(content);
    };

    const formatText = (command: string) => {
        document.execCommand(command, false);
    };

    return (
        <div className="space-y-2">
            <Card>
                {/* Toolbar */}
                <div className="border-b bg-muted/50 p-2 flex space-x-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => formatText('bold')}>
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => formatText('italic')}>
                        <Italic className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => formatText('underline')}>
                        <Underline className="h-4 w-4" />
                    </Button>
                </div>

                {/* Editor */}
                <CardContent>
                    <div
                        contentEditable
                        className="min-h-[120px] p-3 focus:outline-none"
                        dangerouslySetInnerHTML={{ __html: editorContent }}
                        onBlur={e => {
                            const content = e.currentTarget.innerHTML;
                            handleContentChange(content);
                            field.onBlur();
                        }}
                        onInput={e => {
                            const content = e.currentTarget.innerHTML;
                            handleContentChange(content);
                        }}
                    />
                </CardContent>
            </Card>

            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
        </div>
    );
}
```

### Tags Input Component

```tsx title="src/plugins/my-plugin/dashboard/components/tags-input.tsx"
import { CustomFormComponentInputProps, Input, Badge, Button } from '@vendure/dashboard';
import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

export function TagsInputComponent({ field, fieldState }: CustomFormComponentInputProps) {
    const [inputValue, setInputValue] = useState('');

    // Parse tags from string value (comma-separated)
    const tags = field.value ? field.value.split(',').filter(Boolean) : [];

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            const newTags = [...tags, trimmedTag];
            field.onChange(newTags.join(','));
        }
        setInputValue('');
    };

    const removeTag = (tagToRemove: string) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        field.onChange(newTags.join(','));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    return (
        <div className="space-y-2">
            {/* Tags Display */}
            <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                        {tag}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeTag(tag)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                ))}
            </div>

            {/* Input */}
            <Input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={field.onBlur}
                placeholder="Type a tag and press Enter or comma"
            />

            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
        </div>
    );
}
```

## Form Validation Integration

Your custom components integrate seamlessly with React Hook Form's validation system:

```tsx title="src/plugins/my-plugin/dashboard/components/validated-input.tsx"
import { CustomFormComponentInputProps, Input, Alert, AlertDescription } from '@vendure/dashboard';
import { CheckCircle2 } from 'lucide-react';

export function ValidatedInputComponent({ field, fieldState }: CustomFormComponentInputProps) {
    return (
        <div className="space-y-2">
            <Input
                value={field.value || ''}
                onChange={e => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                className={fieldState.error ? 'border-destructive' : ''}
            />

            {fieldState.error && (
                <Alert variant="destructive">
                    <AlertDescription>{fieldState.error.message}</AlertDescription>
                </Alert>
            )}

            {fieldState.isTouched && !fieldState.error && (
                <div className="flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Valid input
                </div>
            )}
        </div>
    );
}
```

## Integration with Dashboard Design System

Leverage the dashboard's existing Shadcn UI components for consistent design:

```tsx title="src/plugins/my-plugin/dashboard/components/enhanced-select.tsx"
import {
    CustomFormComponentInputProps,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@vendure/dashboard';

interface Option {
    value: string;
    label: string;
}

export function EnhancedSelectComponent({ field, fieldState }: CustomFormComponentInputProps) {
    // This could come from props, API call, or static data
    const options: Option[] = [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
    ];

    return (
        <div className="space-y-2">
            <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={fieldState.error ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select a size..." />
                </SelectTrigger>
                <SelectContent>
                    {options.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
        </div>
    );
}
```

:::tip Best Practices

1. **Always use Shadcn UI components** from the `@vendure/dashboard` package for consistent styling
2. **Handle React Hook Form events properly** - call `field.onChange` and `field.onBlur` appropriately for custom field components
3. **Use standard input patterns** for input and display components - follow the `value`/`onChange` pattern
4. **Display validation errors** from `fieldState.error` when they exist (custom field components)
5. **Use dashboard design tokens** - leverage `text-destructive`, `text-muted-foreground`, etc.
6. **Provide clear visual feedback** for user interactions
7. **Handle disabled states** by checking the appropriate props
8. **Target components precisely** using pageId, blockId, and field for input/display components
   :::

:::note Component Registration
All custom form elements must be registered in the `customFormComponents` object before they can be used. For custom field components, the `id` you use when registering is what you reference in the custom field's `ui.component` property. For input and display components, they are automatically applied based on the targeting criteria.
:::

:::important Design System Consistency
Always import UI components from the `@vendure/dashboard` package rather than creating custom inputs or buttons. This ensures your components follow the dashboard's design system and remain consistent with future updates.
:::

The unified custom form elements system gives you complete flexibility in how data is presented and edited in the dashboard, while maintaining seamless integration with React Hook Form and the dashboard's design system.

## Further Reading

For detailed information about specific types of custom form elements, see these dedicated guides:

- **[Input Components](./input-components)** - Learn how to create custom input controls for forms with advanced examples like multi-currency inputs, auto-generating slugs, and rich text editors
- **[Display Components](./display-components)** - Discover how to customize data visualization with enhanced displays for prices, dates, avatars, and progress indicators
