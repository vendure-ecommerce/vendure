import { DateTimeInput } from '@/components/data-input/datetime-input.js';
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
import { PromotionActionsSelector } from './components/promotion-actions-selector.js';
import { PromotionConditionsSelector } from './components/promotion-conditions-selector.js';
import {
    createPromotionDocument,
    promotionDetailDocument,
    updatePromotionDocument,
} from './promotions.graphql.js';

export const Route = createFileRoute('/_authenticated/_promotions/promotions_/$id')({
    component: PromotionDetailPage,
    loader: detailPageRouteLoader({
        queryDocument: promotionDetailDocument,
        breadcrumb(isNew, entity) {
            return [
                { path: '/promotions', label: 'Promotions' },
                isNew ? <Trans>New promotion</Trans> : entity?.name,
            ];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function PromotionDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        queryDocument: promotionDetailDocument,
        createDocument: createPromotionDocument,
        transformCreateInput: values => {
            return {
                ...values,
                startsAt: values.startsAt || undefined,
                endsAt: values.endsAt || undefined,
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
            if (data.__typename === 'Promotion') {
                toast.success(i18n.t('Successfully updated promotion'));
                resetForm();
                if (creatingNewEntity) {
                    await navigate({ to: `../${data.id}`, from: Route.id });
                }
            } else {
                toast.error(i18n.t('Failed to update promotion'), {
                    description: data.message,
                });
            }
        },
        onError: err => {
            toast.error(i18n.t('Failed to update promotion'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId="promotion-detail" form={form} submitHandler={submitHandler}>
            <PageTitle>{creatingNewEntity ? <Trans>New promotion</Trans> : (entity?.name ?? '')}</PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdatePromotion']}>
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
                        description={<Trans>When enabled, a promotion is available in the shop</Trans>}
                        render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                        <div></div>
                    </DetailFormGrid>
                    <div className="mb-4">
                        <TranslatableFormFieldWrapper
                            control={form.control}
                            name="description"
                            label={<Trans>Description</Trans>}
                            render={({ field }) => <RichTextInput {...field} />}
                        />
                    </div>
                    <DetailFormGrid>
                        <FormFieldWrapper
                            control={form.control}
                            name="startsAt"
                            label={<Trans>Starts at</Trans>}
                            render={({ field }) => (
                                <DateTimeInput
                                    value={field.value}
                                    onChange={value => field.onChange(value.toISOString())}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="endsAt"
                            label={<Trans>Ends at</Trans>}
                            render={({ field }) => (
                                <DateTimeInput
                                    value={field.value}
                                    onChange={value => field.onChange(value.toISOString())}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="couponCode"
                            label={<Trans>Coupon code</Trans>}
                            render={({ field }) => <Input {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="perCustomerUsageLimit"
                            label={<Trans>Per customer usage limit</Trans>}
                            render={({ field }) => (
                                <Input
                                    type="number"
                                    value={field.value ?? ''}
                                    onChange={e => field.onChange(e.target.valueAsNumber)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="usageLimit"
                            label={<Trans>Usage limit</Trans>}
                            render={({ field }) => (
                                <Input
                                    type="number"
                                    value={field.value ?? ''}
                                    onChange={e => field.onChange(e.target.valueAsNumber)}
                                />
                            )}
                        />
                    </DetailFormGrid>
                </PageBlock>
                <CustomFieldsPageBlock column="main" entityType="Promotion" control={form.control} />
                <PageBlock column="main" blockId="conditions" title={<Trans>Conditions</Trans>}>
                    <FormFieldWrapper
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
                <PageBlock column="main" blockId="actions" title={<Trans>Actions</Trans>}>
                    <FormFieldWrapper
                        control={form.control}
                        name="actions"
                        render={({ field }) => (
                            <PromotionActionsSelector value={field.value ?? []} onChange={field.onChange} />
                        )}
                    />
                </PageBlock>
            </PageLayout>
        </Page>
    );
}
