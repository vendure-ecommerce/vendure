import { FormProvider, useForm } from 'react-hook-form';
import { SlugInput } from './slug-input.js';

/**
 * Example usage of the SlugInput component.
 * This shows how to integrate the component with React Hook Form
 * in a typical product or collection form.
 */
export function SlugInputExample() {
    const form = useForm({
        defaultValues: {
            name: '',
            slug: '',
        },
    });

    return (
        <FormProvider {...form}>
            <form className="space-y-4 p-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Product Name
                    </label>
                    <input
                        id="name"
                        {...form.register('name')}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Enter product name"
                    />
                </div>

                <div>
                    <label htmlFor="slug" className="block text-sm font-medium mb-2">
                        Slug
                    </label>
                    <SlugInput
                        value={form.watch('slug')}
                        onChange={(value) => form.setValue('slug', value)}
                        fieldDef={{} as any} // In real usage, this would come from your form schema
                        entityName="Product"
                        fieldName="slug"
                        watchFieldName="name"
                        entityId={undefined} // Set this when editing an existing entity
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                        The slug is automatically generated from the product name.
                        Click the edit button to manually customize it.
                    </p>
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Save Product
                </button>
            </form>
        </FormProvider>
    );
}

/**
 * Example for collections
 */
export function CollectionSlugInputExample() {
    const form = useForm({
        defaultValues: {
            name: '',
            slug: '',
        },
    });

    return (
        <FormProvider {...form}>
            <div>
                <SlugInput
                    value={form.watch('slug')}
                    onChange={(value) => form.setValue('slug', value)}
                    fieldDef={{} as any}
                    entityName="Collection"
                    fieldName="slug"
                    watchFieldName="name"
                    defaultReadonly={true}
                />
            </div>
        </FormProvider>
    );
}