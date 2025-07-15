import { CustomFieldsForm } from '@/vdb/components/shared/custom-fields-form.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Form } from '@/vdb/components/ui/form.js';
import { Popover, PopoverContent, PopoverTrigger } from '@/vdb/components/ui/popover.js';
import { Trans } from '@/vdb/lib/trans.js';
import { Settings2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface OrderLineCustomFieldsFormProps {
    onUpdate: (customFieldValues: Record<string, any>) => void;
    value: Record<string, any>;
}

export function OrderLineCustomFieldsForm({ onUpdate, value }: Readonly<OrderLineCustomFieldsFormProps>) {
    const form = useForm<Record<string, any>>({
        defaultValues: {
            customFields: value,
        },
    });

    const onSubmit = (values: any) => {
        onUpdate(values.customFields);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Settings2 className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <Form {...form}>
                    <form
                        onSubmit={e => {
                            e.stopPropagation();
                            form.handleSubmit(onSubmit)(e);
                        }}
                        className="space-y-4"
                    >
                        <h4 className="font-medium leading-none">
                            <Trans>Custom Fields</Trans>
                        </h4>
                        <CustomFieldsForm entityType="OrderLine" control={form.control} />
                        <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
                            <Trans>Update</Trans>
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    );
}
