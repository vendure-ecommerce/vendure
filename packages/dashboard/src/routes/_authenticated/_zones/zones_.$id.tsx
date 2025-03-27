import { ErrorPage } from '@/components/shared/error-page.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.js';
import { Input } from '@/components/ui/input.js';
import { Switch } from '@/components/ui/switch.js';
import { NEW_ENTITY_PATH } from '@/constants.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import {
    CustomFieldsPageBlock,
    DetailFormGrid,
    Page,
    PageActionBar,
    PageActionBarRight,
    PageBlock,
    PageDetailForm,
    PageLayout,
    PageTitle,
} from '@/framework/layout-engine/page-layout.js';
import { getDetailQueryOptions, useDetailPage } from '@/framework/page/use-detail-page.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { createZoneDocument, zoneDetailQuery, updateZoneDocument } from './zones.graphql.js';
import { ZoneCountriesTable } from './components/zone-countries-table.js';
import { detailPageRouteLoader } from '@/framework/page/detail-page-route-loader.js';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper.js';

export const Route = createFileRoute('/_authenticated/_zones/zones_/$id')({
    component: ZoneDetailPage,
    loader: detailPageRouteLoader({
        queryDocument: zoneDetailQuery,
        breadcrumb(isNew, entity) {
            return [{ path: '/zones', label: 'Zones' }, isNew ? <Trans>New zone</Trans> : entity?.name];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function ZoneDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        queryDocument: zoneDetailQuery,
        createDocument: createZoneDocument,
        updateDocument: updateZoneDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                name: entity.name,
                customFields: entity.customFields,
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast.success(i18n.t('Successfully updated zone'));
            resetForm();
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast.error(i18n.t('Failed to update zone'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId="zone-detail">
            <PageTitle>{creatingNewEntity ? <Trans>New zone</Trans> : (entity?.name ?? '')}</PageTitle>
            <PageDetailForm form={form} submitHandler={submitHandler}>
                <PageActionBar>
                    <PageActionBarRight>
                        <PermissionGuard requires={['UpdateZone']}>
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
                                name="name"
                                label={<Trans>Name</Trans>}
                                render={({ field }) => <Input {...field} />}
                            />
                        </DetailFormGrid>
                    </PageBlock>
                    <CustomFieldsPageBlock column="main" entityType="Zone" control={form.control} />
                    {entity && (
                        <PageBlock column="main" blockId="countries" title={<Trans>Countries</Trans>}>
                            <ZoneCountriesTable zoneId={entity.id} canAddCountries={true} />
                        </PageBlock>
                    )}
                </PageLayout>
            </PageDetailForm>
        </Page>
    );
}
