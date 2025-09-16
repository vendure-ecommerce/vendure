import { RichTextInput } from '@/vdb/components/data-input/rich-text-input.js';
import { AssignedFacetValues } from '@/vdb/components/shared/assigned-facet-values.js';
import { EntityAssets } from '@/vdb/components/shared/entity-assets.js';
import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { FormFieldWrapper } from '@/vdb/components/shared/form-field-wrapper.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { TranslatableFormFieldWrapper } from '@/vdb/components/shared/translatable-form-field.js';
import { Button } from '@/vdb/components/ui/button.js';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/vdb/components/ui/form.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Switch } from '@/vdb/components/ui/switch.js';
import { NEW_ENTITY_PATH } from '@/vdb/constants.js';
import {
    CustomFieldsPageBlock,
    DetailFormGrid,
    Page,
    PageActionBar,
    PageActionBarRight,
    PageBlock,
    PageLayout,
    PageTitle,
} from '@/vdb/framework/layout-engine/page-layout.js';
import { detailPageRouteLoader } from '@/vdb/framework/page/detail-page-route-loader.js';
import { useDetailPage } from '@/vdb/framework/page/use-detail-page.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';
import { CreateProductVariantsDialog } from './components/create-product-variants-dialog.js';
import { ProductVariantsTable } from './components/product-variants-table.js';
import { createProductDocument, productDetailDocument, updateProductDocument } from './products.graphql.js';

const pageId = 'product-detail';

export const Route = createFileRoute('/_authenticated/_products/products_/$id')({
    component: ProductDetailPage,
    loader: detailPageRouteLoader({
        pageId,
        queryDocument: productDetailDocument,
        breadcrumb(isNew, entity) {
            return [
                { path: '/products', label: <Trans>Products</Trans> },
                isNew ? <Trans>New product</Trans> : entity?.name,
            ];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function ProductDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();
    const refreshRef = useRef<() => void>(() => {});

    const { form, submitHandler, entity, isPending, refreshEntity, resetForm } = useDetailPage({
        pageId,
        entityName: 'Product',
        queryDocument: productDetailDocument,
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
                    customFields: (translation as any).customFields,
                })),
                customFields: entity.customFields as any,
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast.success(i18n.t(creatingNewEntity ? 'Successfully created product' : 'Successfully updated product'));
            resetForm();
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast.error(i18n.t(creatingNewEntity ? 'Failed to create product' : 'Failed to update product'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
            <PageTitle>{creatingNewEntity ? <Trans>New product</Trans> : (entity?.name ?? '')}</PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdateProduct', 'UpdateCatalog']}>
                        <Button
                            type="submit"
                            disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                        >
                            {creatingNewEntity ? <Trans>Create</Trans> : <Trans>Update</Trans>}
                        </Button>
                    </PermissionGuard>
                </PageActionBarRight>
            </PageActionBar>
            <PageLayout>
                <PageBlock column="side" blockId="enabled-toggle">
                    <FormFieldWrapper
                        control={form.control}
                        name="enabled"
                        label={<Trans>Enabled</Trans>}
                        description={<Trans>When enabled, a product is available in the shop</Trans>}
                        render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        )}
                    />
                </PageBlock>
                <PageBlock column="main" blockId="main-form">
                    <DetailFormGrid>
                        <TranslatableFormFieldWrapper
                            control={form.control}
                            name="name"
                            label={<Trans>Product name</Trans>}
                            render={({ field }) => <Input {...field} />}
                        />
                        <TranslatableFormFieldWrapper
                            control={form.control}
                            name="slug"
                            label={<Trans>Slug</Trans>}
                            render={({ field }) => <Input {...field} />}
                        />
                    </DetailFormGrid>

                    <TranslatableFormFieldWrapper
                        control={form.control}
                        name="description"
                        label={<Trans>Description</Trans>}
                        render={({ field }) => <RichTextInput {...field} />}
                    />
                </PageBlock>
                <CustomFieldsPageBlock column="main" entityType="Product" control={form.control} />
                {entity && entity.variantList.totalItems > 0 && (
                    <PageBlock column="main" blockId="product-variants-table">
                        <ProductVariantsTable
                            productId={params.id}
                            registerRefresher={refresher => {
                                refreshRef.current = refresher;
                            }}
                            fromProductDetailPage={true}
                        />
                        <div className="mt-4 flex gap-2">
                            <Button asChild variant="outline">
                                <Link to="./variants">
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    <Trans>Manage variants</Trans>
                                </Link>
                            </Button>
                        </div>
                    </PageBlock>
                )}
                {entity && entity.variantList.totalItems === 0 && (
                    <PageBlock column="main" blockId="create-product-variants-dialog">
                        <CreateProductVariantsDialog
                            productId={entity.id}
                            productName={entity.name}
                            onSuccess={() => {
                                refreshEntity();
                            }}
                        />
                    </PageBlock>
                )}
                <PageBlock column="side" blockId="facet-values">
                    <FormFieldWrapper
                        control={form.control}
                        name="facetValueIds"
                        label={<Trans>Facet values</Trans>}
                        render={({ field }) => (
                            <AssignedFacetValues facetValues={entity?.facetValues ?? []} {...field} />
                        )}
                    />
                </PageBlock>
                <PageBlock column="side" blockId="assets">
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
                                    form.setValue('featuredAssetId', value.featuredAssetId ?? undefined, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    });
                                    form.setValue('assetIds', value.assetIds ?? [], {
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
        </Page>
    );
}
