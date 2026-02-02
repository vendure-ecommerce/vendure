import { FormFieldWrapper } from '@/vdb/components/shared/form-field-wrapper.js';
import { Button } from '@/vdb/components/ui/button.js';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/vdb/components/ui/dialog.js';
import { Form } from '@/vdb/components/ui/form.js';
import { Input } from '@/vdb/components/ui/input.js';
import { api } from '@/vdb/graphql/api.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trans, useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { createProductOptionDocument } from '../products.graphql.js';

const addOptionValueSchema = z.object({
    name: z.string().min(1, 'Option value name is required'),
});

type AddOptionValueFormValues = z.infer<typeof addOptionValueSchema>;

export function AddOptionValueDialog({
    groupId,
    groupName,
    onSuccess,
}: Readonly<{
    groupId: string;
    groupName: string;
    onSuccess?: () => void;
}>) {
    const [open, setOpen] = useState(false);
    const { t } = useLingui();

    const form = useForm<AddOptionValueFormValues>({
        resolver: zodResolver(addOptionValueSchema),
        defaultValues: {
            name: '',
        },
    });

    const createOptionMutation = useMutation({
        mutationFn: api.mutate(createProductOptionDocument),
        onSuccess: () => {
            toast.success(t`Successfully added option value`);
            setOpen(false);
            form.reset();
            onSuccess?.();
        },
        onError: error => {
            toast.error(t`Failed to add option value`, {
                description: error instanceof Error ? error.message : t`Unknown error`,
            });
        },
    });

    const onSubmit = (values: AddOptionValueFormValues) => {
        createOptionMutation.mutate({
            input: {
                productOptionGroupId: groupId,
                code: values.name.toLowerCase().replace(/\s+/g, '-'),
                translations: [
                    {
                        languageCode: 'en',
                        name: values.name,
                    },
                ],
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" variant="ghost">
                    <Plus className="h-3 w-3" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <Trans>Add option value to {groupName}</Trans>
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            name="name"
                            label={<Trans>Option value name</Trans>}
                            render={({ field }) => (
                                <Input {...field} placeholder={t`e.g., Red, Large, Cotton`} />
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={createOptionMutation.isPending}>
                                <Trans>Add option value</Trans>
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
