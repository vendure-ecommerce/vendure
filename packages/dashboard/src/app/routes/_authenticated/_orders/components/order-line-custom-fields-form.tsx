import { CustomFieldsForm } from '@/vdb/components/shared/custom-fields-form.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Form } from '@/vdb/components/ui/form.js';
import { Popover, PopoverContent, PopoverTrigger } from '@/vdb/components/ui/popover.js';
import { Settings2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface OrderLineCustomFieldsFormProps {
    onUpdate: (customFieldValues: Record<string, any>) => void;
    form: UseFormReturn<any>;
}

export function OrderLineCustomFieldsForm({ onUpdate, form }: Readonly<OrderLineCustomFieldsFormProps>) {
    const onSubmit = (values: any) => {
        onUpdate(values.input?.customFields);
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <h4 className="font-medium leading-none">Custom Fields</h4>
                        <CustomFieldsForm
                            entityType="OrderLine"
                            control={form.control}
                            formPathPrefix="input"
                        />
                        <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
                            Update
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    );
}
