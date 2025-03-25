import { ErrorPage } from '@/components/shared/error-page.js';
import { LanguageSelector } from '@/components/shared/language-selector.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel
} from '@/components/ui/form.js';
import { Input } from '@/components/ui/input.js';
import { Switch } from '@/components/ui/switch.js';
import { NEW_ENTITY_PATH } from '@/constants.js';
import {
    CustomFieldsPageBlock,
    Page,
    PageActionBar,
    PageBlock,
    PageLayout,
    PageTitle,
} from '@/framework/layout-engine/page-layout.js';
import { useDetailPage } from '@/framework/page/use-detail-page.js';
import { api } from '@/graphql/api.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { globalSettingsDocument, updateGlobalSettingsDocument } from './global-settings.graphql.js';

export const Route = createFileRoute('/_authenticated/_global-settings/global-settings')({
    component: GlobalSettingsPage,
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData({
            queryFn: () => api.query(globalSettingsDocument),
            queryKey: ['DetailPage', 'globalSettings'],
        });
        return {
            breadcrumb: [{ path: '/global-settings', label: <Trans>Global settings</Trans> }],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function GlobalSettingsPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending } = useDetailPage({
        queryDocument: globalSettingsDocument,
        entityField: 'globalSettings',
        updateDocument: updateGlobalSettingsDocument,
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
                toast(i18n.t('Successfully updated global settings'), {
                    position: 'top-right',
                });
                form.reset(form.getValues());
                if (creatingNewEntity) {
                    await navigate({ to: `../${data?.id}`, from: Route.id });
                }
            } else {
                toast(i18n.t('Failed to update global settings'), {
                    position: 'top-right',
                    description: data.message,
                });
            }
        },
        onError: err => {
            toast(i18n.t('Failed to update global settings'), {
                position: 'top-right',
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page>
            <PageTitle>
                <Trans>Global settings</Trans>
            </PageTitle>
            <Form {...form}>
                <form onSubmit={submitHandler} className="space-y-8">
                    <PageActionBar>
                        <div></div>
                        <PermissionGuard requires={['UpdateSettings', 'UpdateGlobalSettings']}>
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
                                    name="availableLanguages"
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
                                            <FormDescription>
                                                    <Trans>
                                                        Sets the languages that are available for all
                                                        channels. Individual channels can then support a
                                                        subset of these languages.
                                                    </Trans>
                                                </FormDescription>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="outOfStockThreshold"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Global out of stock threshold</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    value={field.value ?? []}
                                                    onChange={e =>
                                                        field.onChange(Number(e.target.valueAsNumber))
                                                    }
                                                    type="number"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                <Trans>
                                                    Sets the stock level at which this a variant is considered
                                                    to be out of stock. Using a negative value enables
                                                    backorder support. Can be overridden by product variants.
                                                </Trans>
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="trackInventory"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Track inventory by default</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                <Trans>
                                                    When tracked, product variant stock levels will be
                                                    automatically adjusted when sold. This setting can be
                                                    overridden by individual product variants.
                                                </Trans>
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </PageBlock>
                        <CustomFieldsPageBlock
                            column="main"
                            entityType="GlobalSettings"
                            control={form.control}
                        />
                    </PageLayout>
                </form>
            </Form>
        </Page>
    );
}
