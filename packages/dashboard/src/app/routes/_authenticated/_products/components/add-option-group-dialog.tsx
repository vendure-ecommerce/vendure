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
import { api } from '@/vdb/graphql/api.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Plus, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { addOptionGroupToProductDocument, createProductOptionGroupDocument } from '../products.graphql.js';
import { OptionGroup, optionGroupSchema, SingleOptionGroupEditor } from './option-groups-editor.js';

export function AddOptionGroupDialog({
    productId,
    onSuccess,
}: Readonly<{
    productId: string;
    onSuccess?: () => void;
}>) {
    const [open, setOpen] = useState(false);
    const { i18n } = useLingui();

    const form = useForm<OptionGroup>({
        resolver: zodResolver(optionGroupSchema),
        defaultValues: {
            name: '',
            values: [],
        },
        mode: 'onChange',
    });

    const createOptionGroupMutation = useMutation({
        mutationFn: api.mutate(createProductOptionGroupDocument),
    });

    const addOptionGroupToProductMutation = useMutation({
        mutationFn: api.mutate(addOptionGroupToProductDocument),
    });

    const handleSave = async () => {
        const formValue = form.getValues();
        if (!formValue.name || formValue.values.length === 0) return;

        try {
            const createResult = await createOptionGroupMutation.mutateAsync({
                input: {
                    code: formValue.name.toLowerCase().replace(/\s+/g, '-'),
                    translations: [
                        {
                            languageCode: 'en',
                            name: formValue.name,
                        },
                    ],
                    options: formValue.values.map(value => ({
                        code: value.value.toLowerCase().replace(/\s+/g, '-'),
                        translations: [
                            {
                                languageCode: 'en',
                                name: value.value,
                            },
                        ],
                    })),
                },
            });

            if (createResult?.createProductOptionGroup) {
                await addOptionGroupToProductMutation.mutateAsync({
                    productId,
                    optionGroupId: createResult.createProductOptionGroup.id,
                });
            }

            toast.success(i18n.t('Successfully created option group'));
            setOpen(false);
            onSuccess?.();
        } catch (error) {
            toast.error(i18n.t('Failed to create option group'), {
                description: error instanceof Error ? error.message : i18n.t('Unknown error'),
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    <Trans>Add option group</Trans>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" aria-description={'Add option group'}>
                <DialogHeader>
                    <DialogTitle>
                        <Trans>Add option group to product</Trans>
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Form {...form}>
                        <SingleOptionGroupEditor control={form.control} fieldArrayPath={''} />
                    </Form>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleSave}
                        disabled={
                            !form.formState.isValid ||
                            createOptionGroupMutation.isPending ||
                            addOptionGroupToProductMutation.isPending
                        }
                    >
                        <Save className="mr-2 h-4 w-4" />
                        <Trans>Save option group</Trans>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
