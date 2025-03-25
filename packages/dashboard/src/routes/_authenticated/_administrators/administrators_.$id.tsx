import { ErrorPage } from '@/components/shared/error-page.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
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
import {
    administratorDetailDocument,
    createAdministratorDocument,
    updateAdministratorDocument,
} from './administrators.graphql.js';
import { RoleSelector } from '@/components/shared/role-selector.js';
import { RolePermissionsDisplay } from './components/role-permissions-display.js';

export const Route = createFileRoute('/_authenticated/_administrators/administrators_/$id')({
    component: AdministratorDetailPage,
    loader: async ({ context, params }) => {
        const isNew = params.id === NEW_ENTITY_PATH;
        const result = isNew
            ? null
            : await context.queryClient.ensureQueryData(
                  getDetailQueryOptions(administratorDetailDocument, { id: params.id }),
                  { id: params.id },
              );
        if (!isNew && !result.administrator) {
            throw new Error(`Administrator with the ID ${params.id} was not found`);
        }
        return {
            breadcrumb: [
                { path: '/administrators', label: 'Administrators' },
                isNew ? <Trans>New administrator</Trans> : result.administrator.firstName,
            ],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function AdministratorDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending } = useDetailPage({
        queryDocument: addCustomFields(administratorDetailDocument),
        entityField: 'administrator',
        createDocument: createAdministratorDocument,
        updateDocument: updateAdministratorDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                firstName: entity.firstName,
                lastName: entity.lastName,
                emailAddress: entity.emailAddress,
                password: '',
                customFields: entity.customFields,
                roleIds: entity.user.roles.map(role => role.id),
            };
        },
        transformUpdateInput: input => {
            return {
                ...input,
                password: input.password || undefined,
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast(i18n.t('Successfully updated administrator'), {
                position: 'top-right',
            });
            form.reset(form.getValues());
            if (creatingNewEntity) {
                await navigate({ to: `../${data?.id}`, from: Route.id });
            }
        },
        onError: err => {
            toast(i18n.t('Failed to update administrator'), {
                position: 'top-right',
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    const name = `${entity?.firstName} ${entity?.lastName}`;
    const roleIds = form.watch('roleIds');

    return (
        <Page>
            <PageTitle>{creatingNewEntity ? <Trans>New administrator</Trans> : name}</PageTitle>
            <Form {...form}>
                <form onSubmit={submitHandler} className="space-y-8">
                    <PageActionBar>
                        <div></div>
                        <PermissionGuard requires={['UpdateAdministrator']}>
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
                        <PageBlock column="main" title={<Trans>Roles</Trans>}>
                            <FormField
                                control={form.control}
                                name="roleIds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <RoleSelector
                                                value={field.value ?? []}
                                                onChange={field.onChange}
                                                multiple={true}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <RolePermissionsDisplay
                                channels={entity?.user?.roles.flatMap(role => role.channels) ?? []}
                                value={roleIds ?? []}
                            />
                        </PageBlock>
                    </PageLayout>
                </form>
            </Form>
        </Page>
    );
}
