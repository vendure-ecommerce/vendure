import { ContentLanguageSelector } from '@/components/layout/content-language-selector.js';
import { ErrorPage } from '@/components/shared/error-page.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { TranslatableFormField } from '@/components/shared/translatable-form-field.js';
import { Button } from '@/components/ui/button.js';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.js';
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
    loader: async ({ context, params }) => {
        const isNew = params.id === NEW_ENTITY_PATH;
        const result = isNew
            ? null
            : await context.queryClient.ensureQueryData(
                  getDetailQueryOptions(addCustomFields(shippingMethodDetailDocument), { id: params.id }),
                  { id: params.id },
              );
        if (!isNew && !result.shippingMethod) {
            throw new Error(`Shipping method with the ID ${params.id} was not found`);
        }
        return {
            breadcrumb: [
                { path: '/shipping-methods', label: 'Shipping methods' },
                isNew ? <Trans>New shipping method</Trans> : result.shippingMethod.name,
            ],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function ShippingMethodDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, refreshEntity } = useDetailPage({
        queryDocument: addCustomFields(shippingMethodDetailDocument),
        entityField: 'shippingMethod',
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
            toast(i18n.t('Successfully updated shipping method'), {
                position: 'top-right',
            });
            form.reset(form.getValues());
            if (creatingNewEntity) {
                await navigate({ to: `../${data?.id}`, from: Route.id });
            }
        },
        onError: err => {
            toast(i18n.t('Failed to update shipping method'), {
                position: 'top-right',
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page>
            <PageTitle>
                {creatingNewEntity ? <Trans>New shipping method</Trans> : (entity?.name ?? '')}
            </PageTitle>
            <Form {...form}>
                <form onSubmit={submitHandler} className="space-y-8">
                    <PageActionBar>
                        <ContentLanguageSelector />
                        <PermissionGuard requires={['UpdateShippingMethod']}>
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
                            <div className="md:grid md:grid-cols-2 md:gap-4 my-4">
                                <FormField
                                    control={form.control}
                                    name="fulfillmentHandler"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Fulfillment handler</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <FulfillmentHandlerSelector
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </PageBlock>
                        <CustomFieldsPageBlock column="main" entityType="Promotion" control={form.control} />
                        <PageBlock column="main" title={<Trans>Conditions</Trans>}>
                            <FormField
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
                            <FormField
                                control={form.control}
                                name="calculator"
                                render={({ field }) => (
                                    <ShippingCalculatorSelector
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
