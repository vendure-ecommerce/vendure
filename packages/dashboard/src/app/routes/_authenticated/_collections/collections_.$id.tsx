import { RichTextInput } from '@/vdb/components/data-input/rich-text-input.js';
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
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import {
    collectionDetailDocument,
    createCollectionDocument,
    updateCollectionDocument,
} from './collections.graphql.js';
import { CollectionContentsPreviewTable } from './components/collection-contents-preview-table.js';
import { CollectionContentsTable } from './components/collection-contents-table.js';
import { CollectionFiltersSelector } from './components/collection-filters-selector.js';

const pageId = 'collection-detail';

export const Route = createFileRoute('/_authenticated/_collections/collections_/$id')({
    component: CollectionDetailPage,
    loader: detailPageRouteLoader({
        pageId,
        queryDocument: collectionDetailDocument,
        breadcrumb: (isNew, entity) => [
            { path: '/collections', label: <Trans>Collections</Trans> },
            isNew ? <Trans>New collection</Trans> : entity?.name,
        ],
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function CollectionDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        pageId,
        queryDocument: collectionDetailDocument,
        createDocument: createCollectionDocument,
        transformCreateInput: values => {
            return {
                ...values,
                filters: values.filters.filter(f => f.code !== ''),
            };
        },
        updateDocument: updateCollectionDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                isPrivate: entity.isPrivate,
                featuredAssetId: entity.featuredAsset?.id,
                assets: entity.assets.map(asset => asset.id),
                parentId: entity.parent?.id,
                translations: entity.translations.map(translation => ({
                    id: translation.id,
                    languageCode: translation.languageCode,
                    name: translation.name,
                    slug: translation.slug,
                    description: translation.description,
                })),
                filters: entity.filters.map(f => ({
                    code: f.code,
                    arguments: f.args.map(a => ({ name: a.name, value: a.value })),
                })),
                inheritFilters: entity.inheritFilters,
                customFields: entity.customFields,
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast(i18n.t(creatingNewEntity ? 'Successfully created collection' : 'Successfully updated collection'));
            resetForm();
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast(i18n.t(creatingNewEntity ? 'Failed to create collection' : 'Failed to update collection'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    const shouldPreviewContents =
        form.getFieldState('inheritFilters').isDirty || form.getFieldState('filters').isDirty;

    const currentFiltersValue = form.watch('filters');
    const currentInheritFiltersValue = form.watch('inheritFilters');

    return (
        <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
            <PageTitle>{creatingNewEntity ? <Trans>New collection</Trans> : (entity?.name ?? '')}</PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdateCollection', 'UpdateCatalog']}>
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
                <PageBlock column="side" blockId="privacy">
                    <FormFieldWrapper
                        control={form.control}
                        name="isPrivate"
                        label={<Trans>Private</Trans>}
                        description={<Trans>Private collections are not visible in the shop</Trans>}
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
                            label={<Trans>Name</Trans>}
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
                <CustomFieldsPageBlock column="main" entityType="Collection" control={form.control} />
                <PageBlock column="main" blockId="filters" title={<Trans>Filters</Trans>}>
                    <FormFieldWrapper
                        control={form.control}
                        name="inheritFilters"
                        label={<Trans>Inherit filters</Trans>}
                        description={
                            <Trans>
                                If enabled, the filters will be inherited from the parent collection and
                                combined with the filters set on this collection.
                            </Trans>
                        }
                        render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="filters"
                        render={({ field }) => (
                            <CollectionFiltersSelector value={field.value ?? []} onChange={field.onChange} />
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
                <PageBlock column="main" blockId="contents" title={<Trans>Contents</Trans>}>
                    {shouldPreviewContents || creatingNewEntity ? (
                        <CollectionContentsPreviewTable
                            parentId={entity?.parent?.id}
                            filters={currentFiltersValue ?? []}
                            inheritFilters={currentInheritFiltersValue ?? false}
                        />
                    ) : (
                        <CollectionContentsTable collectionId={entity?.id} />
                    )}
                </PageBlock>
            </PageLayout>
        </Page>
    );
}
