import { usePaginatedList } from '@/vdb/components/shared/paginated-list-data-table.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/vdb/components/ui/form.js';
import { Input } from '@/vdb/components/ui/input.js';
import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { Trans } from '@/vdb/lib/trans.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

const productOptionsDocument = graphql(`
    query productOptions($options: ProductOptionListOptions) {
        productOptions(options: $options) {
            items {
                id
                name
                code
                customFields
                translations {
                    id
                    languageCode
                    name
                }
            }
        }
    }
`);

const updateProductOptionsDocument = graphql(`
    mutation UpdateProductOption($input: [UpdateProductOptionInput!]!) {
        updateProductOptions(input: $input) {
            id
        }
    }
`);

export interface EditProductOptionProps {
    productOptionId: string;
    onSuccess?: () => void;
}

export function EditProductOption({ productOptionId, onSuccess }: Readonly<EditProductOptionProps>) {
    const {
        settings: { contentLanguage },
    } = useUserSettings();
    const { refetchPaginatedList } = usePaginatedList();
    const { data: productOptions } = useQuery({
        queryKey: ['productOptions', productOptionId],
        queryFn: () => api.query(productOptionsDocument, { options: { filter: { id: { eq: productOptionId } } } }),
    });
    const { mutate: updateProductOption } = useMutation({
        mutationFn: api.mutate(updateProductOptionsDocument),
        onSuccess: () => {
            refetchPaginatedList();
            onSuccess?.();
        },
    });
    const productOption = productOptions?.productOptions.items[0];

    const form = useForm({
        values: {
            name: productOption?.name ?? '',
            code: productOption?.code ?? '',
        },
    });

    if (!productOption) {
        return <div>Product option not found</div>;
    }

    const handleSave = (values: { name: string; code: string }) => {
        const translations = productOption.translations.map(translation => {
            if (translation.languageCode === contentLanguage) {
                return {
                    id: translation.id,
                    languageCode: translation.languageCode,
                    name: values.name,
                };
            }
            return translation;
        });
        updateProductOption({
            input: [
                {
                    id: productOption.id,
                    translations,
                    code: values.code,
                },
            ],
        });
    };

    return (
        <div className="grid gap-4">
            <div className="space-y-2">
                <h4 className="font-medium leading-none">Edit Product Option</h4>
                <p className="text-sm text-muted-foreground">Update the name and code of this product option.</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSave)} className="grid gap-2">
                    <FormItem>
                        <FormLabel>
                            <Trans>Name</Trans>
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="" {...form.register('name')} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    <FormItem>
                        <FormLabel>
                            <Trans>Code</Trans>
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="" {...form.register('code')} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    <div className="flex justify-end">
                        <Button type="submit" size="sm">
                            <Trans>Save changes</Trans>
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
