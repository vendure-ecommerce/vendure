import { CurrencySelector } from '@/components/shared/currency-selector.js';
import { ErrorPage } from '@/components/shared/error-page.js';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper.js';
import { LanguageSelector } from '@/components/shared/language-selector.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { SellerSelector } from '@/components/shared/seller-selector.js';
import { ZoneSelector } from '@/components/shared/zone-selector.js';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Switch } from '@/components/ui/switch.js';
import { DEFAULT_CHANNEL_CODE, NEW_ENTITY_PATH } from '@/constants.js';
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
import { ChannelCodeLabel } from '../../../components/shared/channel-code-label.js';
import { channelDetailDocument, createChannelDocument, updateChannelDocument } from './channels.graphql.js';

export const Route = createFileRoute('/_authenticated/_channels/channels_/$id')({
    component: ChannelDetailPage,
    loader: detailPageRouteLoader({
        queryDocument: channelDetailDocument,
        breadcrumb(isNew, entity) {
            return [
                { path: '/channels', label: 'Channels' },
                isNew ? <Trans>New channel</Trans> : <ChannelCodeLabel code={entity?.code ?? ''} />,
            ];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function ChannelDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        queryDocument: channelDetailDocument,
        createDocument: createChannelDocument,
        updateDocument: updateChannelDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                code: entity.code,
                token: entity.token,
                pricesIncludeTax: entity.pricesIncludeTax,
                availableCurrencyCodes: entity.availableCurrencyCodes,
                availableLanguageCodes: entity.availableLanguageCodes,
                defaultCurrencyCode: entity.defaultCurrencyCode,
                defaultLanguageCode: entity.defaultLanguageCode,
                defaultShippingZoneId: entity.defaultShippingZone?.id,
                defaultTaxZoneId: entity.defaultTaxZone?.id,
                sellerId: entity.seller?.id,
                customFields: entity.customFields,
            };
        },
        transformCreateInput: input => {
            return {
                ...input,
                currencyCode: undefined,
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            if (data.__typename === 'Channel') {
                toast(i18n.t('Successfully updated channel'), {
                    position: 'top-right',
                });
                resetForm();
                if (creatingNewEntity) {
                    await navigate({ to: `../$id`, params: { id: data.id } });
                }
            } else {
                toast(i18n.t('Failed to update channel'), {
                    position: 'top-right',
                    description: data.message,
                });
            }
        },
        onError: err => {
            toast(i18n.t('Failed to update channel'), {
                position: 'top-right',
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    const availableCurrencyCodes = form.watch('availableCurrencyCodes');
    const availableLanguageCodes = form.watch('availableLanguageCodes');

    const codeIsDefault = entity?.code === DEFAULT_CHANNEL_CODE;

    return (
        <Page pageId="channel-detail">
            <PageTitle>
                {creatingNewEntity ? (
                    <Trans>New channel</Trans>
                ) : (
                    <ChannelCodeLabel code={entity?.code ?? ''} />
                )}
            </PageTitle>
            <PageDetailForm form={form} submitHandler={submitHandler}>
                <PageActionBar>
                    <PageActionBarRight>
                        <PermissionGuard requires={['UpdateChannel']}>
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
                                name="code"
                                label={<Trans>Code</Trans>}
                                render={({ field }) => (
                                    <Input placeholder="" {...field} disabled={codeIsDefault} />
                                )}
                            />
                            <div></div>
                            <FormFieldWrapper
                                control={form.control}
                                name="token"
                                label={<Trans>Token</Trans>}
                                description={
                                    <Trans>
                                        The token is used to specify the channel when making API requests.
                                    </Trans>
                                }
                                render={({ field }) => <Input placeholder="" {...field} />}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="sellerId"
                                label={<Trans>Seller</Trans>}
                                render={({ field }) => (
                                    <SellerSelector value={field.value ?? ''} onChange={field.onChange} />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="availableLanguageCodes"
                                label={<Trans>Available languages</Trans>}
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
                                name="availableCurrencyCodes"
                                label={<Trans>Available currencies</Trans>}
                                render={({ field }) => (
                                    <CurrencySelector
                                        value={field.value ?? []}
                                        onChange={field.onChange}
                                        multiple={true}
                                    />
                                )}
                            />
                        </DetailFormGrid>
                    </PageBlock>
                    <PageBlock column="main" blockId="channel-defaults" title={<Trans>Channel defaults</Trans>}>
                        <DetailFormGrid>
                            <FormFieldWrapper
                                control={form.control}
                                name="defaultLanguageCode"
                                label={<Trans>Default language</Trans>}
                                render={({ field }) => (
                                    <LanguageSelector
                                        value={field.value ?? ''}
                                        onChange={field.onChange}
                                        multiple={false}
                                        availableLanguageCodes={availableLanguageCodes ?? []}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="defaultCurrencyCode"
                                label={<Trans>Default currency</Trans>}
                                render={({ field }) => (
                                    <CurrencySelector
                                        value={field.value ?? ''}
                                        onChange={field.onChange}
                                        multiple={false}
                                        availableCurrencyCodes={availableCurrencyCodes ?? []}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="defaultTaxZoneId"
                                label={<Trans>Default tax zone</Trans>}
                                render={({ field }) => (
                                    <ZoneSelector value={field.value ?? ''} onChange={field.onChange} />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="defaultShippingZoneId"
                                label={<Trans>Default shipping zone</Trans>}
                                render={({ field }) => (
                                    <ZoneSelector value={field.value ?? ''} onChange={field.onChange} />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="pricesIncludeTax"
                                label={<Trans>Prices include tax for default tax zone</Trans>}
                                description={
                                    <Trans>
                                        When this is enabled, the prices entered in the product catalog will
                                        be included in the tax for the default tax zone.
                                    </Trans>
                                }
                                render={({ field }) => (
                                    <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                                )}
                            />
                        </DetailFormGrid>
                    </PageBlock>
                    <CustomFieldsPageBlock column="main" entityType="Channel" control={form.control} />
                </PageLayout>
            </PageDetailForm>
        </Page>
    );
}
