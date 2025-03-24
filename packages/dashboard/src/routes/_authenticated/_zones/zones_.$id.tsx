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
import {
    createZoneDocument,
    zoneDetailQuery,
    updateZoneDocument,
} from './zones.graphql.js';
import { ZoneCountriesTable } from './components/zone-countries-table.js';

export const Route = createFileRoute('/_authenticated/_zones/zones_/$id')({
    component: ZoneDetailPage,
    loader: async ({ context, params }) => {
        const isNew = params.id === NEW_ENTITY_PATH;
        const result = isNew
            ? null
            : await context.queryClient.ensureQueryData(
                  getDetailQueryOptions(addCustomFields(zoneDetailQuery), { id: params.id }),
                  { id: params.id },
              );
        if (!isNew && !result.zone) {
            throw new Error(`Zone with the ID ${params.id} was not found`);
        }
        return {
            breadcrumb: [
                { path: '/zones', label: 'Zones' },
                isNew ? <Trans>New zone</Trans> : result.zone.name,
            ],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function ZoneDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending } = useDetailPage({
        queryDocument: addCustomFields(zoneDetailQuery),
        entityField: 'zone',
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
            toast(i18n.t('Successfully updated zone'), {
                position: 'top-right',
            });
            form.reset(form.getValues());
            if (creatingNewEntity) {
                await navigate({ to: `../${data?.id}`, from: Route.id });
            }
        },
        onError: err => {
            toast(i18n.t('Failed to update zone'), {
                position: 'top-right',
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page>
            <PageTitle>
                {creatingNewEntity ? <Trans>New zone</Trans> : (entity?.name ?? '')}
            </PageTitle>
            <Form {...form}>
                <form onSubmit={submitHandler} className="space-y-8">
                    <PageActionBar>
                        <div></div>
                        <PermissionGuard requires={['UpdateZone']}>
                            <Button
                                type="submit"
                                disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                            >
                                <Trans>Update</Trans>
                            </Button>
                        </PermissionGuard>
                    </PageActionBar>
                    <PageLayout>
                        <PageBlock column="main">
                            <div className="md:grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Name</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </PageBlock>
                        <CustomFieldsPageBlock
                            column="main"
                            entityType="Zone"
                            control={form.control}
                        />
                        {!creatingNewEntity && (
                            <PageBlock column="main" title={<Trans>Countries</Trans>}>
                                <ZoneCountriesTable zoneId={entity?.id} canAddCountries={true} />
                            </PageBlock>
                        )}
                    </PageLayout>
                </form>
            </Form>
        </Page>
    );
}
