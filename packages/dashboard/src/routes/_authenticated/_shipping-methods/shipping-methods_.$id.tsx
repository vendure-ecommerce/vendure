import { ErrorPage } from '@/components/shared/error-page.js';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import {
    TranslatableFormFieldWrapper
} from '@/components/shared/translatable-form-field.js';
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
    PageDetailForm,
    PageLayout,
    PageTitle,
} from '@/framework/layout-engine/page-layout.js';
import { detailPageRouteLoader } from '@/framework/page/detail-page-route-loader.js';
import { useDetailPage } from '@/framework/page/use-detail-page.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { FulfillmentHandlerSelector } from './components/fulfillment-handler-selector.js';
import { ShippingCalculatorSelector } from './components/shipping-calculator-selector.js';
import { ShippingEligibilityCheckerSelector } from './components/shipping-eligibility-checker-selector.js';
import {
    createShippingMethodDocument,
    shippingMethodDetailDocument,
    updateShippingMethodDocument,
} from './shipping-methods.graphql.js';

export const Route = createFileRoute('/_authenticated/_shipping-methods/shipping-methods_/$id')({
    component: ShippingMethodDetailPage,
    loader: detailPageRouteLoader({
        queryDocument: shippingMethodDetailDocument,
        breadcrumb(isNew, entity) {
            return [
                { path: '/shipping-methods', label: 'Shipping methods' },
                isNew ? <Trans>New shipping method</Trans> : entity?.name,
            ];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function ShippingMethodDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        queryDocument: shippingMethodDetailDocument,
        createDocument: createShippingMethodDocument,
        updateDocument: updateShippingMethodDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                name: entity.name,
                code: entity.code,
                description: entity.description,
                fulfillmentHandler: entity.fulfillmentHandlerCode,
                checker: entity.checker && {
                    code: entity.checker?.code,
                    arguments: entity.checker?.args,
                },
                calculator: entity.calculator && {
                    code: entity.calculator?.code,
                    arguments: entity.calculator?.args,
                },
                translations: entity.translations.map(translation => ({
                    id: translation.id,
                    languageCode: translation.languageCode,
                    name: translation.name,
                    description: translation.description,
                })),
                customFields: entity.customFields,
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast.success(i18n.t('Successfully updated shipping method'));
            resetForm();
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast.error(i18n.t('Failed to update shipping method'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page>
            <PageTitle>
                {creatingNewEntity ? <Trans>New shipping method</Trans> : (entity?.name ?? '')}
            </PageTitle>
            <PageDetailForm form={form} submitHandler={submitHandler}>
                <PageActionBar>
                    <PageActionBarRight>
                        <PermissionGuard requires={['UpdateShippingMethod']}>
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
                    <PageBlock column="main">
                        <DetailFormGrid>
                            <TranslatableFormFieldWrapper
                                control={form.control}
                                name="name"
                                label={<Trans>Name</Trans>}
                                render={({ field }) => <Input {...field} />}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="code"
                                label={<Trans>Code</Trans>}
                                render={({ field }) => <Input {...field} />}
                            />
                        </DetailFormGrid>
                        <TranslatableFormFieldWrapper
                            control={form.control}
                            name="description"
                            label={<Trans>Description</Trans>}
                            render={({ field }) => <Textarea {...field} />}
                        />
                        <DetailFormGrid>
                            <FormFieldWrapper
                                control={form.control}
                                name="fulfillmentHandler"
                                label={<Trans>Fulfillment handler</Trans>}
                                render={({ field }) => (
                                    <FulfillmentHandlerSelector
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </DetailFormGrid>
                    </PageBlock>
                    <CustomFieldsPageBlock column="main" entityType="Promotion" control={form.control} />
                    <PageBlock column="main" title={<Trans>Conditions</Trans>}>
                        <FormFieldWrapper
                            control={form.control}
                            name="checker"
                            render={({ field }) => (
                                <ShippingEligibilityCheckerSelector
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </PageBlock>
                    <PageBlock column="main" title={<Trans>Calculator</Trans>}>
                        <FormFieldWrapper
                            control={form.control}
                            name="calculator"
                            render={({ field }) => (
                                <ShippingCalculatorSelector value={field.value} onChange={field.onChange} />
                            )}
                        />
                    </PageBlock>
                </PageLayout>
            </PageDetailForm>
        </Page>
    );
}
