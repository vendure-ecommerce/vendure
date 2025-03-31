import { ErrorPage } from '@/components/shared/error-page.js';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Textarea } from '@/components/ui/textarea.js';
import { NEW_ENTITY_PATH } from '@/constants.js';
import {
    CustomFieldsPageBlock,
    DetailFormGrid,
    Page,
    PageActionBar,
    PageActionBarRight,
    PageBlock,
    PageLayout,
    PageTitle,
} from '@/framework/layout-engine/page-layout.js';
import { detailPageRouteLoader } from '@/framework/page/detail-page-route-loader.js';
import { useDetailPage } from '@/framework/page/use-detail-page.js';
import { Trans, useLingui } from '@/lib/trans.js';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import {
    createStockLocationDocument,
    stockLocationDetailQuery,
    updateStockLocationDocument,
} from './stock-locations.graphql.js';

export const Route = createFileRoute('/_authenticated/_stock-locations/stock-locations_/$id')({
    component: StockLocationDetailPage,
    loader: detailPageRouteLoader({
        queryDocument: stockLocationDetailQuery,
        breadcrumb(isNew, entity) {
            return [
                { path: '/stock-locations', label: 'Stock locations' },
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
            toast.success(i18n.t('Successfully updated stock location'));
            resetForm();
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast.error(i18n.t('Failed to update stock location'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId="stock-location-detail" form={form} submitHandler={submitHandler}>
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
                            <Trans>Update</Trans>
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
