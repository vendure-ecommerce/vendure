import { MoneyInput } from '@/vdb/components/data-input/money-input.js';
import { FormFieldWrapper } from '@/vdb/components/shared/form-field-wrapper.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Checkbox } from '@/vdb/components/ui/checkbox.js';
import { Input } from '@/vdb/components/ui/input.js';
import { useChannel } from '@/vdb/hooks/use-channel.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trans } from '@lingui/react/macro';
import { VariablesOf } from 'gql.tada';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { modifyOrderDocument } from '../orders.graphql.js';

type ModifyOrderInput = VariablesOf<typeof modifyOrderDocument>['input'];
type SurchargeInput = NonNullable<ModifyOrderInput['surcharges']>[number];

const surchargeFormSchema = z.object({
    description: z.string().min(1, { message: 'Description is required' }),
    sku: z.string().optional(),
    price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Price must be a positive number',
    }),
    priceIncludesTax: z.boolean().default(false),
    taxRate: z.number().nullable().optional(),
    taxDescription: z.string().optional(),
});

type SurchargeFormValues = z.infer<typeof surchargeFormSchema>;

export interface AddSurchargeFormProps {
    onAddSurcharge: (surcharge: SurchargeInput) => void;
}

export function AddSurchargeForm({ onAddSurcharge }: Readonly<AddSurchargeFormProps>) {
    const { activeChannel } = useChannel();

    const surchargeForm = useForm<SurchargeFormValues>({
        resolver: zodResolver(surchargeFormSchema),
        defaultValues: {
            description: '',
            sku: '',
            price: '0',
            priceIncludesTax: false,
            taxRate: null,
            taxDescription: '',
        },
    });

    const handleAddSurcharge = () => {
        surchargeForm.handleSubmit(values => {
            onAddSurcharge({
                description: values.description,
                sku: values.sku || undefined,
                price: Number(values.price), // already in minor units from MoneyInput
                priceIncludesTax: values.priceIncludesTax,
                taxRate: values.taxRate ?? undefined,
                taxDescription: values.taxDescription || undefined,
            });
            surchargeForm.reset();
        })();
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormFieldWrapper
                    control={surchargeForm.control}
                    name="description"
                    label={<Trans>Description</Trans>}
                    render={({ field }) => <Input {...field} />}
                />
                <FormFieldWrapper
                    control={surchargeForm.control}
                    name="sku"
                    label={<Trans>SKU</Trans>}
                    render={({ field }) => <Input {...field} />}
                />
                <FormFieldWrapper
                    control={surchargeForm.control}
                    name="price"
                    label={<Trans>Price</Trans>}
                    render={({ field }) => (
                        <MoneyInput
                            {...field}
                            value={Number(field.value) || 0}
                            onChange={value => field.onChange(value.toString())}
                            currency={activeChannel?.defaultCurrencyCode}
                        />
                    )}
                />
                <FormFieldWrapper
                    control={surchargeForm.control}
                    name="priceIncludesTax"
                    label={<Trans>Price includes tax</Trans>}
                    render={({ field }) => (
                        <div className="flex items-center space-x-2">
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </div>
                    )}
                />
                <FormFieldWrapper
                    control={surchargeForm.control}
                    name="taxRate"
                    label={<Trans>Tax rate (%)</Trans>}
                    render={({ field }) => (
                        <Input
                            type="number"
                            step="0.01"
                            {...field}
                            value={field.value ?? ''}
                            onChange={e => {
                                const value = e.target.value === '' ? null : parseFloat(e.target.value);
                                field.onChange(isNaN(value as number) ? null : value);
                            }}
                        />
                    )}
                />
                <FormFieldWrapper
                    control={surchargeForm.control}
                    name="taxDescription"
                    label={<Trans>Tax description</Trans>}
                    render={({ field }) => <Input {...field} />}
                />
            </div>
            <Button type="button" onClick={handleAddSurcharge} disabled={!surchargeForm.formState.isValid}>
                <Plus className="w-4 h-4 mr-2" />
                <Trans>Add surcharge</Trans>
            </Button>
        </div>
    );
}
