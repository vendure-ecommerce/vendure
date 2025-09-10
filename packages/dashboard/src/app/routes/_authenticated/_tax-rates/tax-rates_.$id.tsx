import { AffixedInput } from '@/vdb/components/data-input/affixed-input.js';
import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { FormFieldWrapper } from '@/vdb/components/shared/form-field-wrapper.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { TaxCategorySelector } from '@/vdb/components/shared/tax-category-selector.js';
import { ZoneSelector } from '@/vdb/components/shared/zone-selector.js';
import { Button } from '@/vdb/components/ui/button.js';
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
import { createTaxRateDocument, taxRateDetailDocument, updateTaxRateDocument } from './tax-rates.graphql.js';

const pageId = 'tax-rate-detail';

export const Route = createFileRoute('/_authenticated/_tax-rates/tax-rates_/$id')({
    component: TaxRateDetailPage,
    loader: detailPageRouteLoader({
        pageId,
        queryDocument: taxRateDetailDocument,
        breadcrumb(isNew, entity) {
            return [
                { path: '/tax-rates', label: <Trans>Tax Rates</Trans> },
                isNew ? <Trans>New tax rate</Trans> : entity?.name,
            ];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function TaxRateDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        pageId,
        queryDocument: taxRateDetailDocument,
        createDocument: createTaxRateDocument,
        updateDocument: updateTaxRateDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                name: entity.name,
                value: entity.value,
                enabled: entity.enabled,
                categoryId: entity.category.id,
                zoneId: entity.zone.id,
                customerGroupId: entity.customerGroup?.id,
                customFields: entity.customFields,
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast.success(i18n.t(creatingNewEntity ? 'Successfully created tax rate' : 'Successfully updated tax rate'));
            resetForm();
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast.error(i18n.t(creatingNewEntity ? 'Failed to create tax rate' : 'Failed to update tax rate'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
            <PageTitle>{creatingNewEntity ? <Trans>New tax rate</Trans> : (entity?.name ?? '')}</PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdateTaxRate']}>
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
                <PageBlock column="side" blockId="enabled">
                    <FormFieldWrapper
                        control={form.control}
                        name="enabled"
                        label={<Trans>Enabled</Trans>}
                        render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        )}
                    />
                </PageBlock>
                <PageBlock column="main" blockId="main-form">
                    <DetailFormGrid>
                        <FormFieldWrapper
                            control={form.control}
                            name="name"
                            label={<Trans>Name</Trans>}
                            render={({ field }) => <Input {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="value"
                            label={<Trans>Rate</Trans>}
                            render={({ field }) => (
                                <AffixedInput
                                    {...field}
                                    type="number"
                                    suffix="%"
                                    value={field.value}
                                    onChange={e => field.onChange(e.target.valueAsNumber)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="categoryId"
                            label={<Trans>Tax category</Trans>}
                            render={({ field }) => (
                                <TaxCategorySelector value={field.value} onChange={field.onChange} />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="zoneId"
                            label={<Trans>Zone</Trans>}
                            render={({ field }) => (
                                <ZoneSelector value={field.value} onChange={field.onChange} />
                            )}
                        />
                    </DetailFormGrid>
                </PageBlock>
                <CustomFieldsPageBlock column="main" entityType="TaxRate" control={form.control} />
            </PageLayout>
        </Page>
    );
}
