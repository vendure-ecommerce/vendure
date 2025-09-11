import { FormFieldWrapper } from '@/vdb/components/shared/form-field-wrapper.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Form } from '@/vdb/components/ui/form.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Trans } from '@/vdb/lib/trans.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { Control, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { OptionValueInput } from './option-value-input.js';

export const optionValueSchema = z.object({
    value: z.string().min(1, { message: 'Value cannot be empty' }),
    id: z.string().min(1, { message: 'Value cannot be empty' }),
});

export const optionGroupSchema = z.object({
    name: z.string().min(1, { message: 'Option name is required' }),
    values: z.array(optionValueSchema).min(1, { message: 'At least one value is required' }),
});

const multiGroupFormSchema = z.object({
    optionGroups: z.array(optionGroupSchema),
});

export type OptionGroup = z.infer<typeof optionGroupSchema>;
export type MultiGroupForm = z.infer<typeof multiGroupFormSchema>;

export interface SingleOptionGroup {
    name: string;
    values: Array<{
        value: string;
        id: string;
    }>;
}

export interface OptionGroupConfiguration {
    optionGroups: SingleOptionGroup[];
}

function validateOptionGroup(group: any): SingleOptionGroup | null {
    if (!group || typeof group.name !== 'string' || !Array.isArray(group.values)) {
        return null;
    }

    const validValues = group.values
        .filter((v: any): v is NonNullable<typeof v> => !!v)
        .filter((v: any) => typeof v.value === 'string' && typeof v.id === 'string')
        .map((v: any) => ({
            value: v.value,
            id: v.id,
        }));

    return validValues.length > 0 ? { name: group.name, values: validValues } : null;
}

interface SingleOptionGroupEditorProps {
    control: Control<any>;
    fieldArrayPath: string;
    disabled?: boolean;
}

export function SingleOptionGroupEditor({
    control,
    fieldArrayPath,
    disabled,
}: Readonly<SingleOptionGroupEditorProps>) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: [fieldArrayPath, 'values'].join('.'),
    });

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-[1fr_2fr] gap-4 items-start">
                <div>
                    <FormFieldWrapper
                        control={control}
                        name={[fieldArrayPath, 'name'].join('.')}
                        label={<Trans>Option Group Name</Trans>}
                        render={({ field }) => <Input placeholder="e.g. Size" {...field} />}
                    />
                </div>

                <div>
                    <FormFieldWrapper
                        control={control}
                        name="values"
                        label={<Trans>Option Values</Trans>}
                        render={({ field }) => (
                            <OptionValueInput
                                fields={fields as any}
                                onAdd={append}
                                onRemove={remove}
                                disabled={disabled}
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

// Multi Option Groups Editor - for use in create product variants
interface OptionGroupsEditorProps {
    onChange?: (data: OptionGroupConfiguration) => void;
    initialGroups?: OptionGroupConfiguration['optionGroups'];
}

export function OptionGroupsEditor({ onChange, initialGroups = [] }: Readonly<OptionGroupsEditorProps>) {
    const form = useForm<MultiGroupForm>({
        resolver: zodResolver(multiGroupFormSchema),
        defaultValues: {
            optionGroups: initialGroups.length > 0 ? initialGroups : [],
        },
        mode: 'onChange',
    });

    const { control } = form;
    const {
        fields: optionGroups,
        append: appendOptionGroup,
        remove: removeOptionGroup,
    } = useFieldArray({
        control,
        name: 'optionGroups',
    });

    // Watch for changes and notify parent
    useEffect(() => {
        const subscription = form.watch(value => {
            if (value?.optionGroups) {
                const validOptionGroups = value.optionGroups
                    .map(validateOptionGroup)
                    .filter((group): group is SingleOptionGroup => group !== null);

                const filteredData: OptionGroupConfiguration = {
                    optionGroups: validOptionGroups,
                };

                onChange?.(filteredData);
            }
        });

        return () => subscription.unsubscribe();
    }, [form, onChange]);

    const handleAddOptionGroup = () => {
        appendOptionGroup({ name: '', values: [] });
    };

    return (
        <Form {...form}>
            <div className="space-y-4">
                {optionGroups.map((group, index) => (
                    <div key={group.id} className="flex items-start">
                        <SingleOptionGroupEditor control={control} fieldArrayPath={`optionGroups.${index}`} />
                        <div className="shrink-0 mt-6">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOptionGroup(index)}
                                title="Remove Option"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                <Button type="button" variant="secondary" onClick={handleAddOptionGroup}>
                    <Plus className="mr-2 h-4 w-4" />
                    <Trans>Add Option</Trans>
                </Button>
            </div>
        </Form>
    );
}
