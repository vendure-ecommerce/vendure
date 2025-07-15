import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { FormFieldWrapper } from '@/vdb/components/shared/form-field-wrapper.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Input } from '@/vdb/components/ui/input.js';
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
import { useDetailPage } from '@/vdb/framework/page/use-detail-page.js';
import { api } from '@/vdb/graphql/api.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
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

function ProfilePage() {
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
            toast(i18n.t('Successfully updated profile'));
            form.reset(form.getValues());
        },
        onError: err => {
            toast(i18n.t('Failed to update profile'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId="profile" form={form} submitHandler={submitHandler}>
            <PageTitle>
                <Trans>Profile</Trans>
            </PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <Button
                        type="submit"
                        disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                    >
                        <Trans>Update</Trans>
                    </Button>
                </PageActionBarRight>
            </PageActionBar>
            <PageLayout>
                <PageBlock column="main" blockId="main-form">
                    <DetailFormGrid>
                        <FormFieldWrapper
                            control={form.control}
                            name="firstName"
                            label={<Trans>First name</Trans>}
                            render={({ field }) => <Input {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="lastName"
                            label={<Trans>Last name</Trans>}
                            render={({ field }) => <Input {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="emailAddress"
                            label={<Trans>Email Address or identifier</Trans>}
                            render={({ field }) => <Input {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="password"
                            label={<Trans>Password</Trans>}
                            render={({ field }) => <Input type="password" {...field} />}
                        />
                    </DetailFormGrid>
                </PageBlock>
                <CustomFieldsPageBlock column="main" entityType="Administrator" control={form.control} />
            </PageLayout>
        </Page>
    );
}
