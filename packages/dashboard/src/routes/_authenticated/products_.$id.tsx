import { ContentLanguageSelector } from '@/components/content-language-selector.js';
import { EntityAssets } from '@/components/entity-assets.js';
import { Button } from '@/components/ui/button.js';
import { Card, CardContent, CardHeader } from '@/components/ui/card.js';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form.js';
import { Input } from '@/components/ui/input.js';
import { Switch } from '@/components/ui/switch.js';
import { Textarea } from '@/components/ui/textarea.js';
import { useGeneratedForm } from '@/framework/internal/form-engine/use-generated-form.js';
import { TranslatableFormField } from '@/framework/internal/form/field.js';
import { DetailPage, getDetailQueryOptions } from '@/framework/internal/page/detail-page.js';
import { api } from '@/graphql/api.js';
import { assetFragment } from '@/graphql/fragments.js';
import { graphql } from '@/graphql/graphql.js';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/products_/$id')({
    component: ProductDetailPage,
    loader: async ({ context, params }) => {
        const result = await context.queryClient.ensureQueryData(
            getDetailQueryOptions(productDetailDocument, { id: params.id }),
        );
        return { breadcrumb: [{ path: '/products', label: 'Products' }, result.product.name] };
    },
});

const productDetailFragment = graphql(`
    fragment ProductDetail on Product {
        id
        createdAt
        updatedAt
        enabled
        name
        slug
        description
        featuredAsset {
            ...Asset
        }
        assets {
            ...Asset
        }
        translations {
            id
            languageCode

            name
            slug
            description
        }
    }
`, [assetFragment]);

const productDetailDocument = graphql(
    `
        query ProductDetail($id: ID!) {
            product(id: $id) {
                ...ProductDetail
            }
        }
    `,
    [productDetailFragment],
);

const updateProductDocument = graphql(
    `
        mutation UpdateProduct($input: UpdateProductInput!) {
            updateProduct(input: $input) {
                ...ProductDetail
            }
        }
    `,
    [productDetailFragment],
);

export function ProductDetailPage() {
    const params = Route.useParams();
    const detailQuery = useSuspenseQuery(getDetailQueryOptions(productDetailDocument, { id: params.id }));
    const entity = detailQuery.data.product;
    const updateMutation = useMutation({
        mutationFn: api.mutate(updateProductDocument),
        onSuccess: () => {
            toast('Updated', {
                position: 'top-right',
            });
        },
        onError: err => {
            console.error(err);
        },
    });

    const { form, submitHandler } = useGeneratedForm({
        document: updateProductDocument,
        entity,
        setValues: entity => ({
            id: entity.id,
            enabled: entity.enabled,
            featuredAssetId: entity.featuredAsset?.id,
            assetIds: entity.assets.map(asset => asset.id),
            translations: entity.translations.map(translation => ({
                id: translation.id,
                languageCode: translation.languageCode,
                name: translation.name,
                slug: translation.slug,
                description: translation.description,
            })),
        }),
        onSubmit(values) {
            updateMutation.mutate({ input: values });
        },
    });

    return (
        <DetailPage title={entity?.name ?? ''} route={Route} entity={entity}>
            <ContentLanguageSelector className="mb-4" />
            <Form {...form}>
                <form onSubmit={submitHandler} className="space-y-8">
                    <Card className="">
                        <CardHeader />
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="enabled"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enabled</FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription>This is your public display name.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="featuredAssetId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>featuredAssetId</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                        <FormDescription></FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <TranslatableFormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                        <FormDescription></FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <TranslatableFormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                        <FormDescription></FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <TranslatableFormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea className="resize-none" {...field} />
                                        </FormControl>
                                        <FormDescription></FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                    <Card className="">
                        <CardHeader />
                        <CardContent>
                            <FormItem>
                                <FormLabel>Assets</FormLabel>
                                <FormControl>
                                    <EntityAssets
                                        assets={entity?.assets}
                                        featuredAsset={entity?.featuredAsset}
                                        compact={false}
                                        value={form.getValues()}
                                        onChange={value => {
                                            form.setValue('featuredAssetId', value.featuredAssetId);
                                            form.setValue('assetIds', value.assetIds);
                                        }}
                                    />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        </CardContent>
                    </Card>
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </DetailPage>
    );
}
