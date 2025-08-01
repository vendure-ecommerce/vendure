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
import { graphql } from '@/vdb/graphql/graphql.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const createProductOptionsDocument = graphql(`
    mutation CreateProductOptions($input: [CreateProductOptionInput!]!) {
        createProductOptions(input: $input) {
            id
            name
            code
        }
    }
`);

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    code: z.string().min(1, 'Code is required'),
});

type FormValues = z.infer<typeof formSchema>;

export function AddProductOptionDialog({
    productOptionGroupId,
    onSuccess,
}: Readonly<{
    productOptionGroupId: string;
    onSuccess?: () => void;
}>) {
    const [open, setOpen] = useState(false);
    const { i18n } = useLingui();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            code: '',
        },
    });

    const createProductOptionMutation = useMutation({
        mutationFn: api.mutate(createProductOptionsDocument),
        onSuccess: () => {
            toast.success(i18n.t('Successfully created product option'));
            setOpen(false);
            form.reset();
            onSuccess?.();
        },
        onError: error => {
            toast.error(i18n.t('Failed to create product option'), {
                description: error instanceof Error ? error.message : i18n.t('Unknown error'),
            });
        },
    });

    const onSubmit = useCallback(
        (values: FormValues) => {
            createProductOptionMutation.mutate({
                input: [
                    {
                        productOptionGroupId,
                        code: values.code,
                        translations: [
                            {
                                languageCode: 'en',
                                name: values.name,
                            },
                        ],
                    },
                ],
            });
        },
        [createProductOptionMutation, productOptionGroupId],
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    <Trans>Add product option</Trans>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <Trans>Add product option</Trans>
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={e => {
                            e.stopPropagation();
                            form.handleSubmit(onSubmit)(e);
                        }}
                        className="space-y-4"
                    >
                        <FormFieldWrapper
                            control={form.control}
                            name="name"
                            label={<Trans>Name</Trans>}
                            render={({ field }) => <Input {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="code"
                            label={<Trans>Code</Trans>}
                            render={({ field }) => <Input {...field} />}
                        />
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={
                                    createProductOptionMutation.isPending ||
                                    !form.formState.isValid ||
                                    !form.watch('name').trim() ||
                                    !form.watch('code').trim()
                                }
                            >
                                <Trans>Create product options</Trans>
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
