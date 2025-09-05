import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { FormFieldWrapper } from '@/vdb/components/shared/form-field-wrapper.js';
import { LanguageSelector } from '@/vdb/components/shared/language-selector.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Switch } from '@/vdb/components/ui/switch.js';
import { NEW_ENTITY_PATH } from '@/vdb/constants.js';
import { extendDetailFormQuery } from '@/vdb/framework/document-extension/extend-detail-form-query.js';
import { addCustomFields } from '@/vdb/framework/document-introspection/add-custom-fields.js';
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
import { getDetailQueryOptions, useDetailPage } from '@/vdb/framework/page/use-detail-page.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { globalSettingsDocument, updateGlobalSettingsDocument } from './global-settings.graphql.js';

const pageId = 'global-settings';

export const Route = createFileRoute('/_authenticated/_global-settings/global-settings')({
    component: GlobalSettingsPage,
    loader: async ({ context }) => {
        const { extendedQuery: extendedQueryDocument } = extendDetailFormQuery(
            addCustomFields(globalSettingsDocument),
            pageId,
        );
        await context.queryClient.ensureQueryData(
            getDetailQueryOptions(extendedQueryDocument, { id: '' }),
            {},
        );
        return {
            breadcrumb: [{ path: '/global-settings', label: <Trans>Global Settings</Trans> }],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function GlobalSettingsPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending } = useDetailPage({
        queryDocument: globalSettingsDocument,
        entityName: 'GlobalSettings',
        updateDocument: updateGlobalSettingsDocument,
        pageId,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                availableLanguages: entity.availableLanguages,
                trackInventory: entity.trackInventory,
                outOfStockThreshold: entity.outOfStockThreshold,
                customFields: entity.customFields,
            };
        },
        params: { id: 'undefined' },
        onSuccess: async data => {
            if (data.__typename === 'GlobalSettings') {
                toast(i18n.t('Successfully updated global settings'));
                form.reset(form.getValues());
                if (creatingNewEntity) {
                    await navigate({ to: `../$id`, params: { id: data.id } });
                }
            } else {
                toast(i18n.t('Failed to update global settings'), {
                    description: data.message,
                });
            }
        },
        onError: err => {
            toast(i18n.t('Failed to update global settings'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
            <PageTitle>
                <Trans>Global Settings</Trans>
            </PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdateSettings', 'UpdateGlobalSettings']}>
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
                <PageBlock column="main" blockId="main-form">
                    <DetailFormGrid>
                        <FormFieldWrapper
                            control={form.control}
                            name="availableLanguages"
                            label={<Trans>Available languages</Trans>}
                            description={
                                <Trans>
                                    Sets the languages that are available for all channels. Individual
                                    channels can then support a subset of these languages.
                                </Trans>
                            }
                            render={({ field }) => (
                                <LanguageSelector
                                    value={field.value ?? []}
                                    onChange={field.onChange}
                                    multiple={true}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="outOfStockThreshold"
                            label={<Trans>Global out of stock threshold</Trans>}
                            description={
                                <Trans>
                                    Sets the stock level at which this a variant is considered to be out of
                                    stock. Using a negative value enables backorder support. Can be overridden
                                    by product variants.
                                </Trans>
                            }
                            render={({ field }) => (
                                <Input
                                    value={field.value ?? []}
                                    onChange={e => field.onChange(Number(e.target.valueAsNumber))}
                                    type="number"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="trackInventory"
                            label={<Trans>Track inventory by default</Trans>}
                            description={
                                <Trans>
                                    When tracked, product variant stock levels will be automatically adjusted
                                    when sold. This setting can be overridden by individual product variants.
                                </Trans>
                            }
                            render={({ field }) => (
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            )}
                        />
                    </DetailFormGrid>
                </PageBlock>
                <CustomFieldsPageBlock column="main" entityType="GlobalSettings" control={form.control} />
            </PageLayout>
        </Page>
    );
}
