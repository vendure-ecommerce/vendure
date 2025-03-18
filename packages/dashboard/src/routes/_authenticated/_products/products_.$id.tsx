import { ContentLanguageSelector } from '@/components/layout/content-language-selector.js';
import { AssignedFacetValues } from '@/components/shared/assigned-facet-values.js';
import { EntityAssets } from '@/components/shared/entity-assets.js';
import { ErrorPage } from '@/components/shared/error-page.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
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
import { NEW_ENTITY_PATH } from '@/constants.js';
import {
    Page,
    PageActionBar,
    PageBlock,
    PageLayout,
    PageTitle,
} from '@/framework/layout-engine/page-layout.js';
import { getDetailQueryOptions, useDetailPage } from '@/framework/page/use-detail-page.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { CreateProductVariantsDialog } from './components/create-product-variants-dialog.js';
import { ProductVariantsTable } from './components/product-variants-table.js';
import { createProductDocument, productDetailDocument, updateProductDocument } from './products.graphql.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { CustomFieldsForm } from '@/components/shared/custom-fields-form.js';

export const Route = createFileRoute('/_authenticated/_products/products_/$id')({
    component: ProductDetailPage,
    loader: async ({ context, params }) => {
        const isNew = params.id === NEW_ENTITY_PATH;
        const result = isNew
            ? null
            : await context.queryClient.ensureQueryData(
                  getDetailQueryOptions(addCustomFields(productDetailDocument), { id: params.id }), { id: params.id },
              );
        if (!isNew && !result.product) {
            throw new Error(`Product with the ID ${params.id} was not found`);
        }
        return {
            breadcrumb: [
                { path: '/products', label: 'Products' },
                isNew ? <Trans>New product</Trans> : result.product.name,
            ],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function ProductDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, refreshEntity } = useDetailPage({
        queryDocument: addCustomFields(productDetailDocument),
        entityField: 'product',
        createDocument: createProductDocument,
        updateDocument: updateProductDocument,
        setValuesForUpdate: entity => {
            return {
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
                    customFields: translation.customFields,
                })),
                customFields: entity.customFields,
            };
        },
        params: { id: params.id },
        onSuccess: data => {
            toast(i18n.t('Successfully updated product'), {
                position: 'top-right',
            });
            form.reset();
            if (creatingNewEntity) {
                navigate({ to: `../${data.id}`, from: Route.id });
            }
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
            <PageTitle>{creatingNewEntity ? <Trans>New product</Trans> : (entity?.name ?? '')}</PageTitle>
            <Form {...form}>
                <form onSubmit={submitHandler} className="space-y-8">
                    <PageActionBar>
                        <ContentLanguageSelector />
                        <PermissionGuard requires={['UpdateProduct', 'UpdateCatalog']}>
                            <Button
                                type="submit"
                                disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                            >
                                <Trans>Update</Trans>
                            </Button>
                        </PermissionGuard>
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
                            <CustomFieldsForm entityType="Product" control={form.control} />
                        </PageBlock>
                        {entity && entity.variantList.totalItems > 0 && (
                            <PageBlock column="main">
                                <ProductVariantsTable productId={params.id} />
                            </PageBlock>
                        )}
                        {entity && entity.variantList.totalItems === 0 && (
                            <PageBlock column="main">
                                <CreateProductVariantsDialog
                                    productId={entity.id}
                                    productName={entity.name}
                                    onSuccess={() => {
                                        refreshEntity();
                                    }}
                                />
                            </PageBlock>
                        )}
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
                                            form.setValue('featuredAssetId', value.featuredAssetId, {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                            });
                                            form.setValue('assetIds', value.assetIds, {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                            });
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
