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

const facetValuesDocument = graphql(`
    query FacetValue($options: FacetValueListOptions) {
        facetValues(options: $options) {
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

const updateFacetValueDocument = graphql(`
    mutation UpdateFacetValue($input: [UpdateFacetValueInput!]!) {
        updateFacetValues(input: $input) {
            id
        }
    }
`);

export interface EditFacetValueProps {
    facetValueId: string;
    onSuccess?: () => void;
}

export function EditFacetValue({ facetValueId, onSuccess }: Readonly<EditFacetValueProps>) {
    const {
        settings: { contentLanguage },
    } = useUserSettings();
    const { refetchPaginatedList } = usePaginatedList();
    const { data: facetValues } = useQuery({
        queryKey: ['facetValues', facetValueId],
        queryFn: () => api.query(facetValuesDocument, { options: { filter: { id: { eq: facetValueId } } } }),
    });
    const { mutate: updateFacetValue } = useMutation({
        mutationFn: api.mutate(updateFacetValueDocument),
        onSuccess: () => {
            refetchPaginatedList();
            onSuccess?.();
        },
    });
    const facetValue = facetValues?.facetValues.items[0];

    const form = useForm({
        values: {
            name: facetValue?.name ?? '',
            code: facetValue?.code ?? '',
        },
    });

    if (!facetValue) {
        return <div>Facet value not found</div>;
    }

    const handleSave = (values: { name: string; code: string }) => {
        const translations = facetValue.translations.map(translation => {
            if (translation.languageCode === contentLanguage) {
                return {
                    id: translation.id,
                    languageCode: translation.languageCode,
                    name: values.name,
                };
            }
            return translation;
        });
        updateFacetValue({
            input: [
                {
                    id: facetValue.id,
                    translations,
                    code: values.code,
                },
            ],
        });
    };

    return (
        <div className="grid gap-4">
            <div className="space-y-2">
                <h4 className="font-medium leading-none">Edit Facet Value</h4>
                <p className="text-sm text-muted-foreground">Update the name and code of this facet value.</p>
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
