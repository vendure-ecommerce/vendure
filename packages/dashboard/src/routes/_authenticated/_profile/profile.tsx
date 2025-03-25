import { ErrorPage } from '@/components/shared/error-page.js';
import { Button } from '@/components/ui/button.js';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form.js';
import { Input } from '@/components/ui/input.js';
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
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import { activeAdministratorDocument, updateAdministratorDocument } from './profile.graphql.js';

export const Route = createFileRoute('/_authenticated/_profile/profile')({
    component: ProfilePage,
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData({
            queryFn: () => api.query(activeAdministratorDocument),
            queryKey: ['DetailPage', 'profile'],
        });
        return {
            breadcrumb: [{ path: '/profile', label: <Trans>Profile</Trans> }],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function ProfilePage() {
    const { i18n } = useLingui();

    const { form, submitHandler, isPending } = useDetailPage({
        queryDocument: activeAdministratorDocument,
        entityField: 'activeAdministrator',
        updateDocument: updateAdministratorDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                firstName: entity.firstName,
                lastName: entity.lastName,
                emailAddress: entity.emailAddress,
                password: '',
                customFields: entity.customFields,
            };
        },
        transformUpdateInput: input => {
            return {
                ...input,
                password: input.password?.length ? input.password : undefined,
            };
        },
        params: { id: 'undefined' },
        onSuccess: async data => {
            toast(i18n.t('Successfully updated profile'), {
                position: 'top-right',
            });
            form.reset(form.getValues());
        },
        onError: err => {
            toast(i18n.t('Failed to update profile'), {
                position: 'top-right',
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page>
            <PageTitle>
                <Trans>Profile</Trans>
            </PageTitle>
            <Form {...form}>
                <form onSubmit={submitHandler} className="space-y-8">
                    <PageActionBar>
                        <div></div>
                        <Button
                            type="submit"
                            disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                        >
                            <Trans>Update</Trans>
                        </Button>
                    </PageActionBar>
                    <PageLayout>
                        <PageBlock column="main">
                            <div className="md:grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>First name</Trans>
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
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Last name</Trans>
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
                                    name="emailAddress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Email Address or identifier</Trans>
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
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Password</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="" type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </PageBlock>
                        <CustomFieldsPageBlock
                            column="main"
                            entityType="Administrator"
                            control={form.control}
                        />
                    </PageLayout>
                </form>
            </Form>
        </Page>
    );
}
