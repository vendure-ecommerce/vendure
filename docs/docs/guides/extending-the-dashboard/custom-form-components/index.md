---
title: 'Custom Form Components'
---

The dashboard allows you to create custom form components for custom fields, giving you complete control over how custom fields are rendered and how users interact with them. This is particularly useful for complex data types or specialized input requirements.

:::important React Hook Form Integration
Custom form components are heavily bound to the workflow of React Hook Form. The component props interface essentially passes React Hook Form render props (`field`, `fieldState`, `formState`) directly to your component, providing seamless integration with the form state management system.
:::

## Basic Custom Form Component

Custom form components are React components that receive React Hook Form render props and use the dashboard's Shadcn UI design system for consistent styling.

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

## Registering Custom Form Components

Custom form components are registered in your dashboard extension:

```tsx title="src/plugins/my-plugin/dashboard/index.tsx"
import { defineDashboardExtension } from '@vendure/dashboard';
import { ColorPickerComponent } from './components/color-picker';
import { RichTextEditorComponent } from './components/rich-text-editor';
import { TagsInputComponent } from './components/tags-input';

export default defineDashboardExtension({
    customFormComponents: [
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
    // ... other extension properties
});
```

## Using Custom Form Components in Custom Fields

Once registered, you can reference your custom form components in your custom field definitions:

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

## Component Props Interface

Your custom form components receive React Hook Form render props through the following interface:

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

:::tip Best Practices

1. **Always use Shadcn UI components** from the `@vendure/dashboard` package for consistent styling
2. **Handle React Hook Form events properly** - call `field.onChange` and `field.onBlur` appropriately
3. **Display validation errors** from `fieldState.error` when they exist
4. **Use dashboard design tokens** - leverage `text-destructive`, `text-muted-foreground`, etc.
5. **Provide clear visual feedback** for user interactions
6. **Handle disabled states** by checking the field state or form state
   :::

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

:::note Component Registration
Custom form components must be registered before they can be used in custom field definitions. The `id` you use when registering the component is what you reference in the custom field's `ui.component` property.
:::

:::important Design System Consistency
Always import UI components from the `@vendure/dashboard` package rather than creating custom inputs or buttons. This ensures your components follow the dashboard's design system and remain consistent with future updates.
:::

Custom form components give you complete flexibility in how custom fields are presented and edited in the dashboard, while maintaining seamless integration with React Hook Form and the dashboard's design system.
