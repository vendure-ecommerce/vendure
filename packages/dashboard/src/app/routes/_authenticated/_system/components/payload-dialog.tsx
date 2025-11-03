import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/vdb/components/ui/dialog.js';
import { ScrollArea } from '@/vdb/components/ui/scroll-area.js';
import { JsonEditor } from 'json-edit-react';

type PayloadDialogProps = {
    payload: any;
    trigger: React.ReactNode;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
};

export function PayloadDialog({ payload, trigger, title, description }: Readonly<PayloadDialogProps>) {
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[600px]">
                    <JsonEditor viewOnly data={payload} collapse={1} rootFontSize={12} />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
