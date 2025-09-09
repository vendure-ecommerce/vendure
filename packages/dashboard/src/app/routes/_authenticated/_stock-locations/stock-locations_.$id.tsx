import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { FormFieldWrapper } from '@/vdb/components/shared/form-field-wrapper.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Textarea } from '@/vdb/components/ui/textarea.js';
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
    createStockLocationDocument,
    stockLocationDetailQuery,
    updateStockLocationDocument,
} from './stock-locations.graphql.js';

const pageId = 'stock-location-detail';

export const Route = createFileRoute('/_authenticated/_stock-locations/stock-locations_/$id')({
    component: StockLocationDetailPage,
    loader: detailPageRouteLoader({
        pageId,
        queryDocument: stockLocationDetailQuery,
        breadcrumb(isNew, entity) {
            return [
                { path: '/stock-locations', label: <Trans>Stock Locations</Trans> },
                isNew ? <Trans>New stock location</Trans> : entity?.name,
            ];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function StockLocationDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        pageId,
        queryDocument: stockLocationDetailQuery,
        createDocument: createStockLocationDocument,
        updateDocument: updateStockLocationDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                name: entity.name,
                description: entity.description,
                customFields: entity.customFields,
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast.success(i18n.t(creatingNewEntity ? 'Successfully created stock location' : 'Successfully updated stock location'));
            resetForm();
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast.error(i18n.t(creatingNewEntity ? 'Failed to create stock location' : 'Failed to update stock location'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
            <PageTitle>
                {creatingNewEntity ? <Trans>New stock location</Trans> : (entity?.name ?? '')}
            </PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdateStockLocation']}>
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
                <PageBlock column="main" blockId="main-form">
                    <DetailFormGrid>
                        <FormFieldWrapper
                            control={form.control}
                            label={<Trans>Name</Trans>}
                            name="name"
                            render={({ field }) => <Input {...field} />}
                        />
                        <div></div>
                    </DetailFormGrid>
                    <FormFieldWrapper
                        control={form.control}
                        name="description"
                        label={<Trans>Description</Trans>}
                        render={({ field }) => <Textarea {...field} />}
                    />
                </PageBlock>
                <CustomFieldsPageBlock column="main" entityType="StockLocation" control={form.control} />
            </PageLayout>
        </Page>
    );
}
