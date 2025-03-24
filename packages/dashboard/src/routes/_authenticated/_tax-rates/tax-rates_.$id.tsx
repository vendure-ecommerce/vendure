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
import { createTaxRateDocument, taxRateDetailQuery, updateTaxRateDocument } from './tax-rates.graphql.js';
import { ZoneSelector } from '@/components/shared/zone-selector.js';
import { Switch } from '@/components/ui/switch.js';
export const Route = createFileRoute('/_authenticated/_tax-rates/tax-rates_/$id')({
    component: TaxRateDetailPage,
    loader: async ({ context, params }) => {
        const isNew = params.id === NEW_ENTITY_PATH;
        const result = isNew
            ? null
            : await context.queryClient.ensureQueryData(
                  getDetailQueryOptions(addCustomFields(taxRateDetailQuery), { id: params.id }),
                  { id: params.id },
              );
        if (!isNew && !result.taxRate) {
            throw new Error(`Tax rate with the ID ${params.id} was not found`);
        }
        return {
            breadcrumb: [
                { path: '/tax-rates', label: 'Tax rates' },
                isNew ? <Trans>New tax rate</Trans> : result.taxRate.name,
            ],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function TaxRateDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending } = useDetailPage({
        queryDocument: addCustomFields(taxRateDetailQuery),
        entityField: 'taxRate',
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
            toast(i18n.t('Successfully updated tax rate'), {
                position: 'top-right',
            });
            form.reset(form.getValues());
            if (creatingNewEntity) {
                await navigate({ to: `../${data?.id}`, from: Route.id });
            }
        },
        onError: err => {
            toast(i18n.t('Failed to update tax rate'), {
                position: 'top-right',
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page>
            <PageTitle>{creatingNewEntity ? <Trans>New tax rate</Trans> : (entity?.name ?? '')}</PageTitle>
            <Form {...form}>
                <form onSubmit={submitHandler} className="space-y-8">
                    <PageActionBar>
                        <div></div>
                        <PermissionGuard requires={['UpdateTaxRate']}>
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
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </PageBlock>
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
                                <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Rate</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <AffixedInput
                                                    type="number"
                                                    suffix="%"
                                                    value={field.value}
                                                    onChange={e => field.onChange(e.target.valueAsNumber)}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Tax category</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <TaxCategorySelector
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="zoneId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Zone</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <ZoneSelector value={field.value} onChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </PageBlock>
                        <CustomFieldsPageBlock column="main" entityType="TaxRate" control={form.control} />
                    </PageLayout>
                </form>
            </Form>
        </Page>
    );
}
