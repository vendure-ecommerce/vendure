import { AffixedInput } from '@/components/data-input/affixed-input.js';
import { ErrorPage } from '@/components/shared/error-page.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { TaxCategorySelector } from '@/components/shared/tax-category-selector.js';
import { Button } from '@/components/ui/button.js';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.js';
import { Input } from '@/components/ui/input.js';
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
import { useDetailPage } from '@/framework/page/use-detail-page.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { createTaxRateDocument, taxRateDetailQuery, updateTaxRateDocument } from './tax-rates.graphql.js';
import { ZoneSelector } from '@/components/shared/zone-selector.js';
import { Switch } from '@/components/ui/switch.js';
import { detailPageRouteLoader } from '@/framework/page/detail-page-route-loader.js';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper.js';

export const Route = createFileRoute('/_authenticated/_tax-rates/tax-rates_/$id')({
    component: TaxRateDetailPage,
    loader: detailPageRouteLoader({
        queryDocument: taxRateDetailQuery,
        breadcrumb(isNew, entity) {
            return [
                { path: '/tax-rates', label: 'Tax rates' },
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
        queryDocument: taxRateDetailQuery,
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
            toast.success(i18n.t('Successfully updated tax rate'));
            resetForm();
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast.error(i18n.t('Failed to update tax rate'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId="tax-rate-detail">
            <PageTitle>{creatingNewEntity ? <Trans>New tax rate</Trans> : (entity?.name ?? '')}</PageTitle>
            <PageDetailForm form={form} submitHandler={submitHandler}>
                <PageActionBar>
                    <PageActionBarRight>
                        <PermissionGuard requires={['UpdateTaxRate']}>
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
            </PageDetailForm>
        </Page>
    );
}
