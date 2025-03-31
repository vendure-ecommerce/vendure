import { RichTextInput } from '@/components/data-input/richt-text-input.js';
import { ErrorPage } from '@/components/shared/error-page.js';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { TranslatableFormFieldWrapper } from '@/components/shared/translatable-form-field.js';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Switch } from '@/components/ui/switch.js';
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
import { PaymentEligibilityCheckerSelector } from './components/payment-eligibility-checker-selector.js';
import { PaymentHandlerSelector } from './components/payment-handler-selector.js';
import {
    createPaymentMethodDocument,
    paymentMethodDetailDocument,
    updatePaymentMethodDocument,
} from './payment-methods.graphql.js';

export const Route = createFileRoute('/_authenticated/_payment-methods/payment-methods_/$id')({
    component: PaymentMethodDetailPage,
    loader: detailPageRouteLoader({
        queryDocument: paymentMethodDetailDocument,
        breadcrumb(_isNew, entity) {
            return [{ path: '/payment-methods', label: 'Payment methods' }, entity?.name];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function PaymentMethodDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        queryDocument: paymentMethodDetailDocument,
        createDocument: createPaymentMethodDocument,
        updateDocument: updatePaymentMethodDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                enabled: entity.enabled,
                name: entity.name,
                code: entity.code,
                description: entity.description,
                checker: entity.checker?.code
                    ? {
                          code: entity.checker?.code,
                          arguments: entity.checker?.args,
                      }
                    : null,
                handler: entity.handler?.code
                    ? {
                          code: entity.handler?.code,
                          arguments: entity.handler?.args,
                      }
                    : null,
                translations: entity.translations.map(translation => ({
                    id: translation.id,
                    languageCode: translation.languageCode,
                    name: translation.name,
                    description: translation.description,
                })),
                customFields: entity.customFields,
            };
        },
        transformCreateInput: input => {
            return {
                ...input,
                checker: input.checker?.code ? input.checker : undefined,
                handler: input.handler,
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast.success(i18n.t('Successfully updated payment method'));
            resetForm();
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast.error(i18n.t('Failed to update payment method'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId="payment-method-detail" form={form} submitHandler={submitHandler}>
            <PageTitle>
                {creatingNewEntity ? <Trans>New payment method</Trans> : (entity?.name ?? '')}
            </PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdatePaymentMethod']}>
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
                            <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
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
                        render={({ field }) => <RichTextInput {...field} />}
                    />
                </PageBlock>
                <CustomFieldsPageBlock column="main" entityType="PaymentMethod" control={form.control} />
                <PageBlock
                    column="main"
                    blockId="payment-eligibility-checker"
                    title={<Trans>Payment eligibility checker</Trans>}
                >
                    <FormFieldWrapper
                        control={form.control}
                        name="checker"
                        render={({ field }) => (
                            <PaymentEligibilityCheckerSelector
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </PageBlock>
                <PageBlock column="main" blockId="payment-handler" title={<Trans>Calculator</Trans>}>
                    <FormFieldWrapper
                        control={form.control}
                        name="handler"
                        render={({ field }) => (
                            <PaymentHandlerSelector value={field.value} onChange={field.onChange} />
                        )}
                    />
                </PageBlock>
            </PageLayout>
        </Page>
    );
}
