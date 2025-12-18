import { RichTextInput } from '@/vdb/components/data-input/rich-text-input.js';
import { SlugInput } from '@/vdb/components/data-input/slug-input.js';
import { AssignedFacetValues } from '@/vdb/components/shared/assigned-facet-values.js';
import { EntityAssets } from '@/vdb/components/shared/entity-assets.js';
import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { FormFieldWrapper } from '@/vdb/components/shared/form-field-wrapper.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { TranslatableFormFieldWrapper } from '@/vdb/components/shared/translatable-form-field.js';
import { Button } from '@/vdb/components/ui/button.js';
import { FormControl, FormDescription, FormItem, FormMessage } from '@/vdb/components/ui/form.js';
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
import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';
import { CreateProductVariantsDialog } from './components/create-product-variants-dialog.js';
import { ProductOptionGroupBadge } from './components/product-option-group-badge.js';
import { ProductVariantsTable } from './components/product-variants-table.js';
import {
    assignProductsToChannelDocument,
    createProductDocument,
    productDetailDocument,
    removeProductsFromChannelDocument,
    updateProductDocument,
} from './products.graphql.js';
import { api } from '@/vdb/graphql/api.js';
import { AssignedChannels } from '@/vdb/components/shared/assigned-channels.js';
import { useChannel } from '@/vdb/hooks/use-channel.js';

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
    const { t } = useLingui();
    const refreshRef = useRef<() => void>(() => {});
    const { channels } = useChannel();

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
                channelIds: entity.channels.map(c => c.id) ?? [],
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
            toast.success(
                creatingNewEntity ? t`Successfully created product` : t`Successfully updated product`,
            );
            resetForm();
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast.error(creatingNewEntity ? t`Failed to create product` : t`Failed to update product`, {
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
                            render={({ field }) => (
                                <SlugInput
                                    {...field}
                                    entityName="Product"
                                    fieldName="slug"
                                    watchFieldName="name"
                                    entityId={entity?.id}
                                />
                            )}
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
                {entity?.optionGroups.length ? (
                    <PageBlock column="side" blockId="option-groups" title={<Trans>Product Options</Trans>}>
                        <div className="flex flex-wrap gap-1.5">
                            {entity.optionGroups.map(g => (
                                <ProductOptionGroupBadge key={g.id} id={g.id} name={g.name} />
                            ))}
                        </div>
                    </PageBlock>
                ) : null}
                <PageBlock column="side" blockId="facet-values" title={<Trans>Facet Values</Trans>}>
                    <FormFieldWrapper
                        control={form.control}
                        name="facetValueIds"
                        render={({ field }) => (
                            <AssignedFacetValues facetValues={entity?.facetValues ?? []} {...field} />
                        )}
                    />
                </PageBlock>
                {channels.length > 1 && entity && (
                    <PageBlock column="side" blockId="channels" title={<Trans>Channels</Trans>}>
                        <AssignedChannels
                            channels={entity.channels}
                            entityId={entity.id}
                            canUpdate={!creatingNewEntity}
                            assignMutationFn={api.mutate(assignProductsToChannelDocument)}
                            removeMutationFn={api.mutate(removeProductsFromChannelDocument)}
                        />
                    </PageBlock>
                )}

                <PageBlock column="side" blockId="assets" title={<Trans>Assets</Trans>}>
                    <FormItem>
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
