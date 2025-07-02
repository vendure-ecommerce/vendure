import { Button } from '@/vdb/components/ui/button.js';
import { Checkbox } from '@/vdb/components/ui/checkbox.js';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/vdb/components/ui/form.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/vdb/components/ui/select.js';
import { api } from '@/vdb/graphql/api.js';
import { graphql, ResultOf } from '@/vdb/graphql/graphql.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { addressFragment } from '../customers.graphql.js';

// Query document to fetch available countries
const getAvailableCountriesDocument = graphql(`
    query GetAvailableCountries {
        countries(options: { filter: { enabled: { eq: true } } }) {
            items {
                id
                code
                name
            }
        }
    }
`);

// Define the form schema using zod
const addressFormSchema = z.object({
    id: z.string(),
    fullName: z.string().optional(),
    company: z.string().optional(),
    streetLine1: z.string().min(1, { message: 'Street address is required' }),
    streetLine2: z.string().optional(),
    city: z.string().min(1, { message: 'City is required' }),
    province: z.string().optional(),
    postalCode: z.string().optional(),
    countryCode: z.string().min(1, { message: 'Country is required' }),
    phoneNumber: z.string().optional(),
    defaultShippingAddress: z.boolean().default(false),
    defaultBillingAddress: z.boolean().default(false),
    customFields: z.any().optional(),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;

interface CustomerAddressFormProps {
    address?: ResultOf<typeof addressFragment>;
    onSubmit?: (values: AddressFormValues) => void;
    onCancel?: () => void;
}

export function CustomerAddressForm({ address, onSubmit, onCancel }: Readonly<CustomerAddressFormProps>) {
    const { i18n } = useLingui();

    // Fetch available countries
    const { data: countriesData, isLoading: isLoadingCountries } = useQuery({
        queryKey: ['availableCountries'],
        queryFn: () => api.query(getAvailableCountriesDocument),
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

    // Set up form with react-hook-form and zod
    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressFormSchema),
        values: {
            id: address?.id || '',
            fullName: address?.fullName || '',
            company: address?.company || '',
            streetLine1: address?.streetLine1 || '',
            streetLine2: address?.streetLine2 || '',
            city: address?.city || '',
            province: address?.province || '',
            postalCode: address?.postalCode || '',
            countryCode: address?.country.code || '',
            phoneNumber: address?.phoneNumber || '',
            defaultShippingAddress: address?.defaultShippingAddress || false,
            defaultBillingAddress: address?.defaultBillingAddress || false,
            customFields: (address as any)?.customFields || {},
        },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={e => {
                    e.stopPropagation();
                    onSubmit && form.handleSubmit(onSubmit)(e);
                }}
                className="space-y-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans>Full Name</Trans>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Company */}
                    <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans>Company</Trans>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Company (optional)"
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Street Line 1 */}
                    <FormField
                        control={form.control}
                        name="streetLine1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans>Street Address</Trans>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="123 Main St" {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Street Line 2 */}
                    <FormField
                        control={form.control}
                        name="streetLine2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans>Apartment, suite, etc.</Trans>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Apt 4B (optional)"
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* City */}
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans>City</Trans>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="City" {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Province/State */}
                    <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans>State/Province</Trans>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="State/Province (optional)"
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Postal Code */}
                    <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans>Postal Code</Trans>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Postal Code" {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Country */}
                    <FormField
                        control={form.control}
                        name="countryCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans>Country</Trans>
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value || undefined}
                                    value={field.value || undefined}
                                    disabled={isLoadingCountries}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={i18n.t('Select a country')} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {countriesData?.countries.items.map(country => (
                                            <SelectItem key={country.code} value={country.code}>
                                                {country.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Phone Number */}
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Trans>Phone Number</Trans>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Phone (optional)"
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Default Address Checkboxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <FormField
                        control={form.control}
                        name="defaultShippingAddress"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        <Trans>Default Shipping Address</Trans>
                                    </FormLabel>
                                    <FormDescription>
                                        <Trans>Use as the default shipping address</Trans>
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="defaultBillingAddress"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        <Trans>Default Billing Address</Trans>
                                    </FormLabel>
                                    <FormDescription>
                                        <Trans>Use as the default billing address</Trans>
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-2 pt-4">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            <Trans>Cancel</Trans>
                        </Button>
                    )}
                    <Button type="submit">
                        <Trans>Save Address</Trans>
                    </Button>
                </div>
            </form>
        </Form>
    );
}
