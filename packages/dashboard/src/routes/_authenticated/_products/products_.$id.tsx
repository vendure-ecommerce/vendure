import { ContentLanguageSelector } from '@/components/layout/content-language-selector.js';
import { AssignedFacetValues } from '@/components/shared/assigned-facet-values.js';
import { EntityAssets } from '@/components/shared/entity-assets.js';
import { TranslatableFormField } from '@/components/shared/translatable-form-field.js';
import { Button } from '@/components/ui/button.js';
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
import {
    Page,
    PageActionBar,
    PageBlock,
    PageLayout,
    PageTitle,
} from '@/framework/layout-engine/page-layout.js';
import { useDetailPage, getDetailQueryOptions } from '@/framework/page/use-detail-page.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ProductVariantsTable } from './components/product-variants-table.js';
import { productDetailDocument, updateProductDocument } from './products.graphql.js';

export const Route = createFileRoute('/_authenticated/_products/products_/$id')({
    component: ProductDetailPage,
    loader: async ({ context, params }) => {
        const result = await context.queryClient.ensureQueryData(
            getDetailQueryOptions(productDetailDocument, { id: params.id }),
        );
        return { breadcrumb: [{ path: '/products', label: 'Products' }, result.product.name] };
    },
});

export function ProductDetailPage() {
    const params = Route.useParams();
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending } = useDetailPage({
        queryDocument: productDetailDocument,
        entityField: 'product',
        updateDocument: updateProductDocument,
        setValuesForUpdate: entity => ({
            id: entity.id,
            enabled: entity.enabled,
            featuredAssetId: entity.featuredAsset?.id,
            assetIds: entity.assets.map(asset => asset.id),
            facetValueIds: entity.facetValues.map(facetValue => facetValue.id),
            translations: entity.translations.map(translation => ({
                id: translation.id,
                languageCode: translation.languageCode,
                name: translation.name,
                slug: translation.slug,
                description: translation.description,
            })),
        }),
        params: { id: params.id },
        onSuccess: () => {
            toast(i18n.t('Successfully updated product'), {
                position: 'top-right',
            });
            form.reset();
        },
        onError: err => {
            toast(i18n.t('Failed to update product'), {
                position: 'top-right',
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page>
            <PageTitle>{entity?.name ?? ''}</PageTitle>
            <Form {...form}>
                <form onSubmit={submitHandler} className="space-y-8">
                    <PageActionBar>
                        <ContentLanguageSelector className="mb-4" />
                        <Button
                            type="submit"
                            disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                        >
                            Submit
                        </Button>
                    </PageActionBar>
                    <PageLayout>
                        <PageBlock column="side">
                            <FormField
                                control={form.control}
                                name="enabled"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <Trans>Enabled</Trans>
                                        </FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription>
                                            <Trans>When enabled, a product is available in the shop</Trans>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </PageBlock>
                        <PageBlock column="main">
                            <div className="md:flex w-full gap-4">
                                <div className="w-1/2">
                                    <TranslatableFormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    <Trans>Product name</Trans>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormDescription></FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <TranslatableFormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    <Trans>Slug</Trans>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormDescription></FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <TranslatableFormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <Trans>Description</Trans>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea className="resize-none" {...field} />
                                        </FormControl>
                                        <FormDescription></FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </PageBlock>
                        <PageBlock column="main">
                            <ProductVariantsTable productId={params.id} />
                        </PageBlock>
                        <PageBlock column="side">
                            <FormField
                                control={form.control}
                                name="facetValueIds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <Trans>Facet values</Trans>
                                        </FormLabel>
                                        <FormControl>
                                            <AssignedFacetValues
                                                facetValues={entity?.facetValues ?? []}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </PageBlock>
                        <PageBlock column="side">
                            <FormItem>
                                <FormLabel>
                                    <Trans>Assets</Trans>
                                </FormLabel>
                                <FormControl>
                                    <EntityAssets
                                        assets={entity?.assets}
                                        featuredAsset={entity?.featuredAsset}
                                        compact={true}
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
                        </PageBlock>
                    </PageLayout>
                </form>
            </Form>
        </Page>
    );
}
