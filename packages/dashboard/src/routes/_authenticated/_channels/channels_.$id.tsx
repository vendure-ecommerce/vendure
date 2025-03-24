import { ErrorPage } from '@/components/shared/error-page.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
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
import { createChannelDocument, channelDetailDocument, updateChannelDocument } from './channels.graphql.js';
import { SellerSelector } from '@/components/shared/seller-selector.js';
import { LanguageSelector } from '@/components/shared/language-selector.js';
import { CurrencySelector } from '@/components/shared/currency-selector.js';
import { ZoneSelector } from '@/components/shared/zone-selector.js';
import { Badge } from '@/components/ui/badge.js';
import { DEFAULT_CHANNEL_CODE } from '@/constants.js';
import { ChannelCodeLabel } from './components/channel-code-label.js';

export const Route = createFileRoute('/_authenticated/_channels/channels_/$id')({
    component: ChannelDetailPage,
    loader: async ({ context, params }) => {
        const isNew = params.id === NEW_ENTITY_PATH;
        const result = isNew
            ? null
            : await context.queryClient.ensureQueryData(
                  getDetailQueryOptions(addCustomFields(channelDetailDocument), { id: params.id }),
                  { id: params.id },
              );
        if (!isNew && !result.channel) {
            throw new Error(`Channel with the ID ${params.id} was not found`);
        }
        return {
            breadcrumb: [
                { path: '/channels', label: 'Channels' },
                isNew ? <Trans>New channel</Trans> : <ChannelCodeLabel code={result.channel.code ?? ''} />,
            ],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function ChannelDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending } = useDetailPage({
        queryDocument: addCustomFields(channelDetailDocument),
        entityField: 'channel',
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
                form.reset(form.getValues());
                if (creatingNewEntity) {
                    await navigate({ to: `../${data?.id}`, from: Route.id });
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
        <Page>
            <PageTitle>
                {creatingNewEntity ? (
                    <Trans>New channel</Trans>
                ) : (
                    <ChannelCodeLabel code={entity?.code ?? ''} />
                )}
            </PageTitle>
            <Form {...form}>
                <form onSubmit={submitHandler} className="space-y-8">
                    <PageActionBar>
                        <div></div>
                        <PermissionGuard requires={['UpdateChannel']}>
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
                            <div className="md:grid md:grid-cols-2 gap-4 items-start">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Code</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="" {...field} disabled={codeIsDefault} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div></div>
                                <FormField
                                    control={form.control}
                                    name="token"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Token</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                The token is used to specify the channel when making API
                                                requests.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sellerId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Seller</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <SellerSelector
                                                    value={field.value ?? ''}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="availableLanguageCodes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Available languages</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <LanguageSelector
                                                    value={field.value ?? []}
                                                    onChange={field.onChange}
                                                    multiple={true}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="availableCurrencyCodes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Available currencies</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <CurrencySelector
                                                    value={field.value ?? []}
                                                    onChange={field.onChange}
                                                    multiple={true}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </PageBlock>
                        <PageBlock column="main" title={<Trans>Channel defaults</Trans>}>
                            <div className="md:grid md:grid-cols-2 gap-4 items-start">
                                <FormField
                                    control={form.control}
                                    name="defaultLanguageCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Default language</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <LanguageSelector
                                                    value={field.value ?? ''}
                                                    onChange={field.onChange}
                                                    multiple={false}
                                                    availableLanguageCodes={availableLanguageCodes ?? []}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="defaultCurrencyCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Default currency</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <CurrencySelector
                                                    value={field.value ?? ''}
                                                    onChange={field.onChange}
                                                    multiple={false}
                                                    availableCurrencyCodes={availableCurrencyCodes ?? []}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="defaultTaxZoneId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Default tax zone</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <ZoneSelector
                                                    value={field.value ?? ''}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="defaultShippingZoneId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Default shipping zone</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <ZoneSelector
                                                    value={field.value ?? ''}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="pricesIncludeTax"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Prices include tax for default tax zone</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value ?? false}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                <Trans>
                                                    When this is enabled, the prices entered in the product
                                                    catalog will be included in the tax for the default tax
                                                    zone.
                                                </Trans>
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </PageBlock>
                        <CustomFieldsPageBlock column="main" entityType="Channel" control={form.control} />
                    </PageLayout>
                </form>
            </Form>
        </Page>
    );
}
