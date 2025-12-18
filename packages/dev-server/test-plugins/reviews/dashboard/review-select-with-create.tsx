import { Button } from '@/vdb/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/vdb/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/vdb/components/ui/form';
import { Input } from '@/vdb/components/ui/input';
import { Textarea } from '@/vdb/components/ui/textarea';
import { DashboardFormComponentProps } from '@/vdb/framework/form-engine/form-engine-types';
import { handleNestedFormSubmit } from '@/vdb/framework/form-engine/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ReviewMultiSelect } from './custom-form-components';

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    body: z.string().min(1, 'Body is required'),
});

type FormSchema = z.infer<typeof formSchema>;

export function ReviewSelectWithCreate(props: DashboardFormComponentProps) {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            body: '',
        },
    });

    const onSubmit = (data: FormSchema) => {
        // TODO: Handle form submission
        form.reset();
    };

    return (
        <div>
            <ReviewMultiSelect {...props}></ReviewMultiSelect>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Create new</Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create new review</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={handleNestedFormSubmit(form, onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter review title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="body"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Body</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter review body"
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end gap-2">
                                <Button type="submit">Create Review</Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
