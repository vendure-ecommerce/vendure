import { ContentLanguageSelector } from '@/components/layout/content-language-selector.js';
import { ErrorPage } from '@/components/shared/error-page.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { TranslatableFormField } from '@/components/shared/translatable-form-field.js';
import { Button } from '@/components/ui/button.js';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.js';
import { Input } from '@/components/ui/input.js';
import { Textarea } from '@/components/ui/textarea.js';
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
import { PaymentEligibilityCheckerSelector } from './components/payment-eligibility-checker-selector.js';
import { PaymentHandlerSelector } from './components/payment-handler-selector.js';
import {
    createPaymentMethodDocument,
    paymentMethodDetailDocument,
    updatePaymentMethodDocument,
} from './payment-methods.graphql.js';
import { Switch } from '@/components/ui/switch.js';

export const Route = createFileRoute('/_authenticated/_payment-methods/payment-methods_/$id')({
    component: PaymentMethodDetailPage,
    loader: async ({ context, params }) => {
        const isNew = params.id === NEW_ENTITY_PATH;
        const result = isNew
            ? null
            : await context.queryClient.ensureQueryData(
                  getDetailQueryOptions(addCustomFields(paymentMethodDetailDocument), { id: params.id }),
                  { id: params.id },
              );
        if (!isNew && !result.paymentMethod) {
            throw new Error(`Payment method with the ID ${params.id} was not found`);
        }
        return {
            breadcrumb: [
                { path: '/payment-methods', label: 'Payment methods' },
                isNew ? <Trans>New payment method</Trans> : result.paymentMethod.name,
            ],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function PaymentMethodDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, refreshEntity } = useDetailPage({
        queryDocument: addCustomFields(paymentMethodDetailDocument),
        entityField: 'paymentMethod',
        createDocument: createPaymentMethodDocument,
        updateDocument: updatePaymentMethodDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                enabled: entity.enabled,
                name: entity.name,
                code: entity.code,
                description: entity.description,
                    checker: entity.checker?.code ? {
                    code: entity.checker?.code,
                    arguments: entity.checker?.args,
                } : null,
                handler: entity.handler?.code ? {
                    code: entity.handler?.code,
                    arguments: entity.handler?.args,
                } : null,
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
            toast(i18n.t('Successfully updated payment method'), {
                position: 'top-right',
            });
            form.reset(form.getValues());
            if (creatingNewEntity) {
                await navigate({ to: `../${data?.id}`, from: Route.id });
            }
        },
        onError: err => {
            toast(i18n.t('Failed to update payment method'), {
                position: 'top-right',
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page>
            <PageTitle>
                {creatingNewEntity ? <Trans>New payment method</Trans> : (entity?.name ?? '')}
            </PageTitle>
            <Form {...form}>
                <form onSubmit={submitHandler} className="space-y-8">
                    <PageActionBar>
                        <ContentLanguageSelector />
                        <PermissionGuard requires={['UpdatePaymentMethod']}>
                            <Button
                                type="submit"
                                disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                            >
                                <Trans>Update</Trans>
                            </Button>
                        </PermissionGuard>
                    </PageActionBar>
                    <PageLayout>
                    <PageBlock column="side">
                            <FormField
                                control={form.control}
                                name="enabled"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <Trans>Enabled</Trans>
                                        </FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </PageBlock>
                        <PageBlock column="main">
                            <div className="md:grid md:grid-cols-2 md:gap-4 mb-4">
                                <TranslatableFormField
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
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Code</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <TranslatableFormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <Trans>Description</Trans>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </PageBlock>
                        <CustomFieldsPageBlock column="main" entityType="PaymentMethod" control={form.control} />
                        <PageBlock column="main" title={<Trans>Payment eligibility checker</Trans>}>
                            <FormField
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
                        <PageBlock column="main" title={<Trans>Calculator</Trans>}>
                            <FormField
                                control={form.control}
                                name="handler"
                                render={({ field }) => (
                                    <PaymentHandlerSelector
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </PageBlock>
                    </PageLayout>
                </form>
            </Form>
        </Page>
    );
}
