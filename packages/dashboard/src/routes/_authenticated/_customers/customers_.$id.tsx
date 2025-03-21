import { ContentLanguageSelector } from '@/components/layout/content-language-selector.js';
import { ErrorPage } from '@/components/shared/error-page.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { TranslatableFormField } from '@/components/shared/translatable-form-field.js';
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
    createCustomerDocument,
    customerDetailDocument,
    updateCustomerDocument,
} from './customers.graphql.js';
import { CustomerAddressCard } from './components/customer-address-card.js';

export const Route = createFileRoute('/_authenticated/_customers/customers_/$id')({
    component: CustomerDetailPage,
    loader: async ({ context, params }) => {
        const isNew = params.id === NEW_ENTITY_PATH;
        const result = isNew
            ? null
            : await context.queryClient.ensureQueryData(
                  getDetailQueryOptions(addCustomFields(customerDetailDocument), { id: params.id }),
                  { id: params.id },
              );
        if (!isNew && !result.customer) {
            throw new Error(`Customer with the ID ${params.id} was not found`);
        }
        return {
            breadcrumb: [
                { path: '/customers', label: 'Customers' },
                isNew ? (
                    <Trans>New customer</Trans>
                ) : (
                    `${result.customer.firstName} ${result.customer.lastName}`
                ),
            ],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function CustomerDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending } = useDetailPage({
        queryDocument: addCustomFields(customerDetailDocument),
        entityField: 'customer',
        createDocument: createCustomerDocument,
        updateDocument: updateCustomerDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                title: entity.title,
                emailAddress: entity.emailAddress,
                firstName: entity.firstName,
                lastName: entity.lastName,
                phoneNumber: entity.phoneNumber,
                addresses: entity.addresses,
                customFields: entity.customFields,
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            if (data.__typename === 'Customer') {
                toast(i18n.t('Successfully updated customer'), {
                    position: 'top-right',
                });
                form.reset(form.getValues());
                if (creatingNewEntity) {
                    await navigate({ to: `../${data?.id}`, from: Route.id });
                }
            } else {
                toast(i18n.t('Failed to update customer'), {
                    position: 'top-right',
                    description: data.message,
                });
            }
        },
        onError: err => {
            toast(i18n.t('Failed to update customer'), {
                position: 'top-right',
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    const customerName = entity ? `${entity.firstName} ${entity.lastName}` : '';

    return (
        <Page>
            <PageTitle>{creatingNewEntity ? <Trans>New customer</Trans> : customerName}</PageTitle>
            <Form {...form}>
                <form onSubmit={submitHandler} className="space-y-8">
                    <PageActionBar>
                        <div></div>
                        <PermissionGuard requires={['UpdateCustomer']}>
                            <Button
                                type="submit"
                                disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                            >
                                <Trans>Update</Trans>
                            </Button>
                        </PermissionGuard>
                    </PageActionBar>
                    <PageLayout>
                        {/*  <PageBlock column="side"></PageBlock> */}
                        <PageBlock column="main">
                            <div className="md:grid md:grid-cols-2 w-full gap-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Title</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div></div>
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
                                                <Trans>Email address</Trans>
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
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Phone number</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </PageBlock>
                        <CustomFieldsPageBlock column="main" entityType="Customer" control={form.control} />
                        <PageBlock column="main" title={<Trans>Addresses</Trans>}>
                            <div className="md:grid md:grid-cols-2 gap-4">
                                {entity?.addresses?.map(address => (
                                    <CustomerAddressCard
                                        key={address.id}
                                        address={address}
                                        editable
                                        deletable
                                    />
                                ))}
                            </div>
                        </PageBlock>
                    </PageLayout>
                </form>
            </Form>
        </Page>
    );
}
