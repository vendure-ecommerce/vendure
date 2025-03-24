import { ContentLanguageSelector } from '@/components/layout/content-language-selector.js';
import { EntityAssets } from '@/components/shared/entity-assets.js';
import { ErrorPage } from '@/components/shared/error-page.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { TranslatableFormField } from '@/components/shared/translatable-form-field.js';
import { Button } from '@/components/ui/button.js';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form.js';
import { Input } from '@/components/ui/input.js';
import { Switch } from '@/components/ui/switch.js';
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
import {
    collectionDetailDocument,
    createCollectionDocument,
    updateCollectionDocument,
} from './collections.graphql.js';
import { CollectionContentsTable } from './components/collection-contents-table.js';
import { CollectionFiltersSelect } from './components/collection-filters-select.js';
import { CollectionContentsPreviewTable } from './components/collection-contents-preview-table.js';
import {
    promotionDetailDocument,
    createPromotionDocument,
    updatePromotionDocument,
} from './promotions.graphql.js';
import { PromotionConditionsSelector } from './components/promotion-conditions-selector.js';
import { PromotionActionsSelector } from './components/promotion-actions-selector.js';
import { DateTimeInput } from '@/components/data-input/datetime-input.js';

export const Route = createFileRoute('/_authenticated/_promotions/promotions_/$id')({
    component: PromotionDetailPage,
    loader: async ({ context, params }) => {
        const isNew = params.id === NEW_ENTITY_PATH;
        const result = isNew
            ? null
            : await context.queryClient.ensureQueryData(
                  getDetailQueryOptions(addCustomFields(promotionDetailDocument), { id: params.id }),
                  { id: params.id },
              );
        if (!isNew && !result.promotion) {
            throw new Error(`Promotion with the ID ${params.id} was not found`);
        }
        return {
            breadcrumb: [
                { path: '/promotions', label: 'Promotions' },
                isNew ? <Trans>New promotion</Trans> : result.promotion.name,
            ],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function PromotionDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, refreshEntity } = useDetailPage({
        queryDocument: addCustomFields(promotionDetailDocument),
        entityField: 'promotion',
        createDocument: createPromotionDocument,
        transformCreateInput: values => {
            return {
                ...values,
                conditions: values.conditions.filter(c => c.code !== ''),
                actions: values.actions.filter(a => a.code !== ''),
            };
        },
        updateDocument: updatePromotionDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                name: entity.name,
                description: entity.description,
                enabled: entity.enabled,
                couponCode: entity.couponCode,
                perCustomerUsageLimit: entity.perCustomerUsageLimit,
                usageLimit: entity.usageLimit,
                startsAt: entity.startsAt,
                endsAt: entity.endsAt,
                conditions: entity.conditions.map(x => ({
                    code: x.code,
                    arguments: x.args.map(a => ({ name: a.name, value: a.value })),
                })),
                actions: entity.actions.map(x => ({
                    code: x.code,
                    arguments: x.args.map(a => ({ name: a.name, value: a.value })),
                })),
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
            toast(i18n.t('Successfully updated promotion'), {
                position: 'top-right',
            });
            form.reset(form.getValues());
            if (creatingNewEntity) {
                await navigate({ to: `../${data?.id}`, from: Route.id });
            }
        },
        onError: err => {
            toast(i18n.t('Failed to update promotion'), {
                position: 'top-right',
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page>
            <PageTitle>{creatingNewEntity ? <Trans>New promotion</Trans> : (entity?.name ?? '')}</PageTitle>
            <Form {...form}>
                <form onSubmit={submitHandler} className="space-y-8">
                    <PageActionBar>
                        <ContentLanguageSelector />
                        <PermissionGuard requires={['UpdatePromotion']}>
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
                                        <FormDescription>
                                            <Trans>
                                                If a promotion is enabled, it will be applied to orders in the
                                                shop
                                            </Trans>
                                        </FormDescription>
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
                                    name="startsAt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Starts at</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <DateTimeInput value={field.value} onChange={value => field.onChange(value.toISOString())} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}  
                                />
                                <FormField
                                    control={form.control}
                                    name="endsAt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Ends at</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <DateTimeInput value={field.value} onChange={value => field.onChange(value.toISOString())} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="couponCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Coupon code</Trans>
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
                                    name="perCustomerUsageLimit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Per customer usage limit</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="" type="number" value={field.value} onChange={e => field.onChange(e.target.valueAsNumber)} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="usageLimit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Usage limit</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="" type="number" value={field.value} onChange={e => field.onChange(e.target.valueAsNumber)} />
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
                                name="conditions"
                                render={({ field }) => (
                                    <PromotionConditionsSelector
                                        value={field.value ?? []}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </PageBlock>
                        <PageBlock column="main" title={<Trans>Actions</Trans>}>
                            <FormField
                                control={form.control}
                                name="actions"
                                render={({ field }) => (
                                    <PromotionActionsSelector
                                        value={field.value ?? []}
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
